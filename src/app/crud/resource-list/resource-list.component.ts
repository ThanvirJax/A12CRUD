import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'resource_name',
      headerName: 'Resource Name',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_description',
      headerName: 'Description',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_type',
      headerName: 'Type',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_quantity',
      headerName: 'Quantity',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'resource_expiry_date',
      headerName: 'Expiry Date',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 300,
      cellRenderer: this.actionRender.bind(this)
    }
  ];

  rowDataAvailable: any = [];
  rowDataUnavailable: any = [];
  gridOptions = {
    rowHeight: 50
  };

  resourceList: any = [];
  resourceListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getResourceList();
      }
    });
  }

  ngOnInit(): void {
    this.getResourceList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getResourceList() {
    this.resourceListSubscribe = this.crudService.loadResources().subscribe(res => {
      this.resourceList = res;
      
      // Separate available and unavailable resources
      this.rowDataAvailable = res.filter((resource: any) => resource.resource_status === 'Available');
      this.rowDataUnavailable = res.filter((resource: any) => resource.resource_status === 'Unavailable');
    });
  }

  statusRenderer(params: any): string {
    const status = params.data.resource_status;
    const statusClass = status === 'Available' ? 'badge-success' : 'badge-danger';
    return `<span class="badge ${statusClass}">${status}</span>`;
  }

  actionRender(params: any) {
    // Create container for buttons
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-success">View</button>
      <button type="button" class="btn btn-warning">Edit</button>
      <button type="button" class="btn btn-secondary" id="toggle-status-button">${params.data.resource_status === 'Available' ? 'Mark Unavailable' : 'Mark Available'}</button>
    `;
    div.innerHTML = htmlCode;
  
    // Add event listeners to buttons
    let viewButton = div.querySelector('.btn-success');
    viewButton?.addEventListener('click', () => {
      this.viewResourceDetails(params);
    });
  
    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editResourceDetails(params);
    });
  
    let toggleStatusButton = div.querySelector('.btn-secondary') as HTMLElement;

    toggleStatusButton?.addEventListener('click', () => {
      this.toggleResourceStatus(params, toggleStatusButton);  
    });
  
    return div;
  }
  

  viewResourceDetails(params: any) {
    this.router.navigate(['/crud/view-resource-details/' + params.data.resource_id]);
  }

  editResourceDetails(params: any) {
    this.router.navigate(['/crud/update-resource/' + params.data.resource_id]);
  }

  toggleResourceStatus(params: any, toggleStatusButton: HTMLElement) {
    const newStatus = params.data.resource_status === 'Available' ? 'Unavailable' : 'Available';
    const formData = new FormData();
    formData.append('resource_id', params.data.resource_id);
    formData.append('resource_status', newStatus);
  
    this.crudService.updateResourceDetails(formData).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          toggleStatusButton.textContent = newStatus === 'Available' ? 'Mark Unavailable' : 'Mark Available';
  
          // Show success message
          Swal.fire('Updated!', `Resource status changed to ${newStatus}.`, 'success').then(() => {
            window.location.reload();
          });
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to update resource status.', 'error');
      }
    });
  }
}
