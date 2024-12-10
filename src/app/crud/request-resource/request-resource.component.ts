import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass, CommonModule } from '@angular/common';

declare const Swal: any;

@Component({
  selector: 'app-request-resource',
  standalone: true,
  templateUrl: './request-resource.component.html',
  styleUrls: ['./request-resource.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
    CommonModule
  ],
})
export class RequestResourceComponent implements OnInit {
  requestForm!: FormGroup;
  requestId: any;
  buttonText = 'Create Request';
  availableResources: any[] = []; // Store the available resource names

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createRequestForm();
    this.fetchAvailableResources();

    // Retrieve the user email from the query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      const userEmail = params['email'];
      if (userEmail) {
        this.requestForm.patchValue({ user_email: userEmail });
      }
    });

    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
      this.buttonText = 'Update Request';
    }
  }

  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.email]],
      resource_name: ['', [Validators.required]],
      requested_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
    });
  }

  fetchAvailableResources(): void {
    this.crudService.loadAllResources().subscribe(
      (response: any) => {
        this.availableResources = response;
      },
      (error) => {
        Swal.fire('Error', 'Failed to load available resources.', 'error');
      }
    );
  }

  createOrUpdateRequest(): void {
    this.requestForm.markAllAsTouched();
  
    if (this.requestForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }
  
    const formData = new FormData();
    const values = this.requestForm.value;
    const resources = [
      {
        resource_name: values.resource_name,
        requested_quantity: values.requested_quantity,
      },
    ];
  
    formData.append('user_email', values.user_email);
    resources.forEach((resource, index) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][requested_quantity]`, resource.requested_quantity.toString());
    });
  
    if (this.requestId) {
      formData.append('request_id', this.requestId);
      this.crudService.updateRequest(formData).subscribe(
        (response) => {
          Swal.fire('Success', 'Request updated successfully!', 'success');
          this.router.navigate(['/requests-resource']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to update request.', 'error');
        }
      );
    } else {
      this.crudService.createRequest(formData).subscribe(
        (response) => {
          if (response.error && response.error === 'User does not exist.') {
            Swal.fire('Error', 'User not registered or found. Please check your email.', 'error');
          } else {
            Swal.fire('Success', 'Request created successfully!', 'success');
            this.router.navigate(['home']);
          }
        },
        (error) => {
          Swal.fire('Error', 'Failed to create request. Please try again.', 'error');
        }
      );
    }
  }
  

  loadRequestDetails(requestId: number): void {
    this.crudService.loadRequestInfo(requestId).subscribe(
      (data) => {
        this.requestForm.patchValue({
          user_email: data.user_email,
          resource_name: data.resource_name,
          requested_quantity: data.requested_quantity,
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to load request details.', 'error');
      }
    );
  }
}