import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente de calendário que exibe o mês atual e permite navegar entre os meses.
 * O tamanho do componente pode ser controlado por meio do input `size`.
 */
@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [MatCardModule, MatIconModule, CommonModule],
    styleUrls: ['./calendar.component.scss'],
    templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {

    /**
     * Input que define o tamanho do calendário.
     * Valores possíveis: 'extra-small', 'small', 'medium', 'large', 'extra-large'.
     * O valor padrão é 'medium'.
     */
    @Input() size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' = 'medium';

    /** Array que armazena os dias do mês atual e se o dia é o atual. */
    calendarDays: { day: number, isToday: boolean }[] = [];

    /** Mês atual representado como um número (0 = Janeiro, 11 = Dezembro). */
    currentMonth = new Date().getMonth();

    /** Ano atual. */
    currentYear = new Date().getFullYear();

    /** O dia atual do mês. */
    today = new Date().getDate();

    /** Nomes dos dias da semana. */
    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    /** Nomes dos meses do ano. */
    monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    /** Variável que armazena o tamanho atual do calendário. */
    calendarSize: string = 'medium';

    /**
     * Método de inicialização que é chamado quando o componente é montado.
     * Carrega o tamanho do calendário e os dias do mês atual.
     */
    ngOnInit(): void {
        this.setCalendarSize();
        this.loadCalendarDays();
    }

    /**
     * Define o tamanho do calendário com base no valor do input `size`.
     * A classe CSS apropriada é atribuída à variável `calendarSize`.
     */
    setCalendarSize(): void {
        this.calendarSize = this.size;
    }

    /**
     * Carrega os dias do mês atual e verifica se algum desses dias é o dia atual.
     * Atualiza o array `calendarDays` com os dias do mês.
     */
    loadCalendarDays(): void {
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            isToday: i + 1 === this.today && this.currentMonth === new Date().getMonth(),
        }));
    }

    /**
     * Navega para o mês anterior. Caso esteja em Janeiro (0), navega para Dezembro do ano anterior.
     * Após a navegação, recarrega os dias do mês.
     */
    previousMonth(): void {
        this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        this.currentYear = this.currentMonth === 11 ? this.currentYear - 1 : this.currentYear;
        this.loadCalendarDays();
    }

    /**
     * Navega para o próximo mês. Caso esteja em Dezembro (11), navega para Janeiro do próximo ano.
     * Após a navegação, recarrega os dias do mês.
     */
    nextMonth(): void {
        this.currentMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
        this.currentYear = this.currentMonth === 0 ? this.currentYear + 1 : this.currentYear;
        this.loadCalendarDays();
    }
}