import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Resource } from '../../models/resource';
import { HttpResponse } from '../../models/http-response';
import { UserRequest } from '../../models/user-request';
import { User } from '../../models/user';
import { LoginResponse } from '../../models/login-response';
import { UserIdResponse } from '../../models/user-id-response';
import { Donation } from '../../models/donation';
import { Tracking } from '../../models/tracking';
import { Message } from '../../models/message';
import { Alert } from '../../models/alert';
import { Task } from '../../models/task';
import { AuthService } from '../../auth.service';
import { Center } from '../../models/center';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  private readonly API_ENDPOINT = environment.API_EndPoint;
  private readonly LOGIN_URL = `${this.API_ENDPOINT}login.php`;

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  // Load all resources
  loadResources(): Observable<Resource[]> {
    const url = `${this.API_ENDPOINT}view.php`;
    return this.httpClient.get<Resource[]>(url).pipe(map(data => data));
  }

  // Create a new resource
  createResource(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}create.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Load single resource details by ID
  loadResourceInfo(resourceId: any): Observable<Resource> {
    const url = `${this.API_ENDPOINT}view_one.php?id=${resourceId}`;
    return this.httpClient.get<Resource>(url).pipe(map(data => data));
  }

  // Update resource details
  updateResourceDetails(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}update.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Delete a resource by ID
  deleteResource(resourceId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete.php?id=${resourceId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  loadAllResources(): Observable<Resource[]> {
    const url = `${this.API_ENDPOINT}get_resources.php`;
    return this.httpClient.get<Resource[]>(url).pipe(map(data => data));
  }

  // Load resources
  getResources(): Observable<Resource[]> {
    const url = `${this.API_ENDPOINT}get_resources.php`;
    return this.httpClient.get<Resource[]>(url);
  }

  // Load all users
  loadUser(): Observable<User[]> {
    const url = `${this.API_ENDPOINT}view_users.php`;
    return this.httpClient.get<User[]>(url).pipe(map(data => data));
  }

  // Load single user details by ID
  loadUserInfo(userId: any): Observable<User> {
    const url = `${this.API_ENDPOINT}view_user.php?user_id=${userId}`;
    return this.httpClient.get<User>(url).pipe(map(data => data));
  }

  // Create new users
  createUser(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}create_user.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Update user details
  updateUserDetails(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}update_user.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Delete a user by ID
  deleteUser(userId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete_user.php?user_id=${userId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

    // Load single center details by ID
    loadCenterInfo(centerId: any): Observable<Center> {
      const url = `${this.API_ENDPOINT}view_center.php?center_id=${centerId}`;
      return this.httpClient.get<Center>(url).pipe(map(data => data));
    }

    loadCenters(): Observable<Center[]> {
      const url = `${this.API_ENDPOINT}view_all_centers.php`;
      return this.httpClient.get<{ result: string; centers: Center[] }>(url).pipe(
        map((response) => {
          if (response.result === 'success') {
            return response.centers;
          } else {
            throw new Error('Failed to fetch centers');
          }
        }),
        catchError((error) => {
          console.error('Error fetching centers:', error);
          return throwError(() => new Error('Failed to fetch centers'));
        })
      );
    }
    
  
    // Create new center
    createCenter(data: any): Observable<HttpResponse> {
      const url = `${this.API_ENDPOINT}create_center.php`;
      return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
    }
  
    // Update center details
    updateCenterDetails(data: any): Observable<HttpResponse> {
      const url = `${this.API_ENDPOINT}update_center.php`;
      return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
    }

    // Delete a user by ID
  deleteCenter(centerId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete_center.php?user_id=${centerId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  login(loginData: { user_email: string; user_password: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Format the body in application/x-www-form-urlencoded style
    const body = new URLSearchParams();
    body.set('user_email', loginData.user_email);
    body.set('user_password', loginData.user_password);

    console.log("Sending login request with:", body.toString());

    return this.httpClient.post<LoginResponse>(this.LOGIN_URL, body.toString(), { headers })
      .pipe(
        map((data: LoginResponse) => {
          // Check if the response contains a successful result
          if (data.result === 'success') {
            // Store the user, token, and role in localStorage
            localStorage.setItem('DisasterAppUser', JSON.stringify(data.user));
            localStorage.setItem('DisasterAppToken', data.token);
            localStorage.setItem('DisasterAppRole', data.role);
            console.log('User logged in:', data.user);
            console.log('Role:', data.role);
            return data;
          } else {
            // Handle the case when login fails
            console.error('Login failed:', data.message);
            throw new Error(data.message || 'Login failed');
          }
        })
      );
  }

  // Load single resource details by ID
  loadRequestInfo(requestId: any): Observable<UserRequest> {
    const url = `${this.API_ENDPOINT}view_single_request.php?request_id=${requestId}`;
    return this.httpClient.get<UserRequest>(url).pipe(map(data => data));
  }

  // Load all user requests
  loadUserRequests(): Observable<UserRequest[]> {
    const url = `${this.API_ENDPOINT}view_requests.php`;
    return this.httpClient.get<UserRequest[]>(url).pipe(map(data => data));
  }

  createRequest(payload: any): Observable<any> {
    return this.httpClient.post(`${this.API_ENDPOINT}create_request.php`, payload, {
      headers: new HttpHeaders()
    });
  }

  updateRequest(payload: any): Observable<any> {
    return this.httpClient.put(`${this.API_ENDPOINT}update_request.php`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateRequestStatus(requestId: number, newStatus: string, requestedQuantity: number): Observable<any> {
    const url = `${this.API_ENDPOINT}/update_request_status.php`;
    const body = {
      request_id: requestId,
      request_status: newStatus,
      requested_quantity: requestedQuantity,
    };
  
    return this.httpClient.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to update request status.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 404) {
          errorMessage = 'Request not found.';
        } else if (error.status === 400) {
          errorMessage = 'Bad request. Please check your input.';
        }
        console.error('Error updating request status:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  

  viewSpecificUserStatus(userId: number): Observable<UserRequest[]> {
    const url = `${this.API_ENDPOINT}view_specific_user_request.php?user_id=${encodeURIComponent(userId)}`;
    return this.httpClient.get<UserRequest[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user request:', error.message);
        const errorMessage = error.error?.message || 'Failed to fetch user request';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserIdByEmail(email: string): Observable<UserIdResponse> {
    const url = `${this.API_ENDPOINT}get_user_id.php?email=${email}`;
    return this.httpClient.get<UserIdResponse>(url).pipe(map(data => data));
  }

  // Delete a user resource by ID
  deleteRequest(requestId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete_user_request.php?request_id=${requestId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  // Delete a user message by ID
  deleteMessage(requestId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete_message.php?request_id=${requestId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  // Load all chat
  loadChatMessages(): Observable<Message[]> {
    const url = `${this.API_ENDPOINT}view_chat_messages.php`;
    return this.httpClient.get<Message[]>(url).pipe(map(data => data));
  }

  createMessage(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}create_message.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  updateMessage(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}update_message.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  loadMessageInfo(messageId: any): Observable<Message> {
    const url = `${this.API_ENDPOINT}view_message.php?id=${messageId}`;
    return this.httpClient.get<Message>(url).pipe(map(data => data));
  }

  // Load all donations
  loadDonation(): Observable<Donation[]> {
    const url = `${this.API_ENDPOINT}view_donation.php`;
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        if (response.result === 'success' && Array.isArray(response.data)) {
          return response.data as Donation[];
        } else {
          throw new Error(response.message || 'Failed to load donations');
        }
      })
    );
  }

  createDonation(data: any): Observable<any> {
    const url = `${this.API_ENDPOINT}create_donation.php`;

    return this.httpClient.post<any>(url, data).pipe(
      map(response => {
        // Check if the response is successful
        if (response.result === 'success') {
          return response;  // return the success response
        } else {
          throw new Error(response.message || 'Failed to create donation');
        }
      }),
      catchError(error => {
        // Log the error and rethrow it
        console.error('Error during donation creation:', error);
        return throwError(() => new Error(error.message || 'Unknown error occurred'));
      })
    );
  }

  // Load single donation details by ID
  loadDonationInfo(donationId: number): Observable<Donation> {
    const url = `${this.API_ENDPOINT}view_one_donation.php?donation_id=${donationId}`;
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        if (response.result === 'success') {
          return response.data as Donation;
        } else {
          throw new Error(response.message || 'Donation not found');
        }
      })
    );
  }

  // Update donation details
  updateDonationDetails(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}update_donation.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Delete a donation by ID
  deleteDonation(donationId: number): Observable<any> {
    const url = `${this.API_ENDPOINT}delete_donation.php?donation_id=${donationId}`;
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        if (response.result === 'success') {
          return response;
        } else {
          throw new Error(response.message || 'Failed to delete donation');
        }
      })
    );
  }

  // Create a new tracking record when a request is approved
  createTracking(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}create_tracking.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // Updated CRUD Service returning status and data
  loadTracking(): Observable<{ status: string; data: Tracking[] }> {
    const url = `${this.API_ENDPOINT}view_status.php`;
    return this.httpClient.get<{ status: string; data: Tracking[] }>(url).pipe(
      catchError(this.handleError)
    );
  }

  loadTrackingInfo(trackingId: number): Observable<Tracking> {
    const url = `${this.API_ENDPOINT}view_status.php?tracking_id=${trackingId}`;
    return this.httpClient.get<{ status: string; data: Tracking }>(url).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Update tracking status
  updateTrackingStatus(trackingId: number, trackingStatus: string, remarks: string): Observable<any> {
    const url = `${this.API_ENDPOINT}update_tracking_status.php`;
    const payload = { tracking_id: trackingId, tracking_status: trackingStatus, remarks: remarks };

    return this.httpClient.post<any>(url, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(err => {
        console.error('Update Tracking Status Error:', err);
        return throwError(() => new Error('Failed to update tracking status.'));
      })
    );
  }

  createAlert(payload: any): Observable<any> {
    return this.httpClient.post(`${this.API_ENDPOINT}create_alert.php`, payload, {
      headers: new HttpHeaders()
    });
  }
  
    // Handle errors
    private handleError(error: any): Observable<never> {
      console.error('HTTP error', error);
      return throwError(() => new Error('An error occurred while processing your request.'));
    }
  
  // Update resource details
  updateAlert(data: any): Observable<any> {
    const url = `${this.API_ENDPOINT}update_alert.php`;
    return this.httpClient.post<any>(url, data);
  }
  
  // Load single resource details by ID
  loadAlertInfo(alertId: any): Observable<Alert> {
    const url = `${this.API_ENDPOINT}view_one_alert.php?alert_id=${alertId}`; 
    return this.httpClient.get<Alert>(url);
  }
  

  // Method to fetch all alerts
  getAlerts(): Observable<Alert[]> {
    const url = `${this.API_ENDPOINT}view_alerts.php`;
    return this.httpClient.get<Alert[]>(url);
  }
  

  // Delete a resource by ID
  deleteAlert(alertId: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}delete_alert.php?id=${alertId}`;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  createTask(taskData: string): Observable<any> {
    const url = `${this.API_ENDPOINT}create_task.php`;
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  
    return this.httpClient.post<any>(url, taskData, httpOptions);
  }
  
  updateTaskDetails(taskData: string): Observable<any> {
    const url = `${this.API_ENDPOINT}update_task.php`;
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
  
    return this.httpClient.post<any>(url, taskData, httpOptions);
  }
  
  loadTaskInfo(taskId: any): Observable<any> {
    const url = `${this.API_ENDPOINT}get_task.php?taskId=${taskId}`;
    return this.httpClient.get<any>(url);
  }
    // Load all tasks
    loadTasks(): Observable<Task[]> {
      const url = `${this.API_ENDPOINT}view_tasks.php`;
      return this.httpClient.get<Task[]>(url).pipe(
        map((data) => data),
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching tasks:', error.message);
          return throwError(() => new Error('Failed to fetch tasks'));
        })
      );
    }

    deleteTask(taskId: any): Observable<HttpResponse> {
      const url = `${this.API_ENDPOINT}delete_task.php?id=${taskId}`;
      return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
    }

// Update task status and volunteer statuses
updateTaskStatus(taskId: any, status: string): Observable<any> {
  const url = `${this.API_ENDPOINT}update_task_status.php`;

  // Prepare the payload with task_id and task_status
  const payload = new FormData();
  payload.append('task_id', taskId);
  payload.append('task_status', status);

  return this.httpClient
    .post<any>(url, payload) // POST request to PHP endpoint
    .pipe(
      map((response) => {
        // Handle the response
        if (response.message) {
          console.log('Task status updated successfully:', response.message);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating task status:', error.message);
        return throwError(() => new Error('Failed to update task status'));
      })
    );
}


updateVolunteerStatus(taskId: number, status: string): Observable<any> {
  const url = `${this.API_ENDPOINT}update_volunteer_status.php`;

  const user = this.authService.getUser();
  const userId = user?.user_id;

  const payload = new FormData();
  payload.append('task_id', taskId.toString());
  payload.append('user_id', userId?.toString() || ''); 
  payload.append('volunteer_status', status);

  return this.httpClient.post<any>(url, payload);
}

  // Fetch tasks accepted by a specific user
  fetchAcceptedTasks(userId: number): Observable<Task[]> {
    const url = `${this.API_ENDPOINT}get_accepted_tasks.php?user_id=${userId}`;
    return this.httpClient.get<Task[]>(url).pipe(
      map((response: Task[]) => response),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching accepted tasks:', error.message);
        return throwError(() => new Error('Failed to fetch accepted tasks'));
      })
    );
  }
  
}