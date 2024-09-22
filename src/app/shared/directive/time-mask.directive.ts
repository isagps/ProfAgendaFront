import { Directive, HostListener, ElementRef } from '@angular/core';

/**
 * Diretiva para aplicar máscara de tempo (HH:MM) em campos de entrada.
 * 
 * Esta diretiva formata a entrada do usuário para o formato de tempo padrão de 24 horas (HH:MM),
 * garantindo que os valores inseridos estejam dentro dos limites válidos para horas e minutos.
 * 
 * ### Exemplo de Uso:
 * ```html
 * <input type="text" appTimeMask />
 * ```
 */
@Directive({
    selector: '[appTimeMask]',
    standalone: true
})
export class TimeMaskDirective {
    /**
     * Define o comprimento máximo do campo de entrada para 5 caracteres (HH:MM).
     * 
     * @param el ElementRef do elemento host.
     */
    constructor(private el: ElementRef<HTMLInputElement>) {
        this.el.nativeElement.maxLength = 5;
    }

    /**
     * Listener para o evento de entrada (`input`) no campo de entrada.
     * Formata o valor para o padrão HH:MM conforme o usuário digita.
     * 
     * @param event Evento de entrada.
     */
    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const rawValue = input.value.replace(/\D/g, '');

        input.value = this.formatTime(rawValue);
    }

    /**
     * Listener para o evento de perda de foco (`blur`) no campo de entrada.
     * Garante que o valor esteja corretamente formatado ao sair do campo.
     */
    @HostListener('blur')
    onBlur(): void {
        const input = this.el.nativeElement;
        const rawValue = input.value.replace(/\D/g, '');

        let formattedValue = this.formatTime(rawValue);
        input.value = formattedValue;
    }

    /**
     * Formata uma string numérica para o padrão de tempo HH:MM.
     * 
     * @param value Valor numérico sem formatação.
     * @returns Valor formatado para HH:MM ou string vazia se inválido.
     */
    private formatTime(value: string): string {
        if (!value) return '';

        if (value.length > 2) {
            value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
        }

        let [hours, minutes] = value.split(':').map(part => parseInt(part, 10) || 0);
        if (hours > 23 || minutes > 59) {
            value = `${value.slice(0, -1)}`;
        }

        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        return value;
    }
}