import { Directive, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Diretiva para exibir mensagens de erro associadas a um controle de formulário Angular.
 * 
 * A diretiva `ShowErrorDirective` monitora o estado de um controle de formulário (`AbstractControl`) 
 * e exibe mensagens de erro específicas quando o controle está inválido e interagido (sujo ou tocado).
 * 
 * ### Funcionalidades:
 * - Exibe mensagens de erro personalizadas com base no tipo de erro.
 * - Adiciona uma classe CSS (`text-danger`) ao elemento host quando há um erro.
 * - Atualiza dinamicamente o conteúdo de texto do elemento host para refletir o estado de erro.
 * - Gerencia assinaturas de forma eficiente para evitar vazamentos de memória.
 * 
 * ### Exemplo de Uso:
 * ```html
 * <form [formGroup]="meuForm">
 *   <div>
 *     <label for="nome">Nome:</label>
 *     <input id="nome" formControlName="nome" />
 *     <span appShowError="meuForm.get('nome')" 
 *           errorMessage="Nome inválido." 
 *           requiredMessage="Nome é obrigatório.">
 *     </span>
 *   </div>
 *   
 *   <button type="submit">Enviar</button>
 * </form>
 * ```
 */
@Directive({
    selector: '[appShowError]',
    standalone: true
})
export class ShowErrorDirective implements OnInit, OnDestroy {
    /**
     * Controle de formulário a ser monitorado para exibição de erros.
     * 
     * @example
     * ```html
     * <span appShowError="meuForm.get('nome')"></span>
     * ```
     */
    @Input('appShowError') control!: AbstractControl;

    /**
     * Mensagem de erro genérica a ser exibida quando o controle está inválido.
     * 
     * @default 'Ocorreu um erro.'
     * @example
     * ```html
     * <span appShowError="meuForm.get('nome')" errorMessage="Nome inválido."></span>
     * ```
     */
    @Input() errorMessage: string = 'Ocorreu um erro.';

    /**
     * Mensagem de erro específica para o caso de o controle ser obrigatório.
     * 
     * @default 'Campo obrigatório.'
     * @example
     * ```html
     * <span appShowError="meuForm.get('nome')" requiredMessage="Nome é obrigatório."></span>
     * ```
     */
    @Input() requiredMessage: string = 'Campo obrigatório.';

    /**
     * Conteúdo de texto a ser exibido no elemento host.
     * 
     * Vinculado ao atributo `textContent` do elemento host.
     * 
     * @internal
     */
    @HostBinding('textContent') errorText: string = '';

    /**
     * Adiciona ou remove a classe CSS `text-danger` no elemento host com base no estado de erro.
     * 
     * Vinculado ao atributo `class.text-danger` do elemento host.
     * 
     * @internal
     */
    @HostBinding('class.text-danger') isError: boolean = false;

    /**
     * Subject utilizado para gerenciar o ciclo de vida das assinaturas observáveis.
     * 
     * @internal
     */
    private destroy$ = new Subject<void>();

    /**
     * Lifecycle hook chamado após a criação da diretiva.
     * 
     * Inicia a monitoração das mudanças de status do controle de formulário e atualiza o estado de erro inicialmente.
     */
    public ngOnInit(): void {
        if (this.control) {
            // Inscreve-se nas mudanças de status do controle até que `destroy$` emita.
            this.control.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.updateErrorState());

            // Atualiza o estado de erro inicialmente.
            this.updateErrorState();
        }
    }

    /**
     * Lifecycle hook chamado imediatamente antes de destruir a diretiva.
     * 
     * Emite um valor em `destroy$` para completar as assinaturas e evita vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Atualiza o estado de erro no elemento host com base no estado do controle de formulário.
     * 
     * - Se o controle estiver inválido e sujo ou tocado, exibe a mensagem de erro apropriada e adiciona a classe `text-danger`.
     * - Caso contrário, limpa a mensagem de erro e remove a classe `text-danger`.
     * 
     * @internal
     */
    private updateErrorState(): void {
        const isInvalid = this.control.invalid && (this.control.dirty || this.control.touched);
        if (isInvalid) {
            this.errorText = this.getErrorMessage();
            this.isError = true;
        } else {
            this.errorText = '';
            this.isError = false;
        }
    }

    /**
     * Determina a mensagem de erro apropriada com base nos erros presentes no controle de formulário.
     * 
     * Prioriza a mensagem de erro de campo obrigatório (`required`) sobre a mensagem genérica.
     * 
     * @returns A mensagem de erro a ser exibida.
     * 
     * @internal
     */
    private getErrorMessage(): string {
        return this.control.hasError('required') ? this.requiredMessage : this.errorMessage;
    }
}