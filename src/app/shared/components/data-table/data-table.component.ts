import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Page } from '../../../model/page.model';
import { TableFilterComponent } from '../table-filter/table-filter.component';
import { TablePaginationComponent } from '../table-pagination/table-pagination.component';
import { TitleLabelPipe } from '../../pipe/title-label.pipe';
import { MatCardModule } from '@angular/material/card';

/**
 * O `DataTableComponent` é um componente que exibe dados em formato de tabela, permitindo paginação, filtros, e
 * a exibição de colunas configuráveis. Também permite executar ações (visualizar, editar e excluir) nos itens da tabela.
 */
@Component({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        TableFilterComponent,
        TablePaginationComponent,
        TitleLabelPipe,
    ],
    selector: 'app-data-table',
    standalone: true,
    styleUrls: ['./data-table.component.scss'],
    templateUrl: './data-table.component.html'
})
export class DataTableComponent implements AfterViewInit {
    /**
     * Tamanho da página atual. Define o número de itens exibidos por página.
     * @type {number}
     * @default 10
     */
    private _pageSize: number = 10;

    /**
     * Número da página atual.
     * @type {number}
     * @default 1
     */
    private _pageNumber: number = 1;

    /**
     * Valor do filtro aplicado à tabela.
     * @type {string}
     * @default ''
     */
    private _filter: string = '';

    /**
     * Evento emitido quando um item é deletado.
     * @type {EventEmitter<any>}
     */
    @Output() public delete = new EventEmitter<any>();

    /**
     * Evento emitido quando um item é editado.
     * @type {EventEmitter<any>}
     */
    @Output() public edit = new EventEmitter<any>();

    /**
     * Evento emitido quando o número da página é alterado.
     * @type {EventEmitter<number>}
     */
    @Output() public pageNumberChange = new EventEmitter<number>();

    /**
     * Evento emitido quando o tamanho da página é alterado.
     * @type {EventEmitter<number>}
     */
    @Output() public pageSizeChange = new EventEmitter<number>();

    /**
     * Evento emitido quando um item é visualizado.
     * @type {EventEmitter<any>}
     */
    @Output() public view = new EventEmitter<any>();

    /**
     * Evento emitido quando qualquer alteração (filtro, número da página, tamanho da página) é feita na tabela.
     * @type {EventEmitter<{ pageSize: number; pageNumber: number; filter: string }>}
     */
    @Output() public onChange = new EventEmitter<{ pageSize: number; pageNumber: number; filter: string }>();

    /**
     * Evento emitido quando o valor do filtro é alterado.
     * @type {EventEmitter<string>}
     */
    @Output() public filterChange = new EventEmitter<string>();

    /**
     * Dados a serem exibidos na tabela.
     * @type {Page}
     */
    @Input() public data?: Page;

    /**
     * Um mapa de colunas que devem ser exibidas ou ocultadas, onde a chave é o nome da coluna.
     * @type { { [key: string]: boolean } }
     */
    @Input() public showColumns: { [key: string]: boolean } = {};

    /**
     * Define o tamanho da página e emite o evento de alteração de tamanho da página.
     * @param {number} value - Novo tamanho da página.
     */
    @Input() public set pageSize(value: number) {
        if (this._pageSize !== value) {
            this._pageSize = value;
            this.pageSizeChange.emit(this._pageSize);
            this.emitChanges();
        }
    }

    /**
     * Define o número da página e emite o evento de alteração de número da página.
     * @param {number} value - Novo número da página.
     */
    @Input() public set pageNumber(value: number) {
        if (this._pageNumber !== value) {
            this._pageNumber = value;
            this.pageNumberChange.emit(this._pageNumber);
            this.emitChanges();
        }
    }

    /**
     * Define o filtro aplicado à tabela e emite o evento de alteração de filtro.
     * @param {string} value - Novo valor do filtro.
     */
    @Input() public set filter(value: string) {
        if (this._filter !== value) {
            this._filter = value;
            this.filterChange.emit(this._filter);
            this.emitChanges();
        }
    }

    /**
     * Obtém o tamanho da página atual.
     * @returns {number} - O tamanho da página.
     */
    public get pageSize(): number {
        return this._pageSize;
    }

    /**
     * Obtém o número da página atual.
     * @returns {number} - O número da página.
     */
    public get pageNumber(): number {
        return this._pageNumber;
    }

    /**
     * Obtém o valor do filtro atual.
     * @returns {string} - O valor do filtro.
     */
    public get filter(): string {
        return this._filter;
    }

    /**
     * Indica se a coluna de ações (visualizar, editar, excluir) deve ser exibida.
     * @type {boolean}
     */
    public showDelete: boolean = false;
    public showEdit: boolean = false;
    public showView: boolean = false;

    /**
     * Número de colunas na tabela.
     * @type {number}
     */
    public columnCount: number = 0;

    constructor(private cdr: ChangeDetectorRef) { }

    /**
     * Método do ciclo de vida que é chamado após a inicialização da visualização do componente.
     * Verifica se os eventos de ação (delete, edit, view) estão observados e calcula o número de colunas da tabela.
     */
    public ngAfterViewInit() {
        this.showDelete = !!this.delete.observed;
        this.showEdit = !!this.edit.observed;
        this.showView = !!this.view.observed;

        this.cdr.detectChanges();
    }

    /**
     * Retorna se a coluna de ações deve ser exibida, com base na presença de ações e dados.
     * @returns {boolean} - Verdadeiro se a coluna de ações deve ser exibida.
     */
    public get showActionColumn(): boolean {
        return this.data !== undefined && this.data?.items?.length > 0 && (this.showView || this.showEdit || this.showDelete);
    }

    /**
     * Retorna as chaves dos itens da tabela que devem ser exibidas, com base em `showColumns`.
     * @param {any} item - O item da tabela.
     * @returns {string[]} - Um array de chaves que devem ser exibidas.
     */
    public getKeys(item: any): string[] {
        return Object.keys(item || {}).filter(key => this.showColumns[key] !== false);
    }

    /**
     * Emite o evento `onChange` com os parâmetros de tamanho da página, número da página e filtro atuais.
     * @param {string} filter - O valor atual do filtro (opcional).
     */
    public emitChanges(filter: string = this._filter): void {
        this.onChange.emit({ pageSize: this._pageSize, pageNumber: this._pageNumber, filter });
    }

    /**
     * Verifica se um valor é um array.
     * @param {any} value - O valor a ser verificado.
     * @returns {boolean} - Verdadeiro se o valor for um array.
     */
    public isArray(value: any): boolean {
        return Array.isArray(value);
    }

    /**
     * Função `trackBy` usada no *ngFor para otimizar a renderização de itens da tabela.
     * @param {number} index - O índice do item.
     * @param {any} item - O item da tabela.
     * @returns {any} - O identificador único para o item.
     */
    public trackByItem(index: number, item: any): any {
        return item?.id || index;
    }

    /**
     * Função `trackBy` usada no *ngFor para otimizar a renderização de chaves de itens.
     * @param {number} index - O índice da chave.
     * @param {string} key - A chave do item.
     * @returns {string} - A chave única para o item.
     */
    public trackByKey(index: number, key: string): string {
        return key;
    }
}