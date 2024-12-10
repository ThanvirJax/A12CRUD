import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CRUDService } from '../services/crud.service';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatusComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    { field: 'resource_name', headerName: 'Resource Name', sortable: true, headerClass: 'header-cell' },
    { field: 'request_status', headerName: 'Request Status', sortable: true, headerClass: 'header-cell' },
    { field: 'requested_quantity', headerName: 'Requested Quantity', sortable: true, headerClass: 'header-cell' },
    { field: 'requester_name', headerName: 'Requester Name', sortable: true, headerClass: 'header-cell' },
    { field: 'tracking_status', headerName: ' Delivery Status', sortable: true, headerClass: 'header-cell' },
    { field: 'remarks', headerName: 'Remarks', sortable: true, headerClass: 'header-cell' },
    { field: 'tracking_created', headerName: 'Created At', sortable: true, headerClass: 'header-cell' },
    { field: 'tracking_updated', headerName: 'Updated At', sortable: true, headerClass: 'header-cell' },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 300,
      cellRenderer: this.actionRender.bind(this)
    }
  ];
  

  rowData: any = [];
  gridOptions = { rowHeight: 50 };

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadTrackingData();
      }
    });
  }

  ngOnInit(): void {
    this.loadTrackingData();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  loadTrackingData() {
    this.crudService.loadTracking().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          // Flatten the response and extract necessary data from resources
          this.rowData = response.flatMap((tracking: any) =>
            tracking.resources.map((resource: any) => ({
              tracking_id: tracking.tracking_id,
              tracking_status: tracking.tracking_status,
              remarks: tracking.remarks,
              tracking_created: tracking.tracking_created,
              tracking_updated: tracking.tracking_updated,
              resource_name: resource.resource_name,
              requested_quantity: resource.requested_quantity,
              resource_description: resource.resource_description,
              request_id: resource.request_id,
              request_status: resource.request_status,
              requester_name: resource.requester_name,
              requester_email: resource.requester_email,
              requester_type: resource.requester_type,
              user_id: resource.user_id,
              center_id: resource.center_id
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
      }
    });
  }
  
  actionRender(params: any) {
    const div = document.createElement('div');
    const isDelivered = params.data.tracking_status === 'Delivered';
  
    const htmlCode = ` 
      <button type="button" class="btn btn-primary">Status</button>
      <button type="button" class="btn btn-success" ${isDelivered ? 'disabled' : ''}>Delivered</button>
      <button type="button" class="btn btn-warning" ${isDelivered ? 'disabled' : ''}>Collected</button>
    `;
    
    div.innerHTML = htmlCode;

    // Status action with dropdown
    div.querySelector('.btn-primary')?.addEventListener('click', () =>
      this.showStatusDropdown(params)
    );

    // Delivered action
    if (!isDelivered) {
      div.querySelector('.btn-success')?.addEventListener('click', () =>
        this.updateTrackingStatus(params, 'Delivered')
      );
    }

    // Collected action
    if (!isDelivered) {
      div.querySelector('.btn-warning')?.addEventListener('click', () =>
        this.updateTrackingStatus(params, 'Collected')
      );
    }

    return div;
  }

  showStatusDropdown(params: any) {
    const currentStatus = params.data.tracking_status;
    const statusOptions = ['Pending', 'Delivered', 'Collected'];

    Swal.fire({
      title: 'Update Tracking Status',
      html: ` 
        <strong>Tracking ID:</strong> ${params.data.tracking_id}<br>
        <strong>Resource Name:</strong> ${params.data.resource_name}<br>
        <strong>Requested Quantity:</strong> ${params.data.requested_quantity}<br>
        <label for="status">Select New Status:</label>
        <select id="status" class="swal2-select">
          ${statusOptions
            .map(
              (status) =>
                `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>`
            )
            .join('')}
        </select>`,
      preConfirm: () => {
        const newStatus = (document.getElementById('status') as HTMLSelectElement).value;
        if (newStatus && newStatus !== currentStatus) {
          return newStatus;
        }
        Swal.showValidationMessage('Please select a new status different from the current one.');
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Update Status',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newStatus = result.value;
        this.updateTrackingStatus(params, newStatus);
      }
    });
  }
  updateTrackingStatus(params: any, newStatus: string) {
    const trackingId = params.data.tracking_id;
  
    this.crudService.updateTrackingStatus(trackingId, newStatus).subscribe({
      next: (response) => {
        if (response.message === 'Tracking status updated successfully.') {
          // Update the status in the grid data
          params.data.tracking_status = newStatus;
          this.gridApi.redrawRows({ rowNodes: [params.node] });
          Swal.fire('Success', `Tracking status updated to ${newStatus}.`, 'success');
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      error: (err) => {
        console.error(`Error updating status to ${newStatus}:`, err);
        Swal.fire('Error', 'Failed to update tracking status.', 'error');
      }
    });
  }
  }
