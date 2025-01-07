import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-center-form',
  standalone: true,
  templateUrl: './center-form.component.html',
  styleUrls: ['./center-form.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ],
})
export class CenterFormComponent implements OnInit {
  centerForm!: FormGroup;
  centerId: any; 
  buttonText = 'Create Center'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createCenterForm();

    this.centerId = this.activatedRoute.snapshot.params['centerId'];
    if (this.centerId) {
      this.loadCenterDetails(this.centerId);
      this.buttonText = 'Update Center'; 
    }
  }

  createCenterForm(): void {
    this.centerForm = this.formBuilder.group({
      center_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      center_email: ['', [Validators.required, Validators.email]],
      center_password: ['', [Validators.required, Validators.minLength(6)]], // Added password field
      center_phone: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      center_address: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  createOrUpdateCenter(): void {
    if (this.centerForm.invalid) {
      this.centerForm.markAllAsTouched(); 
      return;
    }
  
    const formData = new FormData();
    const values = this.centerForm.value;
    
    // Append form data, including password for both create and update
    formData.append('center_name', values.center_name);
    formData.append('center_email', values.center_email);
    formData.append('center_phone', values.center_phone);
    formData.append('center_address', values.center_address);
    formData.append('center_password', values.center_password); // Added password field for both create and update
    
    if (this.centerId) {
      formData.append('center_id', this.centerId);
      this.crudService.updateCenterDetails(formData).subscribe({
        next: (res) => this.handleResponse(res, 'Center Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the center.', 'error')
      });
    } else {
      this.crudService.createCenter(formData).subscribe({
        next: (res) => {
          if (res.result === 'fail') {
            Swal.fire('Error', res.message, 'error');
          } else {
            this.handleResponse(res, 'Center Created!');
          }
        },
        error: () => Swal.fire('Error', 'Failed to create the center.', 'error')
      });
    }
  }
  
  
  loadCenterDetails(centerId: string): void {
    this.crudService.loadCenterInfo(centerId).subscribe({
      next: (res) => {
        this.centerForm.patchValue({
          center_name: res.center_name,
          center_email: res.center_email,
          center_phone: res.center_phone,
          center_address: res.center_address,
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to load center details.', 'error');
      },
    });
  }

  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.centerForm.reset(); // Clear the form
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
