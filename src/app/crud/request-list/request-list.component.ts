import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.css'
})
export class RequestListComponent implements OnInit, OnDestroy {
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
      headerName: 'User Email',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_name',
      headerName: 'Resource',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'request_quantity',
      headerName: 'Quantity',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'request_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'request_date',
      headerName: 'Date of Request',
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

  requestList: any = [];
  requestListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
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
    this.requestListSubscribe = this.crudService.loadUserRequests().subscribe(res => {
      this.requestList = res;
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
      this.viewRequestDetails(params);
    });

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editRequestDetails(params);
    });

    let deleteButton = div.querySelector('.btn-danger');
    deleteButton?.addEventListener('click', () => {
      this.deleteRequest(params);
    });

    return div;
  }

  viewRequestDetails(params: any) {
    this.router.navigate(['/crud/view-request-details/' + params.data.request_id]);
  }

  editRequestDetails(params: any) {
    this.router.navigate(['/crud/update-request/' + params.data.request_id], { queryParams: { reload: true } });
  }

  deleteRequest(params: any) {
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
        that.crudService.deleteRequest(params.data.request_id).subscribe(res => {
          if (res.result === 'success') {
            this.gridApi.applyTransaction({ remove: [params.data] });

            Swal.fire(
              'Deleted!',
              'The request has been deleted.',
              'success'
            );
          }
        }, error => {
          Swal.fire('Error', 'An error occurred while deleting the request.', 'error');
        });
      }
    });
  }

  priceCellRender(params: any) {
    return '$ ' + params.data.request_status;
  }
}
