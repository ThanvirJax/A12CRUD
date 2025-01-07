import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location, NgIf } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CRUDService } from '../crud/services/crud.service';
import { LoginResponse } from '../models/login-response';
import { AuthService } from '../auth.service'; 
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginObj = {
    user_email: '',
    user_password: ''
  };

  loading = false;

  constructor(
    private crudService: CRUDService, 
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  onLogin() {
    if (!this.loginObj.user_email || !this.loginObj.user_password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in both email and password.',
      });
      return;
    }

    this.loading = true;
    this.crudService.login(this.loginObj).subscribe(
      (res: LoginResponse) => {
        this.loading = false;
        if (res.result === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Login Success',
            text: 'You have successfully logged in!',
          }).then(() => {
            const loginData = {
              result: res.result,
              user: res.user,
              role: res.role,
              token: res.token,
            };

            this.authService.login(loginData);  

            this.router.navigate(['/dashboard']).then(() => {
              this.location.go('/dashboard');
              window.location.reload();
            });
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: res.message || 'Invalid Email or Password',
          });
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Please check your internet connection.',
          });
        } else if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'Invalid credentials, please try again.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `An error occurred: ${error.message || 'Please try again later.'}`,
          });
        }
      }
    );
  }
  
  onCreateAccount() {
    this.router.navigate(['/crud/user-form']); 
  }
}
