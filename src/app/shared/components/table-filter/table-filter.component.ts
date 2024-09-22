import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente de filtro para tabelas, que permite filtrar os dados com base em uma ou mais propriedades de um objeto.
 * Inclui funcionalidade de debounce para evitar processamento excessivo e mostrar um indicador de carregamento
 * enquanto o filtro é aplicado.
 */
@Component({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    ],
    preserveWhitespaces: false,
    selector: 'app-table-filter',
    standalone: true,
    styleUrls: ['./table-filter.component.scss'],
    templateUrl: './table-filter.component.html',
})
export class TableFilterComponent implements OnDestroy {
    /**
     * Lista de dados que será filtrada.
     * @type {any[] | undefined}
     */
    @Input() data: any[] | undefined = [];

    /**
     * Lista de propriedades das quais o filtro será aplicado.
     * Permite que o filtro busque em múltiplas colunas/atributos.
     * @type {string[]}
     */
    @Input() filterProperties: string[] = [];

    /**
     * Rótulo exibido no campo de input do filtro.
     * @type {string}
     */
    @Input() label: string = 'Filter';

    /**
     * Placeholder exibido no campo de input do filtro.
     * @type {string}
     */
    @Input() placeholder: string = '';

    /**
     * Evento emitido quando os dados são filtrados. A lista filtrada será emitida
     * para o componente pai através deste evento.
     * @type {EventEmitter<any[]>}
     */
    @Output() filteredData = new EventEmitter<any[]>();

    /**
     * Evento emitido sempre que o valor do filtro for alterado.
     * O valor atual do filtro será emitido para o componente pai.
     * @type {EventEmitter<string>}
     */
    @Output() filterChanged = new EventEmitter<string>();

    /**
     * Valor atual do filtro digitado no campo de input.
     * @type {string}
     */
    public filterValue: string = '';

    /**
     * Indicador de carregamento que aparece enquanto o filtro está sendo aplicado.
     * @type {boolean}
     */
    public isLoading: boolean = false;

    /**
     * Subject usado para aplicar debounce ao filtro, evitando que ele seja disparado
     * a cada digitação.
     * @type {Subject<string>}
     */
    private filterSubject = new Subject<string>();

    /**
     * Subject para gerenciar o ciclo de vida da assinatura e prevenir vazamento de memória.
     * @type {Subject<void>}
     */
    private destroy$ = new Subject<void>();

    /**
     * Método de ciclo de vida chamado quando o componente é inicializado.
     * Configura o debounce para o filtro com um atraso de 300ms.
     */
    public ngOnInit(): void {
        this.filterSubject
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe((filterValue) => {
                this.applyFilter(filterValue);
            });
    }

    /**
     * Método chamado quando o valor do input é alterado.
     * Atualiza o valor do filtro, emite o evento `filterChanged` e inicia o indicador de carregamento.
     * @param {Event} event - O evento de input do campo de texto.
     */
    public onFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

        this.isLoading = true;
        this.filterSubject.next(filterValue);
        this.filterChanged.emit(filterValue);
    }

    /**
     * Aplica o filtro nos dados fornecidos com base no valor de filtro atual.
     * Filtra em múltiplas propriedades, conforme definidas no array `filterProperties`.
     * @param {string} filterValue - O valor atual do filtro.
     */
    public applyFilter(filterValue: string): void {
        if (this.data && this.filterProperties.length > 0) {
            const filtered = this.data.filter((item) =>
                this.filterProperties.some((prop) =>
                    String(this.getNestedPropertyValue(item, prop))
                        .toLowerCase()
                        .includes(filterValue.toLowerCase())
                )
            );
            this.filteredData.emit(filtered);
        } else {
            this.filteredData.emit(this.data);
        }
        this.isLoading = false;
    }

    /**
     * Retorna o valor de uma propriedade aninhada em um objeto com base em uma string de caminho.
     * Exemplo: 'professor.nome' acessará item['professor']['nome'].
     * @param {any} obj - O objeto do qual queremos acessar a propriedade.
     * @param {string} path - O caminho da propriedade, separado por '.'.
     * @returns {any} - O valor da propriedade aninhada, ou undefined se não existir.
     */
    private getNestedPropertyValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }    

    /**
     * Limpa o valor do filtro e restaura os dados originais.
     */
    public clearFilter(): void {
        this.filterValue = '';
        this.isLoading = false;
        this.filteredData.emit(this.data);
        this.filterChanged.emit('');
    }

    /**
     * Método chamado quando o componente é destruído.
     * Emite o valor para `destroy$` e completa o observable para cancelar todas as assinaturas ativas.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}