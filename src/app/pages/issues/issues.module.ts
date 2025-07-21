import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { IssuesComponent } from './issues.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';
import { IssueUpdateComponent } from './issue-update/issue-update.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
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
import {MatTabsModule} from '@angular/material/tabs';
import { FileSizePipe } from '../../Pipes/file-size.pipe';
import {MatMenuModule} from '@angular/material/menu';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    IssuesComponent,
    IssueListComponent,
    IssueCreateComponent,
    IssueUpdateComponent,
    IssueViewComponent,
    FileSizePipe
  ],
  imports: [
    CommonModule,
    IssuesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
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
    NgMultiSelectDropDownModule.forRoot(),
    FontAwesomeModule,
    MatTabsModule,
    MatMenuModule,
    EditorModule
  ],
  exports:[FileSizePipe]
})
export class IssuesModule { }
