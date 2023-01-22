import { Component } from '@angular/core';
import dataJSON from '../assets/data.json';
import { DataInterface } from './model/data-interface';
import {
  CommentAndReplyIndexes,
  Updating,
  Replying,
} from './comments/comments.component';

if (localStorage.getItem('data') === null) {
  localStorage.setItem('data', JSON.stringify(dataJSON));
}
if (localStorage.getItem('idCount') === null) {
  localStorage.setItem('idCount', '5');
}
if (localStorage.getItem('changeOrder') === null) {
  localStorage.setItem('changeOrder', 'false');
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'comments-ang';
  data: DataInterface = JSON.parse(localStorage.getItem('data') as string);
  idCount: number = +(localStorage.getItem('idCount') as string);
  textareaVisible: boolean = true;

  addComment(value: string) {
    this.data.comments.push({
      id: this.idCount,
      content: value,
      createdAt: '',
      score: 0,
      exactTime: Date.now(),
      user: this.data.currentUser,
    });
    localStorage.setItem('data', JSON.stringify(this.data));
    this.idCount++;
    localStorage.setItem('idCount', JSON.stringify(this.idCount));
  }

  deleteComment(deletingInfo: CommentAndReplyIndexes) {
    if (
      deletingInfo.replyIndex === undefined &&
      deletingInfo.commentIndex !== undefined
    ) {
      this.data.comments.splice(deletingInfo.commentIndex, 1);
    } else if (
      deletingInfo.commentIndex !== undefined &&
      deletingInfo.replyIndex !== undefined
    ) {
      this.data.comments[deletingInfo.commentIndex].replies!.splice(
        deletingInfo.replyIndex,
        1
      );
    }
    localStorage.setItem('data', JSON.stringify(this.data));
  }

  hidingNewComment(value: boolean) {
    this.textareaVisible = value;
  }

  editTheContent(updatedValues: Updating) {
    if (updatedValues.replyIndex === undefined) {
      this.data.comments[updatedValues.commentIndex].content =
        updatedValues.value;
    } else {
      this.data.comments[updatedValues.commentIndex].replies![
        updatedValues.replyIndex
      ]['content'] = updatedValues.value;
    }
    localStorage.setItem('data', JSON.stringify(this.data));
  }

  addToReplies(fullInfo: Replying) {
    this.data.comments[fullInfo.index].replies?.push({
      id: this.idCount,
      content: fullInfo.value,
      createdAt: '',
      score: 0,
      exactTime: Date.now(),
      replyingTo: fullInfo.replyingTo,
      user: this.data.currentUser,
    });
    localStorage.setItem('data', JSON.stringify(this.data));
    this.idCount++;
    localStorage.setItem('idCount', JSON.stringify(this.idCount));
  }
  increaseVotes(indexes: CommentAndReplyIndexes) {
    if (
      indexes.replyIndex === undefined &&
      indexes.commentIndex !== undefined
    ) {
      this.data.comments[indexes.commentIndex].score++;
      this.data.comments[0].score >= this.data.comments[1].score
        ? localStorage.setItem('changeOrder', 'false')
        : localStorage.setItem('changeOrder', 'true');
    } else if (
      indexes.replyIndex !== undefined &&
      indexes.commentIndex !== undefined
    ) {
      this.data.comments[indexes.commentIndex].replies![indexes.replyIndex]
        .score++;
    }
    localStorage.setItem('data', JSON.stringify(this.data));
  }
  decreaseVotes(indexes: CommentAndReplyIndexes) {
    if (
      indexes.replyIndex === undefined &&
      indexes.commentIndex !== undefined
    ) {
      if (this.data.comments[indexes.commentIndex].score !== 0) {
        this.data.comments[indexes.commentIndex].score--;
        this.data.comments[0].score >= this.data.comments[1].score
          ? localStorage.setItem('changeOrder', 'false')
          : localStorage.setItem('changeOrder', 'true');
      }
    } else if (
      indexes.replyIndex !== undefined &&
      indexes.commentIndex !== undefined
    ) {
      if (
        this.data.comments[indexes.commentIndex].replies![indexes.replyIndex]
          .score !== 0
      ) {
        this.data.comments[indexes.commentIndex].replies![indexes.replyIndex]
          .score--;
      }
    }
    localStorage.setItem('data', JSON.stringify(this.data));
  }
}
