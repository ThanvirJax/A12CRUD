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
  requestResource!: FormGroup;
  requestId: any;
  buttonText = 'Create Request';
  resources: any[] = []; // Array to hold resources

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createRequestResource();
    this.loadResources(); // Load resources on initialization

    if (this.activatedRoute.snapshot.params['requestId']) {
      this.requestId = this.activatedRoute.snapshot.params['requestId'];
      if (this.requestId) {
        this.loadRequestDetails(this.requestId);
      }
    }
  }

  createRequestResource(): void {
    this.requestResource = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.email]],
      resource_name: ['', [Validators.required]], // Now stores resource_id
      request_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]]
    });
  }

  // Load available resources from the backend
  loadResources(): void {
    this.crudService.getResources().subscribe({
      next: (res: any) => {
        this.resources = res;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load resources.', 'error');
      }
    });
  }

  createOrUpdateRequest(values: any): void {
    let formData = new FormData();
    formData.append('user_email', values.user_email);
    formData.append('resource_name', values.resource_name); // Now holds resource_id
    formData.append('request_quantity', values.request_quantity);
    formData.append('request_status', 'Pending');

    if (this.requestId) {
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
        error: () => {
          Swal.fire('Error', 'Failed to update the request.', 'error');
        }
      });
    } else {
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
        error: () => {
          Swal.fire('Error', 'Failed to create the request.', 'error');
        }
      });
    }
  }

  loadRequestDetails(requestId: any): void {
    this.buttonText = 'Update Request';
    this.crudService.loadRequestInfo(requestId).subscribe(res => {
      this.requestResource.controls['user_email'].setValue(res.user_email);
      this.requestResource.controls['resource_name'].setValue(res.resource_id); // Updated to use resource_id
      this.requestResource.controls['request_quantity'].setValue(res.request_quantity);
      this.requestId = res.request_id;
    });
  }

  navigateTo(route: any): void {
    this.router.navigate([route]);
  }
}
