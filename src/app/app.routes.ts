import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestResourceComponent } from './crud/request-resource/request-resource.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegistrationComponent } from './crud/user-registration/user-registration.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '', redirectTo: 'crud', pathMatch: 'full'},
    {path: 'crud', loadChildren: ()=>import('./crud/crud.module').then(m=>m.CRUDModule)},
    {path: 'crud/request-resource', component: RequestResourceComponent },
    {path: 'login', component: LoginComponent},
    {path: 'crud/user-registration', component: UserRegistrationComponent},
    {
        path: '',
         component: LayoutComponent, 
         children:[
            {
                path:'dashboard', 
                component: DashboardComponent
            }
        ]
    },
];


  