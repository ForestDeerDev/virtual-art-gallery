import request from '@/utils/request'
import type {
  Comment,
  CommentCreateRequest,
  LikeStatus,
  LikeCountResponse,
  CommentCountResponse
} from '@/types'

export default {
  // 点赞作品
  likeArtwork(artworkId: number): Promise<LikeStatus> {
    return request<LikeStatus>({
      url: `/interactions/artworks/${artworkId}/like`,
      method: 'post'
    })
  },

  // 取消点赞作品
  unlikeArtwork(artworkId: number): Promise<void> {
    return request<void>({
      url: `/interactions/artworks/${artworkId}/like`,
      method: 'delete'
    })
  },

  // 检查用户是否已点赞作品
  checkLikeStatus(artworkId: number): Promise<LikeStatus> {
    return request<LikeStatus>({
      url: `/interactions/artworks/${artworkId}/like/status`,
      method: 'get'
    })
  },

  // 获取作品点赞数量
  getLikeCount(artworkId: number): Promise<LikeCountResponse> {
    return request<LikeCountResponse>({
      url: `/interactions/artworks/${artworkId}/like/count`,
      method: 'get'
    })
  },

  // 创建评论
  createComment(
    artworkId: number,
    commentData: CommentCreateRequest
  ): Promise<Comment> {
    return request<Comment>({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: 'post',
      data: commentData
    })
  },

  // 获取作品的顶层评论列表
  getTopLevelComments(artworkId: number): Promise<Comment[]> {
    return request<Comment[]>({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: 'get'
    })
  },

  // 获取评论的回复列表
  getReplies(commentId: number): Promise<Comment[]> {
    return request<Comment[]>({
      url: `/interactions/comments/${commentId}/replies`,
      method: 'get'
    })
  },

  // 删除评论
  deleteComment(commentId: number): Promise<void> {
    return request<void>({
      url: `/interactions/comments/${commentId}`,
      method: 'delete'
    })
  },

  // 获取作品评论数量
  getCommentCount(artworkId: number): Promise<CommentCountResponse> {
    return request<CommentCountResponse>({
      url: `/interactions/artworks/${artworkId}/comments/count`,
      method: 'get'
    })
  }
}
