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
  resourceForm!: FormGroup;  // Ensures proper initialization
  resourceId: any;           // To store resource ID if updating
  buttonText = 'Create Resource';  // Button label changes based on action

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createResourceForm();

    // Check if resourceId is passed through route and load resource details for update
    if (this.activatedRoute.snapshot.params['resourceId']) {
      this.resourceId = this.activatedRoute.snapshot.params['resourceId'];
      if (this.resourceId) {
        this.loadResourceDetails(this.resourceId);
      }
    }
  }

  // Create the resource form with validation
  createResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      description: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(500)])],
      quantity: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(99999999)])],
      type: ['', Validators.required]
    });
  }

createOrUpdateResource(values: any): void {
  let formData = new FormData();
  formData.append('name', values.name);
  formData.append('description', values.description);
  formData.append('quantity', values.quantity);
  formData.append('type', values.type);

  if (this.resourceId) {
    // Update resource details
    formData.append('resource_id', this.resourceId);
    this.crudService.updateResourceDetails(formData).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          this.navigateTo('/crud/resource-list');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Resource Updated!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to update the resource.', 'error');
      }
    });
  } else {
    // Create new resource
    this.crudService.createResource(formData).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          this.navigateTo('/crud/resource-list');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Resource created!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to create the resource.', 'error');
      }
    });
  }
}



  // Load resource details if updating
  loadResourceDetails(resourceId: any): void {
    this.buttonText = 'Update Resource';  // Change button text to "Update Resource"
    this.crudService.loadResourceInfo(resourceId).subscribe(res => {
      this.resourceForm.controls['name'].setValue(res.resource_name);
      this.resourceForm.controls['description'].setValue(res.resource_description);
      this.resourceForm.controls['quantity'].setValue(res.resource_quantity);
      this.resourceForm.controls['type'].setValue(res.resource_type);
      this.resourceId = res.resource_id;
    });
  }

  // Navigate to the desired route
  navigateTo(route: any): void {
    this.router.navigate([route]);
  }
}
