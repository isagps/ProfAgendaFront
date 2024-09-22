import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { BaseEdit } from '../../../infrastructure/base-edit';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { MateriaService } from '../../../service/materia.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';

/**
 * Componente responsável por editar os detalhes de uma matéria.
 * Ele estende a classe genérica BaseEdit, que oferece funcionalidades padrão para edição de entidades.
 */
@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        PanelComponent,
        ReactiveFormsModule,
    ],
    preserveWhitespaces: false,
    selector: 'app-materia-create',
    standalone: true,
    templateUrl: './materia-edit.component.html',
})
export class MateriaEditComponent extends BaseEdit<Materia> {
    
    /**
     * Construtor que injeta os serviços e o form builder necessários para manipulação e edição da matéria.
     * @param fb Utilizado para construir o formulário reativo.
     * @param linkUtils Utilitário para manipulação de links e URLs.
     * @param notification Serviço de notificação para exibir mensagens ao usuário.
     * @param service Serviço responsável por operações relacionadas à entidade Materia.
     */
    constructor(
        fb: FormBuilder,
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: MateriaService,
    ) {
        // Chama o construtor da classe BaseEdit, passando os serviços necessários.
        super(linkUtils, notification, service, fb);
    }

    /**
     * Método responsável por inicializar os dados principais da matéria no formulário.
     * @param data Dados da matéria carregados da API ou de outra fonte.
     */
    protected override initMainData(data: Materia): void {
        this.data = data;

        // Inicializa o formulário com os dados da matéria
        this.form = this.formBuilder.group({
            id: [data.id ?? ''],  // Preenche o campo id se existir, caso contrário, vazio
            nome: [data.nome || '', Validators.required],  // Valida o nome como obrigatório
            professores: [data.professores || []]  // Lista de professores, inicializada vazia se não houver
        });
    }

    /**
     * Método responsável por preparar os dados da matéria para submissão.
     * Este método coleta os valores do formulário e retorna um objeto `Materia`.
     * @returns Um objeto `Materia` pronto para ser enviado ou `undefined` caso o formulário esteja inválido.
     */
    protected override submitData(): Materia | undefined {
        const formValue = this.form?.value;  // Coleta os valores do formulário

        if (!formValue) {
            return undefined;  // Retorna undefined se os dados do formulário não forem válidos
        }

        // Retorna os dados da matéria prontos para submissão
        return {
            id: formValue.id,
            nome: formValue.nome
        } as Materia;
    }
}