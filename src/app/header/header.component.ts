import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userId: number | null = null; 
  userName: string | null = null;
  adminName: string | null = null;
  centerName: string | null = null; 
  userRole: 'admin' | 'user' | null = null;
  searchQuery: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.user_id || null; // Assign the userId here
      this.userName = user.user_name || null;
      this.adminName = user.admin_name || null;
      this.centerName = user.center_name || null;
      this.userRole = this.authService.getRole() as 'admin' | 'user';
      console.log('User data loaded:', {
        userId: this.userId,
        userName: this.userName,
        adminName: this.adminName,
        centerName: this.centerName,
        userRole: this.userRole,
      });
    } else {
      console.warn('No user data found in localStorage.');
    }
  }

  navigateToRequestForm(): void {
    if (this.userRole === 'user') {
      this.router.navigate(['/crud/request-resource']);
    } else if (this.centerName) {
      this.router.navigate(['/crud/c-request-form']);
    } else {
      Swal.fire('Error', 'Please Log in and try again', 'error');
    }
  }

  navigateToDonationForm(): void {
    if (this.userRole === 'user') {
      this.router.navigate(['/crud/donation-form']);
    } else if (this.centerName) {
      this.router.navigate(['/crud/c-donation-form']);
    } else {
      Swal.fire('Error', 'Please log in and try again', 'error');
    }
  }


  onLogout(): void {
    this.authService.logout();
    this.userId = null; // Reset userId on logout
    this.userName = null;
    this.adminName = null;
    this.centerName = null; // Reset centerName on logout
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    console.log('Search query:', this.searchQuery);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Check if user is not logged in and is a guest
  isGuest(): boolean {
    return !this.isLoggedIn();
  }
}
