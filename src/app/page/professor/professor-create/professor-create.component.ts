import { Component } from '@angular/core';

import { BaseCreate } from '../../../infrastructure/base-create';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { Professor } from '../../../model/professor.model';
import { ProfessorService } from '../../../service/professor.service';
import { LinkUtils } from '../../../util/link.utils';

@Component({
    imports: [DataFormComponent],
    selector: 'app-professor-create',
    standalone: true,
    templateUrl: './professor-create.component.html',
})
export class ProfessorCreateComponent extends BaseCreate<Professor> {
    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: ProfessorService,
    ) {
        super(linkUtils, notification, service);
        this.data = new Professor();
    }
}