import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-center-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './center-list.component.html',
  styleUrls: ['./center-list.component.css']
})
export class CenterListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'center_name',
      headerName: 'Name',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'center_email',
      headerName: 'Email',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'center_phone',
      headerName: 'Phone Number',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'center_address',
      headerName: 'Address',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'center_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 250,
      cellRenderer: this.actionRender.bind(this)
    }
  ];

  rowData: any = [];
  gridOptions = {
    rowHeight: 50
  };

  centerListSubscribe: Subscription | undefined;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getCenterList();
      }
    });
  }

  ngOnInit(): void {
    this.getCenterList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.centerListSubscribe) {
      this.centerListSubscribe.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getCenterList() {
    this.centerListSubscribe = this.crudService.loadCenters().subscribe(res => {
      this.rowData = res;
    });
  }

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-warning">Edit</button>
      <button type="button" class="btn btn-secondary">${params.data.center_status === 'Active' ? 'Deactivate' : 'Activate'}</button>
    `;
    div.innerHTML = htmlCode;

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editCenterDetails(params);
    });

    let updateStatusButton = div.querySelector('.btn-secondary') as HTMLElement;
    updateStatusButton?.addEventListener('click', () => {
      this.updateCenterStatus(params, updateStatusButton); // Pass the button for dynamic updates
    });

    return div;
  }

  editCenterDetails(params: any) {
    this.router.navigate(['/crud/update-center/' + params.data.center_id], { queryParams: { reload: true } });
  }

  updateCenterStatus(params: any, updateStatusButton: HTMLElement) {
    const newStatus = params.data.center_status === 'Active' ? 'Inactive' : 'Active';
    const formData = new FormData();
    formData.append('center_id', params.data.center_id);
    formData.append('center_status', newStatus);

    this.crudService.updateCenterStatus(formData).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          // Update the status locally
          params.data.center_status = newStatus;

          // Update button text dynamically
          updateStatusButton.textContent = newStatus === 'Active' ? 'Deactivate' : 'Activate';

          // Refresh the row in the grid
          this.gridApi.refreshCells({ rowNodes: [params.node], force: true });

          Swal.fire('Updated!', `Center status changed to ${newStatus}.`, 'success');
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to update center status.', 'error');
      }
    });
  }
}
