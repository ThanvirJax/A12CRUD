import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { User } from '../../models/user';  
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetails: User | null = null; 

  constructor(private authService: AuthService) { }  

  ngOnInit(): void {
    this.loadUserDetails();  
  }

  loadUserDetails() {
    this.userDetails = this.authService.getUser();  
    if (!this.userDetails) {
      console.error('No logged-in user found!');
    }
  }
}
