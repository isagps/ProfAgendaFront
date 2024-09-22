import { Component } from '@angular/core';

import { BaseList } from '../../../infrastructure/base-list';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LinkUtils } from '../../../util/link.utils';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { Professor } from '../../../model/professor.model';
import { ProfessorService } from '../../../service/professor.service';

/**
 * Componente responsável por listar os professores.
 * Estende a classe BaseList para lidar com a lógica de listagem e manipulação de professores.
 */
@Component({
    imports: [DataTableComponent, PanelComponent],
    preserveWhitespaces: false,
    selector: 'app-professor-list',
    standalone: true,
    templateUrl: './professor-list.component.html',
})
export class ProfessorListComponent extends BaseList<Professor> {
    /**
     * Construtor do componente que injeta os serviços necessários.
     * @param confirmDialog Serviço para exibir diálogos de confirmação.
     * @param linkUtils Utilitário para gerenciamento de links (URL).
     * @param notification Serviço de notificação para mostrar alertas e mensagens.
     * @param professorService Serviço específico para operações relacionadas aos professores.
     */
    constructor(
        confirmDialog: ConfirmDialogService,
        linkUtils: LinkUtils,
        notification: NotificationService,
        professorService: ProfessorService,
    ) {
        super(confirmDialog, linkUtils, notification, professorService);
    }
}