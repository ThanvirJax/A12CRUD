import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../services/crud.service';
import { Resource } from '../../models/resource';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-request-resource',
  standalone: true,
  templateUrl: './request-resource.component.html',
  styleUrls: ['./request-resource.component.css'],
  imports: [ReactiveFormsModule, CommonModule] // Add CommonModule here
})
export class RequestResourceComponent implements OnInit {
  requestForm!: FormGroup;  // Form to handle user requests
  resources: Resource[] = []; // Array to hold available resources
  buttonText = 'Submit Request'; // Button label for form submission

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CRUDService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.createRequestForm();
    this.loadRequest(); // Load resources when the component initializes
  }

  // Create the request form with validation
  createRequestForm(): void {
    this.requestForm = this.formBuilder.group({
      user_name: ['', Validators.required],          
      user_email: ['', [Validators.required, Validators.email]], 
      resource_id: ['', Validators.required],         
      request_quantity: ['', [Validators.required, Validators.min(1)]], 
    });
  }

  // Fetch available resources from the service
  loadRequest(): void {
    this.crudService.loadResources().subscribe({
      next: (data) => {
        this.resources = data; // Populate the resources array
      },
      error: (err) => {
        console.error('Failed to load resources', err); // Handle error case
      }
    });
  }

  // Handle form submission
  submitRequest(): void {
    if (this.requestForm.valid) {
      const requestData = {
        user_name: this.requestForm.value.user_name,
        user_email: this.requestForm.value.user_email,
        resource_id: this.requestForm.value.resource_id,
        request_quantity: this.requestForm.value.request_quantity,
        request_status: 'pending', 
        request_date: new Date()        
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

  // Navigate to the request-list route
  navigateToRequestList(): void {
    this.router.navigate(['../home']); 
  }
}
