import type { User } from './user'

/**
 * 评论实体 - 匹配后端 CommentDTO
 */
export interface Comment {
  id: number
  user: User
  content: string
  parentId?: number
  createTime: string
  replies?: Comment[]
  replyCount?: number
}

/**
 * 评论创建请求 - 匹配后端 CommentCreateRequest
 */
export interface CommentCreateRequest {
  content: string
  parentId?: number
}

/**
 * 点赞状态
 */
export interface LikeStatus {
  isLiked: boolean
  likeCount: number
}
