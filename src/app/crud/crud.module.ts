import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRUDRoutingModule } from './crud-routing.module';
import { ResourceDetailsComponent } from './resource-details/resource-details.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { RequestResourceComponent } from './request-resource/request-resource.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { DonationFormComponent } from './donation-form/donation-form.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DonationListComponent } from './donation-list/donation-list.component';
import { UserFormComponent } from './user-registration/user-form.component';
import { CDonationFormComponent } from './c-donation-form/c-donation-form.component';
import { AlertFormComponent } from './alert-form/alert-form.component';
import { AlertListComponent } from './alert-list/alert-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CRUDRoutingModule,
    ResourceDetailsComponent,
    UserDetailsComponent,
    UserFormComponent,
    ResourceFormComponent,
    DonationFormComponent,
    RequestResourceComponent,
    DonationListComponent,
    ResourceListComponent,
    RequestListComponent,
    UserListComponent,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    CDonationFormComponent,
    AlertFormComponent,
    AlertListComponent,
  ]
})
export class CRUDModule { }
