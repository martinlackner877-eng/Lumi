import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ArchivePageComponent } from './features/workspace/archive-page.component';
import { AtlasPageComponent } from './features/workspace/atlas-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'LUMI | Quantum Dashboard',
  },
  {
    path: 'study-tree',
    loadComponent: () =>
      import('./features/study-tree/study-tree.component').then(
        (module) => module.StudyTreeComponent,
      ),
    title: 'LUMI | Quantum Study Map',
  },
  {
    path: 'atlas',
    component: AtlasPageComponent,
    title: 'LUMI | Atlas',
  },
  {
    path: 'archive',
    component: ArchivePageComponent,
    title: 'LUMI | Archive',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
