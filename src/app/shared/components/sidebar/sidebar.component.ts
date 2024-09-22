import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarItem } from './models/sidebar-item.model';
import { SidebarService } from './sidebar.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente de barra lateral (`SidebarComponent`).
 * 
 * Este componente exibe uma barra lateral com itens que podem ser links ou grupos de links. 
 * Os itens podem ser passados diretamente para o componente através da propriedade `itens` 
 * ou obtidos através do serviço `SidebarService`. O componente também gerencia o estado 
 * de abertura dos grupos de itens.
 * 
 * O componente de barra lateral é customizável através dos seguintes atributos:
 * 
 * - `itens` (SidebarItem[] | undefined): Lista de itens da barra lateral a serem exibidos no componente.
 *   Se não for fornecido, o valor padrão será `undefined`, e os itens serão obtidos a partir do `SidebarService` 
 *   com base nas rotas configuradas.
 * 
 * @example
 * ```html
 * <app-sidebar [itens]="sidebarItems"></app-sidebar>
 * ```
 */
@Component({
    imports: [CommonModule, RouterModule],
    preserveWhitespaces: false,
    selector: 'app-sidebar',
    standalone: true,
    styleUrl: './sidebar.component.scss',
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
    /**
     * Subject para gerenciar a destruição das assinaturas e prevenir vazamentos de memória.
     */
    private destroy$ = new Subject<void>();

    /**
     * Define se a barra lateral está colapsada ou não.
     * 
     * @type {boolean}
     * @default false
     * 
     * Quando `true`, a barra lateral é colapsada (minimizada). O valor padrão é `false`.
     */
    public isCollapsed = false;

    /**
     * Itens da barra lateral a serem exibidos no componente.
     * 
     * @type {SidebarItem[] | null}
     * @default null
     * 
     * Se não for fornecido, o componente obtém os itens do `SidebarService` com base nas rotas configuradas.
     */
    @Input() public itens: SidebarItem[] | null = null;

    /**
     * Construtor do componente `SidebarComponent`.
     * 
     * @param sidebarService - Instância do serviço `SidebarService` utilizado para obter os itens da barra lateral.
     */
    constructor(private sidebarService: SidebarService) { }

    /**
     * Método de inicialização do ciclo de vida do componente.
     * 
     * Se a propriedade `itens` não estiver definida, o método se inscreve no observable `sidebarItems$` 
     * do `SidebarService` para obter e definir os itens da barra lateral.
     */
    public ngOnInit(): void {
        if (!this.itens) {
            this.sidebarService.sidebarItems$
                .pipe(takeUntil(this.destroy$))
                .subscribe(items => (this.itens = items));
        }
    }

    /**
     * Método de ciclo de vida chamado quando o componente é destruído.
     * 
     * Limpa as assinaturas ativas ao destruir o componente, evitando vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Alterna o estado de abertura de um grupo de itens da barra lateral.
     * 
     * @param item - O item da barra lateral cujo estado de abertura deve ser alternado.
     * 
     * Define a propriedade `isOpen` do item para o valor oposto ao atual (`true` se estiver fechado e `false` 
     * se estiver aberto).
     */
    public toggleGroup(item: SidebarItem): void {
        item.isOpen = !item.isOpen;
    }

    /**
     * Alterna o estado de colapso da barra lateral.
     * 
     * Define a propriedade `isCollapsed` para `true` ou `false`, colapsando ou expandindo a barra lateral.
     */
    public toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    /**
     * Método que monitora o redimensionamento da janela do navegador.
     * 
     * Se a largura da janela for menor ou igual a 500px, a barra lateral será colapsada automaticamente.
     * 
     * @HostListener - Este decorator faz com que o método seja chamado automaticamente
     * quando a janela do navegador for redimensionada.
     */
    @HostListener('window:resize')
    public onResize(): void {
        this.isCollapsed = window.innerWidth <= 500;
    }
}