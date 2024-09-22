import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { MateriaService } from '../../service/materia.service';
import { PanelComponent } from '../../shared/components/panel/panel.component';
import { ProfessorService } from '../../service/professor.service';
import { TurmaService } from '../../service/turma.service';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

/**
 * O DashboardComponent exibe um painel que inclui contadores de matérias, professores e turmas,
 * além de um calendário e uma tabela com detalhes de professores e aulas.
 */
@Component({
    imports: [
        CalendarComponent,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatTooltipModule,
        NgxChartsModule,
        PanelComponent,
    ],
    selector: 'app-dashboard',
    standalone: true,
    styleUrls: ['./dashboard.component.scss'],
    templateUrl: './dashboard.component.html',
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' }
      ]
})
export class DashboardComponent implements OnInit, OnDestroy {
    /**
     * Observable para gerenciar a destruição do componente e evitar vazamentos de memória.
     */
    private destroy$ = new Subject<void>();

    /**
     * Contadores exibidos no dashboard para matérias, professores e turmas.
     */
    public totalMaterias: number = 0;
    public totalProfessores: number = 0;
    public totalTurmas: number = 0;

    /**
     * Data atual utilizada para exibir no tooltip do calendário.
     */
    public currentDate = new Date();

    /**
     * Construtor para injetar os serviços necessários para carregar dados do dashboard.
     * 
     * @param materiaService Serviço responsável por obter dados de matérias.
     * @param professorService Serviço responsável por obter dados de professores.
     * @param turmaService Serviço responsável por obter dados de turmas.
     */
    constructor(
        private materiaService: MateriaService,
        private professorService: ProfessorService,
        private turmaService: TurmaService,
    ) {}

    /**
     * Método de inicialização do componente.
     * Chama a função para carregar os dados do dashboard ao iniciar o componente.
     */
    public ngOnInit(): void {
        this.loadDashboardData();
    }

    /**
     * Método chamado quando o componente é destruído.
     * Utilizado para garantir que o Observable `destroy$` complete e evite vazamentos de memória.
     */
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Carrega os dados do dashboard (matérias, professores e turmas) de forma assíncrona
     * usando o `forkJoin` para executar as requisições simultaneamente.
     */
    public loadDashboardData(): void {
        forkJoin({
            materias: this.materiaService.countAll(),
            professores: this.professorService.countAll(),
            turmas: this.turmaService.countAll()
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: ({ materias, professores, turmas }) => {
                this.totalMaterias = materias;
                this.totalProfessores = professores;
                this.totalTurmas = turmas;
            },
            error: (err) => {
                console.error('Erro ao carregar dados do dashboard', err);
            }
        });
    }
}