import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * @pipe FilterControlPipe
 * @description
 * Filtra uma lista de controles, removendo aqueles cujas chaves começam com 'id' ou cujo valor no formulário é um array.
 * 
 * **Exemplo de Uso:**
 * ```typescript
 * const controles = [
 *   { key: 'idUsuario', value: 123 },
 *   { key: 'nome', value: 'João' },
 *   { key: 'hobbies', value: ['futebol', 'leitura'] }
 * ];
 * 
 * const form = new FormGroup({
 *   idUsuario: new FormControl(123),
 *   nome: new FormControl('João'),
 *   hobbies: new FormControl(['futebol', 'leitura'])
 * });
 * 
 * const controlesFiltrados = controles | filterControl:form;
 * console.log(controlesFiltrados);
 * // Output: [{ key: 'nome', value: 'João' }]
 * ```
 */
@Pipe({ name: 'filterControl', standalone: true })
export class FilterControlPipe implements PipeTransform {
    /**
     * Filtra a lista de controles removendo aqueles cujas chaves começam com 'id' ou cujo valor no formulário é um array.
     * 
     * @param {Array<{ key: string; value: any }>} controls - A lista de controles a ser filtrada.
     * @param {FormGroup} form - O formulário contendo os valores dos controles.
     * @returns {Array<{ key: string; value: any }>} - A lista filtrada de controles.
     * 
     * **Exemplo:**
     * ```typescript
     * const controles = [
     *   { key: 'idProduto', value: 456 },
     *   { key: 'descricao', value: 'Produto X' },
     *   { key: 'tags', value: ['novo', 'em promoção'] }
     * ];
     * 
     * const form = new FormGroup({
     *   idProduto: new FormControl(456),
     *   descricao: new FormControl('Produto X'),
     *   tags: new FormControl(['novo', 'em promoção'])
     * });
     * 
     * const controlesFiltrados = filterControlTransform(controles, form);
     * console.log(controlesFiltrados);
     * // Output: [{ key: 'descricao', value: 'Produto X' }]
     * ```
     */
    transform(
        controls: { key: string; value: any }[],
        form: FormGroup
    ): { key: string; value: any }[] {
        return controls.filter(({ key }) => 
            !key.startsWith('id') && !Array.isArray(form.get(key)?.value)
        );
    }
}