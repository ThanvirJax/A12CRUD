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

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CRUDRoutingModule,
    ResourceDetailsComponent,
    ResourceFormComponent,
    ResourceListComponent,
    RequestListComponent,
    UserListComponent,
    RequestResourceComponent,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CRUDModule { }
