import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-user-registration',
  standalone: true,
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class UserRegistrationComponent implements OnInit {
  userForm!: FormGroup;
  userId: any; // Track ID for updates
  buttonText = 'Create User'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createUserForm();

    // Check if 'userId' exists in route params for updates
    this.userId = this.activatedRoute.snapshot.params['userId'];
    if (this.userId) {
      this.loadUserDetails(this.userId);
      this.buttonText = 'Update User'; 
    }
  }

  // Create the user form with validation rules
  createUserForm(): void {
    this.userForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      user_email: ['', [Validators.required, Validators.email]],
      user_phone: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_address: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  // Create or update user based on the form state
  createOrUpdateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Trigger validation errors
      return;
    }

    const formData = new FormData();
    const values = this.userForm.value;

    formData.append('user_name', values.user_name);
    formData.append('user_email', values.user_email);
    formData.append('user_phone', values.user_phone);
    formData.append('user_password', values.user_password);
    formData.append('user_address', values.user_address);

    if (this.userId) {
      // Update existing user
      formData.append('user_id', this.userId);
      this.crudService.updateUserDetails(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the user.', 'error')
      });
    } else {
      // Create new user
      this.crudService.createUser(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Created!'),
        error: () => Swal.fire('Error', 'Failed to create the user.', 'error')
      });
    }
  }

  // Load user details for updates
  loadUserDetails(userId: any): void {
    this.crudService.loadUserInfo(userId).subscribe((res) => {
      this.userForm.patchValue({
        user_name: res.user_name,
        user_email: res.user_email,
        user_phone: res.user_phone,
        user_password: '', // Password not pre-filled for security reasons
        user_address: res.user_address,
      });
    });
  }

  // Handle navigation and success/error messages
  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/crud/user-list']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire('Error', res.message || 'An unexpected error occurred.', 'error');
    }
  }
}
