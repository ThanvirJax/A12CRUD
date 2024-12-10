import { Component, OnInit, OnDestroy } from '@angular/core';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ChatMessage } from '../../models/message';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit, OnDestroy {
  forum: ChatMessage[] = [];
  routerSubscription: Subscription = new Subscription();
  newMessageContent: string = '';
  userLoggedIn: boolean = false;
  loading: boolean = false;
  errorMessage: string = ''; // For better user feedback

  constructor(
    private crudService: CRUDService,
    private router: Router,
    private authService: AuthService
  ) {
    // Update messages on route changes
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getForumMessages();
      }
    });
  }

  ngOnInit(): void {
    this.getForumMessages();
    this.checkUserLoginStatus();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Load forum messages from the API
  getForumMessages(): void {
    this.crudService.loadChatMessages().subscribe(
      (res: ChatMessage[]) => {
        this.forum = res; // Populate forum with messages
        this.errorMessage = ''; // Clear error message if successful
      },
      (error) => {
        console.error('Error loading messages:', error);
        this.errorMessage = 'Failed to load forum messages. Please try again later.'; // Set error message
      }
    );
  }

  // Check if the user is logged in
  checkUserLoginStatus(): void {
    this.userLoggedIn = this.authService.isLoggedIn();
  }

  addMessage(): void {
    if (!this.userLoggedIn) {
      alert('Please log in to send a message.');
      return;
    }
  
    // Check if the message is not empty
    if (this.newMessageContent.trim()) {
      if (this.newMessageContent.length > 255) {
        alert('Message too long. Limit to 255 characters.');
        return;
      }
  
      // Get the user details from AuthService
      const user = this.authService.getUser();
      console.log('User:', user);  // Log the user object
      
      if (user && user.user_id) {
        const newMessage: ChatMessage = {
          user_id: user.user_id, // Access the user_id from the user object
          message_content: this.newMessageContent.trim(),
        };
        
        this.loading = true; // Show loading spinner
        this.crudService.createMessage(newMessage).subscribe(
          (res: ChatMessage) => {
            this.forum.push(res); // Add the new message to the forum
            this.newMessageContent = ''; // Reset the input field
            this.loading = false; // Hide the loading spinner
          },
          (error) => {
            console.error('Error sending message:', error);
            this.errorMessage = 'Failed to send message. Try again.'; // Display error message
            this.loading = false; // Hide the loading spinner on error
          }
        );
      } else {
        alert('User identification failed. Please log in again.');
      }
    } else {
      alert('Message content cannot be empty.');
    }
  }
  
  
}
