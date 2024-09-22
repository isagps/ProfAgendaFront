import { Component } from '@angular/core';

import { BaseList } from '../../../infrastructure/base-list';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LinkUtils } from './../../../util/link.utils';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { Turma } from '../../../model/turma.model';
import { TurmaService } from '../../../service/turma.service';

/**
 * Componente responsável por listar as turmas.
 * Extende a classe genérica BaseList para lidar com as operações comuns de listagem.
 * Utiliza serviços de confirmação, notificação e manipulação de turmas.
 */
@Component({
    imports: [DataTableComponent, PanelComponent],
    selector: 'app-turma-list',
    standalone: true,
    templateUrl: './turma-list.component.html',
})
export class TurmaListComponent extends BaseList<Turma> {
    /**
     * Construtor do componente que injeta os serviços necessários.
     * @param confirmDialog Serviço para exibir diálogos de confirmação.
     * @param linkUtils Utilitário para gerenciamento de links (URL).
     * @param notification Serviço de notificação para mostrar alertas e mensagens.
     * @param turmaService Serviço específico para operações relacionadas à turma.
     */
    constructor(
        confirmDialog: ConfirmDialogService,
        linkUtils: LinkUtils,
        notification: NotificationService,
        turmaService: TurmaService,
    ) {
        super(confirmDialog, linkUtils, notification, turmaService);
    }
}