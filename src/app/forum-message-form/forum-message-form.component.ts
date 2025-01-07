import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDService } from '../crud/services/crud.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Message } from '../models/message';
declare const Swal: any;

@Component({
  selector: 'app-forum-message-form',
  standalone: true,
  templateUrl: './forum-message-form.component.html',
  styleUrls: ['./forum-message-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule] // Add CommonModule to imports
})
export class ForumMessageFormComponent implements OnInit {
  messageForm!: FormGroup;
  messageId: any;
  buttonText = 'Create Message';
  userId: number | null = null; // Ensure this matches the type from AuthService
  messages: Message[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private crudService: CRUDService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser()?.user_id || null; // Get the logged-in user ID
    this.createMessageForm();
    this.loadMessages();

    this.messageId = this.activatedRoute.snapshot.params['messageId'];
    if (this.messageId) {
      this.loadMessageDetails(this.messageId);
      this.buttonText = 'Update Message';
    }
  }

  loadMessages(): void {
    this.crudService.loadChatMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.scrollToBottom();  // Scroll to the bottom after messages are loaded
      },
      error: () => Swal.fire('Error', 'Failed to load messages.', 'error')
    });
  }
  
  createMessageForm(): void {
    this.messageForm = this.formBuilder.group({
      user_id: [{ value: this.userId, disabled: true }, Validators.required], // Set user_id as readonly
      message_content: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(500)]
      ]
    });
  }
  scrollToBottom(): void {
    const chatList = document.querySelector('.chat-list');
    if (chatList) {
      chatList.scrollTop = chatList.scrollHeight; // Scroll to the bottom of the chat
    }
  }
  
  
  createOrUpdateMessage(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    const values = this.messageForm.getRawValue(); // Get all form values, including disabled fields
    formData.append('user_id', values.user_id);
    formData.append('message_content', values.message_content);
  
    if (this.messageId) {
      formData.append('message_id', this.messageId);
      this.crudService.updateMessage(formData).subscribe({
        next: (res) => {
          this.handleResponse(res, 'Message Updated!');
          this.scrollToBottom();  // Scroll to the bottom after updating message
        },
        error: () => Swal.fire('Error', 'Failed to update the message.', 'error')
      });
    } else {
      this.crudService.createMessage(formData).subscribe({
        next: (res) => {
          this.handleResponse(res, 'Message Created!');
          this.loadMessages(); // Reload the messages
  
          // Reset the form after message creation is successful
          this.messageForm.reset({
            user_id: this.authService.getUser().user_id, // Keep user ID after reset
            message_content: '' // Clear message content field
          });
  
          this.scrollToBottom();  // Scroll to the bottom after new message
        },
        error: () => Swal.fire('Error', 'Failed to create the message.', 'error')
      });
    }
  }
  
  
  
  loadMessageDetails(messageId: any): void {
    this.crudService.loadMessageInfo(messageId).subscribe((res) => {
      this.messageForm.patchValue({
        user_id: res.user_id,
        message_content: res.message_content
      });
    });
  }

  handleResponse(res: any, message: string): void {
    if (res.result === 'success') {
      this.router.navigate(['/forum/message-list']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire('Error', res.message || 'An unexpected error occurred.', 'error');
    }
  }
}
