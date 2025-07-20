import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesComponent } from './issues.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { IssueUpdateComponent } from './issue-update/issue-update.component';

const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'view/:id', component: IssueViewComponent },
  { path: 'create', component: IssueCreateComponent },
  { path: 'edit/:id', component: IssueUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule { }
