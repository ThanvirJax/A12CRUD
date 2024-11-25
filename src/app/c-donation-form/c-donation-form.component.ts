import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
import { CRUDService } from '../crud/services/crud.service';
declare const Swal: any;

@Component({
  selector: 'app-donation-form',
  standalone: true,
  templateUrl: './c-donation-form.component.html',
  styleUrls: ['./c-donation-form.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class CDonationFormComponent implements OnInit {
  donationForm!: FormGroup;
  donationId: any; 
  buttonText = 'Create Donation'; 

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createDonationForm();

    this.donationId = this.activatedRoute.snapshot.params['donationId'];
    if (this.donationId) {
      this.loadDonationDetails(this.donationId);
      this.buttonText = 'Update Donation'; 
    }
  }

  // Create the donation form with validation rules
  createDonationForm(): void {
    this.donationForm = this.formBuilder.group({
      center_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      resource_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      resource_description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      resource_type: ['', Validators.required],
      donation_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]], 
    });
  }

  // Create or update the donation entry
  createOrUpdateDonation(): void {
    this.donationForm.markAllAsTouched(); 

    if (this.donationForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    const formData = new FormData();
    const values = this.donationForm.value;

    // Prepare resources array to be sent in the correct format (matching Postman request)
    const resources = [{
      resource_name: values.resource_name,
      resource_description: values.resource_description,
      resource_type: values.resource_type,
      donation_quantity: values.donation_quantity
    }];

    // Append the user email and the resources array to formData
    formData.append('center_name', values.center_name);

    // Dynamically append the resources array to FormData
    resources.forEach((resource, index) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][resource_description]`, resource.resource_description);
      formData.append(`resources[${index}][resource_type]`, resource.resource_type);
      formData.append(`resources[${index}][donation_quantity]`, resource.donation_quantity.toString());
    });

    // Proceed with API call based on whether this is an update or a new donation
    if (this.donationId) {
      formData.append('donation_id', this.donationId);
      this.crudService.updateDonationDetails(formData).subscribe(
        (response) => {
          Swal.fire('Success', 'Donation updated successfully!', 'success');
          this.router.navigate(['/donations']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to update donation.', 'error');
        }
      );
    } else {
      this.crudService.createDonation(formData).subscribe(
        (response) => {
          Swal.fire('Success', 'Donation created successfully!', 'success');
          this.router.navigate(['/crud/donation-list']);
        },
        (error) => {
          Swal.fire('Error', 'Failed to create donation.', 'error');
        }
      );
    }
  }

  // Load donation details for editing
  loadDonationDetails(donationId: number): void {
    this.crudService.loadDonationInfo(donationId).subscribe(
      (data) => {
        this.donationForm.patchValue({
          center_name: data.center_name,
          resource_name: data.resource_name,
          resource_description: data.resource_description,
          resource_type: data.resource_type,
          donation_quantity: data.donation_quantity,
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to load donation details.', 'error');
      }
    );
  }
}
