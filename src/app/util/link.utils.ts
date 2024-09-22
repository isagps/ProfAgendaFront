import { Location } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router, Routes } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

/**
 * Serviço para manipulação de URLs e navegação.
 * 
 * A classe `LinkUtilsService` oferece métodos para acessar e manipular parâmetros de URL, 
 * realizar navegações entre rotas, e verificar a URL atual. Utiliza as instâncias de `ActivatedRoute` 
 * e `Router` do Angular para essas operações.
 * 
 * Atributos disponíveis:
 * 
 * - ``currentUrl``: Obtém a URL atual.
 * - ``urlFromRoot``: Obtém a URL atual a partir da raiz da rota.
 * - ``routesConfig``: Obtém a configuração das rotas definidas no roteador.
 * - ``currentSiteWithPort``: Obtém o site atual com o protocolo e a porta.
 * 
 * Métodos disponíveis:

 * - ``getNumberParamFromUrl``: Obtém o valor de um parâmetro de URL como um número.
 * - ``getParamFromUrl``: Obtém o valor de um parâmetro de URL da rota atual.
 * - ``isUrlActive``: Verifica se uma URL fornecida é a URL ativa atual.
 * - ``navigateTo``: Navega para uma nova rota com parâmetros de consulta opcionais.
 * - ``registerRouterEvent``: Registra uma função de callback para ser chamada quando um evento de navegação ocorre.
 * - ``removeUrlParam``: Remove um parâmetro de consulta da URL atual.
 * - ``updateUrlParams``: Atualiza os parâmetros de consulta da URL atual.
 */
@Injectable({ providedIn: 'root' })
export class LinkUtils implements OnDestroy {
    private destroy$ = new Subject<void>();

    /**
     * Construtor do serviço LinkUtilsService.
     * 
     * @param route - Instância do ActivatedRoute para acessar informações da rota atual.
     * @param router - Instância do Router para navegar entre rotas.
     */
    constructor(
        protected location: Location,
        protected route: ActivatedRoute,
        protected router: Router,
    ) { }

    /**
     * Limpa os recursos e as assinaturas quando o serviço é destruído.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Obtém a configuração das rotas definidas no roteador.
     * 
     * @returns A configuração das rotas como um array de objetos Route.
     */
    public get routesConfig(): Routes {
        return this.router.config;
    }

    /**
     * Obtém a URL atual.
     * 
     * @returns A URL atual como uma string.
     */
    public get currentUrl(): string {
        return this.router.url;
    }

    /**
     * Obtém a rota raiz do aplicativo.
     *
     * Este método retorna a instância da `ActivatedRoute` que representa a raiz da árvore de rotas,
     * permitindo acessar e manipular as rotas a partir do nível mais alto da aplicação.
     *
     * @returns {ActivatedRoute} A rota raiz do aplicativo.
     */
    public get urlFromRoot(): ActivatedRoute {
        return this.route.root;
    }

    /**
     * Obtém o site atual com o protocolo e a porta.
     * 
     * Este método retorna a URL base do site atual, incluindo o protocolo (`http:` ou `https:`), o nome do host e a porta,
     * se uma porta estiver especificada na URL. Caso contrário, ele retorna o protocolo e o nome do host sem a porta.
     * 
     * @returns {string} A URL base do site atual com o protocolo e, se presente, a porta.
     */
    public get currentSiteWithPort(): string {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }

    /**
     * Obtém o valor de um parâmetro de URL a partir da rota atual.
     * 
     * @param param - Nome do parâmetro de URL a ser recuperado.
     * @returns O valor do parâmetro como uma string ou uma string vazia se o parâmetro não existir.
     */
    public getParamFromUrl(param: string): string | null {
        return this.route.firstChild?.snapshot.paramMap.get(param) ?? null;
    }

    /**
     * Obtém o valor de um parâmetro de URL como um número.
     * 
     * @param param - Nome do parâmetro de URL a ser recuperado.
     * @returns O valor do parâmetro como um número ou NaN se o valor não puder ser convertido em número.
     */
    public getNumberParamFromUrl(param: string): number {
        const value = this.getParamFromUrl(param);
        const parsed = Number(value);
        return isNaN(parsed) ? NaN : parsed;
    }

    /**
     * Navega para uma nova rota com parâmetros de consulta opcionais.
     * 
     * @param path - Caminho da nova rota para a qual navegar. Se não fornecido, a navegação não ocorrerá.
     * @param queryParams - Parâmetros de consulta opcionais para a nova rota.
     */
    public navigateTo(path: string, queryParams?: Record<string, any>): void {
        if (!path.trim()) {
            throw new Error('Path is required and should be a non-empty string.');
        }
        this.router.navigate([path], { queryParams });
    }

    /**
     * Atualiza os parâmetros de consulta da URL atual.
     * 
     * @param params - Objeto com os parâmetros de consulta a serem adicionados ou atualizados.
     */
    public updateUrlParams(params: Record<string, any>): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
        });
    }

    /**
     * Remove um parâmetro de consulta da URL atual.
     * 
     * @param param - Nome do parâmetro de consulta a ser removido.
     */
    public removeUrlParam(param: string): void {
        const { [param]: _, ...queryParams } = this.route.snapshot.queryParams;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
        });
    }

    /**
     * Verifica se uma URL fornecida é a URL ativa atual.
     * 
     * @param url - URL a ser verificada.
     * @param normalize - Indica se a URL deve ser normalizada antes da comparação. O valor padrão é true.
     * @returns true se a URL fornecida for a URL ativa; caso contrário, false.
     */
    public isUrlActive(url?: string, normalize = true): boolean {
        if (!url) return false;
        const compare = normalize ? this.normalizeUrl(this.currentUrl) : this.currentUrl;
        const target = normalize ? this.normalizeUrl(url) : url;
        return compare === target;
    }

    /**
     * Normaliza uma URL removendo parâmetros de consulta e barras finais.
     * 
     * @param url - URL a ser normalizada.
     * @returns A URL normalizada como uma string.
     * @private
     */
    private normalizeUrl(url: string): string {
        return url.split('?')[0].replace(/\/+$/, '');
    }

    /**
     * Registra uma função de callback para ser chamada quando um evento de navegação ocorre.
     * 
     * @param callback - Função de callback a ser registrada.
     */
    public registerRouterEvent(callback: () => void, eventType: new (...args: any[]) => Event = NavigationEnd): void {
        this.router.events
            .pipe(
                filter(event => event instanceof eventType),
                takeUntil(this.destroy$)
            )
            .subscribe(callback);
    }

    /**
     * Navega para a página anterior na pilha de navegação.
     * 
     * Este método utiliza o serviço `Location` para voltar à página anterior na história de navegação do navegador. 
     * Se não houver uma página anterior, o comportamento pode variar dependendo da configuração do navegador ou da aplicação.
     * 
     * É útil para retornar à página anterior depois de realizar uma ação ou quando o usuário deseja cancelar uma operação.
     */
    public backPage() {
        this.location.back();
    }
}