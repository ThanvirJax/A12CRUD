import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-request-resource',
  standalone: true,
  templateUrl: './request-resource.component.html',
  styleUrls: ['./request-resource.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class RequestResourceComponent implements OnInit {
  requestResource!: FormGroup;  // Ensures proper initialization
  requestId: any;               // To store resource ID if updating
  buttonText = 'Create Request';  // Button label changes based on action

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createRequestResource();

    // Check if requestId is passed through the route and load request details for update
    if (this.activatedRoute.snapshot.params['requestId']) {
      this.requestId = this.activatedRoute.snapshot.params['requestId'];
      if (this.requestId) {
        this.loadRequestDetails(this.requestId);
      }
    }
  }

  // Create the request form with validation
  createRequestResource(): void {
    this.requestResource = this.formBuilder.group({
      user_id: ['', Validators.compose([Validators.required, Validators.min(1)])],
      resource_id: ['', Validators.compose([Validators.required, Validators.min(1)])],
      request_quantity: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(99999999)])]
    });
  }

  createOrUpdateRequest(values: any): void {
    let formData = new FormData();
    formData.append('user_id', values.user_id);
    formData.append('resource_id', values.resource_id);
    formData.append('request_quantity', values.request_quantity);
    formData.append('request_status', 'pending');  // Always set 'pending' status

    if (this.requestId) {
      // Update existing request
      formData.append('request_id', this.requestId);
      this.crudService.updateRequest(formData).subscribe({
        next: (res) => {
          if (res.result === 'success') {
            this.navigateTo('/crud/request-list');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Request updated!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to update the request.', 'error');
        }
      });
    } else {
      // Create new request
      this.crudService.createRequest(formData).subscribe({
        next: (res) => {
          if (res.result === 'success') {
            this.navigateTo('/crud/request-list');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Request created!',
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
        error: (err) => {
          Swal.fire('Error', 'Failed to create the request.', 'error');
        }
      });
    }
  }

  // Load request details if updating
  loadRequestDetails(requestId: any): void {
    this.buttonText = 'Update Request';  // Change button text to "Update Request"
    this.crudService.loadRequestInfo(requestId).subscribe(res => {
      this.requestResource.controls['user_id'].setValue(res.user_id);
      this.requestResource.controls['resource_id'].setValue(res.resource_id);
      this.requestResource.controls['request_quantity'].setValue(res.request_quantity);
      this.requestId = res.request_id;
    });
  }

  // Navigate to the desired route
  navigateTo(route: any): void {
    this.router.navigate([route]);
  }
}
