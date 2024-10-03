import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceDetailsComponent } from './resource-details/resource-details.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'resource-list', pathMatch: 'full'},
  {path: 'resource-list', component: ResourceListComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'request-list', component: RequestListComponent},
  {path: 'create-resource', component: ResourceFormComponent},
  {path: 'update-resource/:resourceId', component: ResourceFormComponent},
  {path: 'view-resource-details/:resourceId', component: ResourceDetailsComponent},
  {path: 'view-resource-details/:resourceId', component: ResourceDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRUDRoutingModule { }
