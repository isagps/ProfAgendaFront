import { FormBuilder, FormGroup } from '@angular/forms';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseModel } from './base-model';
import { BaseService } from './base-service';
import { LinkUtils } from '../util/link.utils';
import { NotificationService } from '../shared/components/notification/notification.service';

/**
 * Classe abstrata BaseEdit usada para operações de edição.
 * Gerencia o ciclo de vida do componente e as assinaturas para evitar vazamentos de memória.
 * 
 * @template T O tipo de modelo usado no componente.
 */
@Injectable()
export abstract class BaseEdit<T extends BaseModel> implements OnInit, OnDestroy {
    /**
     * Formulário reativo utilizado para manipulação dos dados de edição.
     * 
     * @type {FormGroup | undefined}
     */
    public form?: FormGroup;

    /**
     * Dados do modelo que estão sendo editados.
     * 
     * @type {T | undefined}
     */
    public data?: T;

    /**
     * Subject utilizado para encerrar as assinaturas de observables no ciclo de vida do componente.
     * 
     * @type {Subject<void>}
     */
    protected destroy$ = new Subject<void>();

    /**
     * Construtor da classe `BaseEdit`.
     * 
     * @param {LinkUtils} linkUtils - Serviço para manipulação de navegação e URLs.
     * @param {NotificationService} notification - Serviço de notificação para o usuário.
     * @param {BaseService<T>} service - Serviço responsável pelas operações CRUD.
     * @param {FormBuilder} formBuilder - FormBuilder para construção do formulário reativo.
     */
    constructor(
        protected linkUtils: LinkUtils,
        protected notification: NotificationService,
        protected service: BaseService<T>,
        protected formBuilder: FormBuilder,
    ) {
        this.form = this.formBuilder.group({});
    }

    /**
     * Método chamado automaticamente ao inicializar o componente.
     * Inicializa os dados através do método `init`.
     */
    public ngOnInit(): void {
        this.init();
    }

    /**
     * Método chamado automaticamente quando o componente é destruído.
     * Garante que todas as assinaturas sejam encerradas para evitar vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Método para submissão dos dados do formulário.
     * Atualiza os dados através do serviço e navega após sucesso.
     * 
     * @param {T | undefined} data - Dados a serem enviados. Se não fornecido, o método `submitData()` é utilizado.
     */
    public onSubmit(data?: T): void {
        const submitData = data ?? this.submitData();

        if (!submitData || submitData.id === undefined) {
            this.notification.show('Dados inválidos.', 'error');
            return;
        }

        this.service.update(submitData.id, submitData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedData) => {
                    this.notification.show('Dados alterados com sucesso!', 'success');
                    this.data = updatedData;
                    this.linkUtils.navigateTo(`/${this.service.endpoint}`);
                },
                error: (error) => this.notification.show(error, 'error'),
            });
    }

    /**
     * Cancela a operação e navega de volta à página anterior.
     */
    public cancel(): void {
        this.linkUtils.backPage();
    }

    /**
     * Inicializa os dados do formulário obtendo o ID da URL e carregando os dados do serviço.
     */
    protected init(): void {
        const id = this.linkUtils.getNumberParamFromUrl('id');

        if (!isNaN(id)) {
            this.service.getById(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (data: T) => this.initMainData(data),
                    error: () => this.notification.show('Erro ao carregar dados', 'error'),
                });

            this.loadData();
        } else {
            this.notification.show('ID inválido na URL', 'error');
            throw new Error('ID inválido na URL');
        }
    }

    /**
     * Método opcional para carregar outros dados, se necessário.
     */
    protected loadData(): void {
        // Implementação opcional para carregar outros dados
    }

    /**
     * Inicializa os dados principais no formulário.
     * 
     * @param {T} data - Dados a serem carregados no formulário.
     */
    protected initMainData(data: T): void {
        this.data = data;
        this.form?.patchValue(data);
    }

    /**
     * Submete os dados do formulário e os converte no tipo `T`.
     * 
     * @returns {T | undefined} Os dados convertidos ou `undefined` se o formulário for inválido.
     */
    protected submitData(): T | undefined {
        return this.form?.valid ? this.form.value as T : undefined;
    }
}