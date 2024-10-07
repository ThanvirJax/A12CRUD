import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestResourceComponent } from './crud/request-resource/request-resource.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegistrationComponent } from './crud/user-registration/user-registration.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  // Home route (can be guarded if necessary)
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  // Default redirect to home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazy load the CRUD module
  { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CRUDModule) },

  // Specific components that aren't part of lazy-loaded modules
  { path: 'crud/request-resource', component: RequestResourceComponent },
  { path: 'crud/user-registration', component: UserRegistrationComponent },

  // Login route (public)
  { path: 'login', component: LoginComponent },

  // Protected dashboard route with layout component
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard], // Guard for protected route
      }
    ]
  },

  // Wildcard route (redirect to home if not found)
  { path: '**', redirectTo: 'home' }
];
