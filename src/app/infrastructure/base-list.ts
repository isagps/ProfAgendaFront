import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseModel } from './base-model';
import { ConfirmDialogService } from '../shared/components/confirm-dialog/confirm-dialog.service';
import { LinkUtils } from '../util/link.utils';
import { NotificationService } from '../shared/components/notification/notification.service';
import { Page } from '../model/page.model';
import { BaseService } from './base-service';

/**
 * Classe abstrata `BaseList` usada para gerenciar a exibição e manipulação de uma lista paginada de dados.
 * Implementa `OnInit` e `OnDestroy` para gerenciar o ciclo de vida do componente e evitar vazamentos de memória.
 *
 * @template T O tipo de recurso que está sendo manipulado, que deve estender `BaseModel`.
 */
@Injectable()
export abstract class BaseList<T extends BaseModel> implements OnInit, OnDestroy {

    /**
     * Dados paginados que estão sendo exibidos na lista.
     * 
     * @type {Page | undefined}
     */
    public data?: Page;

    /**
     * Filtro aplicado à pesquisa da lista de dados.
     * 
     * @type {string}
     * @default ''
     */
    public filter: string = '';

    /**
     * Número da página atual na lista paginada.
     * 
     * @type {number}
     * @default 1
     */
    public pageNumber: number = 1;

    /**
     * Número de itens por página.
     * 
     * @type {number}
     * @default 10
     */
    public pageSize: number = 10;

    /**
     * Subject utilizado para encerrar assinaturas de observables quando o componente for destruído.
     * 
     * @type {Subject<void>}
     */
    private destroy$ = new Subject<void>();

    /**
     * Construtor da classe `BaseList`.
     * 
     * @param {ConfirmDialogService} confirmDialog - Serviço para exibir diálogos de confirmação.
     * @param {LinkUtils} linkUtils - Utilitário para gerenciar navegação e URLs.
     * @param {NotificationService} notification - Serviço de notificação para exibir mensagens ao usuário.
     * @param {BaseService<T>} service - Serviço genérico para interagir com o recurso `T`.
     */
    constructor(
        protected confirmDialog: ConfirmDialogService,
        protected linkUtils: LinkUtils,
        protected notification: NotificationService,
        protected service: BaseService<T>,
    ) { }

    /**
     * Método `ngOnInit` chamado automaticamente ao inicializar o componente.
     * Carrega os dados iniciais da lista ao chamar o método `loadData()`.
     */
    public ngOnInit(): void {
        this.loadData();
    }

    /**
     * Método `ngOnDestroy` chamado automaticamente quando o componente é destruído.
     * Encerra todas as assinaturas ativas utilizando `destroy$`.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Exclui um item da lista após confirmação do usuário.
     * 
     * @param {T} data - O item a ser excluído.
     */
    public delete(data: T): void {
        this.confirmDialog.open('delete')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: result => {
                    if (!data?.id) {
                        this.notification.show('Dado inválido.', 'error');
                        return;
                    }

                    if (result) {
                        this.service.delete(data.id)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(() => {
                                this.loadData();
                                this.notification.show('Dado excluído com sucesso.');
                            });
                    }
                },
                error: () => this.notification.show('Não foi possível excluir o dado selecionado.', 'error'),
            });
    }

    /**
     * Navega para a página de visualização do item.
     * 
     * @param {T} data - O item a ser visualizado.
     */
    public view(data: T): void {
        if (!data || !data.id) {
            this.notification.show('Dado inválido.', 'error');
            return;
        }

        this.linkUtils.navigateTo(`${this.service.endpoint}/view/${data.id}`);
    }

    /**
     * Navega para a página de edição do item.
     * 
     * @param {T} data - O item a ser editado.
     */
    public edit(data: T): void {
        if (!data || !data.id) {
            this.notification.show('Dado inválido.', 'error');
            return;
        }
    
        this.linkUtils.navigateTo(`${this.service.endpoint}/edit/${data.id}`);
    }
    

    /**
     * Carrega a lista de dados a partir do serviço com base nos parâmetros de paginação e filtro.
     * 
     * @param {Object} [event={}] - Parâmetros opcionais para definir a página, tamanho da página e filtro.
     */
    public loadData(event: { pageSize?: number; pageNumber?: number; filter?: string } = {}): void {
        const pageSize = event.pageSize ?? this.pageSize;
        const pageNumber = event.pageNumber ?? this.pageNumber;
        const filter = event.filter ?? this.filter;

        this.service.getAll(pageNumber, pageSize, filter)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: Page) => this.data = data,
                error: () => this.notification.show('Erro ao carregar dados.', 'error'),
            });
    }
}