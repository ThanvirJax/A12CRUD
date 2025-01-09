import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'user_name',
      headerName: 'Name',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_email',
      headerName: 'Email',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_phone',
      headerName: 'Phone Number',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_address',
      headerName: 'Address',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_status',
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

  userList: any = [];
  userListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getUserList();
      }
    });
  }

  ngOnInit(): void {
    this.getUserList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getUserList() {
    this.userListSubscribe = this.crudService.loadUser().subscribe(res => {
      this.userList = res;
      this.rowData = res;
    });
  }

  statusRenderer(params: any): string {
    const status = params.data.user_status;
    const statusClass = status === 'Active' ? 'badge-success' : 'badge-danger';
    return `<span class="badge ${statusClass}">${status}</span>`;
  }

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-warning">Edit</button>
      <button type="button" class="btn btn-secondary" id="update-status-button">${params.data.user_status === 'Active' ? 'Deactivate' : 'Activate'}</button>
    `;
    div.innerHTML = htmlCode;

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editUserDetails(params);
    });

    let updateStatusButton = div.querySelector('.btn-secondary') as HTMLElement;
    updateStatusButton?.addEventListener('click', () => {
      this.updateUserStatus(params, updateStatusButton); // Pass the button for dynamic updates
    });

    return div;
  }

  editUserDetails(params: any) {
    this.router.navigate(['/crud/update-user/' + params.data.user_id], { queryParams: { reload: true } });
  }

  updateUserStatus(params: any, updateStatusButton: HTMLElement) {
    const newStatus = params.data.user_status === 'Active' ? 'Inactive' : 'Active';
    const formData = new FormData();
    formData.append('user_id', params.data.user_id);
    formData.append('user_status', newStatus);

    this.crudService.updateUserStatus(formData).subscribe({
      next: (res) => {
        if (res.result === 'success') {
          updateStatusButton.textContent = newStatus === 'Active' ? 'Deactivate' : 'Activate';

          Swal.fire('Updated!', `User status changed to ${newStatus}.`, 'success').then(() => {
            window.location.reload();
          });
        }
      },
      error: () => {
        Swal.fire('Error', 'Failed to update user status.', 'error');
      }
    });
  }
}
