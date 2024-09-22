import { Injectable, OnDestroy } from "@angular/core";
import { Routes } from "@angular/router";

import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";

import { LinkUtils } from "../../../util/link.utils";
import { SidebarConfig } from "./models/sidebar-config.model";
import { SidebarItem } from "./models/sidebar-item.model";
import { RouteData } from "../../../app.routes";

/**
 * Serviço responsável por gerenciar e fornecer itens de barra lateral para a aplicação.
 * 
 * A classe `SidebarService` utiliza o sistema de injeção de dependências do Angular para inicializar e gerenciar
 * uma lista de itens de barra lateral com base na configuração de rotas da aplicação. Fornece métodos para
 * converter rotas em itens de barra lateral, adicionar itens a grupos e organizar itens em uma estrutura hierárquica.
 * 
 * **Atributos Públicos:**
 * - `sidebarItems$`: `Observable<SidebarItem[]>` - Observable que emite a lista de itens de barra lateral atualizados.
 * 
 * **Métodos Públicos:**
 * - **Nenhum** - Todos os métodos são privados e utilizados internamente pela classe.
 */
@Injectable({ providedIn: 'root' })
export class SidebarService implements OnDestroy {
    private sidebarItemsSubject = new BehaviorSubject<SidebarItem[]>([]);
    private destroy$ = new Subject<void>();

    public sidebarItems$: Observable<SidebarItem[]> = this.sidebarItemsSubject.asObservable();

    /**
     * Construtor do serviço `SidebarService`.
     * 
     * Inicializa os itens da barra lateral com base nas configurações de rotas fornecidas pelo serviço `LinkUtils`.
     * 
     * @param linkUtils - Instância do serviço `LinkUtils`, utilizado para obter a configuração das rotas.
     */
    constructor(private linkUtils: LinkUtils) {
        this.initializeSidebarItems();
        this.linkUtils.registerRouterEvent(() => this.checkActiveGroups());
    }

    /**
     * Limpa os recursos quando o serviço é destruído.
     * 
     * Desinscreve todos os observables para evitar vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Inicializa os itens da barra lateral a partir das configurações de rotas.
     * 
     * Obtém as rotas configuradas através do serviço `LinkUtils`, converte essas rotas em itens de barra lateral
     * e atualiza o `BehaviorSubject` com a nova lista de itens.
     * 
     * @private
     * @returns void
     */
    private initializeSidebarItems(): void {
        const routes: Routes = this.linkUtils.routesConfig;
        const sidebarItems = this.convertRoutesToSidebarItems(routes);
        this.sidebarItemsSubject.next(sidebarItems);
    }

    /**
     * Converte uma lista de rotas em itens de barra lateral.
     * 
     * Itera sobre as rotas fornecidas, extrai a configuração da barra lateral para cada rota e cria um item
     * de barra lateral correspondente. Em seguida, organiza a lista de itens colocando o item "Dashboard"
     * (se presente) como o primeiro e ordena os demais itens pela propriedade `label`.
     * 
     * @private
     * @param routes - Lista de rotas da aplicação.
     * @returns Lista de itens de barra lateral gerados e organizados a partir das rotas.
     * 
     * O item com `label` "Dashboard" sempre será o primeiro, e os demais itens serão ordenados 
     * alfabeticamente pela `label`.
     */
    private convertRoutesToSidebarItems(routes: Routes): SidebarItem[] {
        const sidebarItems = routes.reduce<SidebarItem[]>((items, route) => {
            const routeData: RouteData | null = route.data as RouteData || null;

            if (routeData) {
                const sidebarConfig = this.extractSidebarConfig(routeData);
                if (sidebarConfig?.show) {
                    const sidebarItem = this.createSidebarItem(routeData, route.path ?? '');
                    this.addSidebarItem(items, sidebarItem);
                }
            }

            return items;
        }, []);

        const dashboardItem = sidebarItems.find(item => item.label.toLowerCase() === 'dashboard');
        const otherItems = sidebarItems.filter(item => item.label.toLowerCase() !== 'dashboard');

        otherItems.sort((a, b) => a.label.localeCompare(b.label));

        if (dashboardItem) {
            return [dashboardItem, ...otherItems];
        } else {
            return otherItems;
        }
    }

    /**
     * Extrai a configuração da barra lateral a partir da rota.
     * 
     * Obtém a configuração associada à barra lateral a partir dos dados da rota. Retorna `null` se a configuração
     * não estiver presente.
     * 
     * @private
     * @param route - Objeto de configuração da rota.
     * @returns Configuração da barra lateral ou `null` se não estiver presente.
     */
    private extractSidebarConfig(data: RouteData | undefined): SidebarConfig | null {
        return data?.sidebar ?? null;
    }

    /**
     * Cria um item de barra lateral a partir da configuração da barra lateral e do caminho.
     * 
     * Gera um objeto `SidebarItem` usando a configuração da barra lateral e o caminho da rota fornecido.
     * 
     * @private
     * @param sidebarConfig - Configuração da barra lateral contendo propriedades como `label`, `icon`, e `group`.
     * @param path - Caminho da rota associado ao item da barra lateral.
     * @returns Novo item de barra lateral com as propriedades configuradas.
     */
    private createSidebarItem(routeData: RouteData, path: string): SidebarItem {
        return {
            label: routeData.label,
            url: `/${path}`,
            icon: routeData.icon,
            group: routeData.sidebar?.group,
            isOpen: false,
            hasChildren: false,
        };
    }

    /**
     * Adiciona um novo item à lista de itens de barra lateral, organizando-o em grupos, se necessário.
     * 
     * Verifica se o item pertence a um grupo. Se sim, adiciona o item ao grupo apropriado; caso contrário,
     * adiciona-o diretamente à lista de itens.
     * 
     * @private
     * @param items - Lista de itens de barra lateral.
     * @param newItem - Novo item de barra lateral a ser adicionado.
     * @returns void
     */
    private addSidebarItem(items: SidebarItem[], newItem: SidebarItem): void {
        if (newItem.group) {
            this.addToGroup(items, newItem.group.split('/'), newItem);
        } else {
            items.push(newItem);
        }
    }

    /**
     * Adiciona um item de barra lateral a um grupo específico.
     * 
     * Itera sobre a lista de grupos, criando grupos conforme necessário e adicionando o item ao grupo final.
     * 
     * @private
     * @param items - Lista de itens de barra lateral ou grupo.
     * @param groups - Lista de grupos para adicionar o item.
     * @param newItem - Novo item de barra lateral a ser adicionado.
     * @returns void
     */
    private addToGroup(items: SidebarItem[], groups: string[], newItem: SidebarItem): void {
        if (groups.length === 0) {
            items.push(newItem);
            return;
        }

        const [currentGroup, ...remainingGroups] = groups;
        let groupItem = this.findOrCreateGroupItem(items, currentGroup);

        if (groupItem.children) {
            this.addToGroup(groupItem.children, remainingGroups, newItem);
            groupItem.hasChildren = true;
        }
    }

    /**
     * Encontra um grupo existente ou cria um novo item de grupo na lista de itens.
     * 
     * Verifica se um item de grupo com o nome fornecido já existe. Se não, cria um novo grupo e adiciona-o à lista.
     * 
     * @private
     * @param items - Lista de itens de barra lateral.
     * @param groupName - Nome do grupo a ser encontrado ou criado.
     * @returns Item de grupo encontrado ou criado.
     */
    private findOrCreateGroupItem(items: SidebarItem[], groupName: string): SidebarItem {
        let groupItem = items.find(i => i.label === groupName);

        if (!groupItem) {
            groupItem = {
                label: groupName,
                group: groupName,
                children: [],
                isOpen: false,
                hasChildren: false,
            };
            items.push(groupItem);
        }

        return groupItem;
    }

    /**
     * Verifica e atualiza o estado de abertura dos grupos com base na URL ativa.
     * 
     * O método `checkActiveGroups` determina quais grupos devem estar abertos com base na URL atual, garantindo que o grupo
     * correspondente à URL ativa esteja expandido.
     * 
     * @private
     * @param items - Lista de itens da barra lateral a ser verificada.
     * @returns {void}
     */
    private checkActiveGroups = (): void => {
        this.sidebarItems$.pipe(takeUntil(this.destroy$)).subscribe({ next: items => this.updateGroupState(items) });
    };

    /**
     * Atualiza o estado dos itens da barra lateral, determinando se cada grupo deve estar aberto
     * com base na URL atual.
     * 
     * @private
     * @param items - Lista de itens da barra lateral a serem atualizados.
     * 
     * Itera sobre cada item na lista de itens fornecida. Se o item tiver filhos, determina se o 
     * grupo deve estar aberto com base na presença de filhos ativos e, em seguida, atualiza 
     * recursivamente o estado dos filhos.
     */
    private updateGroupState = (items: SidebarItem[]): void => {
        items.forEach(item => {
            if (item.children) {
                item.isOpen = this.isGroupActive(item.children);
                this.updateGroupState(item.children);
            }
        });
    };

    /**
     * Verifica se algum dos filhos de um item de grupo está ativo, ou se algum dos filhos de filhos está ativo.
     * 
     * @private
     * @param children - Lista de itens de barra lateral que são filhos de um item de grupo.
     * @returns `true` se algum dos itens filhos ou seus descendentes estiver ativo; `false` caso contrário.
     * 
     * Utiliza a função `isItemActive` para verificar se um item específico está ativo e faz chamadas recursivas 
     * para verificar a atividade dos filhos dos itens.
     */
    private isGroupActive = (children: SidebarItem[]): boolean => {
        return children.some(child =>
            child.url === this.linkUtils.currentUrl || (child.children && this.isGroupActive(child.children))
        );
    };
}