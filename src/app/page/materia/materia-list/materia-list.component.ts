import { Component } from '@angular/core';

import { BaseList } from '../../../infrastructure/base-list';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { MateriaService } from '../../../service/materia.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';

/**
 * Componente responsável por listar as matérias.
 * Estende a classe genérica BaseList para lidar com operações comuns de listagem.
 * Utiliza serviços de confirmação, notificação e manipulação de matérias.
 */
@Component({
  imports: [PanelComponent, DataTableComponent],
  preserveWhitespaces: false,
  selector: 'app-materia-list',
  standalone: true,
  templateUrl: './materia-list.component.html',
})
export class MateriaListComponent extends BaseList<Materia> {
    /**
     * Construtor do componente que injeta os serviços necessários.
     * @param confirmDialog Serviço para exibir diálogos de confirmação.
     * @param linkUtils Utilitário para gerenciamento de links (URL).
     * @param notification Serviço de notificação para mostrar alertas e mensagens.
     * @param materiaService Serviço específico para operações relacionadas à matéria.
     */
    constructor(
        confirmDialog: ConfirmDialogService,
        linkUtils: LinkUtils,
        notification: NotificationService,
        materiaService: MateriaService,
    ) {
        super(confirmDialog, linkUtils, notification, materiaService);
    }
}