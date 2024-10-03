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
      headerName: 'user_name',
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
      headerName: 'type',
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

  resourceList: any = [];
  resourceListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    // Subscribe to route changes
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Re-fetch resource list when the route changes
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
      this.viewResourceDetails(params);
    });

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editResourceDetails(params);
    });

    let deleteButton = div.querySelector('.btn-danger');
    deleteButton?.addEventListener('click', () => {
      this.deleteResource(params);
    });

    return div;
  }

  viewResourceDetails(params: any) {
    this.router.navigate(['/crud/view-resource-details/' + params.data.resource_id]);
  }

  editResourceDetails(params: any) {
    this.router.navigate(['/crud/update-resource/' + params.data.resource_id], { queryParams: { reload: true } });
  }

  deleteResource(params: any) {
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
        that.crudService.deleteResource(params.data.resource_id).subscribe(res => {
          if (res.result === 'success') {
            this.gridApi.applyTransaction({ remove: [params.data] });

            Swal.fire(
              'Deleted!',
              'The resource has been deleted.',
              'success'
            );
          }
        }, error => {
          Swal.fire('Error', 'An error occurred while deleting the resource.', 'error');
        });
      }
    });
  }

  typeCellRender(params: any) {
    return '$ ' + params.data.resource_type;
  }
}
