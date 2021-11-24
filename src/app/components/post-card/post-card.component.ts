import { Component, OnInit, ViewChild } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @ViewChild('comment') comment!: any;

  constructor(private commentsService: CommentsService) {}

  comments$ = this.commentsService.temp();
  // comments$ = this.commentsService.comments$;
  noData$ = this.commentsService.noData;
  docsCount$ = this.commentsService.getCount();

  ngOnInit(): void {
    this.commentsService.getFirst();
  }

  addComment() {
    const commentText = this.comment.nativeElement.value.trim();
    if (!commentText) return;

    this.commentsService.addComment({
      addedBy: 'username',
      body: commentText,
      createdAt: { seconds: Date.now() },
    });

    this.comment.nativeElement.value = '';
    this.comment.nativeElement.blur();
  }

  loadMore() {
    this.commentsService.getAfter();
  }
}
