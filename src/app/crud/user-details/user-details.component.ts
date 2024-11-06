import { Component, OnInit } from '@angular/core';
import { CRUDService } from "../services/crud.service";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from '@angular/common';  
import { User } from '../../models/user';  

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetails: User | undefined; 

  constructor(private crudService: CRUDService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['userId'];  // Get user ID from route
    if (userId) {
      this.loadUserDetails(userId);  // Load user details
    }
  }
  
  loadUserDetails(UserId: string) {
    this.crudService.loadUserInfo(UserId).subscribe(
      (res: User) => {
        this.userDetails = res;
      },
      (error) => {
        console.error('Failed to load user details:', error);
      }
    );
  }
}

