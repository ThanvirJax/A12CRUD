import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

// Custom Validator for Password Matching
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('user_password')?.value;
  const confirmPassword = control.get('confirm_password')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

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
  nicImageError: string | null = null; 

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
      this.buttonText = 'Update User'; 
    }
  }

  // Initialize the user form with validation rules
  createUserForm(): void {
    this.userForm = this.formBuilder.group(
      {
        user_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        user_email: ['', [Validators.required, Validators.email]],
        user_phone: ['', [Validators.required, Validators.pattern('^\\d{7,15}$')]],
        user_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
          ],
        ],
        confirm_password: ['', [Validators.required]],
        user_address: ['', [Validators.required, Validators.maxLength(100)]],
        user_nic: [
          '',
          [
            Validators.required,
            Validators.minLength(14),
            Validators.maxLength(14),
            Validators.pattern('^[A-Za-z]\\d{13}$'),
          ],
        ],
        nic_image: [null, this.userId ? [] : [Validators.required]],
      },
      { validators: passwordMatchValidator } 
    );
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.nicImageError = 'NIC image size must not exceed 5MB.';
        this.userForm.get('nic_image')?.setValue(null); 
        return;
      }
  
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        this.nicImageError = null;
        this.userForm.get('nic_image')?.setValue(file); 
      } else {
        this.nicImageError = 'Only JPEG or PNG files are allowed.';
        this.userForm.get('nic_image')?.setValue(null); 
      }
    } else {
      this.nicImageError = 'Please select a valid file.';
      this.userForm.get('nic_image')?.setValue(null);
    }
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
    formData.append('user_nic', values.user_nic); 
  
    if (values.nic_image instanceof File) { 
      formData.append('nic_image', values.nic_image, values.nic_image.name);
    } else {
      console.error('NIC image is not a valid file.');
    }
  
    if (this.userId) {
      formData.append('user_id', this.userId);
      this.crudService.updateUserDetails(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Updated!'),
        error: (err) => this.handleErrorResponse(err)
      });
    } else {
      this.crudService.createUser(formData).subscribe({
        next: (res) => this.handleResponse(res, 'User Created!'),
        error: (err) => this.handleErrorResponse(err)
      });
    }
  }
  
  handleErrorResponse(err: any): void {
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    if (err.error && err.error.message) {
      // Check for duplicate username error
      if (err.error.message.includes('duplicate entry') && err.error.message.includes('user_name')) {
        errorMessage = 'The username you entered is already taken. Please choose a different one.';
      } else if (err.error.message.includes('duplicate entry') && err.error.message.includes('user_nic')) {
        errorMessage = 'The NIC you entered is already taken. Please choose a different one.';
      } else if (err.error.message.includes('NIC image size must not exceed')) {
        errorMessage = 'The NIC image size must not exceed 5MB.';
      } else if (err.error.message.includes('Only PNG and JPEG files are allowed')) {
        errorMessage = 'Only PNG and JPEG files are allowed for the NIC image.';
      } else if (err.error.message.includes('NIC image is required')) {
        errorMessage = 'The NIC image is required.';
      }
    }
  
    Swal.fire('Error', errorMessage, 'error');
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
          user_nic: res.user_nic || ''  
        });
  
        // Disable the NIC field if we're updating
        this.userForm.get('user_nic')?.disable();
        // Set nic_image as optional on update
        this.userForm.get('nic_image')?.clearValidators(); 
        this.userForm.get('nic_image')?.updateValueAndValidity(); 
      },
      error: () => {
        Swal.fire('Error', 'Failed to load user details.', 'error');
      },
    });
  }

  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/login']);
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