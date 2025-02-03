import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CRUDService } from '../services/crud.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css'],
})

export class DeliveryStatusComponent implements OnInit, OnDestroy {
  rowData: any[] = [];
  routerSubscription: Subscription;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadTrackingData();
      }
    });
  }

  ngOnInit(): void {
    this.loadTrackingData();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  loadTrackingData() {
    this.crudService.loadTracking().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.rowData = response.flatMap((tracking: any) =>
            tracking.resources.map((resource: any) => ({
              ...tracking,
              ...resource,
            }))
          );
        } else {
          this.rowData = [];
          Swal.fire('Info', 'No tracking data available.', 'info');
        }
      },
      error: (err) => {
        console.error('Error loading tracking data:', err);
        Swal.fire('Error', 'Failed to load tracking data.', 'error');
      },
    });
  }

  // Schedule Delivery Action
  scheduleDelivery(tracking: any) {
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 16);

    Swal.fire({
      title: 'Schedule Delivery',
      html: `
        <label for="delivery-date">Select Delivery Date and Time:</label>
        <input type="datetime-local" id="delivery-date" class="swal2-input" min="${isoDate}">`,
      showCancelButton: true,
      confirmButtonText: 'Schedule',
      preConfirm: () => {
        const deliveryDate = (document.getElementById('delivery-date') as HTMLInputElement).value;
        if (!deliveryDate) {
          Swal.showValidationMessage('Please select a delivery date.');
          return null;
        }
        if (new Date(deliveryDate) <= today) {
          Swal.showValidationMessage('The delivery date must be in the future.');
          return null;
        }
        return deliveryDate;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const deliveryDate = result.value;
        this.crudService.scheduleDelivery(tracking.tracking_id, deliveryDate).subscribe({
          next: (response) => {
            if (response?.status === 'success') {
              tracking.delivery_status = 'In Progress';
              tracking.delivery_date = deliveryDate;
              Swal.fire('Success', 'Delivery scheduled successfully.', 'success');
            } else {
              Swal.fire('Error', response.message || 'Unknown error occurred.', 'error');
            }
          },
          error: (err) => {
            console.error('Error scheduling delivery:', err);
            Swal.fire('Error', 'Failed to schedule delivery.', 'error');
          },
        });
      }
    });
  }

  // Update Tracking Status Action
  updateTrackingStatus(tracking: any, newStatus: string) {
    const remarksMap: Record<string, string> = {
      Pending: 'The request is pending and awaiting processing.',
      InProgress: 'The delivery is in progress.',
      Delivered: 'The resources have been delivered successfully.',
    };

    const trackingId = tracking.tracking_id;
    const remarks = remarksMap[newStatus] || '';

    this.crudService.updateTrackingStatus(trackingId, newStatus, remarks).subscribe({
      next: () => {
        tracking.delivery_status = newStatus;
        tracking.remarks = remarks;
        Swal.fire('Success', `Status updated to ${newStatus}.`, 'success');
      },
      error: () => Swal.fire('Error', `Failed to update status to ${newStatus}.`, 'error'),
    });
  }

  // Show Status Dropdown Action
  showStatusDropdown(tracking: any) {
    const statusOptions = ['Pending', 'In Progress', 'Delivered'];

    Swal.fire({
      title: 'Update Delivery Status',
      html: `
        <strong>Tracking ID:</strong> ${tracking.tracking_id}<br>
        <strong>Resource Name:</strong> ${tracking.resource_name}<br>
        <strong>Requested Quantity:</strong> ${tracking.requested_quantity}<br>
        <label for="status">Select New Status:</label>
        <select id="status" class="swal2-select">
          ${statusOptions
            .map(
              (status) =>
                `<option value="${status}" ${
                  status === tracking.delivery_status ? 'selected' : ''
                }>${status}</option>`
            )
            .join('')}
        </select>`,
      preConfirm: () => {
        const newStatus = (document.getElementById('status') as HTMLSelectElement).value;
        if (newStatus && newStatus !== tracking.delivery_status) return newStatus;
        Swal.showValidationMessage('Please select a new status different from the current one.');
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Update Status',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateTrackingStatus(tracking, result.value);
      }
    });
  }

  // Handle Image Upload Action
  handleImageUpload(tracking: any) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) {
        this.crudService.uploadImage(tracking.tracking_id, file).subscribe({
          next: (response) => {
            if (response?.status === 'success') {
              Swal.fire('Success', 'Image uploaded successfully.', 'success');
              this.loadTrackingData(); // Refresh the data after image upload
            } else {
              Swal.fire('Error', response.message || 'Failed to upload image.', 'error');
            }
          },
          error: (err) => {
            console.error('Error uploading image:', err);
            Swal.fire('Error', 'Failed to upload image.', 'error');
          },
        });
      }
    });

    // Trigger file input dialog
    input.click();
  }
}
