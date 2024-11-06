import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
declare const Swal: any;

@Component({
  selector: 'app-donation-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'donor_name',
      headerName: 'Donor',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'donor_type',
      headerName: 'Donor Type',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_name',
      headerName: 'Resource Name',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_description',
      headerName: 'Resource Description',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'resource_type',
      headerName: 'Resource Type',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'donation_quantity',
      headerName: 'Donation Quantity',
      sortable: true,
      headerClass: 'header-cell'
    },
    {
      field: 'donation_date',
      headerName: 'Date',
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

  rowData: any[] = [];
  gridOptions = {
    rowHeight: 50
  };

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getDonationList();
      }
    });
  }

  ngOnInit(): void {
    this.getDonationList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getDonationList() {
    this.crudService.loadDonation().subscribe(
      (res: any[]) => {
        // Flatten resource data if each donation has multiple resources
        this.rowData = res.flatMap(donation => 
          donation.resources.map((resource: any) => ({
            donor_name: donation.donor_name,
            donor_type: donation.donor_type,
            donation_date: donation.donation_date,
            donation_id: donation.donation_id,
            // Resource-specific fields
            resource_name: resource.resource_name,
            resource_description: resource.resource_description,
            resource_type: resource.resource_type,
            donation_quantity: resource.donation_quantity
          }))
        );
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while fetching donations.', 'error');
      }
    );
  }

  actionRender(params: any) {
    const div = document.createElement('div');
    const htmlCode = `
      <button type="button" class="btn btn-success">View</button>
      <button type="button" class="btn btn-warning">Edit</button>
      <button type="button" class="btn btn-danger">Delete</button>`;
    div.innerHTML = htmlCode;

    div.querySelector('.btn-success')?.addEventListener('click', () => this.viewDonationDetails(params));
    div.querySelector('.btn-warning')?.addEventListener('click', () => this.editDonationDetails(params));
    div.querySelector('.btn-danger')?.addEventListener('click', () => this.deleteDonation(params));

    return div;
  }

  viewDonationDetails(params: any) {
    Swal.fire({
      title: 'Donation Details',
      html: `
        <strong>Donation ID:</strong> ${params.data.donation_id}<br>
        <strong>Donor:</strong> ${params.data.donor_name}<br>
        <strong>Type:</strong> ${params.data.donor_type}<br>
        <strong>Resource Name:</strong> ${params.data.resource_name}<br>
        <strong>Description:</strong> ${params.data.resource_description}<br>
        <strong>Type:</strong> ${params.data.resource_type}<br>
        <strong>Quantity:</strong> ${params.data.donation_quantity}<br>
        <strong>Date:</strong> ${params.data.donation_date}
      `,
      icon: 'info'
    });
  }

  editDonationDetails(params: any) {
    this.router.navigate(['/crud/update-donation/' + params.data.donation_id], { queryParams: { reload: true } });
  }

  deleteDonation(params: any) {
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
        this.crudService.deleteDonation(params.data.donation_id).subscribe(
          (res: any) => {
            if (res.result === 'success') {
              this.gridApi.applyTransaction({ remove: [params.data] });
              Swal.fire('Deleted!', 'The donation has been deleted.', 'success');
            }
          },
          (error) => Swal.fire('Error', 'An error occurred while deleting the donation.', 'error')
        );
      }
    });
  }
}
