import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ],
})

export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId: any; 
  buttonText = 'Create User'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createUserForm();
   
  this.userId = this.activatedRoute.snapshot.params['userId'];
  if (this.userId) {
    this.loadUserDetails(this.userId);
    this.buttonText = 'Update Resource'; 
  }
}
  // Initialize the user form with validation rules
  createUserForm(): void {
    this.userForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      user_email: ['', [Validators.required, Validators.email]],
      user_phone: ['', [Validators.required, Validators.pattern('^\\d{7,15}$')]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_address: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  createOrUpdateUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); 
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
      formData.append('user_id', this.userId);
      this.crudService.updateUserDetails(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the user.', 'error')
      });
    } else {

      this.crudService.createUser(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Created!'),
        error: () => Swal.fire('Error', 'Failed to create the User.', 'error')
      });
    }
  }

  loadUserDetails(userId: string): void {
  this.crudService.loadUserInfo(userId).subscribe({
    next: (res) => {
      this.userForm.patchValue({
        user_name: res.user_name,
        user_email: res.user_email,
        user_phone: res.user_phone,
        user_address: res.user_address,
        user_password: res.user_password || '', 
      });
    },
    error: () => {
      Swal.fire('Error', 'Failed to load user details.', 'error');
    },
  });
}

handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/crud/user-details']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire('Error', res.message || 'An unexpected error occurred.', 'error');
    }
  }
}
