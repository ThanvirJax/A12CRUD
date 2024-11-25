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
import { ChatMessage } from '../../models/message';
import { Donation } from '../../models/donation';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  private readonly API_ENDPOINT = environment.API_EndPoint;
  private readonly LOGIN_URL = `${this.API_ENDPOINT}login.php`;

  constructor(private httpClient: HttpClient) { }

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
    const url = `${this.API_ENDPOINT}get_resources.php`; // Adjust with actual endpoint
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
    const url = `${this.API_ENDPOINT}view_user.php?id=${userId}`;
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

// Update request status
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
      console.error('Error updating request status:', error);
      return throwError(() => new Error('Failed to update request status.'));
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
  loadChatMessages(): Observable<ChatMessage[]> {
    const url = `${this.API_ENDPOINT}view_chat_messages.php`;
    return this.httpClient.get<ChatMessage[]>(url).pipe(map(data => data));
  }

  createMessage(newMessage: ChatMessage): Observable<ChatMessage> {
    // Retrieve the logged-in user's data from localStorage
    const user = localStorage.getItem('DisasterAppUser');

    if (!user) {
      return throwError(() => new Error('User not logged in'));
    }

    const parsedUser = JSON.parse(user);

    // Ensure the user data has the expected structure
    const userEmail = parsedUser.email;
    const userName = parsedUser.user_name || 'Anonymous';  // Provide a fallback name
    const role = parsedUser.role;

    if (!userEmail) {
      return throwError(() => new Error('User email is missing'));
    }

    const data = {
      user_email: userEmail,
      user_name: userName,
      role: role,
      message_content: newMessage.message_content,
    };

    const url = `${this.API_ENDPOINT}create_message.php`;

    // Send data with user_email, user_name, role, and message_content
    return this.httpClient.post<ChatMessage>(url, data).pipe(
      catchError(error => {
        console.error('Error sending message:', error);
        return throwError(() => new Error('Error sending message: ' + error.message));
      })
    );
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
          throw new Error(response.message || 'Failed to create donation');  // throw an error if not success
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
}