interface CurrentUser {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  exactTime?: number;
  user: CurrentUser;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  exactTime?: number;
  user: CurrentUser;
  replies?: Array<Reply>;
}

export interface DataInterface {
  currentUser: CurrentUser;
  comments: Array<Comment>;
}
