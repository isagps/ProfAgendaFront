import { Pipe, PipeTransform } from '@angular/core';

/**
 * @pipe TitleLabelPipe
 * @description
 * Transforma uma string substituindo underscores (`_`) por espaços e convertendo todas as letras para maiúsculas.
 * 
 * **Exemplo de Uso:**
 * ```html
 * <p>{{ 'nome_do_campo' | titleLabel }}</p>
 * <!-- Output: NOME DO CAMPO -->
 * ```
 */
@Pipe({ name: 'titleLabel', standalone: true })
export class TitleLabelPipe implements PipeTransform {
    /**
     * Transforma a string de entrada substituindo underscores por espaços e convertendo para maiúsculas.
     * 
     * @param {string} value - A string a ser transformada.
     * @returns {string} - A string formatada com espaços e letras maiúsculas.
     * 
     * **Exemplo:**
     * ```typescript
     * const resultado = titleLabelTransform('exemplo_de_texto');
     * console.log(resultado); // Output: EXEMPLO DE TEXTO
     * ```
     */
    transform(value: string = ''): string {
        return value.replace(/_/g, ' ').toUpperCase();
    }
}