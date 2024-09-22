import { NotificationType } from "./notification-type.model";

/**
 * Representa uma notificação.
 * 
 * - `id` (number): Identificador único da notificação.
 * - `message` (string): Mensagem da notificação.
 * - `type` (NotificationType): Tipo da notificação, definido pelo modelo NotificationType.
 * - `displayDuration` (number): Duração da notificação em milissegundos.
 * - `totalDuration` (number): Duração inicial da notificação em milissegundos.
 */
export interface Notification {
    /**
     * Identificador único da notificação.
     *   @type number
     */
    id: number;

    /**
     * Mensagem da notificação.
     *   @type string
     */
    message: string;

    /**
     * Tipo da notificação, definido pelo modelo NotificationType.
     *   @type NotificationType
     */
    type: NotificationType;

    /**
     * Duração da notificação em milissegundos.
     *   @type number
     */
    displayDuration: number;

    /**
     * Duração inicial da notificação em milissegundos.
     *   @type number
     */
    totalDuration: number;

    /**
     * Identificador do intervalo associado à notificação.
     * Utilizado para controlar a atualização do tempo restante da notificação
     * e permitir que o intervalo seja limpo corretamente ao fechar a notificação.
     * 
     * @type NodeJS.Timeout | null
     */
    intervalId: NodeJS.Timeout | null;
}