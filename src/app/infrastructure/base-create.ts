import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

import { BaseModel } from './base-model';
import { NotificationService } from '../shared/components/notification/notification.service';
import { BaseService } from './base-service';
import { LinkUtils } from '../util/link.utils';

/**
 * Classe abstrata `BaseCreate` utilizada para criar novos recursos no serviço.
 * Implementa o ciclo de vida do Angular para gerenciar a criação de recursos e 
 * prevenir vazamentos de memória com o uso de observables.
 *
 * @template T O tipo de modelo que está sendo manipulado.
 */
@Injectable()
export abstract class BaseCreate<T extends BaseModel> implements OnDestroy {
    /**
     * Formulário utilizado para capturar os dados de criação.
     * 
     * @type {FormGroup | undefined}
     */
    public form?: FormGroup;

    /**
     * Instância do dado criado.
     * 
     * @type {T | undefined}
     */
    public data?: T;

    /**
     * Subject para controlar o ciclo de vida das assinaturas do observable,
     * evitando vazamentos de memória.
     * 
     * @type {Subject<void>}
     */
    private destroy$ = new Subject<void>();

    /**
     * Construtor da classe `BaseCreate`.
     * 
     * @param {LinkUtils} linkUtils - Serviço para navegação entre páginas.
     * @param {NotificationService} notification - Serviço para exibição de notificações.
     * @param {BaseService<T>} service - Serviço de manipulação do recurso `T`.
     * @param {FormBuilder} formBuilder - Utilizado para criar formulários reativos.
     */
    constructor(
        protected linkUtils: LinkUtils,
        protected notification: NotificationService,
        protected service: BaseService<T>,
        protected formBuilder?: FormBuilder
    ) {
        if (formBuilder !== undefined && this.formBuilder !== undefined) {
            this.form = this.formBuilder.group({});
        }
    }

    /**
     * Submete os dados do formulário ou o objeto fornecido para criação no serviço.
     * Emite notificações de sucesso ou erro dependendo do resultado.
     * 
     * @param {T | undefined} data - Os dados a serem enviados. Se não fornecido, os dados do formulário são utilizados.
     */
    public onSubmit(data?: T): void {
        const submitData = data ?? this.getFormData();

        if (!submitData) {
            this.notification.show('Erro ao tentar cadastrar dados.', 'error');
            return;
        }

        // Adiciona o operador `takeUntil` para garantir que a assinatura seja encerrada
        this.service.create(submitData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notification.show('Dado cadastrado com sucesso', 'success');
                    this.data = submitData;
                    this.linkUtils.navigateTo(`/${this.service.endpoint}`);
                },
                error: (error) => this.notification.show(error, 'error'),
            });
    }

    /**
     * Cancela a criação do recurso e retorna à página anterior.
     */
    public cancel(): void {
        this.linkUtils.backPage();
    }

    /**
     * Obtém os dados do formulário se forem válidos. Emite uma notificação de erro se os dados forem inválidos.
     * 
     * @returns {T | undefined} Os dados do formulário no formato do modelo `T` ou `undefined` se o formulário for inválido.
     */
    protected getFormData(): T | undefined {
        if (this.form?.valid) {
            return this.form.value as T;
        } else {
            this.notification.show('Por favor, preencha os campos obrigatórios.', 'error');
            return undefined;
        }
    }

    /**
     * Método de ciclo de vida chamado quando o componente é destruído.
     * Dispara o subject `destroy$` para encerrar todas as assinaturas ativas e prevenir vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}