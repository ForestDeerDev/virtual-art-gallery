import request from "@/utils/request";
import type {
  Comment,
  CommentCreateRequest,
  LikeStatus,
  LikeCountResponse,
  CommentCountResponse,
} from "@/types";

const interactionApi = {
  likeArtwork(artworkId: number): Promise<LikeStatus> {
    return request<LikeStatus>({
      url: `/interactions/artworks/${artworkId}/like`,
      method: "post",
    });
  },

  unlikeArtwork(artworkId: number): Promise<void> {
    return request<void>({
      url: `/interactions/artworks/${artworkId}/like`,
      method: "delete",
    });
  },

  checkLikeStatus(artworkId: number): Promise<LikeStatus> {
    return request<LikeStatus>({
      url: `/interactions/artworks/${artworkId}/like/status`,
      method: "get",
    });
  },

  getLikeCount(artworkId: number): Promise<LikeCountResponse> {
    return request<LikeCountResponse>({
      url: `/interactions/artworks/${artworkId}/like/count`,
      method: "get",
    });
  },

  createComment(
    artworkId: number,
    commentData: CommentCreateRequest,
  ): Promise<Comment> {
    return request<Comment>({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: "post",
      data: commentData,
    });
  },

  getTopLevelComments(artworkId: number): Promise<Comment[]> {
    return request<Comment[]>({
      url: `/interactions/artworks/${artworkId}/comments`,
      method: "get",
    });
  },

  getReplies(commentId: number): Promise<Comment[]> {
    return request<Comment[]>({
      url: `/interactions/comments/${commentId}/replies`,
      method: "get",
    });
  },

  deleteComment(commentId: number): Promise<void> {
    return request<void>({
      url: `/interactions/comments/${commentId}`,
      method: "delete",
    });
  },

  getCommentCount(artworkId: number): Promise<CommentCountResponse> {
    return request<CommentCountResponse>({
      url: `/interactions/artworks/${artworkId}/comments/count`,
      method: "get",
    });
  },
};

export default interactionApi;
