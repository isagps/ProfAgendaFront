import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilterControlPipe } from '../../pipe/filter-control.pipe';
import { InputUtils } from '../../../util/input.utils';
import { PanelComponent } from '../panel/panel.component';
import { TimeMaskDirective } from '../../directive/time-mask.directive';
import { TitleLabelPipe } from '../../pipe/title-label.pipe';

/**
 * O `DataFormComponent` é um componente Angular que renderiza um formulário dinâmico dentro de um painel.
 * Ele suporta diferentes modos de operação: criação, visualização e edição de dados.
 * Utiliza o Angular Material para componentes de UI, garantindo uma interface moderna e responsiva.
 */
@Component({
    imports: [
        CommonModule,
        FilterControlPipe,
        MatButtonModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatTooltipModule,
        PanelComponent,
        ReactiveFormsModule,
        TimeMaskDirective,
        TitleLabelPipe,
    ],
    preserveWhitespaces: false,
    selector: 'app-data-form',
    standalone: true,
    templateUrl: './data-form.component.html',
})
export class DataFormComponent implements OnChanges, AfterViewInit {
    /**
     * Dados a serem exibidos no formulário.
     * @type {any}
     */
    @Input() data: any;

    /**
     * Título do painel que envolve o formulário.
     * @type {string | undefined}
     */
    @Input() header?: string;

    /**
     * Modo de operação do formulário: 'create' para criação, 'view' para visualização, ou 'edit' para edição.
     * @type {'create' | 'view' | 'edit'}
     * @default 'create'
     */
    @Input() mode: 'create' | 'view' | 'edit' = 'create';

    /**
     * Evento emitido ao submeter o formulário com os dados preenchidos.
     * @type {EventEmitter<any>}
     */
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();

    /**
     * Grupo de controles do formulário reativo.
     * @type {FormGroup}
     */
    public form: FormGroup;

    /**
     * Indica se os campos do formulário são somente leitura.
     * @type {boolean}
     * @default false
     */
    public isReadOnly: boolean = false;

    /**
     * Texto exibido no botão de submissão do formulário.
     * @type {string}
     * @default ''
     */
    public buttonText: string = '';

    /**
     * Construtor do componente que injeta os serviços necessários.
     * @param {FormBuilder} fb - Serviço para construir o formulário reativo.
     * @param {Location} location - Serviço para navegar entre rotas.
     * @param {ChangeDetectorRef} cdr - Serviço para detectar mudanças e atualizar a visualização.
     */
    constructor(
        private fb: FormBuilder,
        private location: Location,
        private cdr: ChangeDetectorRef
    ) {
    // Inicializa o grupo de controles do formulário vazio
        this.form = this.fb.group({});
    }

    /**
     * Detecta mudanças nas propriedades de entrada e configura o formulário conforme necessário.
     * @param {SimpleChanges} changes - Objeto que contém as mudanças nas propriedades de entrada.
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['mode']) {
            this.setupForm();
        }
    }

    /**
     * Método do ciclo de vida chamado após a inicialização da visualização do componente.
     * Pode ser usado para lógica adicional pós-renderização.
     */
    public ngAfterViewInit(): void {
        // Se necessário, adicione lógica adicional aqui
    }

    /**
     * Método chamado ao submeter o formulário.
     * Verifica se o formulário é válido e emite os dados através do evento `onSubmit`.
     */
    public submit(): void {
        if (this.form.valid) {
            this.onSubmit.emit(this.form.value);
        }
    }

    /**
     * Método chamado ao clicar no botão de cancelar.
     * Retorna para a página anterior na pilha de navegação.
     */
    public cancel(): void {
        this.location.back();
    }

    /**
     * Verifica se uma determinada chave contém a palavra "Hora".
     * Utiliza a função utilitária `InputUtils.containsHora`.
     * @param {string} value - Chave a ser verificada.
     * @returns {boolean} - Verdadeiro se a chave contiver "Hora", caso contrário, falso.
     */
    public containsHora(value: string): boolean {
        return InputUtils.containsHora(value);
    }

    /**
     * Verifica se um valor é um array.
     * @param {any} value - Valor a ser verificado.
     * @returns {boolean} - Verdadeiro se for um array, caso contrário, falso.
     */
    public isArray(value: any): boolean {
        return Array.isArray(value);
    }

    /**
     * Configura o formulário com base no modo de operação.
     * Chama os métodos para inicializar o modo e construir o formulário.
     */
    private setupForm(): void {
        this.initializeMode();
        this.buildForm();
    }

    /**
     * Inicializa as propriedades do formulário com base no modo de operação.
     * Define se os campos são somente leitura e o texto do botão de submissão.
     */
    private initializeMode(): void {
        switch (this.mode) {
            case 'create':
                this.isReadOnly = false;
                this.buttonText = 'Criar novo';
                break;
            case 'view':
                this.isReadOnly = true;
                this.buttonText = '';
                break;
            case 'edit':
                this.isReadOnly = false;
                this.buttonText = 'Salvar edição';
                break;
            default:
                this.isReadOnly = false;
                this.buttonText = '';
                break;
        }
    }

    /**
     * Constrói o grupo de controles do formulário com base nos dados fornecidos.
     * Cada chave nos dados se torna um controle no formulário.
     * @private
     */
    private buildForm(): void {
        const group: { [key: string]: any } = {};

        Object.keys(this.data || {}).forEach(key => {
            group[key] = [{ value: this.data[key], disabled: this.isReadOnly }];
        });

        this.form = this.fb.group(group);
    }

    /**
     * Obtém os controles do formulário filtrados que não contêm "Hora".
     * Utilizado para renderizar apenas os campos relevantes no formulário.
     * @returns {Array<[string, any]>} - Array de pares [chave, controle] filtrados.
     */
    public get filteredControls() {
        return Object.entries(this.form.controls).filter(([key, _]) => !this.containsHora(key));
    }

    /**
     * Calcula o número de colunas para o grid layout baseado no número de controles.
     * Se houver apenas um controle, retorna 1 coluna; caso contrário, retorna 2 colunas.
     * @returns {number} - Número de colunas para o grid.
     */
    public getGridCols(): number {
        return this.filteredControls.length === 1 ? 1 : 2;
    }

    /**
     * Função `trackBy` para otimizar a renderização de *ngFor nos controles do formulário.
     * Utiliza a chave do controle para identificar de forma única cada item.
     * @param {number} index - Índice do item no array.
     * @param {[string, any]} control - Par [chave, controle] do formulário.
     * @returns {string} - Chave única do controle.
     */
    public trackByKey(index: number, control: [string, any]): string {
        return control[0];
    }
}