import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CRUDService } from '../crud/services/crud.service';
import { LoginResponse } from '../models/login-response';
import { UserRegistrationComponent } from '../crud/user-registration/user-registration.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink, UserRegistrationComponent], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginObj = {
    user_email: '',
    user_password: ''
  };

  loading = false;

  constructor(private crudService: CRUDService, private router: Router) {}

  // Login method with validation and API call
    onLogin() {
    if (!this.loginObj.user_email || !this.loginObj.user_password) {
      alert('Please fill in both email and password.');
      return;
    }

    this.loading = true;
    this.crudService.login(this.loginObj).subscribe(
      (res: LoginResponse) => {
        this.loading = false;
        if (res.result === 'success') {
          alert('Login Success');
          localStorage.setItem("DisasterAppLogin", this.loginObj.user_email);  // Store user email
          this.router.navigate(['/home']);  // Navigate to home/dashboard after login
        } else {
          alert(res.message || 'Invalid Email or Password');
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 0) {
          alert('Network error: Please check your connection.');
        } else if (error.status === 401) {
          alert('Unauthorized: Invalid credentials');
        } else {
          alert(`Error: ${error.message || 'An unknown error occurred'}`);
        }
      }
    );
  }

  // Method for navigation to the registration page (no validation required)
  onCreateAccount() {
    this.router.navigate(['/crud/user-registration']);  // Navigate to user registration
  }
}