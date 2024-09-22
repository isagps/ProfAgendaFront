/**
 * Configuração de um item na barra lateral.
 * 
 * Define as propriedades opcionais e obrigatórias usadas para configurar um item de barra lateral.
 * 
 * **Propriedades:**
 * 
 * - `show`: `boolean` - Define se o item deve ser exibido na barra lateral.
 * - `group`: `string` (opcional) - Nome do grupo ao qual o item pertence. Usado para organizar itens em grupos hierárquicos.
 */
export interface SidebarConfig {
    /**
     * Define se o item deve ser exibido na barra lateral.
     * 
     * Um valor booleano que, quando verdadeiro, indica que o item será mostrado.
     * 
     * @type {boolean}
     */
    show: boolean;

    /**
     * Nome do grupo ao qual o item pertence.
     * 
     * Usado para organizar itens em grupos hierárquicos. Este atributo é opcional.
     * 
     * @type {string}
     */
    group?: string;
}