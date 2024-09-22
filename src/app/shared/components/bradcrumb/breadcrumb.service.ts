import { Injectable } from '@angular/core';
import { Route } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { BreadcrumbItem } from './model/breadcrumb-item.model';
import { LinkUtils } from '../../../util/link.utils';
import { RouteData } from '../../../app.routes';

/**
 * Serviço responsável por gerenciar e fornecer itens de breadcrumb para a aplicação.
 * 
 * A classe `BreadcrumbService` utiliza o sistema de injeção de dependências do Angular para gerenciar
 * e fornecer itens de breadcrumb baseados na configuração de rotas da aplicação. Atualiza a lista de breadcrumbs
 * quando a URL atual muda e garante que os itens de breadcrumb estejam livres de duplicatas.
 * 
 * **Atributos Públicos:**
 * - `breadcrumbItems$`: `Observable<BreadcrumbItem[]>` - Observable que emite a lista atualizada de itens de breadcrumb.
 * 
 * **Métodos Públicos:**
 * - **Nenhum** - Todos os métodos são privados e utilizados internamente pela classe.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
    private routesMap = new Map<string, Route>();
    private breadcrumbItemsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);

    /**
     * Observable que emite a lista atualizada de itens de breadcrumb.
     * 
     * @type Observable<BreadcrumbItem[]>
     */
    public breadcrumbItems$: Observable<BreadcrumbItem[]> = this.breadcrumbItemsSubject.asObservable();

    /**
     * Construtor do serviço `BreadcrumbService`.
     * 
     * Inicializa o mapeamento de rotas e registra um evento para atualizar os breadcrumbs
     * sempre que a URL atual muda.
     * 
     * @param linkUtils - Instância do serviço `LinkUtils`, utilizado para obter a configuração das rotas e URL atual.
     */
    constructor(private linkUtils: LinkUtils) {
        this.initializeRoutesMap();
        this.linkUtils.registerRouterEvent(() => this.updateBreadcrumbs());
    }

    /**
     * Inicializa o mapeamento de rotas a partir da configuração de rotas.
     * 
     * Itera sobre a configuração de rotas e armazena cada rota em um mapa para referência rápida.
     * 
     * @private
     * @returns void
     */
    private initializeRoutesMap(): void {
        this.linkUtils.routesConfig.forEach(route => {
            if (route.path) {
                this.routesMap.set(route.path, route);
            }
        });
    }

    /**
     * Atualiza a lista de itens de breadcrumb com base na URL atual.
     * 
     * Remove breadcrumbs duplicados e emite a nova lista através do `BehaviorSubject`.
     * 
     * @private
     * @returns void
     */
    private updateBreadcrumbs(): void {
        const breadcrumbs = this.removeDuplicateBreadcrumbs(this.createBreadcrumbs(this.linkUtils.currentUrl));
        this.breadcrumbItemsSubject.next(breadcrumbs);
    }

    /**
     * Cria uma lista de breadcrumbs com base na URL atual.
     * 
     * Itera sobre a configuração de rotas e adiciona breadcrumbs para cada rota correspondente à URL atual.
     * 
     * @private
     * @param currentUrl - URL atual da aplicação.
     * @returns Lista de itens de breadcrumb gerados.
     */
    private createBreadcrumbs(currentUrl: string): BreadcrumbItem[] {
        const breadcrumbs: BreadcrumbItem[] = [];
        const mainRoute = this.findMainRoute();

        if (mainRoute && !(mainRoute.data as RouteData).breadcrumbConfig?.noUseMain) {
            this.addBreadcrumbFromRoute(breadcrumbs, mainRoute);
        }

        this.linkUtils.routesConfig.forEach(route => {
            if (this.isCurrentUrl(route.path, currentUrl)) {
                this.addBreadcrumbsFromRoute(breadcrumbs, route);
            }
        });

        return breadcrumbs;
    }

    /**
     * Encontra a rota principal definida na configuração de rotas.
     * 
     * @private
     * @returns Rota principal ou `null` se não encontrada.
     */
    private findMainRoute(): Route | null {
        return this.linkUtils.routesConfig.find(route => (route.data as RouteData)?.breadcrumbConfig?.isMain) || null;
    }

    /**
     * Adiciona um item de breadcrumb com base em uma rota.
     * 
     * Adiciona um item à lista de breadcrumbs com o rótulo e URL extraídos dos dados da rota.
     * 
     * @private
     * @param breadcrumbs - Lista de itens de breadcrumb.
     * @param route - Rota da qual o breadcrumb será adicionado.
     * @returns void
     */
    private addBreadcrumbFromRoute(breadcrumbs: BreadcrumbItem[], route: Route): void {
        const data = route.data as RouteData;
        breadcrumbs.push({
            label: data.label,
            url: route.path ?? ''
        });
    }

    /**
     * Verifica se a URL atual corresponde ao caminho da rota.
     * 
     * @private
     * @param routePath - Caminho da rota a ser verificado.
     * @param currentUrl - URL atual da aplicação.
     * @returns `true` se o caminho da rota corresponder à URL atual; `false` caso contrário.
     */
    private isCurrentUrl(routePath: string | undefined, currentUrl: string): boolean {
        return `/${routePath}` === currentUrl;
    }

    /**
     * Adiciona breadcrumbs com base na configuração de breadcrumb da rota.
     * 
     * Itera sobre os caminhos definidos na configuração de breadcrumb e adiciona os itens correspondentes
     * à lista de breadcrumbs.
     * 
     * @private
     * @param breadcrumbs - Lista de itens de breadcrumb.
     * @param route - Rota da qual os breadcrumbs serão adicionados.
     * @returns void
     */
    private addBreadcrumbsFromRoute(breadcrumbs: BreadcrumbItem[], route: Route): void {
        const data = route.data as RouteData;
        const breadcrumbConfig = data?.breadcrumbConfig;

        if (breadcrumbConfig?.paths) {
            breadcrumbConfig.paths.forEach(path => {
                const foundRoute = this.routesMap.get(path);
                if (foundRoute) {
                    const foundData = foundRoute.data as RouteData;
                    breadcrumbs.push({
                        label: foundData.label,
                        url: foundRoute.path ?? ''
                    });
                }
            });
        }

        this.addBreadcrumbFromRoute(breadcrumbs, route);
    }

    /**
     * Remove breadcrumbs duplicados da lista.
     * 
     * Utiliza um conjunto para garantir que cada URL de breadcrumb seja única.
     * 
     * @private
     * @param breadcrumbs - Lista de itens de breadcrumb a ser filtrada.
     * @returns Lista de itens de breadcrumb sem duplicatas.
     */
    private removeDuplicateBreadcrumbs(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[] {
        const seenUrls = new Set<string>();
        return breadcrumbs.filter(breadcrumb => {
            if (!seenUrls.has(breadcrumb.url)) {
                seenUrls.add(breadcrumb.url);
                return true;
            }
            return false;
        });
    }
}