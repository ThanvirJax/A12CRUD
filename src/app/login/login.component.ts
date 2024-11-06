import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CRUDService } from '../crud/services/crud.service';
import { LoginResponse } from '../models/login-response';
import { UserFormComponent } from '../crud/user-registration/user-form.component';
import { AuthService } from '../auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, UserFormComponent], 
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
    private location: Location, // Inject Location service
    private authService: AuthService // Inject AuthService
  ) {}

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
          this.authService.login(res.user);  // Store user data using AuthService
          
          // Navigate to home, then force a page reload
          this.router.navigate(['/home']).then(() => {
            this.location.go('/home'); // Update location without reloading
            window.location.reload(); // Force page reload
          });
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
    this.router.navigate(['/crud/user-form']);  // Navigate to user registration
  }
}
