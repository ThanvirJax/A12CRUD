import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
import { CRUDService } from '../services/crud.service';
import { AuthService } from '../../auth.service'; // Import AuthService
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
  ],
})
export class CDonationFormComponent implements OnInit {
  donationForm!: FormGroup;
  donationId: any;
  buttonText = 'Create Donation';
  centerName: string | null = null;

  constructor(
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.createDonationForm();

    // Get center name from AuthService
    const center = this.authService.getUser();
    this.centerName = center ? center.center_name : null;

    // Autofill the center name field
    if (this.centerName) {
      this.donationForm.patchValue({ center_name: this.centerName });
    }

    // Check if updating an existing donation
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
      expiry_date: ['', Validators.required], 
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

    // Prepare resources array to be sent in the correct format
    const resources = [
      {
        resource_name: values.resource_name,
        resource_description: values.resource_description,
        resource_type: values.resource_type,
        donation_quantity: values.donation_quantity,
        expiry_date: values.expiry_date 

      },
    ];

    // Append the center name and resources to formData
    formData.append('center_name', values.center_name);

    resources.forEach((resource, index) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][resource_description]`, resource.resource_description);
      formData.append(`resources[${index}][resource_type]`, resource.resource_type);
      formData.append(`resources[${index}][donation_quantity]`, resource.donation_quantity.toString());
      formData.append(`resources[${index}][expiry_date]`, resource.expiry_date); 

    });

    // Call the appropriate API method
    if (this.donationId) {
      formData.append('donation_id', this.donationId);
      this.crudService.updateDonationDetails(formData).subscribe(
        () => {
          Swal.fire('Success', 'Donation updated successfully!', 'success');
          this.router.navigate(['/donations']);
        },
        () => {
          Swal.fire('Error', 'Failed to update donation.', 'error');
        }
      );
    } else {
      this.crudService.createDonation(formData).subscribe(
        () => {
          Swal.fire('Success', 'Donation created successfully!', 'success');
          this.router.navigate(['/dashboard']);
        },
        () => {
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
          resource_expiry_date: data.resource_expiry_date 
        });
      },
      () => {
        Swal.fire('Error', 'Failed to load donation details.', 'error');
      }
    );
  }
}
