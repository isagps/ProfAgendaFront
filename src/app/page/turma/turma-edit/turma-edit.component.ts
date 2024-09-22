import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';

import { BaseEdit } from '../../../infrastructure/base-edit';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { MateriaService } from '../../../service/materia.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { Professor } from '../../../model/professor.model';
import { ProfessorService } from '../../../service/professor.service';
import { TimeMaskDirective } from '../../../shared/directive/time-mask.directive';
import { Turma } from '../../../model/turma.model';
import { TurmaService } from '../../../service/turma.service';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Componente de edição de turmas, permitindo a edição de horários, professores e matérias para a turma.
 * Estende o componente base `BaseEdit` para aproveitar sua lógica de edição e manipulação de dados.
 */
@Component({
    selector: 'app-turma-edit',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        PanelComponent,
        ReactiveFormsModule,
        TimeMaskDirective,
        MatTooltipModule,
    ],
    templateUrl: './turma-edit.component.html',
    styleUrls: ['./turma-edit.component.scss'],
    preserveWhitespaces: false,
})
export class TurmaEditComponent extends BaseEdit<Turma> implements OnDestroy {

    /**
     * Lista de opções de matérias disponíveis para seleção no formulário.
     * Populada pelo serviço `MateriaService`.
     */
    public materiasOptions: Materia[] = [];

    /**
     * Lista de opções de professores disponíveis para seleção no formulário.
     * Populada pelo serviço `ProfessorService`.
     */
    public professoresOptions: Professor[] = [];

    /**
     * Lista dos dias da semana que pode ser usada para definir os horários de uma turma.
     */
    public diasDaSemana: string[] = [
        'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO',
    ];

    /**
     * Construtor que inicializa os serviços e constrói o formulário para edição.
     * 
     * @param formBuilder Construtor de formulários reativos.
     * @param linkUtils Utilitário para manipulação de links.
     * @param notification Serviço de notificações.
     * @param turmaService Serviço para operações relacionadas a `Turma`.
     * @param materiaService Serviço para obter as matérias.
     * @param professorService Serviço para obter os professores.
     */
    constructor(
        formBuilder: FormBuilder,
        linkUtils: LinkUtils,
        notification: NotificationService,
        turmaService: TurmaService,
        private materiaService: MateriaService,
        private professorService: ProfessorService,
    ) {
        super(linkUtils, notification, turmaService, formBuilder);
    }

    /**
     * Inicializa os dados principais da turma e configura o formulário com os valores recebidos.
     * Se a turma tiver horários existentes, eles serão adicionados ao formulário.
     * 
     * @param data Dados da turma a ser editada.
     */
    protected override initMainData(data: Turma): void {
        this.data = data;
        this.form = this.formBuilder.group({
            id: [data.id ?? ''],
            nome: [data.nome || '', Validators.required],
            horarios: this.formBuilder.array([]),
        });

        data.horarios?.forEach(horario => this.addHorario(horario));
    }

    /**
     * Carrega as listas de matérias e professores disponíveis.
     * Usa o método `getAllWithoutPagination` para buscar todas as matérias e professores.
     */
    protected override loadData(): void {
        this.materiaService.getAllWithoutPagination()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (materias) => this.materiasOptions = materias,
                error: () => this.notification.show('Erro ao carregar matérias', 'error'),
            });

        this.professorService.getAllWithoutPagination()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (professores) => this.professoresOptions = professores,
                error: () => this.notification.show('Erro ao carregar professores', 'error'),
            });
    }

    /**
     * Retorna o FormArray de horários dentro do formulário da turma.
     */
    public get horarios(): FormArray {
        return this.form!.get('horarios') as FormArray;
    }

    /**
     * Adiciona um grupo de formulário para um horário ao FormArray de horários.
     * 
     * @param horario O horário que será adicionado. Se não for fornecido, cria um grupo vazio.
     */
    public addHorario(horario?: any): void {
        this.horarios.push(this.createHorarioGroup(horario));
    }

    /**
     * Remove o grupo de formulário para o horário no índice especificado.
     * 
     * @param index O índice do horário a ser removido.
     */
    public removeHorario(index: number): void {
        this.horarios.removeAt(index);
    }

    /**
     * Cria um grupo de formulário para um horário, com campos de dia da semana, hora, professor e matéria.
     * 
     * @param horario Os dados do horário a serem preenchidos no grupo de formulário (opcional).
     */
    private createHorarioGroup(horario?: any): FormGroup {
        const professorId: number | null = horario?.professor?.id ?? null;
        const group = this.formBuilder.group({
            id: [horario?.id ?? ''],
            dia_da_semana: [horario?.dia_da_semana ?? '', Validators.required],
            hora: [horario?.hora ?? '', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
            professor: [professorId, Validators.required],
            materia: [horario?.materia?.id, Validators.required],
        });

        group.get('professor')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((professorId: number | null) => {
                const materiasDisponiveis = this.getMateriasForHorarioGroup(professorId);
                const materiaControl = group.get('materia') as FormControl;

                if (materiasDisponiveis.length === 0 || professorId === null) {
                    // Se não houver matérias ou professorId for null, limpar as matérias disponíveis
                    materiaControl.reset();
                }

                materiaControl.updateValueAndValidity();
            });

        return group;
    }

    /**
     * Retorna as matérias associadas a um professor específico.
     * 
     * @param professorId O ID do professor.
     * @returns Array de matérias associadas ao professor.
     */
    private getMateriasForHorarioGroup(professorId: number | null): Materia[] {
        if (professorId === null) {
            return [];
        }
        const professor = this.professoresOptions.find(p => p.id === professorId);
        return professor?.materias ?? [];
    }

    /**
     * Prepara os dados da turma a serem enviados ao serviço de edição, incluindo o mapeamento de horários,
     * professores e matérias.
     * 
     * @returns Os dados da turma para submissão.
     */
    protected override submitData(): Turma | undefined {
        if (!this.form) {
            return undefined;
        }

        const formValue = this.form.value;
        const horarios: any[] = formValue.horarios.map((horario: any) => {
            const professor = this.professoresOptions.find(p => p.id === horario.professor);
            const validMaterias = professor?.materias?.map(m => m.id) ?? [];

            if (validMaterias.length > 0 && !validMaterias.includes(horario.materia)) {
                this.notification.show(`Matéria inválida selecionada para o professor ${professor?.nome}`, 'error');
                throw new Error('Matéria inválida selecionada');
            }

            return {
                id: horario.id,
                dia_da_semana: horario.dia_da_semana,
                hora: horario.hora,
                professor: { id: horario.professor },
                materia: horario.materia ? { id: horario.materia } : undefined,
            };
        });

        const turma: Turma = {
            id: formValue.id,
            nome: formValue.nome,
            horarios: horarios,
        };

        return turma;
    }

    /**
     * Retorna as matérias associadas a um horário específico para exibição no template.
     * 
     * @param index O índice do horário no FormArray.
     * @returns Array de matérias filtradas para o professor selecionado.
     */
    public getMateriasForHorario(index: number): Materia[] {
        const horarioGroup = this.horarios.at(index);
        const professorId: number | null = horarioGroup.get('professor')?.value;
        return this.getMateriasForHorarioGroup(professorId);
    }

    /**
     * Método de rastreamento para otimizar a renderização de listas.
     * 
     * @param index O índice do item na lista.
     * @param item O item atual.
     * @returns O índice, usado como identificador único.
     */
    public trackByIndex(index: number, item: any): number {
        return index;
    }
}
