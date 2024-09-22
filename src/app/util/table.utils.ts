/**
 * Classe utilitária para manipulação de tabelas HTML.
 * 
 * A classe `TableUtils` fornece métodos estáticos para realizar operações relacionadas a tabelas HTML.
 * Atualmente, inclui um método para obter a contagem de colunas em uma tabela com base em seu ID.
 * 
 * Métodos disponíveis:
 * 
 * - ``getColumnCountByTableId``: Obtém o número de colunas de uma tabela HTML especificada pelo ID.
 */
export class TableUtils {
    /**
     * Obtém a contagem de colunas de uma tabela com base no ID fornecido.
     * 
     * Verifica se o ambiente é do lado do servidor (Node.js) e se o documento está disponível.
     * Em seguida, tenta encontrar a tabela pelo ID fornecido e conta o número de colunas no `<thead>`.
     * Se a tabela não for encontrada ou se ocorrer algum problema, retorna 1 por padrão.
     * 
     * @param tableId - ID da tabela cujo número de colunas deve ser determinado.
     * @returns O número de colunas na tabela ou 1 se a tabela não for encontrada ou houver um erro.
     */
    static getColumnCountByTableId(tableId: string): number {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return 1;
        }

        const table = document.getElementById(tableId);
        if (!table) {
            console.warn(`Tabela com ID "${tableId}" não encontrada.`);
            return 1;
        }

        return table.querySelector('thead tr')?.children.length ?? 1;
    }
}
