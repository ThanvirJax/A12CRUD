import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, FormsModule], // Add FormsModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  searchQuery: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserName();
  }

  private loadUserName(): void {
    const user = localStorage.getItem("DisasterAppUser");
    if (user) {
      try {
        this.userName = JSON.parse(user).user_name || null;
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }

  onLogout(): void {
    localStorage.removeItem("DisasterAppToken");
    localStorage.removeItem("DisasterAppUser");
    this.userName = null;
    this.router.navigate(['/login']);
  }

  onSearch(event: Event): void {
    event.preventDefault(); // Prevent default form submission behavior
    // Add your search logic here if needed
  }
  
}
