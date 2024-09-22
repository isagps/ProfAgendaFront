/**
 * Item da barra lateral.
 * 
 * Define a estrutura de um item na barra lateral, incluindo suas propriedades e organização hierárquica.
 * 
 * **Propriedades:**
 * 
 * - `isOpen`: `boolean` - Indica se o item está aberto (expansível) ou fechado (recolhido).
 * - `label`: `string` - Texto exibido para o item na barra lateral.
 * - `children`: `SidebarItem[]` (opcional) - Lista de itens filhos, se o item atual for um grupo que contém outros itens.
 * - `group`: `string` (opcional) - Nome do grupo ao qual o item pertence. Usado para organizar itens em grupos hierárquicos.
 * - `hasChildren`: `boolean` (opcional) - Indica se o item possui filhos ou não. Usado para determinar se o item é um grupo.
 * - `icon`: `string` (opcional) - Nome ou caminho do ícone associado ao item.
 * - `url`: `string` (opcional) - URL associada ao item, usada para navegação.
 */
export interface SidebarItem {
    /**
     * Indica se o item está aberto (expansível) ou fechado (recolhido).
     * 
     * Este atributo é obrigatório e controla o estado de expansão do item na interface.
     * 
     * @type {boolean}
     */
    isOpen: boolean;

    /**
     * Texto exibido para o item na barra lateral.
     * 
     * Este atributo é obrigatório e representa o nome ou título do item que será exibido.
     * 
     * @type {string}
     */
    label: string;

    /**
     * Lista de itens filhos.
     * 
     * Este atributo é opcional e só deve ser usado se o item atual for um grupo que contém outros itens. 
     * É usado para definir uma estrutura hierárquica de itens.
     * 
     * @type {SidebarItem[]}
     */
    children?: SidebarItem[];

    /**
     * Nome do grupo ao qual o item pertence.
     * 
     * Usado para organizar itens em grupos hierárquicos. Este atributo é opcional.
     * 
     * @type {string}
     */
    group?: string;

    /**
     * Indica se o item possui filhos ou não.
     * 
     * Este atributo é opcional e é usado para determinar se o item deve ser exibido como um grupo expandível ou não.
     * 
     * @type {boolean}
     */
    hasChildren?: boolean;

    /**
     * Nome ou caminho do ícone associado ao item.
     * 
     * Este atributo é opcional e pode ser usado para exibir um ícone ao lado do texto do item.
     * 
     * @type {string}
     */
    icon?: string;

    /**
     * URL associada ao item.
     * 
     * Este atributo é opcional e pode ser usado para navegação quando o item é selecionado.
     * 
     * @type {string}
     */
    url?: string;
}