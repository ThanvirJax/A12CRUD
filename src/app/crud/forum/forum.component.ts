import { Component, OnInit, OnDestroy } from '@angular/core';
import { CRUDService } from '../services/crud.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit, OnDestroy {
  forum: any[] = [];
  routerSubscription: Subscription;
  newReplyContent: { [key: number]: string } = {}; 

  constructor(private crudService: CRUDService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getForumMessages();
      }
    });
  }

  ngOnInit(): void {
    this.getForumMessages();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getForumMessages() {
    this.crudService.loadChatMessages().subscribe((res: any) => {
      this.forum = res.map((post: any) => ({
        ...post,
        replies: [], 
      }));
    });
  }

  addReply(postId: number) {
    const content = this.newReplyContent[postId];
    if (content && content.trim()) {
      const newReply = {
        user_id: 1, 
        message_content: content,
        message_created: new Date(),
      };
      const post = this.forum.find((p) => p.message_id === postId);
      if (post) {
        post.replies.push(newReply); 
        this.newReplyContent[postId] = ''; 
      }
    }
  }
}
