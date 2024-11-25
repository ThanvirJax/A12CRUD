import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  adminName: string | null = null;
  userRole: 'admin' | 'user' | null = null;
  searchQuery: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.user_name || null;
      this.adminName = user.admin_name || null;
      this.userRole = this.authService.getRole() as 'admin' | 'user';
      console.log('User data loaded:', { userName: this.userName, adminName: this.adminName, userRole: this.userRole });
    } else {
      console.warn('No user data found in localStorage.');
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.userName = null;
    this.adminName = null;
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  onSearch(event: Event): void {
    event.preventDefault(); 
    console.log('Search query:', this.searchQuery);
    // Add search logic if necessary
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
