import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import * as moment from 'moment';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.css'],
})
export class UserCommentComponent implements OnInit {
  @Input() comment!: Comment;
  formattedDate: any;
  constructor() {}

  ngOnInit(): void {
    this.formattedDate = moment(this.comment.createdAt?.seconds).fromNow();
  }
}
