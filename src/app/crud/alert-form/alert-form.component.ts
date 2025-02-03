import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-alert-form',
  standalone: true,
  templateUrl: './alert-form.component.html',
  styleUrls: ['./alert-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ],
})
export class AlertFormComponent implements OnInit {
  alertForm!: FormGroup;
  alertId: any; 
  buttonText = 'Create Alert'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createAlertForm();
     
    // Get the alertId from the route
    this.alertId = this.activatedRoute.snapshot.params['alertId'];
    if (this.alertId) {
      this.loadAlertDetails(this.alertId); 
      this.buttonText = 'Update Alert'; 
    }
  }
  
  // Initialize the alert form with validation rules
  createAlertForm(): void {
    this.alertForm = this.formBuilder.group({
      alert_message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      alert_description: ['', [Validators.required, Validators.maxLength(200)]],
      alert_type: ['', [Validators.required]],
    });
  }

  createOrUpdateAlert(): void {
    if (this.alertForm.invalid) {
      this.alertForm.markAllAsTouched(); 
      return;
    }

    const formData = new FormData();
    const values = this.alertForm.value;
    formData.append('alert_message', values.alert_message);
    formData.append('alert_description', values.alert_description);
    formData.append('alert_type', values.alert_type);

    if (this.alertId) {
      formData.append('alert_id', this.alertId);
      this.crudService.updateAlert(formData).subscribe({
        next: (res) => this.handleResponse(res, 'Alert Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the alert.', 'error')
      });
    } else {
      this.crudService.createAlert(formData).subscribe({
        next: (res) => this.handleResponse(res, 'Alert Created!'),
        error: () => Swal.fire('Error', 'Failed to create the alert.', 'error')
      });
    }
  }

  loadAlertDetails(alertId: string): void {
    this.crudService.loadAlertInfo(alertId).subscribe({
      next: (res) => {
        // Patch the form values with the fetched alert details
        this.alertForm.patchValue({
          alert_message: res.alert_message,
          alert_description: res.alert_description,
          alert_type: res.alert_type,
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to load alert details.', 'error');
      },
    });
  }
  

  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/crud/alert-details']);
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
