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
      field: 'user_password',
      headerName: 'Password',
      sortable: true,
      headerClass: 'header-cell',
      cellRenderer: this.passwordCellRenderer.bind(this) 
    },
    {
      field: 'user_address',
      headerName: 'Address',
      sortable: true,
      headerClass: 'header-cell'
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

  passwordCellRenderer(params: any) {
    const div = document.createElement('div');
    let isPasswordVisible = false;

    const passwordText = document.createElement('span');
    passwordText.textContent = '*****'; 
/*
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.classList.add('btn', 'btn-sm', 'btn-secondary');
    toggleButton.style.marginLeft = '10px';

    toggleButton.addEventListener('click', () => {
      isPasswordVisible = !isPasswordVisible;
      passwordText.textContent = isPasswordVisible ? params.value : '*****';
      toggleButton.textContent = isPasswordVisible ? 'Hide' : 'Show';
    });
    

    div.appendChild(passwordText);
    //div.appendChild(toggleButton);

    return div;*/
  }

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-success">View</button>
      <button type="button" class="btn btn-danger">Remove</button>
      <button type="button" class="btn btn-warning">Edit</button>`;
    div.innerHTML = htmlCode;

    let viewButton = div.querySelector('.btn-success');
    viewButton?.addEventListener('click', () => {
      this.viewUserDetails(params);
    });

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editUserDetails(params);
    });

    let deleteButton = div.querySelector('.btn-danger');
    deleteButton?.addEventListener('click', () => {
      this.deleteUser(params);
    });

    return div;
  }

  viewUserDetails(params: any) {
    this.router.navigate(['/crud/view-user-details/' + params.data.user_id]);
  }

  editUserDetails(params: any) {
    this.router.navigate(['/crud/update-user/' + params.data.user_id], { queryParams: { reload: true } });
  }

  deleteUser(params: any) {
    const that = this;
    Swal.fire({
      title: 'Are you sure you want to remove user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        that.crudService.deleteUser(params.data.user_id).subscribe(
          res => {
            if (res.result === 'success') {
              this.gridApi.applyTransaction({ remove: [params.data] });

              Swal.fire(
                'Deleted!',
                'The user has been deleted.',
                'success'
              );
            }
          },
          error => {
            Swal.fire('Error', 'An error occurred while deleting the user.', 'error');
          }
        );
      }
    });
  }
}
