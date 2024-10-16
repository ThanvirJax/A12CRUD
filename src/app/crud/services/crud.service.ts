import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Resource } from '../../models/resource';
import { HttpResponse } from '../../models/http-response';
import { UserRequest } from '../../models/user-request';
import { User } from '../../models/user';
import { LoginResponse } from '../../models/login-response';
import { UserIdResponse } from '../../models/user-id-response';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  updateRequestDetails(formData: FormData) {
    throw new Error('Method not implemented.');
  }

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

  // Login function
  login(loginData: { user_email: string; user_password: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Format the body in application/x-www-form-urlencoded style
    const body = new URLSearchParams();
    body.set('user_email', loginData.user_email);
    body.set('user_password', loginData.user_password);

    return this.httpClient.post<LoginResponse>(this.LOGIN_URL, body.toString(), { headers }).pipe(map(data => data));
  }
 // Load single resource details by ID
 loadRequestInfo(requestId: any): Observable<UserRequest> {
  const url = `${this.API_ENDPOINT}view_user_request.php?request_id=${requestId}`;
  return this.httpClient.get<UserRequest>(url).pipe(map(data => data));
}
  
    // Load all user requests
    loadUserRequests(): Observable<UserRequest[]> {
      const url = `${this.API_ENDPOINT}view_user_requests.php`;
      return this.httpClient.get<UserRequest[]>(url).pipe(map(data => data));
    }
       // Create a new resource
       createRequest(data: any): Observable<HttpResponse> {
        const url = `${this.API_ENDPOINT}create_user_request.php`;
        return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
      }

        // Update resource details
  updateUserRequest(data: any): Observable<HttpResponse> {
    const url = `${this.API_ENDPOINT}update_request.php`;
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }
  
  getUserIdByEmail(email: string): Observable<UserIdResponse> {
    const url = `${this.API_ENDPOINT}get_user_id.php?email=${email}`;
    return this.httpClient.get<UserIdResponse>(url).pipe(map(data => data));
  }

    // Update resource details
    updateRequest(data: any): Observable<HttpResponse> {
      const url = `${this.API_ENDPOINT}update_request.php`;
      return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
    }
  

    // Delete a user resource by ID
    deleteRequest(requestId: any): Observable<HttpResponse> {
      const url = `${this.API_ENDPOINT}delete_user_request.php?request_id=${requestId}`;
      return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
    }
}
