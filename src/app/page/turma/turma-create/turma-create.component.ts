import { Component } from '@angular/core';

import { BaseCreate } from '../../../infrastructure/base-create';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { LinkUtils } from '../../../util/link.utils';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { Turma } from '../../../model/turma.model';
import { TurmaService } from '../../../service/turma.service';

@Component({
  imports: [DataFormComponent],
  preserveWhitespaces: false,
  selector: 'app-turma-create',
  standalone: true,
  templateUrl: './turma-create.component.html',
})
export class TurmaCreateComponent extends BaseCreate<Turma> {
    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: TurmaService,
    ) {
        super(linkUtils, notification, service);
        this.data = new Turma();
    }
}