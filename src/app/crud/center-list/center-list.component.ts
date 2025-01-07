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
  private routerSubscription!: Subscription;
  private centerListSubscription: Subscription | null = null; // Option 1: Initialized to null

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

  centerList: any = [];

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
    if (this.centerListSubscription) {
      this.centerListSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getCenterList() {
    this.centerListSubscription = this.crudService.loadCenters().subscribe(res => {
      this.rowData = res; // Directly assign the response to rowData
    });
  }

  actionRender(params: any) {
    let div = document.createElement('div');
    let htmlCode = `
      <button type="button" class="btn btn-danger">Remove</button>
      <button type="button" class="btn btn-warning">Edit</button>`;
    div.innerHTML = htmlCode;

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editCenterDetails(params);
    });

    let deleteButton = div.querySelector('.btn-danger');
    deleteButton?.addEventListener('click', () => {
      this.deleteCenter(params);
    });

    return div;
  }

  editCenterDetails(params: any) {
    this.router.navigate(['/crud/update-center/' + params.data.center_id]);
  }

  deleteCenter(params: any) {
    const that = this;
    Swal.fire({
      title: 'Are you sure you want to remove this center?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        that.crudService.deleteCenter(params.data.center_id).subscribe(
          res => {
            if (res.result === 'success') {
              this.gridApi.applyTransaction({ remove: [params.data] });
              Swal.fire(
                'Deleted!',
                'The center has been deleted.',
                'success'
              );
            }
          },
          error => {
            Swal.fire('Error', 'An error occurred while deleting the center.', 'error');
          }
        );
      }
    });
  }
}
