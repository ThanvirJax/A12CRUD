import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestResourceComponent } from './crud/request-resource/request-resource.component';
import { LoginComponent } from './login/login.component';
import { UserFormComponent } from './crud/user-registration/user-form.component';
import { RequestListComponent } from './crud/request-list/request-list.component';
import { ForecastComponent } from './forecast/forecast.component';
import { CenterLocationsComponent } from './center-locations/center-locations.component';
import { ResourceDetailsComponent } from './crud/resource-details/resource-details.component';
import { UserListComponent } from './crud/user-list/user-list.component';
import { DonationFormComponent } from './crud/donation-form/donation-form.component';
import { PrecautionsComponent } from './precautions/precautions.component';
import { UserDetailsComponent } from './crud/user-details/user-details.component';
import { DonationListComponent } from './crud/donation-list/donation-list.component';
import { CenterActionsComponent } from './center-actions/center-actions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CRequestFormComponent } from './crud/c-request-form/c-request-form.component';
import { CDonationFormComponent } from './crud/c-donation-form/c-donation-form.component';
import { DeliveryStatusComponent } from './crud/delivery-status/delivery-status.component';
import { DonateFundComponent } from './donate-fund/donate-fund.component';
import { ForumMessageFormComponent } from './forum-message-form/forum-message-form.component';
import { AlertFormComponent } from './crud/alert-form/alert-form.component';
import { AlertListComponent } from './crud/alert-list/alert-list.component';
import { TaskFormComponent } from './crud/task-form/task-form.component';
import { TaskListComponent } from './crud/task-list/task-list.component';
import { CenterFormComponent } from './crud/center-form/center-form.component';
import { CenterListComponent } from './crud/center-list/center-list.component';
import { EmergencyContactsComponent } from './emergency-contacts/emergency-contacts.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent},

  // Default redirect to home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazy load the CRUD module
  { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CRUDModule) },

  // Specific components that aren't part of lazy-loaded modules
  { path: 'crud/request-resource', component: RequestResourceComponent },
  { path: 'crud/c-request-form', component: CRequestFormComponent },
  { path: 'crud/donation-form', component: DonationFormComponent },
  { path: 'crud/c-donation-form', component: CDonationFormComponent },
  { path: 'crud/resource-details', component: ResourceDetailsComponent },
  { path: 'crud/user-details', component: UserDetailsComponent },
  { path: 'crud/user-form', component: UserFormComponent },
  { path: 'crud/user-list', component: UserListComponent },
  { path: 'crud/request-list', component: RequestListComponent },
  { path: 'crud/donation-list', component: DonationListComponent },
  { path: 'crud/task-list', component: TaskListComponent },
  { path: 'forecast', component: ForecastComponent },
  { path: 'center-locations', component: CenterLocationsComponent },
  { path: 'forum', component: ForumMessageFormComponent },
  { path: 'precaution', component: PrecautionsComponent },
  { path: 'emergency-contacts', component: EmergencyContactsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'center-actions', component: CenterActionsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'crud/delivery-status', component: DeliveryStatusComponent },
  { path: 'donate-fund', component: DonateFundComponent },
  { path: 'crud/alert-form', component: AlertFormComponent},
  { path: 'crud/alert-list', component: AlertListComponent },
  { path: 'crud/task-form', component: TaskFormComponent},
  { path: 'crud/center-form', component: CenterFormComponent},
  { path: 'crud/center-list', component: CenterListComponent },

];
