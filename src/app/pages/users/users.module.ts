import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipListbox } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserCreateComponent,
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
export class UsersModule { }
