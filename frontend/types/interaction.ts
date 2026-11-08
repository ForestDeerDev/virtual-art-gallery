import type { User } from "./user";

export interface Comment {
  id: number;
  user: User;
  content: string;
  parentId?: number;
  createTime: string;
  replies?: Comment[];
  replyCount?: number;
}

export interface CommentCreateRequest {
  content: string;
  parentId?: number;
}

export interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

export interface LikeCountResponse {
  likeCount: number;
}

export interface CommentCountResponse {
  count: number;
}
