import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceDetailsComponent } from './resource-details/resource-details.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { RequestResourceComponent } from './request-resource/request-resource.component';
import { UserFormComponent } from './user-registration/user-form.component';
import { ForumComponent } from './forum/forum.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DonationListComponent } from './donation-list/donation-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'resource-list', pathMatch: 'full'},
  {path: 'resource-list', component: ResourceListComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'request-list', component: RequestListComponent},
  {path: 'donation-list', component: DonationListComponent},
  {path: 'request-resource', component: RequestResourceComponent},
  {path: 'create-resource', component: ResourceFormComponent},
  {path: 'update-resource/:resourceId', component: ResourceFormComponent},
  {path: 'create-user', component: UserFormComponent},
  {path: 'update-user/:userId', component: UserFormComponent},
  {path: 'view-resource-details/:resourceId', component: ResourceDetailsComponent},
  {path: 'view-user-details/:userId', component: UserDetailsComponent},
  {path: 'forum/:MessageId', component: ForumComponent},
  {path: 'request-resource/:resourceId', component: RequestResourceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRUDRoutingModule { }
