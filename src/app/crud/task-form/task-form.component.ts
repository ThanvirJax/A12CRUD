import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../services/crud.service';
import { HttpClientModule } from '@angular/common/http';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../auth.service';
declare const Swal: any;

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgClass,
  ]
})
export class TaskFormComponent implements OnInit {
  adminEmail: string | null = null;

  taskForm!: FormGroup;
  taskId: any;
  buttonText = 'Create Task';

  constructor(
        private authService: AuthService,
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createTaskForm();
    const user = this.authService.getUser();
    this.adminEmail = user ? user.admin_email : null;
  
    // Set the admin_email field value directly in the form control
    if (this.adminEmail) {
      this.taskForm.get('admin_email')?.setValue(this.adminEmail);
    }
  
    // Check if we are updating an existing task
    this.taskId = this.activatedRoute.snapshot.params['taskId'];
    if (this.taskId) {
      this.loadTaskDetails(this.taskId);
      this.buttonText = 'Update Task';
    }
  }
  
  // Initialize the form with validation
  createTaskForm(): void {
    this.taskForm = this.formBuilder.group({
      task_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      task_description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      admin_email: ['', [Validators.required, Validators.email]],
      task_deadline: ['', [Validators.required]]
    });
  }

  createOrUpdateTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
  
    const values = this.taskForm.value;
  
    // Convert task_deadline to "Y-m-d H:i:s" format
    const deadline = new Date(values.task_deadline).toISOString().slice(0, 19).replace('T', ' ');
  
    // Encode form data for application/x-www-form-urlencoded
    const encodedFormData = new URLSearchParams();
    encodedFormData.set('task_name', values.task_name);
    encodedFormData.set('task_description', values.task_description);
    encodedFormData.set('admin_email', values.admin_email);
    encodedFormData.set('task_deadline', deadline); 
  
    if (this.taskId) {
      // Update task
      encodedFormData.set('task_id', this.taskId);
      this.crudService.updateTaskDetails(encodedFormData.toString()).subscribe({
        next: (res) => this.handleResponse(res, 'Task Updated!'),
        error: () => Swal.fire('Error', 'Failed to update the task.', 'error'),
      });
    } else {
      // Create new task
      this.crudService.createTask(encodedFormData.toString()).subscribe({
        next: (res) => this.handleResponse(res, 'Task Created!'),
        error: () => Swal.fire('Error', 'Failed to create the task.', 'error'),
      });
    }
  }
  
  // Load task details for update
  loadTaskDetails(taskId: any): void {
    this.crudService.loadTaskInfo(taskId).subscribe((res) => {
      if (res.result === 'success') {
        this.taskForm.patchValue({
          task_name: res.task_name,
          task_description: res.task_description,
          admin_email: res.admin_email,
          task_deadline: res.task_deadline 
        });
      } else {
        Swal.fire('Error', 'Failed to load task details.', 'error');
      }
    });
  }

  // Handle navigation and response messages
  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/crud/task-list']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire('Error', res.message || 'An unexpected error occurred.', 'error');
    }
  }
}
