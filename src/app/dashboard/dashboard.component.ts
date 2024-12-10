import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = null;
  adminName: string | null = null;
  centerName: string | null = null;  // Store center name if user is a center
  userId: string | null = null;  // Store user ID

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user ? user.user_name : null;
    this.adminName = user ? user.admin_name : null;
    this.centerName = user && user.center_name ? user.center_name : null;  // Fetch center name
    this.userId = user ? user.user_id : null;  // Get the user ID for the edit profile button
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCenter(): boolean {
    return !!this.centerName;  // Return true if the user has a center name
  }

  // Method to navigate to the Edit Profile page
  editProfile(): void {
    if (this.userId) {
      this.router.navigate(['/crud/update-user', this.userId]);
    }
  }

  // Method to navigate to Request Resource page with userId as a route parameter
  requestResource(): void {
    const user = this.authService.getUser();
    if (user && user.user_id) {
      this.router.navigate(['/crud/request-resource', user.user_id]);  // Passing userId as a route parameter
    }
  }
}
