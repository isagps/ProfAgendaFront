import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbItem } from './model/breadcrumb-item.model';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente responsável pela exibição da trilha de navegação (breadcrumb) na interface do usuário.
 * 
 * O componente utiliza o serviço `BreadcrumbService` para obter e exibir a lista de itens da trilha de navegação. 
 * Ele se inscreve no observável fornecido pelo serviço para receber atualizações em tempo real sobre os itens da 
 * trilha e limpa suas assinaturas quando é destruído para evitar vazamentos de memória.
 * 
 * **Atributos Públicos:**
 * 
 * - `breadcrumbItems`: `BreadcrumbItem[]` - Lista de itens da trilha de navegação a ser exibida.
 */
@Component({
    imports: [CommonModule, RouterModule],
    preserveWhitespaces: false,
    selector: 'app-breadcrumb',
    standalone: true,
    styleUrl: './breadcrumb.component.scss',
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
    /**
     * Lista de itens da trilha de navegação (breadcrumb) a ser exibida.
     * 
     * @type {BreadcrumbItem[]}
     */
    @Input() breadcrumbItems: BreadcrumbItem[] = [];

    /**
     * Subject usado para gerenciar o ciclo de vida das assinaturas e evitar vazamentos de memória.
     * 
     * @private
     */
    private destroy$ = new Subject<void>();

    /**
     * Construtor do componente.
     * 
     * @param breadcrumbService Serviço que fornece os itens da trilha de navegação.
     */
    constructor(private breadcrumbService: BreadcrumbService) { }

    /**
     * Inicializa o componente, assinando o observável de itens da trilha de navegação.
     * 
     * @method ngOnInit
     */
    public ngOnInit(): void {
        this.breadcrumbService.breadcrumbItems$
            .pipe(takeUntil(this.destroy$))
            .subscribe({ next: items => this.breadcrumbItems = items });
    }

    /**
     * Limpa as assinaturas quando o componente é destruído para evitar vazamentos de memória.
     * 
     * @method ngOnDestroy
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}