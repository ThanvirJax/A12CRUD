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
  templateUrl: './c-request-form.component.html',
  styleUrls: ['./c-request-form.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
    CommonModule  
  ]
})
export class CRequestFormComponent implements OnInit {
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
    this.fetchAvailableResources(); // Fetch the available resources when the component loads

    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    if (this.requestId) {
      this.loadRequestDetails(this.requestId);
      this.buttonText = 'Update Request';
    }
  }

  // Create the request form with validation rules
  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      center_name: ['', [Validators.required]], // Center name field for centers
      resource_name: ['', [Validators.required]], // Resource name is a dropdown
      requested_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
    });
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

  // Create or update the request entry
  createOrUpdateRequest(): void {
    this.requestForm.markAllAsTouched();

    if (this.requestForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    const formData = new FormData();
    const values = this.requestForm.value;

    // Prepare resources array to be sent in the correct format
    const resources = [{
      resource_name: values.resource_name,
      requested_quantity: values.requested_quantity,
    }];

    // Append the center name and resources array to formData
    formData.append('center_name', values.center_name);

    // Dynamically append the resources array to FormData
    resources.forEach((resource, index) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][requested_quantity]`, resource.requested_quantity.toString());
    });

    // Proceed with API call based on whether this is an update or a new request
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
          Swal.fire('Success', 'Request created successfully!', 'success');
          this.router.navigate(['crud/request-list']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to create request.', 'error');
        }
      );
    }
  }

  // Load request details for editing
  loadRequestDetails(requestId: number): void {
    this.crudService.loadRequestInfo(requestId).subscribe(
      (data) => {
        this.requestForm.patchValue({
          center_name: data.center_name,
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
