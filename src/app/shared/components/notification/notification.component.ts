import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from './notification.service';
import { Notification } from './model/notification.model';

/**
 * Componente para exibir notificações ao usuário.
 * 
 * O `NotificationComponent` é responsável por exibir uma lista de notificações e suas barras de progresso.
 * Ele interage com o `NotificationService` para recuperar e atualizar as notificações ativas. 
 * 
 * **Observação:**
 * Para utilizar este componente, use o serviço `NotificationService`.
 */
@Component({
    imports: [CommonModule],
    preserveWhitespaces: false,
    selector: 'app-notification',
    standalone: true,
    styleUrls: ['./notification.component.scss'],
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit, OnDestroy {
    /**
     * Controla o ciclo de vida das assinaturas para evitar vazamento de memória.
     * @type Subject<void>
     */
    private destroy$ = new Subject<void>();

    /**
     * Lista de notificações ativas a serem exibidas.
     * @type Notification[]
     */
    public notificationList: Notification[] = [];

    /**
     * Armazena as larguras das barras de progresso das notificações, usando o ID da notificação como chave.
     * @type Map<number, string>
     */
    public notificationProgressBars: Map<number, string> = new Map();

    /**
     * Construtor que injeta o serviço de notificação.
     * @param notificationService Serviço responsável por gerenciar as notificações.
     */
    constructor(private notificationService: NotificationService) { }

    /**
     * Inscreve-se no observable de notificações ao iniciar o componente, garantindo a atualização da lista
     * e a desinscrição automática no momento da destruição do componente.
     */
    public ngOnInit(): void {
        this.notificationService.notifications$
            .pipe(takeUntil(this.destroy$))
            .subscribe({ next: notifications => this.notificationList = notifications });
    }

    /**
     * Emite um valor ao `destroy$` e finaliza o observable para cancelar todas as assinaturas e evitar vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Fecha a notificação com o ID fornecido.
     * 
     * @param notification A notificação a ser fechada.
     */
    public close(notification: Notification): void {
        this.notificationService.close(notification.id);
    }

    /**
     * Retorna a classe CSS apropriada para a notificação com base no seu tipo.
     * 
     * @param notification A notificação da qual a classe será extraída.
     * @returns string Classe CSS para o tipo da notificação.
     */
    public getNotificationClass(notification: Notification): string {
        return `notification ${notification.type}`;
    }

    /**
     * Calcula a largura da barra de progresso da notificação com base no tempo restante.
     * 
     * @param notification A notificação da qual a largura será calculada.
     * @returns string Largura da barra de progresso em porcentagem.
     */
    public getProgressBarWidth(notification: Notification): string {
        return `${(notification.displayDuration / notification.totalDuration) * 100}%`;
    }
}