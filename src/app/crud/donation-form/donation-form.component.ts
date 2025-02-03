import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../auth.service';
declare const Swal: any;

@Component({
  selector: 'app-donation-form',
  standalone: true,
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.css'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class DonationFormComponent implements OnInit {
  userEmail: string | null = null;
  donationForm!: FormGroup;
  donationId: any; 
  buttonText = 'Create Donation'; 

  constructor(
    private authService: AuthService, 
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createDonationForm();
    const user = this.authService.getUser();
    this.userEmail = user ? user.user_email : null; 

    if (this.userEmail) {
      this.donationForm.get('user_email')?.setValue(this.userEmail);
    }

    this.donationId = this.activatedRoute.snapshot.params['donationId'];
    if (this.donationId) {
      this.loadDonationDetails(this.donationId);
      this.buttonText = 'Update Donation'; 
    }
  }

  // Initialize the form with validation
  createDonationForm(): void {
    this.donationForm = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.email]],
      resource_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      resource_description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      resource_type: ['', Validators.required],
      donation_quantity: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
      expiry_date: [''], 
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
  
    formData.append('user_email', values.user_email);
  
    // Prepare resources array to be sent in the correct format
    const resources = [{
      resource_name: values.resource_name,
      resource_description: values.resource_description,
      resource_type: values.resource_type,
      donation_quantity: values.donation_quantity,
      expiry_date: values.expiry_date || '' 
    }];
  
    resources.forEach((resource, index) => {
      formData.append(`resources[${index}][resource_name]`, resource.resource_name);
      formData.append(`resources[${index}][resource_description]`, resource.resource_description);
      formData.append(`resources[${index}][resource_type]`, resource.resource_type);
      formData.append(`resources[${index}][donation_quantity]`, resource.donation_quantity.toString());
      formData.append(`resources[${index}][expiry_date]`, resource.expiry_date); 
    });
  
    // Update or Create donation
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
          if (response.error && response.error === 'User does not exist.') {
            Swal.fire('Error', 'User not registered or found. Please check your email.', 'error');
          } else {
            Swal.fire('Success', 'Donation created successfully!', 'success');
            this.router.navigate(['home']);
          }
        },
        (error) => {
          Swal.fire('Error', 'User not found. Please check your email or register.', 'error');
        }
      );
    }
  }
  
  // Load donation details 
loadDonationDetails(donationId: number): void {
  this.crudService.loadDonationInfo(donationId).subscribe(
    (data) => {
      this.donationForm.patchValue({
        user_email: data.user_email,
        resource_name: data.resource_name,
        resource_description: data.resource_description,
        resource_type: data.resource_type,
        donation_quantity: data.donation_quantity,
        expiry_date: data.resource_expiry_date || ''
      });
    },
    (error) => {
      Swal.fire('Error', 'Failed to load donation details.', 'error');
    }
  );
}

}
