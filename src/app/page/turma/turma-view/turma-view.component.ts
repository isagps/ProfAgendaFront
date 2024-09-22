import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

import { BaseView } from '../../../infrastructure/base-view';
import { Horario } from '../../../model/horario.model';
import { LinkUtils } from '../../../util/link.utils';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { TableFilterComponent } from '../../../shared/components/table-filter/table-filter.component';
import { Turma } from '../../../model/turma.model';
import { TurmaService } from '../../../service/turma.service';

/**
 * Componente responsável por exibir os detalhes de uma turma.
 * Estende a classe BaseView, que fornece funcionalidades comuns para visualização de entidades.
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
        PanelComponent,
        TableFilterComponent,
    ],
    preserveWhitespaces: false,
    selector: 'app-turma-view',
    standalone: true,
    templateUrl: './turma-view.component.html',
})
export class TurmaViewComponent extends BaseView<Turma> implements OnInit, OnDestroy {
    /**
     * Lista de horários filtrados associados à turma. Inicialmente vazia e preenchida ao carregar os dados.
     * @type {Horario[] | undefined}
     */
    public override filtered?: Horario[] = [];

    /**
     * Construtor que injeta os serviços necessários para manipulação da turma e exibição de notificações.
     * @param linkUtils Utilitário para manipulação de links e URLs.
     * @param notification Serviço de notificação para exibir mensagens ao usuário.
     * @param service Serviço responsável por operações relacionadas à entidade Turma.
     */
    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: TurmaService,
    ) {
        super(linkUtils, notification, service);
    }

    /**
     * Método responsável por carregar os dados de uma turma específica.
     * Atualiza a lista de horários associados à turma após os dados serem carregados.
     * @param data Dados da turma que foram carregados.
     */
    protected override loadData(data: Turma): void {
        super.loadData(data);
        this.filtered = data.horarios || [];
    }
}