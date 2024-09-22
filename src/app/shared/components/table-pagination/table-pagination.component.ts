import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Componente de paginação para uma tabela, que permite navegar entre as páginas
 * e selecionar o tamanho da página. Funciona de forma independente (standalone).
 */
@Component({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTooltipModule,
    ],
    preserveWhitespaces: false,
    selector: 'app-table-pagination',
    standalone: true,
    styleUrls: ['./table-pagination.component.scss'],
    templateUrl: './table-pagination.component.html',
})
export class TablePaginationComponent {
    
    /**
     * Número atual da página. Começa no valor 1 por padrão.
     */
    @Input() public pageNumber: number = 1;

    /**
     * Tamanho da página, que define quantos itens são exibidos por página. O padrão é 10.
     */
    @Input() public pageSize: number = 10;

    /**
     * Número total de itens no dataset.
     */
    @Input() public totalItems: number = 0;

    /**
     * Emite o novo número da página quando uma mudança de página ocorre.
     */
    @Output() public pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Emite o novo tamanho da página quando o usuário seleciona uma nova opção de tamanho.
     */
    @Output() public pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Opções de tamanhos de página disponíveis. Define os valores: 5, 10, 25, 50, 100.
     */
    public pageSizeOptions: number[] = [5, 10, 25, 50, 100];

    /**
     * Calcula o número total de páginas com base no número total de itens e no tamanho da página atual.
     * @returns O número total de páginas.
     */
    public get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Navega para uma nova página se o número da página estiver entre 1 e o total de páginas.
     * Emite o novo número da página através do evento `pageNumberChange`.
     * @param newPage O número da nova página.
     */
    public onPageChange(newPage: number): void {
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.pageNumber = newPage;
            this.pageNumberChange.emit(this.pageNumber);
        }
    }

    /**
     * Muda o tamanho da página conforme a seleção do usuário.
     * Emite o novo tamanho da página através do evento `pageSizeChange`.
     * @param event O evento contendo o novo tamanho da página.
     */
    public onPageSizeChange(event: { value: number }): void {
        this.pageSize = event.value;
        this.pageSizeChange.emit(this.pageSize);
    }
}