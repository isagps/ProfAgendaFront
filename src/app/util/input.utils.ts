/**
 * @class InputUtils
 * @description
 * A classe `InputUtils` fornece métodos utilitários estáticos para manipulação e validação de entradas de dados.
 * Atualmente, inclui funcionalidades para verificar o conteúdo de strings, mas pode ser estendida para
 * abranger outras operações de entrada conforme necessário.
 */
export class InputUtils {
    /**
     * Verifica se uma string contém 'hora'.
     * 
     * @param value - A string a ser verificada.
     * @returns true se a string contém 'hora', caso contrário, false.
     */
    public static containsHora(value: string): boolean {
        if (!value) return false;

        return value.toLowerCase().includes('hora');
    }
}