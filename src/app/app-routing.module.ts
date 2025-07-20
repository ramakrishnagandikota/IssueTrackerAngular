import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { LoginComponent } from './Auth/login/login.component';

const routes: Routes = [
  {path:"", component: LoginComponent},
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
