import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'alert_message',
      headerName: 'Message',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'alert_description',
      headerName: 'Description',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'alert_type',
      headerName: 'Type',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'alert_created',
      headerName: 'Created on',
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

  alertList: any = [];
  alertListSubscribe: any;

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getAlertList();
      }
    });
  }

  ngOnInit(): void {
    this.getAlertList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getAlertList() {
    this.alertListSubscribe = this.crudService.getAlerts().subscribe(res => {
      this.alertList = res;
      this.rowData = res;
    });
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
      this.viewAlertDetails(params);
    });

    let editButton = div.querySelector('.btn-warning');
    editButton?.addEventListener('click', () => {
      this.editAlertDetails(params);
    });

    let deleteButton = div.querySelector('.btn-danger');
    deleteButton?.addEventListener('click', () => {
      this.deleteAlert(params);
    });

    return div;
  }

  viewAlertDetails(params: any) {
    this.router.navigate(['/crud/view-alert-details/' + params.data.alert_id]);
  }

  editAlertDetails(params: any) {
    this.router.navigate(['/crud/update-alert/' + params.data.alert_id]);
  }
  

  deleteAlert(params: any) {
    const that = this;
    Swal.fire({
      title: 'Are you sure you want to remove this alert?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        that.crudService.deleteAlert(params.data.alert_id).subscribe(
          res => {
            if (res.result === 'success') {
              this.gridApi.applyTransaction({ remove: [params.data] });

              Swal.fire(
                'Deleted!',
                'The alert has been deleted.',
                'success'
              );
            }
          },
          error => {
            Swal.fire('Error', 'An error occurred while deleting the alert.', 'error');
          }
        );
      }
    });
  }
}
