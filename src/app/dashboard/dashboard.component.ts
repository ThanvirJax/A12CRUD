import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CRUDService } from '../crud/services/crud.service';
import { UserRequest } from '../models/user-request';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgClass, RouterLink, NgFor, DatePipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = null;
  adminName: string | null = null;
  centerName: string | null = null;
  userId: string | null = null;
  userRequests: UserRequest[] = []; 
  acceptedTasks: Task[] = []; 
  errorMessage: string | null = null; 
  taskErrorMessage: string | null = null; 
  selectedTab: string = 'requests'; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private crudService: CRUDService 
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user ? user.user_name : null;
    this.adminName = user ? user.admin_name : null;
    this.centerName = user?.center_name || null;
    this.userId = user ? user.user_id : null;
    if (this.userId) {
      this.fetchUserRequests(this.userId);
      this.fetchAcceptedTasks(this.userId);
    }
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Check if the user is associated with a center
  isCenter(): boolean {
    return !!this.centerName;
  }

  // Navigate to edit profile page
  editProfile(): void {
    if (this.userId) {
      this.router.navigate(['/crud/update-user', this.userId]);
    }
  }

  editCenterInfo(): void {
    const user = this.authService.getUser();
    const centerId = user?.center_id;
    if (centerId) {
      this.router.navigate(['/crud/update-center', centerId]);
    } else {
      console.error('No center ID available for the logged-in user.');
    }
  }
  

  onCreateCenter() {
    this.router.navigate(['/crud/center-form']); 
  }

  // Navigate to request resources page
  requestResource(): void {
    if (this.userId) {
      this.router.navigate(['/crud/request-resource', this.userId]);
    }
  }

  // Fetch user requests from the API
  private fetchUserRequests(userId: string): void {
    this.crudService.viewSpecificUserStatus(Number(userId)).subscribe({
      next: (requests: UserRequest[]) => {
        this.userRequests = requests;
        this.errorMessage = this.userRequests.length === 0 ? 'No requests found.' : null;
      },
      error: (err) => {
        console.error('Error fetching user requests:', err);
        this.errorMessage = 'Unable to fetch requests. Please try again later.';
      }
    });
  }

  // Fetch accepted tasks from the API
  private fetchAcceptedTasks(userId: string): void {
    this.crudService.fetchAcceptedTasks(Number(userId)).subscribe({
      next: (tasks: Task[]) => {
        this.acceptedTasks = tasks;
        this.taskErrorMessage = this.acceptedTasks.length === 0 ? 'No accepted tasks found.' : null;
      },
      error: (err) => {
        console.error('Error fetching accepted tasks:', err);
        this.taskErrorMessage = 'Unable to fetch accepted tasks. Please try again later.';
      }
    });
  }

  // Get approved requests
  get approvedRequests(): UserRequest[] {
    return this.userRequests.filter(request => request.request_status === 'Approved');
  }

  // Check if there are no approved requests
  get hasNoApprovedRequests(): boolean {
    return this.approvedRequests.length === 0;
  }

  // Check if there are no accepted tasks
  get hasNoAcceptedTasks(): boolean {
    return this.acceptedTasks.length === 0;
  }
  markTaskComplete(task: Task): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to mark this task as complete.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.crudService.updateTaskStatus(task.task_id, 'Completed').subscribe({
          next: () => {
            Swal.fire('Success', 'Task marked as complete.', 'success').then(() => {
              // Update the local list
              task.task_status = 'Completed';
            });
          },
          error: (error) => {
            Swal.fire('Error', 'An error occurred while updating the task status.', 'error');
          },
        });
      }
    });
  }
}
