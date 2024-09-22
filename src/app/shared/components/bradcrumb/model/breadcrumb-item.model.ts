/**
 * Configuração de um item no breadcrumb.
 * 
 * Define as propriedades opcionais e obrigatórias usadas para configurar um item no breadcrumb.
 * 
 * **Propriedades:**
 * 
 * - `icon` (opcional): `string` - Ícone associado ao item do breadcrumb.
 * - `label` (opcional): `string` - Texto a ser exibido para o item do breadcrumb.
 * - `url`: `string` - URL para a qual o item do breadcrumb deve redirecionar.
 */
export interface BreadcrumbItem {
    /**
     * Texto a ser exibido para o item do breadcrumb.
     * 
     * Este atributo é opcional e pode ser usado para fornecer uma descrição textual do item.
     * 
     * @type {string}
     */
    label: string;

    /**
     * URL para a qual o item do breadcrumb deve redirecionar.
     * 
     * Este atributo é obrigatório e define o link para a página correspondente ao item do breadcrumb.
     * 
     * @type {string}
     */
    url: string;

    /**
     * Ícone associado ao item do breadcrumb.
     * 
     * Este atributo é opcional e permite adicionar um ícone para representar visualmente o item.
     * 
     * @type {string}
     */
    icon?: string;
}
