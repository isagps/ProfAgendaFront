import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseModel } from './base-model';
import { BaseService } from './base-service';
import { LinkUtils } from '../util/link.utils';
import { NotificationService } from '../shared/components/notification/notification.service';

/**
 * Classe abstrata `BaseView` usada para visualizar um recurso específico.
 * Implementa `OnInit` e `OnDestroy` para gerenciar o ciclo de vida do componente e evitar vazamentos de memória.
 * 
 * @template T O tipo de recurso que está sendo visualizado, que deve estender `BaseModel`.
 */
@Injectable()
export abstract class BaseView<T extends BaseModel> implements OnInit, OnDestroy {
    
    /**
     * `destroy$` é um `Subject` utilizado para encerrar todas as assinaturas ativas ao destruir o componente.
     */
    private destroy$ = new Subject<void>();

    /**
     * O recurso que está sendo visualizado.
     * 
     * @type {T | undefined}
     */
    public data?: T;

    /**
     * Dados filtrados, se aplicável. Pode ser usado para armazenar dados derivados.
     * 
     * @type {any[] | undefined}
     */
    public filtered?: any[];

    /**
     * Construtor da classe `BaseView`.
     * 
     * @param {LinkUtils} linkUtils - Utilitário para gerenciar navegação e manipulação de URLs.
     * @param {NotificationService} notification - Serviço de notificações para exibir mensagens ao usuário.
     * @param {BaseService<T>} service - Serviço genérico para realizar operações com o recurso `T`.
     */
    constructor(
        protected linkUtils: LinkUtils,
        protected notification: NotificationService,
        protected service: BaseService<T>,
    ) {}

    /**
     * Método `ngOnInit` chamado automaticamente durante a inicialização do componente.
     * Carrega os dados necessários chamando o método `init`.
     */
    public ngOnInit(): void {
        this.init();
    }

    /**
     * Método `ngOnDestroy` chamado automaticamente durante a destruição do componente.
     * Emite um valor em `destroy$` para encerrar todas as assinaturas ativas e evitar vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Inicializa a lógica de carregamento de dados, incluindo a obtenção do ID da URL e o carregamento do recurso correspondente.
     * Exibe uma notificação de erro se o ID for inválido.
     */
    private init(): void {
        const id = this.linkUtils.getNumberParamFromUrl('id');

        if (isNaN(id)) {
            this.notification.show('ID inválido na URL', 'error');
            return;
        }

        this.service.getById(id)
            .pipe(takeUntil(this.destroy$))  // Garante que a assinatura será limpa no ngOnDestroy
            .subscribe({
                next: (data: T) => this.loadData(data),
                error: () => this.notification.show('Erro ao carregar dados', 'error'),
            });
    }

    /**
     * Carrega os dados obtidos da API para o recurso visualizado e os armazena no atributo `data`.
     * 
     * @param {T} data - O recurso carregado do serviço.
     */
    protected loadData(data: T): void {
        this.data = data;
    }

    /**
     * Cancela a operação atual e retorna para a página anterior.
     */
    public cancel(): void {
        this.linkUtils.backPage();
    }
}