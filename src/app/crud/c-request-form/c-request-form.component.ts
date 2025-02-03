import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; 
declare const Swal: any;

@Component({
  selector: 'app-c-request-form',
  standalone: true,
  templateUrl: './c-request-form.component.html',
  styleUrls: ['./c-request-form.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
    CommonModule,
  ],
})
export class CRequestFormComponent implements OnInit {
  requestForm!: FormGroup;
  requestId: any;
  buttonText = 'Create Request';
  availableResources: any[] = []; 
  centerName: string | null = null; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.createRequestForm();
    this.fetchAvailableResources();

    // Get center name from AuthService
    const center = this.authService.getUser();
    this.centerName = center ? center.center_name : null;

    // Autofill the center name field
    if (this.centerName) {
      this.requestForm.patchValue({ center_name: this.centerName });
    }

    // Check if we are updating an existing request
    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
      this.buttonText = 'Update Request';
    }
  }

  // Create the request form with validation rules
  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      center_name: ['', [Validators.required]], // Center name will be autofilled
      delivery_location: ['', [Validators.required]], // Delivery location field
      resources: this.formBuilder.array([]), // Form array for resources
    });
    this.addResource(); // Initialize with one empty resource
  }

  // Fetch available resources from the backend
  fetchAvailableResources(): void {
    this.crudService.loadAllResources().subscribe(
      (response: any) => {
        this.availableResources = response; // Assume response contains an array of resources
      },
      (error) => {
        Swal.fire('Error', 'Failed to load available resources.', 'error');
      }
    );
  }

  // Get resources as FormArray
  get resources(): FormArray {
    return this.requestForm.get('resources') as FormArray;
  }

  // Add resource input fields
  addResource(): void {
    const resourceGroup = this.formBuilder.group({
      resource_name: ['', [Validators.required]],
      requested_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
    });
    this.resources.push(resourceGroup);
  }

  // Remove resource input fields
  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  // Create or update the request entry
  createOrUpdateRequest(): void {
    this.requestForm.markAllAsTouched();

    if (this.requestForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    const formData = new FormData();
    const values = this.requestForm.value;

    // Append center name and delivery location
    formData.append('center_name', values.center_name);
    formData.append('delivery_location', values.delivery_location);

    // Append resources to FormData
    values.resources.forEach((resource: any, index: number) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][requested_quantity]`, resource.requested_quantity.toString());
    });

    // API call based on whether it's update or create
    if (this.requestId) {
      formData.append('request_id', this.requestId);
      this.crudService.updateRequest(formData).subscribe(
        () => {
          Swal.fire('Success', 'Request updated successfully!', 'success');
          this.router.navigate(['/c-request-list']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to update request.', 'error');
        }
      );
    } else {
      this.crudService.createRequest(formData).subscribe(
        () => {
          Swal.fire('Success', 'Request created successfully!', 'success');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to create request.', 'error');
        }
      );
    }
  }

  // Load request details for editing
  loadRequestDetails(requestId: string): void {
    this.crudService.loadRequestInfo(requestId).subscribe(
      (response: any) => {
        const requestDetails = response;
        this.requestForm.patchValue({
          center_name: requestDetails.center_name,
          delivery_location: requestDetails.delivery_location,
        });

        // Load resources into form
        if (requestDetails.resources.length) {
          requestDetails.resources.forEach((resource: any) => {
            this.addResource();
            const resourcesControl = this.resources.controls[this.resources.controls.length - 1];
            resourcesControl.patchValue({
              resource_name: resource.resource_name,
              requested_quantity: resource.requested_quantity,
            });
          });
        }
      },
      (error) => {
        Swal.fire('Error', 'Failed to load request details.', 'error');
      }
    );
  }
}
