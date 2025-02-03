import { Injectable } from '@angular/core';
import { LoginResponse } from './models/login-response'; // Import the LoginResponse interface

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'DisasterAppUser';
  private tokenKey = 'DisasterAppToken';
  private roleKey = 'DisasterAppRole';

  // Update the login method to accept a typed LoginResponse
  login(response: LoginResponse): void {
    const { user, role, token } = response;

    // Store user, token, and role in localStorage
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);

    console.log('User logged in:', this.getUser());
    console.log('Login state:', this.isLoggedIn() ? 'Logged in' : 'Not logged in');
    console.log('Is Admin:', this.isAdmin());
    console.log('Is Center:', this.isCenter());
  }

  logout(): void {
    // On logout clear localStorage 
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    console.log('User logged out');
    console.log('Login state after logout:', this.isLoggedIn() ? 'Logged in' : 'Not logged in');
  }

  isLoggedIn(): boolean {
    const loggedIn = !!localStorage.getItem(this.userKey);
    console.log('Checking login state:', loggedIn ? 'Logged in' : 'Not logged in');
    return loggedIn;
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    const parsedUser = user ? JSON.parse(user) : undefined;  
    console.log('Retrieved user:', parsedUser);
    return parsedUser;
  }

  isAdmin(): boolean {
    const role = this.getRole();
    const isAdmin = role === 'admin';
    console.log('Checking if user is admin:', isAdmin);
    return isAdmin;
  }

  isCenter(): boolean {
    const role = this.getRole();
    const isCenter = role === 'center';
    console.log('Checking if user is center:', isCenter);
    return isCenter;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved token:', token);  // to check if logged in 
    return token;
  }

  // Add additional method to check if user is an admin or user
  getRole(): string | null {
    const role = localStorage.getItem(this.roleKey);
    console.log('User role:', role); // Check role after login
    return role;
  }
}
