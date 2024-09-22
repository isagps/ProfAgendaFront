/**
 * Interface que representa uma página de resultados paginados.
 * 
 * @template T Tipo dos itens contidos na página.
 */
export interface Page {
    /** Número atual da página. */
    page_number: number;
    
    /** Número de itens por página. */
    page_size: number;
    
    /** Número total de itens disponíveis. */
    total_items: number;
    
    /** Array de itens na página atual. */
    items: any[];
}

/**
 * Classe que implementa a interface Page<T> para representar uma página de resultados paginados.
 * 
 * @template T Tipo dos itens contidos na página.
 */
export class Page implements Page {
    /** Número atual da página. */
    page_number: number;
    
    /** Número de itens por página. */
    page_size: number;
    
    /** Número total de itens disponíveis. */
    total_items: number;
    
    /** Array de itens na página atual. */
    items: any[];
    
    /**
     * Cria uma instância de PageModel.
     * 
     * @param {number} [page_number=1] Número da página. Default é 1.
     * @param {number} [page_size=10] Número de itens por página. Default é 10.
     * @param {number} [total_items=0] Número total de itens disponíveis. Default é 0.
     * @param {any[]} [items=[]] Array de itens na página atual. Default é um array vazio.
     */
    constructor(
        page_number: number = 1,
        page_size: number = 10,
        total_items: number = 0,
        items: any[] = []
    ) {
        this.page_number = page_number;
        this.page_size = page_size;
        this.total_items = total_items;
        this.items = items;
    }
}