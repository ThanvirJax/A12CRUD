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
  styleUrl: './user-list.component.css'
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
      headerName: 'Description',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_phone',
      headerName: 'Description',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_password',
      headerName: 'Password',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'user_address',
      headerName: 'Quantity',
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
    // Subscribe to route changes
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Re-fetch resource list when the route changes
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

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-success">View</button>
      <button type="button" class="btn btn-danger">Delete</button>
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
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        that.crudService.deleteUser(params.data.user_id).subscribe(res => {
          if (res.result === 'success') {
            this.gridApi.applyTransaction({ remove: [params.data] });

            Swal.fire(
              'Deleted!',
              'The resource has been deleted.',
              'success'
            );
          }
        }, error => {
          Swal.fire('Error', 'An error occurred while deleting the user.', 'error');
        });
      }
    });
  }

  typeCellRender(params: any) {
    return '$ ' + params.data.resource_type;
  }
}
