import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './shared/components/bradcrumb/breadcrumb.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
    imports: [
        BreadcrumbComponent,
        CommonModule,
        NotificationComponent,
        RouterModule,
        SidebarComponent,
    ],
    preserveWhitespaces: false,
    selector: 'app-root',
    standalone: true,
    styleUrl: './app.component.scss',
    templateUrl: './app.component.html',
})
export class AppComponent { }