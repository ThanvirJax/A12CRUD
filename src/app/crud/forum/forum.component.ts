import { Component, OnInit, OnDestroy } from '@angular/core';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';  // Import AuthService
import { ChatMessage } from '../../models/message';  // Import ChatMessage model

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit, OnDestroy {
  forum: ChatMessage[] = [];  // Use the ChatMessage type here
  routerSubscription: Subscription;
  newMessageContent: string = '';  // Store the new message content
  userLoggedIn: boolean = false;  // Track if user is logged in

  constructor(
    private crudService: CRUDService,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getForumMessages();
      }
    });
  }

  ngOnInit(): void {
    this.getForumMessages();
    this.checkUserLoginStatus();  // Check login status on initialization
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getForumMessages() {
    // Load messages from the backend
    this.crudService.loadChatMessages().subscribe(
      (res: ChatMessage[]) => {
        this.forum = res;  // Assuming the response is an array of ChatMessage
      },
      (error) => {
        console.error('Error loading messages:', error);
        alert('Error loading forum messages.');
      }
    );
  }

  checkUserLoginStatus() {
    // Check if user is logged in via AuthService
    this.userLoggedIn = this.authService.isLoggedIn();
  }

  addMessage(): void {
    if (!this.authService.isLoggedIn()) {
      console.error('User is not logged in.');
      alert('Please log in to send a message.');
      return;  // Exit early if the user is not logged in
    }
  
    if (this.newMessageContent.trim()) {
      const user = this.authService.getUser();
      console.log('Current User:', user);  // Log user for inspection
  
      if (user && user.email) {
        const userEmail = user.email;
        const userName = user.user_name || 'Anonymous';
  
        const newMessage: ChatMessage = {
          user_email: userEmail,
          user_name: userName,
          message_content: this.newMessageContent,
          message_created: new Date().toISOString(),
        };
  
        this.crudService.createMessage(newMessage).subscribe(
          (res: ChatMessage) => {
            this.forum.push(res);  // Add the new message to the forum
            this.newMessageContent = '';  // Clear input after sending message
          },
          (error) => {
            console.error('Error sending message:', error);
            alert('There was an error sending your message.');
          }
        );
      } else {
        console.error('User email is not available.');
        alert('User is not logged in. Please log in to send messages.');
      }
    }
  }
  
}  
