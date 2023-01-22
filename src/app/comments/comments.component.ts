import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataInterface } from '../model/data-interface';

export interface Replying {
  value: string;
  index: number;
  replyingTo: string;
}

export interface Updating {
  value: string;
  commentIndex: number;
  replyIndex: number | undefined;
}

export interface CommentAndReplyIndexes {
  commentIndex: number | undefined;
  replyIndex: number | undefined;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() currentData!: DataInterface;
  @Output() deleteIndex = new EventEmitter<CommentAndReplyIndexes>();
  @Output() hideNewComment = new EventEmitter<boolean>();
  @Output() editedCommentContent = new EventEmitter<Updating>();
  @Output() replyingToEveryone = new EventEmitter<Replying>();
  @Output() increasingVotes = new EventEmitter<CommentAndReplyIndexes>();
  @Output() decreasingVotes = new EventEmitter<CommentAndReplyIndexes>();

  showModal = false;
  indexOfArea: number = -1;
  editorActive: boolean = false;
  replyingTo: string = '';
  showReplyArea: boolean = false;
  deleteItem: CommentAndReplyIndexes = {
    commentIndex: undefined,
    replyIndex: undefined,
  };

  constructor() {}

  ngOnInit(): void {}

  timeSince(date: number | undefined): string | void {
    const rightNow = Date.now();
    const interval = rightNow - (date as number);
    const minutes = Math.floor(interval / 60000);
    if (minutes === 0) {
      return `just now`;
    } else if (minutes >= 1 && minutes < 60) {
      return `${minutes} minute${minutes == 1 ? '' : 's'} ago`;
    } else if (minutes >= 60 && minutes < 1440) {
      return `${Math.floor(minutes / 60)} hour${
        Math.floor(minutes / 60) == 1 ? '' : 's'
      } ago`;
    } else if (minutes >= 1440 && minutes < 10080) {
      return `${Math.floor(minutes / 60 / 24)} day${
        Math.floor(minutes / 60 / 24) == 1 ? '' : 's'
      } ago`;
    } else if (minutes >= 10080 && minutes < 43800) {
      return `${Math.floor(minutes / 60 / 24 / 7)} week${
        Math.floor(minutes / 60 / 24 / 7) == 1 ? '' : 's'
      } ago`;
    } else if (minutes >= 43800) {
      return `${Math.floor(minutes / 60 / 24 / 7 / 4)} month${
        Math.floor(minutes / 60 / 24 / 7 / 4) == 1 ? '' : 's'
      } ago`;
    }
  }

  chooseOption(commentIndex: number, replyIndex: number | undefined): void {
    this.showModal = !this.showModal;
    this.deleteItem.commentIndex = commentIndex;
    this.deleteItem.replyIndex = replyIndex;
  }

  cancelOption(): void {
    this.showModal = !this.showModal;
    this.deleteItem.commentIndex, (this.deleteItem.replyIndex = undefined);
  }

  deleteOption(): void {
    this.deleteIndex.emit({
      commentIndex: this.deleteItem.commentIndex,
      replyIndex: this.deleteItem.replyIndex,
    });
    this.showModal = !this.showModal;
    this.deleteItem.commentIndex, (this.deleteItem.replyIndex = undefined);
  }

  showArea(event: MouseEvent): void {
    if (!this.editorActive) {
      this.editorActive = true;
      const element = (event.currentTarget as Element).closest('.main-content');
      element?.querySelector('.comment-body')?.classList.add('hide');
      element?.querySelector('.update1')?.classList.add('active');
      this.hideNewComment.emit(false);
    }
  }

  updateContent(
    event: MouseEvent,
    index: number,
    index2: number | undefined
  ): void {
    const newContent = (event.currentTarget as Element).closest(
      '.main-content'
    );
    const value = (newContent?.querySelector('textArea') as HTMLTextAreaElement)
      .value;
    if (value.length > 0) {
      const indexOfSpace: number = value.indexOf(' ') + 1;
      if (index2 === undefined) {
        this.editedCommentContent.emit({
          value: value,
          commentIndex: index,
          replyIndex: undefined,
        });
      } else {
        this.editedCommentContent.emit({
          value: value.slice(indexOfSpace),
          commentIndex: index,
          replyIndex: index2,
        });
      }
      this.editorActive = false;
      this.hideNewComment.emit(true);
      newContent?.querySelector('.comment-body')?.classList.remove('hide');
      newContent?.querySelector('.update1')?.classList.remove('active');
    }
  }

  replying(event: MouseEvent): void {
    if (!this.showReplyArea) {
      this.showReplyArea = true;
      const newReply = (event.currentTarget as Element).closest('.comment');
      newReply?.querySelector('.new-reply')?.classList.remove('hidden');
      this.hideNewComment.emit(false);
      this.replyingTo = (event.currentTarget as Element)
        ?.closest('.personal-details')
        ?.querySelector('.username')?.textContent as string;
    }
  }

  replyingToAll(event: MouseEvent, index: number): void {
    const target = event.currentTarget as Element;
    const value = (
      target
        ?.closest('.new-reply')
        ?.querySelector('textarea') as HTMLTextAreaElement
    ).value;
    if (value.length > 0) {
      this.replyingToEveryone.emit({
        value: value,
        index: index,
        replyingTo: this.replyingTo,
      });
      target?.closest('.new-reply')?.classList.add('hidden');
      (
        target
          .closest('.new-reply')!
          .querySelector('textarea') as HTMLTextAreaElement
      ).value = '';
      this.hideNewComment.emit(true);
      this.showReplyArea = false;
      this.replyingTo = '';
    }
  }

  increaseVotes(
    user: string,
    commentIndex: number,
    replyIndex: number | undefined
  ) {
    if (user !== this.currentData.currentUser.username) {
      this.increasingVotes.emit({
        commentIndex: commentIndex,
        replyIndex: replyIndex,
      });
    }
  }

  decreaseVotes(
    user: string,
    commentIndex: number,
    replyIndex: number | undefined
  ) {
    if (user !== this.currentData.currentUser.username) {
      this.decreasingVotes.emit({
        commentIndex: commentIndex,
        replyIndex: replyIndex,
      });
    }
  }

  changingOrder(user: string) {
    return {
      changeOrder:
        user === 'maxblagun' && localStorage.getItem('changeOrder') === 'true',
    };
  }
}
