import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRUDService } from '../services/crud.service';
import { Resource } from '../../models/resource';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-resource',
  standalone: true,
  templateUrl: './request-resource.component.html',
  styleUrls: ['./request-resource.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RequestResourceComponent implements OnInit {
  requestForm!: FormGroup;
  resources: Resource[] = [];
  buttonText = 'Submit Request';

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CRUDService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.createRequestForm();
    this.loadResources(); 
  }

  // Initialize request form
  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_id: [''], 
      resource_id: ['', Validators.required],
      request_quantity: ['', [Validators.required, Validators.min(1)]], 
    });
  }

  // Load available resources
  loadResources(): void {
    this.crudService.loadResources().subscribe({
      next: (data) => {
        this.resources = data;
      },
      error: (err) => {
        console.error('Failed to load resources', err);
      }
    });
  }

  // Fetch user ID by email
  getUserIdByEmail(): void {
    const email = this.requestForm.value.user_email;
    if (email) {
      this.crudService.getUserIdByEmail(email).subscribe({
        next: (user) => {
          this.requestForm.patchValue({ user_id: user.user_id });
        },
        error: (err) => {
          console.error('Failed to fetch user ID', err);
        }
      });
    }
  }

  // Handle form submission
  submitRequest(): void {
    if (this.requestForm.valid) {
      const requestData = {
        user_id: this.requestForm.value.user_id,
        user_name: this.requestForm.value.user_name,
        user_email: this.requestForm.value.user_email,
        resource_id: this.requestForm.value.resource_id,
        request_quantity: this.requestForm.value.request_quantity,
        request_status: 'pending' 
      };

      this.crudService.createRequest(requestData).subscribe({
        next: (res) => {
          console.log('Request submitted successfully', res);
          this.navigateToRequestList(); 
        },
        error: (err) => {
          console.error('Failed to submit request', err);
        }
      });
    }
  }

  // Navigate to request list
  navigateToRequestList(): void {
    this.router.navigate(['../home']); 
  }
}
