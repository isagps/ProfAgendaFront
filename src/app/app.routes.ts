import { Routes } from '@angular/router';

import { BreadcrumbConfig } from './shared/components/bradcrumb/model/breadcrumb-config.model';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MateriaCreateComponent } from './page/materia/materia-create/materia-create.component';
import { MateriaEditComponent } from './page/materia/materia-edit/materia-edit.component';
import { MateriaListComponent } from './page/materia/materia-list/materia-list.component';
import { MateriaViewComponent } from './page/materia/materia-view/materia-view.component';
import { ProfessorCreateComponent } from './page/professor/professor-create/professor-create.component';
import { ProfessorEditComponent } from './page/professor/professor-edit/professor-edit.component';
import { ProfessorListComponent } from './page/professor/professor-list/professor-list.component';
import { ProfessorViewComponent } from './page/professor/professor-view/professor-view.component';
import { SidebarConfig } from './shared/components/sidebar/models/sidebar-config.model';
import { TurmaCreateComponent } from './page/turma/turma-create/turma-create.component';
import { TurmaEditComponent } from './page/turma/turma-edit/turma-edit.component';
import { TurmaListComponent } from './page/turma/turma-list/turma-list.component';
import { TurmaViewComponent } from './page/turma/turma-view/turma-view.component';

export interface RouteData {
    label: string;
    icon?: string;
    sidebar?: SidebarConfig;
    breadcrumbConfig?: BreadcrumbConfig;
}

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { label: 'Dashboard', sidebar: { show: true }, breadcrumbConfig: { isMain: true } } as RouteData
    }, {
        path: 'materia',
        component: MateriaListComponent,
        data: { label: 'Consultar materia', breadcrumbConfig: { isMain: false }, sidebar: { show: true, group: 'Matéria' } } as RouteData
    }, {
        path: 'materia/create',
        component: MateriaCreateComponent,
        data: { label: 'Criar matéria', breadcrumbConfig: { isMain: false, paths: ['materia'] }, sidebar: { show: true, group: 'Matéria' } } as RouteData
    }, {
        path: 'materia/view/:id',
        component: MateriaViewComponent,
        data: { label: 'Visualizar matéria', breadcrumbConfig: { isMain: false, paths: ['materia'] } } as RouteData
    }, {
        path: 'materia/edit/:id',
        component: MateriaEditComponent,
        data: { label: 'Editar matéria', breadcrumbConfig: { isMain: false, paths: ['materia'] } } as RouteData
    }, {
        path: 'professor',
        component: ProfessorListComponent,
        data: { label: 'Consultar professores', breadcrumbConfig: { isMain: false }, sidebar: { show: true, group: 'Professor' } } as RouteData
    }, {
        path: 'professor/create',
        component: ProfessorCreateComponent,
        data: { label: 'Criar professor', breadcrumbConfig: { isMain: false, paths: ['professor'] }, sidebar: { show: true, group: 'Professor' } } as RouteData
    }, {
        path: 'professor/view/:id',
        component: ProfessorViewComponent,
        data: { label: 'Visualizar professor', breadcrumbConfig: { isMain: false, paths: ['professor'] } } as RouteData
    }, {
        path: 'professor/edit/:id',
        component: ProfessorEditComponent,
        data: { label: 'Editar professor', breadcrumbConfig: { isMain: false, paths: ['professor'] } } as RouteData
    }, {
        path: 'turma',
        component: TurmaListComponent,
        data: { label: 'Consultar turmas', breadcrumbConfig: { isMain: false }, sidebar: { show: true, group: 'Turma' }, } as RouteData
    }, {
        path: 'turma/create',
        component: TurmaCreateComponent,
        data: { label: 'Criar turmas', breadcrumbConfig: { isMain: false, paths: ['turma'] }, sidebar: { show: true, group: 'Turma' } } as RouteData
    }, {
        path: 'turma/view/:id',
        component: TurmaViewComponent,
        data: { label: 'Visualizar turmas', breadcrumbConfig: { isMain: false, paths: ['turma'] } } as RouteData
    }, {
        path: 'turma/edit/:id',
        component: TurmaEditComponent,
        data: { label: 'Editar turmas', breadcrumbConfig: { isMain: false, paths: ['turma'] } } as RouteData
    },
];