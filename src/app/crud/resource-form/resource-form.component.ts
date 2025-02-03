import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
declare const Swal: any;

@Component({
  selector: 'app-resource-form',
  standalone: true,
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class ResourceFormComponent implements OnInit {
  resourceForm!: FormGroup;
  resourceId: any; 
  buttonText = 'Create Resource'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createResourceForm();

    this.resourceId = this.activatedRoute.snapshot.params['resourceId'];
    if (this.resourceId) {
      this.loadResourceDetails(this.resourceId);
      this.buttonText = 'Update Resource'; 
    }
    
  }

  ngAfterContentInit(): void {
  }

  // Create the resource form with validation rules
  createResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
      type: ['', Validators.required],
      status: ['Available', Validators.required],
      expiryDate: [null]  // Add expiry date control (null initially)
    });
  }
  

  createOrUpdateResource(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    const values = this.resourceForm.value;
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('quantity', values.quantity);
    formData.append('resource_type', values.type);
    formData.append('resource_status', values.status);
  
    // Handle expiry date if provided
    if (values.expiryDate) {
      formData.append('expiry_date', values.expiryDate);
    }
  
    if (this.resourceId) {
      // Update resource
      formData.append('resource_id', this.resourceId);
      this.crudService.updateResourceDetails(formData).subscribe({
        next: (res) => this.handleResponse(res, 'Resource Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the resource.', 'error')
      });
    } else {
      // Create new resource
      this.crudService.createResource(formData).subscribe({
        next: (res) => this.handleResponse(res, 'Resource Created!'),
        error: () => Swal.fire('Error', 'Failed to create the resource.', 'error')
      });
    }
  }
  
  // Load resource details for update
  loadResourceDetails(resourceId: any): void {
    this.crudService.loadResourceInfo(resourceId).subscribe((res) => {
      this.resourceForm.patchValue({
        name: res.resource_name,
        description: res.resource_description,
        quantity: res.resource_quantity,
        type: res.resource_type,
        status: res.resource_status 
      });
    });
  }
  
  // Handle navigation and response messages
  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/crud/resource-list']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire('Error', res.message || 'Resource Name Already Exists!', 'error');
    }
  }
}
