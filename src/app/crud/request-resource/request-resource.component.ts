import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; 

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
  availableResources: any[] = [];
  userEmail: string | null = null;

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.createRequestForm();
    this.fetchAvailableResources();

    // Get the user email from the AuthService
    const user = this.authService.getUser();
    this.userEmail = user ? user.user_email : null;

    // Check if email exists and autofill the user_email field
    if (this.userEmail) {
      this.requestForm.patchValue({ user_email: this.userEmail });
    }

    // Check if we are updating an existing request
    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
      this.buttonText = 'Update Request';
    }
  }

  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.email]],
      delivery_location: ['', [Validators.required]], 
      resources: this.formBuilder.array([]),
    });

    // Initialize with one empty resource
    this.addResource();
  }

  get resources(): FormArray {
    return this.requestForm.get('resources') as FormArray;
  }

  addResource(): void {
    const resourceGroup = this.formBuilder.group({
      resource_name: ['', [Validators.required]],
      requested_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
    });
    this.resources.push(resourceGroup);
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
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
    formData.append('user_email', this.requestForm.value.user_email);
    formData.append('delivery_location', this.requestForm.value.delivery_location); 
    this.resources.value.forEach((resource: any, index: number) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][requested_quantity]`, resource.requested_quantity.toString());
    });

    if (this.requestId) {
      formData.append('request_id', this.requestId);
      this.crudService.updateRequest(formData).subscribe(
        () => {
          Swal.fire('Success', 'Request updated successfully!', 'success');
          this.router.navigate(['/requests-resource']);
        },
        () => {
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
        () => {
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
          delivery_location: data.delivery_location,
        });
        this.resources.clear();
        data.resources.forEach((resource: any) => {
          const resourceGroup = this.formBuilder.group({
            resource_name: [resource.resource_name, [Validators.required]],
            requested_quantity: [resource.requested_quantity, [Validators.required, Validators.min(1), Validators.max(99999999)]],
          });
          this.resources.push(resourceGroup);
        });
      },
      () => {
        Swal.fire('Error', 'Failed to load request details.', 'error');
      }
    );
  }
}
