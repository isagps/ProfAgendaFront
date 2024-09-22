import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Notification } from './model/notification.model';
import { NotificationType } from './model/notification-type.model';

/**
 * Serviço para gerenciar e exibir notificações.
 * 
 * A classe `NotificationService` é responsável por gerenciar uma fila de notificações e exibi-las
 * para o usuário. Permite adicionar novas notificações, atualizar a duração de notificações existentes
 * e fechar notificações. Utiliza um `BehaviorSubject` para emitir a lista atualizada de notificações.
 * 
 * Métodos disponíveis:
 * - `show`: Adiciona uma nova notificação ou atualiza uma existente.
 * - `close`: Fecha uma notificação específica com base no seu ID.
 * 
 * Atributos disponíveis:
 * - `notifications$`: Observable que emite a lista atual de notificações.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
    private readonly maxVisibleNotifications = 3;

    private nextId = 1;
    private queue: Notification[] = [];
    private visibleNotifications = new Map<number, Notification>();

    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    /**
     * Limpa os intervalos e realiza a limpeza do serviço ao ser destruído.
     */
    public ngOnDestroy(): void {
        this.visibleNotifications.forEach(notification => {
            if (notification.intervalId) {
                clearInterval(notification.intervalId);
            }
        });
    }

    /**
     * Adiciona uma nova notificação ou atualiza uma notificação existente.
     * 
     * @param message Mensagem da notificação a ser exibida.
     * @param type Tipo da notificação (opcional, padrão: 'info').
     * @param totalDuration Duração em milissegundos antes de fechar a notificação (opcional, padrão: 5000).
     */
    public show(message: string, type: NotificationType = 'info', totalDuration: number = 5000): void {
        const existingNotification = Array.from(this.visibleNotifications.values())
            .find(notification => notification.message === message);

        if (existingNotification) {
            existingNotification.displayDuration = totalDuration;
        } else {
            const notification: Notification = { 
                id: this.nextId++, 
                message, 
                type, 
                displayDuration: totalDuration, 
                totalDuration,
                intervalId: null,
            };
            this.queue.push(notification);
            this.processQueue();
        }
    }

    /**
     * Fecha uma notificação específica com base no seu ID.
     * 
     * @param notificationId ID da notificação a ser fechada.
     */
    public close(notificationId: number): void {
        const notification = this.visibleNotifications.get(notificationId);

        if (notification?.intervalId) {
            clearInterval(notification.intervalId);
        }

        this.visibleNotifications.delete(notificationId);
        this.updateNotifications();
        this.processQueue();
    }

    /**
     * Emite a lista atualizada de notificações para os assinantes.
     * @private
     */
    private updateNotifications(): void {
        this.notificationsSubject.next(Array.from(this.visibleNotifications.values()));
    }

    /**
     * Processa a fila de notificações e exibe as que cabem na tela.
     * @private
     */
    private processQueue(): void {
        if (this.visibleNotifications.size < this.maxVisibleNotifications && this.queue.length > 0) {
            const notification = this.queue.shift()!;
            this.visibleNotifications.set(notification.id, notification);
            this.updateNotifications();

            const intervalId = setInterval(() => {
                notification.displayDuration -= 50;

                if (notification.displayDuration <= 0) {
                    this.close(notification.id);
                } else {
                    this.updateNotifications();
                }
            }, 50);

            notification.intervalId = intervalId;
        }
    }
}