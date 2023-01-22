import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  @Output() newCommentContent = new EventEmitter<string>();
  @Input() stateOfTextarea: boolean = true;

  constructor() {}

  ngOnInit(): void {}
  commentContent = '';

  sendInfo(value: string): void {
    if (this.commentContent.length > 0) {
      this.newCommentContent.emit(value);
      this.commentContent = '';
    }
  }
}
