/**
 * Configuração para um item de breadcrumb.
 * 
 * Define as propriedades opcionais e obrigatórias usadas para configurar um item de breadcrumb em uma aplicação.
 * 
 * **Propriedades:**
 * 
 * - `isMain` (opcional): `boolean` - Indica se a rota é a principal para os breadcrumbs. Se `true`, a rota é tratada como a principal para o breadcrumb.
 * - `noUseMain` (opcional): `boolean` - Indica se a rota não deve usar a rota principal para breadcrumbs. Se `true`, a rota não utilizará a configuração da rota principal.
 * - `paths` (opcional): `string[]` - Lista de caminhos que devem ser considerados para gerar breadcrumbs. Define os caminhos adicionais para os quais o breadcrumb deve ser criado.
 */
export interface BreadcrumbConfig {
    /**
     * Indica se a rota é a principal para os breadcrumbs.
     * 
     * Se definido como `true`, a rota é tratada como a rota principal e será utilizada como base para gerar breadcrumbs.
     * 
     * @type {boolean}
     */
    isMain?: boolean;

    /**
     * Indica se a rota não deve usar a configuração da rota principal para breadcrumbs.
     * 
     * Se definido como `true`, a rota será excluída da configuração de breadcrumb principal, mesmo que seja a rota principal.
     * 
     * @type {boolean}
     */
    noUseMain?: boolean;

    /**
     * Lista de caminhos adicionais para gerar breadcrumbs.
     * 
     * Define os caminhos para os quais o breadcrumb deve ser criado, além da rota principal.
     * 
     * @type {string[]}
     */
    paths?: string[];
}
