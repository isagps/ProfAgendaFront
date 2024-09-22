import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

import { BaseView } from '../../../infrastructure/base-view';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { PanelComponent } from '../../../shared/components/panel/panel.component';
import { Professor } from '../../../model/professor.model';
import { ProfessorService } from './../../../service/professor.service';
import { TableFilterComponent } from '../../../shared/components/table-filter/table-filter.component';

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
    selector: 'app-professor-view',
    standalone: true,
    templateUrl: './professor-view.component.html',
})
export class ProfessorViewComponent extends BaseView<Professor> implements OnInit {
    override filtered?: Materia[] = [];

    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        professorService: ProfessorService,
    ) {
        super(linkUtils, notification, professorService);
    }

    protected override loadData(data: Professor): void {
        super.loadData(data);
        this.filtered = data.materias || [];
    }
}
