import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'DisasterAppUser';
  private tokenKey = 'DisasterAppToken';

  login(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    // Optionally store a token if available
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
    }
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
