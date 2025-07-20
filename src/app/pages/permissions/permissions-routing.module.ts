import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission-create/permission-create.component';
import { PermissionUpdateComponent } from './permission-update/permission-update.component';

const routes: Routes = [
  { path: '', component: PermissionListComponent },
  { path: 'create', component: PermissionCreateComponent },
  { path: 'edit', component: PermissionUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
