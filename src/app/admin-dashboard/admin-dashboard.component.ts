import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    userName: string | null = null;
    adminName: string | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      const user = this.authService.getUser();
      this.userName = user ? user.user_name : null;
      this.adminName = user ? user.admin_name : null;
    }
  
    isAdmin(): boolean {
      return this.authService.isAdmin();
    }
}
