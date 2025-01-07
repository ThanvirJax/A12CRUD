import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceDetailsComponent } from './resource-details/resource-details.component';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { RequestResourceComponent } from './request-resource/request-resource.component';
import { UserFormComponent } from './user-registration/user-form.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { DeliveryStatusComponent } from './delivery-status/delivery-status.component';
import { ForumMessageFormComponent } from '../forum-message-form/forum-message-form.component';
import { AlertFormComponent } from './alert-form/alert-form.component';
import { AlertListComponent } from './alert-list/alert-list.component';
import { CenterListComponent } from './center-list/center-list.component';
import { CenterFormComponent } from './center-form/center-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'resource-list', pathMatch: 'full'},
  {path: 'resource-list', component: ResourceListComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'center-list', component: CenterListComponent},
  {path: 'request-list', component: RequestListComponent},
  {path: 'donation-list', component: DonationListComponent},
  {path: 'delivery-status', component: DeliveryStatusComponent},
  {path: 'request-resource/:userId', component: RequestResourceComponent },
  {path: 'create-resource', component: ResourceFormComponent},
  {path: 'update-resource/:resourceId', loadComponent: () => import('./resource-form/resource-form.component').then(m => m.ResourceFormComponent)},
  {path: 'update-request/:requestId', component: RequestResourceComponent},
  {path: 'create-user', component: UserFormComponent},
  {path: 'update-user/:userId', component: UserFormComponent},
  {path: 'update-center/:centerId', component: CenterFormComponent},
  {path: 'view-resource-details/:resourceId', component: ResourceDetailsComponent},
  {path: 'view-user-details/:userId', component: UserDetailsComponent},
  {path: 'view-center-details/:centerId', component: CenterListComponent},
  {path: 'forum/:userId', component: ForumMessageFormComponent},
  {path: 'request-resource/:resourceId', component: RequestResourceComponent},  
  { path: 'create-alert', component: AlertFormComponent },
  { path: 'update-alert/:alertId', component: AlertFormComponent },
  { path: 'view-alert-details/:alertId', component: AlertListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CRUDRoutingModule { }
