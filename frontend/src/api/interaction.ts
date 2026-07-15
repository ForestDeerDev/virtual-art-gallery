import request from '@/utils/request'
import type {
  Comment,
  CommentCreateRequest,
  LikeStatus
} from '@/types'

export default {
  // 点赞作品
  likeArtwork(artworkId: number): Promise<LikeStatus> {
    return request({
      url: `/interactions/artworks/${artworkId}/like`,
      method: 'post'
    }) as Promise<LikeStatus>
  },

  // 取消点赞作品
  unlikeArtwork(artworkId: number): Promise<void> {
    return request({
      url: `/interactions/artworks/${artworkId}/like`,
      method: 'delete'
    })
  },

  // 检查用户是否已点赞作品
  checkLikeStatus(artworkId: number): Promise<LikeStatus> {
    return request({
      url: `/interactions/artworks/${artworkId}/like/status`,
      method: 'get'
    })
  },

  // 获取作品点赞数量
  getLikeCount(artworkId: number): Promise<{ likeCount: number }> {
    return request({
      url: `/interactions/artworks/${artworkId}/like/count`,
      method: 'get'
    })
  },

  // 创建评论
  createComment(
    artworkId: number,
    commentData: CommentCreateRequest
  ): Promise<Comment> {
    return request({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: 'post',
      data: commentData
    }) as Promise<Comment>
  },

  // 获取作品的顶层评论列表
  getTopLevelComments(artworkId: number): Promise<Comment[]> {
    return request({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: 'get'
    })
  },

  // 获取评论的回复列表
  getReplies(commentId: number): Promise<Comment[]> {
    return request({
      url: `/interactions/comments/${commentId}/replies`,
      method: 'get'
    })
  },

  // 删除评论
  deleteComment(commentId: number): Promise<void> {
    return request({
      url: `/interactions/comments/${commentId}`,
      method: 'delete'
    })
  },

  // 获取作品评论数量
  getCommentCount(artworkId: number): Promise<{ count: number }> {
    return request({
      url: `/interactions/artworks/${artworkId}/comments/count`,
      method: 'get'
    })
  }
}
