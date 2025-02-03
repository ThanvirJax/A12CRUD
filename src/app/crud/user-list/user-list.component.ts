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
      headerClass: 'header-cell',
    },
    {
      field: 'user_email',
      headerName: 'Email',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'user_nic',
      headerName: 'NIC',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'user_phone',
      headerName: 'Phone Number',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'user_address',
      headerName: 'Address',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'user_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'nic_image',
      headerName: 'NIC Image',
      cellRenderer: this.nicImageRenderer.bind(this),
      width: 150,
      headerClass: 'header-cell',
    },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 300,
      cellRenderer: this.actionRender.bind(this),
    }
  ];

  rowData: any = [];
  gridOptions = {
    rowHeight: 100, 
  };

  userList: any = [];
  userListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
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
    this.userListSubscribe = this.crudService.loadUser().subscribe((res) => {
      if (res.result === 'success') {
        this.userList = res.data.map((user: any) => ({
          ...user,
          nic_image: user.nic_image ? `data:image/jpeg;base64,${user.nic_image}` : null,
        }));
        this.rowData = this.userList;
      }
    });
  }

  nicImageRenderer(params: any): string {
    const imageUrl = params.data.nic_image;
    return imageUrl
      ? `<img src="${imageUrl}" alt="NIC Image" style="width: 100px; height: 100px; object-fit: cover;">`
      : `<img src="assets/icon/no-image.png" alt="no Image" style="width: 45px; height: 45px; object-fit: cover;">`;
  }

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-info" id="view-image-button">View NIC</button>
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
      this.updateUserStatus(params, updateStatusButton);
    });
  
    let viewImageButton = div.querySelector('.btn-info') as HTMLElement;
    viewImageButton?.addEventListener('click', () => {
      this.openImageInSwal(params.data);
    });
  
    return div;
  }
  
openImageInSwal(user: any) {
  const { nic_image, user_nic, user_name, user_status } = user;

  Swal.fire({
    title: 'User Details',
    html: `
      <div style="text-align: left;">
      <p><strong>Status:</strong> ${user_status}</p>
      <p><strong>User Name:</strong> ${user_name}</p>
      <p><strong>NIC Number:</strong> ${user_nic}</p>
        ${
          nic_image
            ? `<div style="text-align: center;"><img src="${nic_image}" alt="NIC Image" style="max-width: 100%; border-radius: 5px; margin-bottom: 10px;"></div>`
            : `<p><img src="assets/icon/no-image.png" alt="no Image" style="max-width: 100%; border-radius: 1px; margin-bottom: 10px;"></p>`
        }
      </div>
    `,
    showCloseButton: true,
    focusConfirm: false,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    showCancelButton: true,
    cancelButtonText: user_status === 'Active' ? 'Deactivate' : 'Activate',
    customClass: {
      cancelButton: 'btn btn-secondary mr-2', // Customize cancel button style
      confirmButton: 'btn btn-primary',
    },
    didRender: () => {
      // Attach event listener for the status button after rendering
      const cancelButton = document.querySelector('.swal2-cancel') as HTMLElement;
      cancelButton?.addEventListener('click', () => {
        this.updateUserStatusInPopup(user, cancelButton);
      });
    },
    preConfirm: () => {
      return true; 
    },
  });
}
  
  updateUserStatusInPopup(user: any, statusButton: HTMLElement) {
  const newStatus = user.user_status === 'Active' ? 'Inactive' : 'Active';

  const formData = new FormData();
  formData.append('user_id', user.user_id);
  formData.append('user_status', newStatus);

  this.crudService.updateUserStatus(formData).subscribe({
    next: (res) => {
      if (res.result === 'success') {
        // Update the user's status locally
        user.user_status = newStatus;

        // Update button text
        statusButton.textContent = newStatus === 'Active' ? 'Deactivate' : 'Activate';

        // Show success feedback
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
