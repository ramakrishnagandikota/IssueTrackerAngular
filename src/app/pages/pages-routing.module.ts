import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  { path: '', component: PagesComponent,
    children: [
          {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'permissions',
        loadChildren: () =>
          import('./permissions/permissions.module').then(
            (m) => m.PermissionsModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'issues',
        loadChildren: () =>
          import('./issues/issues.module').then((m) => m.IssuesModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
