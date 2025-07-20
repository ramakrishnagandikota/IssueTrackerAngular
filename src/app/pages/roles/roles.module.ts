import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleUpdateComponent } from './role-update/role-update.component';
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    RolesComponent,
    RoleListComponent,
    RoleCreateComponent,
    RoleUpdateComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatChipListbox,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FontAwesomeModule
]
})
export class RolesModule { }
