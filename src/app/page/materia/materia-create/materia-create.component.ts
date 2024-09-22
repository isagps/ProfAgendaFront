import { Component } from '@angular/core';

import { BaseCreate } from '../../../infrastructure/base-create';
import { DataFormComponent } from '../../../shared/components/data-form/data-form.component';
import { LinkUtils } from '../../../util/link.utils';
import { Materia } from '../../../model/materia.model';
import { MateriaService } from '../../../service/materia.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';

@Component({
  imports: [DataFormComponent],
  preserveWhitespaces: false,
  selector: 'app-materia-create',
  standalone: true,
  templateUrl: './materia-create.component.html',
})
export class MateriaCreateComponent extends BaseCreate<Materia> {
    constructor(
        linkUtils: LinkUtils,
        notification: NotificationService,
        service: MateriaService,
    ) {
        super(linkUtils, notification, service);
        this.data = new Materia();
    }
}