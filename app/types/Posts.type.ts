export interface PostType {
  message: string;
  paginationInfo: PaginationInfo;
  posts: Post[];
}

export interface PaginationInfo {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}

export interface Post {
  _id: string;
  body?: string;
  image?: string;
  user: User;
  createdAt: string;
  comments: Comment[];
  id: string;
}

export interface User {
  _id: string;
  name: string;
  photo: string;
}

export interface Comment {
  _id: string;
  content?: string;
  commentCreator: CommentCreator;
  post: string;
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
}

export interface AddingPost {
  body: string;
  image: FileList | null;
}

export interface EditCommentInput {
  postId: string;
  commentId: string;
  content: string;
}
