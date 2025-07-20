import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission-create/permission-create.component';
import { PermissionUpdateComponent } from './permission-update/permission-update.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    PermissionsComponent,
    PermissionListComponent,
    PermissionCreateComponent,
    PermissionUpdateComponent
  ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
]
})
export class PermissionsModule { }
