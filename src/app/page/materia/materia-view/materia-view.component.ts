import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { BaseView } from '../../../infrastructure/base-view';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { MateriaService } from '../../../service/materia.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { Professor } from '../../../model/professor.model';
import { TableFilterComponent } from '../../../shared/components/table-filter/table-filter.component';

/**
 * Componente responsável por exibir os detalhes de uma matéria.
 * Ele herda da classe genérica BaseView, que oferece funcionalidades comuns
 * para exibir detalhes de uma entidade.
 */
@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatInputModule,
        MatTableModule,
        PanelComponent,
        TableFilterComponent,
    ],
    preserveWhitespaces: false,
    selector: 'app-materia-create',
    standalone: true,
    templateUrl: './materia-view.component.html',
})
export class MateriaViewComponent extends BaseView<Materia> {
    /**
     * Lista de professores filtrados que estão associados à matéria.
     * É usada para exibir os professores em uma tabela com base nos dados da matéria.
     * @type {Professor[] | undefined}
     */
    public override filtered?: Professor[] = [];

    /**
     * Construtor que injeta os serviços necessários.
     * @param linkUtils Utilitário para manipulação de URLs.
     * @param notification Serviço de notificação para exibir mensagens ao usuário.
     * @param service Serviço responsável por operações relacionadas à matéria.
     */
    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: MateriaService,
    ) {
        super(linkUtils, notification, service);
        // Inicializa os dados da matéria com um novo objeto vazio.
        this.data = new Materia();
    }

    /**
     * Método chamado para carregar os dados de uma matéria específica.
     * Atualiza a lista de professores associados à matéria.
     * @param data Dados da matéria que estão sendo carregados.
     */
    protected override loadData(data: Materia): void {
        super.loadData(data);
        // Associa a lista de professores à variável 'filtered' para exibição.
        this.filtered = data.professores;
    }
}