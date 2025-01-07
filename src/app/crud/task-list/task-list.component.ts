import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi<any>;
  private routerSubscription: Subscription;

  columnDefs = [
    {
      field: 'task_name',
      headerName: 'Task Name',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'task_description',
      headerName: 'Description',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'assigned_admin',
      headerName: 'Assigned Admin',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'volunteer_names',
      headerName: 'Volunteers',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'task_status',
      headerName: 'Status',
      sortable: true,
      headerClass: 'header-cell',
      width: 120,
    },
    {
      field: 'task_deadline',
      headerName: 'Deadline',
      sortable: true,
      headerClass: 'header-cell',
    },
    {
      field: 'completion_date',
      headerName: 'Completion Date',
      sortable: true,
      headerClass: 'header-cell',
      valueFormatter: (params: any) => {
        // Format completion date if it's present
        return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
      },
    },
    {
      field: '',
      headerName: 'Actions',
      headerClass: 'header-cell',
      width: 250,
      cellRenderer: this.actionRender.bind(this),
    },
  ];

  rowData: any[] = [];
  gridOptions = {
    rowHeight: 60,
  };

  userId: number | null = null;

  constructor(
    private crudService: CRUDService,
    private router: Router,
    private authService: AuthService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getTaskList();
      }
    });
  }

  ngOnInit(): void {
    // Initialize userId from AuthService
    this.userId = this.authService.getUser()?.user_id || null;
    this.getTaskList();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  getTaskList() {
    this.crudService.loadTasks().subscribe(
      (res: any[]) => {
        this.rowData = res.map((task) => ({
          task_id: task.task_id,
          task_name: task.task_name,
          task_description: task.task_description,
          assigned_admin: task.assigned_admin,
          volunteer_names: task.volunteers
            .map((vol: any) => vol.volunteer_name)
            .join(', '),
          task_status: task.task_status,
          task_deadline: task.task_deadline,
          completion_date: task.completion_date, // Add completion_date here
          accepted_by_user: task.volunteers.some(
            (vol: any) => vol.volunteer_id === this.userId
          ),
        }));
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while fetching tasks.', 'error');
      }
    );
  }

  actionRender(params: any) {
    const div = document.createElement('div');
    const isCompleted = params.data.task_status === 'Completed';
    const isAccepted = params.data.accepted_by_user;

    const htmlCode = `
      <button type="button" class="btn btn-primary">Details</button>
      <button type="button" class="btn btn-warning" ${isAccepted || isCompleted ? 'disabled' : ''}>Accept Task</button>
      `;

    div.innerHTML = htmlCode;

    div.querySelector('.btn-primary')?.addEventListener('click', () =>
      this.showTaskDetails(params)
    );

    div.querySelector('.btn-warning')?.addEventListener('click', () =>
      this.acceptTask(params)
    );

    return div;
  }

  showTaskDetails(params: any) {
    Swal.fire({
      title: `Task Details`,
      html: `
        <strong>Task Name:</strong> ${params.data.task_name}<br>
        <strong>Description:</strong> ${params.data.task_description}<br>
        <strong>Assigned Admin:</strong> ${params.data.assigned_admin}<br>
        <strong>Volunteers:</strong> ${params.data.volunteer_names}<br>
        <strong>Status:</strong> ${params.data.task_status}<br>
        <strong>Deadline:</strong> ${params.data.task_deadline}`,
      confirmButtonText: 'Close',
    });
  }

  acceptTask(params: any) {
    if (!this.userId) {
      Swal.fire('Error', 'User ID is missing. Please log in again.', 'error');
      return;
    }

    if (params.data.accepted_by_user) {
      Swal.fire('Error', 'You have already accepted this task.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to accept this task.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService
          .updateVolunteerStatus(params.data.task_id, 'Accepted')
          .subscribe(
            () => {
              Swal.fire('Success', 'Task accepted.', 'success').then(() => {
                window.location.reload();
              });
            },
            (error) => {
              Swal.fire('Error', 'An error occurred while accepting the task.', 'error');
            }
          );
      }
    });
  }
}
