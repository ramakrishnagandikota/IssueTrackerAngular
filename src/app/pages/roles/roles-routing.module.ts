import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleUpdateComponent } from './role-update/role-update.component';

const routes: Routes = [
  { path: '', component: RoleListComponent },
  { path: 'create', component: RoleCreateComponent },
  { path: 'edit', component: RoleUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
