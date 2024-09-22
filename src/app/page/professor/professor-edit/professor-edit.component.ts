import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
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

/**
 * Componente responsável pela edição de professores.
 * Ele permite editar o nome do professor e associar matérias ao mesmo.
 * Estende a classe genérica BaseEdit, que fornece funcionalidades padrão para a edição de entidades.
 */
@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatSelectModule,
        PanelComponent,
        ReactiveFormsModule,
    ],
    preserveWhitespaces: false,
    selector: 'app-professor-edit',
    standalone: true,
    templateUrl: './professor-edit.component.html',
})
export class ProfessorEditComponent extends BaseEdit<Professor> implements OnDestroy {
    
    /**
     * Opções de matérias disponíveis para serem associadas ao professor.
     * Estas opções são carregadas ao inicializar o componente.
     * @type {Materia[]}
     */
    public materiasOptions: Materia[] = [];

    /**
     * Construtor que injeta os serviços necessários e inicializa o formulário.
     * @param formBuilder Utilizado para construir o formulário reativo.
     * @param linkUtils Utilitário para manipulação de links e URLs.
     * @param notification Serviço de notificação para exibir mensagens ao usuário.
     * @param professorService Serviço responsável pelas operações da entidade Professor.
     * @param materiaService Serviço para obter as opções de matérias.
     */
    constructor(
        formBuilder: FormBuilder,
        linkUtils: LinkUtils,
        notification: NotificationService,
        professorService: ProfessorService,
        private materiaService: MateriaService,
    ) {
        // Chama o construtor da classe base, fornecendo os serviços necessários.
        super(linkUtils, notification, professorService, formBuilder);
    }

    /**
     * Inicializa os dados principais do professor no formulário, associando o nome e as matérias.
     * @param data Dados do professor que foram carregados para edição.
     */
    protected override initMainData(data: Professor): void {
        this.data = data;

        this.form = this.formBuilder.group({
            id: [data.id ?? ''],
            nome: [data.nome || '', Validators.required],
            materias: [data.materias?.map(materia => materia.id) || []],
        });
    }

    /**
     * Carrega as opções de matérias disponíveis ao inicializar o componente.
     * As matérias são buscadas do serviço `MateriaService`.
     */
    protected override loadData(): void {
        this.materiaService.getAllWithoutPagination()
            .pipe(takeUntil(this.destroy$))
            .subscribe(materias => this.materiasOptions = materias);
    }

    /**
     * Prepara os dados do professor para submissão.
     * O formulário coleta o nome do professor e associa as matérias selecionadas.
     * @returns Um objeto `Professor` pronto para ser enviado ou `undefined` se o formulário estiver inválido.
     */
    protected override submitData(): Professor | undefined {
        const formValue = this.form?.value;

        if (!formValue) {
            return undefined;
        }

        const professor: Professor = {
            id: formValue.id,
            nome: formValue.nome,
            materias: this.materiasOptions
                ?.filter((materia: Materia) => formValue.materias.includes(materia.id))
                .map((materia: Materia) => ({ id: materia.id, nome: materia.nome })) || [],
        };
        
        return professor;
    }
}