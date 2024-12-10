import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'; // Import SweetAlert2 for using the modal

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
})
export class RequestListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'requester_name',
      headerName: 'Requester Name',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'requester_email',
      headerName: 'Requester Email',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'requester_type',
      headerName: 'Requester Type',
      sortable: true,
      headerClass: 'header-cell',
      width: 150,

    },
    {
      field: 'resource_name',
      headerName: 'Resource Name',
      sortable: true,
      headerClass: 'header-cell',
      width: 150,
    },
    {
      field: 'resource_description',
      headerName: 'Resource Desc',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'requested_quantity',
      headerName: 'Quantity',
      sortable: true,
      headerClass: 'header-cell',
      width: 100,
    },
    {
      field: 'request_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell',
      width: 125,

    },
    {
      field: 'request_date',
      headerName: 'Date of Request',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 250,
      cellRenderer: this.actionRender.bind(this),
    },
  ];

  rowData: any[] = [];
  gridOptions = {
    rowHeight: 60,
  };

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getRequestList();
      }
    });
  }

  ngOnInit(): void {
    this.getRequestList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getRequestList() {
    this.crudService.loadUserRequests().subscribe(
      (res: any[]) => {
        this.rowData = res.flatMap((request) =>
          request.resources.map((resource: any) => ({
            request_id: request.request_id,
            request_status: request.request_status,
            request_date: request.request_date,
            requester_name: request.requester_name,
            requester_email: request.requester_email,
            requester_type: request.requester_type,
            resource_name: resource.resource_name,
            resource_description: resource.resource_description,
            requested_quantity: resource.requested_quantity,
          }))
        );
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while fetching requests.', 'error');
      }
    );
  }

  actionRender(params: any) {
    const div = document.createElement('div');
    const isApproved = params.data.request_status === 'Approved';
  
    const htmlCode = `
      <button type="button" class="btn btn-primary">Status</button>
      <button type="button" class="btn btn-success" ${
        isApproved ? 'disabled' : ''
      }>Approve</button>
      <button type="button" class="btn btn-danger" ${
        isApproved ? 'disabled' : ''
      }>Reject</button>`;
    
    div.innerHTML = htmlCode;
  
    // Status action with dropdown
    div.querySelector('.btn-primary')?.addEventListener('click', () =>
      this.showStatusDropdown(params)
    );
  
    // Approve action
    if (!isApproved) {
      div.querySelector('.btn-success')?.addEventListener('click', () =>
        this.updateRequestStatus(params, 'Approved')
      );
    }
  
    // Reject action
    if (!isApproved) {
      div.querySelector('.btn-danger')?.addEventListener('click', () =>
        this.updateRequestStatus(params, 'Rejected')
      );
    }
  
    return div;
  }
  
  showStatusDropdown(params: any) {
    const currentStatus = params.data.request_status;
    const statusOptions = ['Pending', 'Approved', 'Rejected'];
  
    Swal.fire({
      title: 'Update Request Status',
      html: `
        <strong>Request ID:</strong> ${params.data.request_id}<br>
        <strong>Requester:</strong> ${params.data.requester_name}<br>
        <strong>Email:</strong> ${params.data.requester_email}<br>
        <strong>Resource Name:</strong> ${params.data.resource_name}<br>
        <strong>Requested Quantity:</strong> ${params.data.requested_quantity}<br>
        <label for="status">Select New Status:</label>
        <select id="status" class="swal2-select">
          ${statusOptions
            .map(
              (status) =>
                `<option value="${status}" ${
                  status === currentStatus ? 'selected' : ''
                }>${status}</option>`
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
        this.updateRequestStatus(params, newStatus);
      }
    });
  }
  
  updateRequestStatus(params: any, newStatus: string) {
    const requestId = params.data.request_id;
  
    this.crudService.updateRequestStatus(requestId, newStatus, params.data.requested_quantity).subscribe(
      () => {
        params.data.request_status = newStatus;
        this.gridApi.redrawRows({ rowNodes: [params.node] });
        Swal.fire(
          'Success',
          `Request status has been updated to ${newStatus} successfully.`,
          'success'
        );
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while updating the status.', 'error');
      }
    );
  }
  
  deleteRequest(params: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService.deleteRequest(params.data.request_id).subscribe(
          () => {
            this.gridApi.applyTransaction({ remove: [params.data] });
            Swal.fire('Deleted!', 'The request has been deleted.', 'success');
          },
          () => Swal.fire('Error', 'An error occurred while deleting the request.', 'error')
        );
      }
    });
  }
}
