import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Resource } from '../../models/resource';
import { HttpResponse } from '../../models/http-response';
import { UserRequest } from '../../models/user-request';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class CRUDService {

  constructor(private httpClient: HttpClient) { }

  // Load all resources
  loadResources(): Observable<Resource[]> {
    const url = environment.API_EndPoint + 'view.php';
    return this.httpClient.get<Resource[]>(url).pipe(map(data => data));
  }

  // Create a new resource
  createResource(data: any): Observable<HttpResponse> {
    const url = environment.API_EndPoint + 'create.php';
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Load single resource details by ID
  loadResourceInfo(resourceId: any): Observable<Resource> {
    const url = environment.API_EndPoint + 'view_one.php?id=' + resourceId;
    return this.httpClient.get<Resource>(url).pipe(map(data => data));
  }

  // Update resource details
  updateResourceDetails(data: any): Observable<HttpResponse> {
    const url = environment.API_EndPoint + 'update.php';
    return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
  }

  // Delete a resource by ID
  deleteResource(resourceId: any): Observable<HttpResponse> {
    const url = environment.API_EndPoint + 'delete.php?id=' + resourceId;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

    // Create a new user request
    createRequest(data: any): Observable<HttpResponse> {
      const url = environment.API_EndPoint + 'create_user_request.php'; 
      return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
    }
  
    // Load all user requests
    loadUserRequests(): Observable<UserRequest[]> {
      const url = environment.API_EndPoint + 'view_user_requests.php'; 
      return this.httpClient.get<UserRequest[]>(url).pipe(map(data => data));
    }

      // Delete a user resource by ID
  deleteRequest(requestId: any): Observable<HttpResponse> {
    const url = environment.API_EndPoint + 'delete_user_request.php?request_id=' + requestId;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }

  // Load all user 
  loadUser(): Observable<User[]> {
    const url = environment.API_EndPoint + 'view_users.php'; 
    return this.httpClient.get<User[]>(url).pipe(map(data => data));
  }
  
    // Create a new users
    createUser(data: any): Observable<HttpResponse> {
      const url = environment.API_EndPoint + 'create_user.php';
      return this.httpClient.post<HttpResponse>(url, data).pipe(map(data => data));
    }

  // Delete a user User by ID
  deleteUser(UserId: any): Observable<HttpResponse> {
    const url = environment.API_EndPoint + 'delete_user.php?user_id=' + UserId;
    return this.httpClient.get<HttpResponse>(url).pipe(map(data => data));
  }


}
