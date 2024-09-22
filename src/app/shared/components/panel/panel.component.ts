import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Componente `PanelComponent` para exibir um painel com um cabeçalho e conteúdo personalizáveis.
 * 
 * Atributos:
 * - `header` (string): Texto exibido no cabeçalho do painel. Valor padrão é uma string vazia.
 * 
 * @example
 * <app-panel 
 *   header="Título do Painel" 
 * </app-panel>
 */
@Component({
    imports: [CommonModule, MatCardModule],
    preserveWhitespaces: false,
    selector: 'app-panel',
    standalone: true,
    templateUrl: './panel.component.html',
    styleUrl: './panel.component.scss',
})
export class PanelComponent {
    /**
     * O texto exibido no cabeçalho do painel.
     * @type {string}
     * @default ''
     */
    @Input() public header?: string = '';
}