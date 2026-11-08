import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import artworkApi from "@/api/artwork";
import interactionApi from "@/api/interaction";
import { normalizeTaggable } from "@/utils/normalize";
import { useIsAuthenticated } from "@/hooks/useAuth";
import type { Artwork, Comment, LikeStatus, LikeCountResponse } from "@/types";

export function useArtworkDetail(id: number) {
  return useQuery<Artwork>({
    queryKey: ["artwork", "detail", id],
    queryFn: async () => {
      const artwork = await artworkApi.getArtworkById(id);
      return normalizeTaggable(artwork);
    },
    enabled: !!id,
  });
}

export function useRelatedArtworks(
  category: string,
  excludeId: number,
  limit = 4,
) {
  return useQuery<Artwork[]>({
    queryKey: ["artwork", "related", category, excludeId, limit],
    queryFn: async () => {
      const artworkListResponse = await artworkApi.getArtworks({
        category,
        limit: 8,
      });
      return artworkListResponse.data
        .map(normalizeTaggable)
        .filter((item) => item.id !== excludeId)
        .slice(0, limit);
    },
    enabled: !!category,
  });
}

export function useLikeStatus(artworkId: number) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<LikeStatus>({
    queryKey: ["artwork", "like-status", artworkId, isAuthenticated],
    queryFn: async () => {
      const likeCountResponse = await interactionApi.getLikeCount(artworkId);
      if (!isAuthenticated) {
        return { likeCount: likeCountResponse.likeCount, isLiked: false };
      }
      const likeStatus = await interactionApi.checkLikeStatus(artworkId);
      return {
        likeCount: likeCountResponse.likeCount,
        isLiked: likeStatus.isLiked,
      };
    },
    enabled: !!artworkId,
  });
}

export function useToggleLike(artworkId: number) {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();
  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        return interactionApi.unlikeArtwork(artworkId);
      }
      return interactionApi.likeArtwork(artworkId);
    },
    onSuccess: (data, variables) => {
      const key = [
        "artwork",
        "like-status",
        artworkId,
        isAuthenticated,
      ] as const;
      const wasLiked = variables;
      const likeCount = (data as LikeCountResponse | null)?.likeCount ?? 0;
      queryClient.setQueryData<LikeStatus>(key, {
        isLiked: !wasLiked,
        likeCount,
      });
    },
  });
}

export function useComments(artworkId: number) {
  return useQuery<Comment[]>({
    queryKey: ["artwork", "comments", artworkId],
    queryFn: async () => {
      const topLevel = await interactionApi.getTopLevelComments(artworkId);
      const withReplies = await Promise.all(
        topLevel.map(async (comment) => {
          try {
            const replies = await interactionApi.getReplies(comment.id);
            return { ...comment, replies };
          } catch {
            return { ...comment, replies: [] };
          }
        }),
      );
      return withReplies;
    },
    enabled: !!artworkId,
  });
}

export function useCreateComment(artworkId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: number;
    }) =>
      interactionApi.createComment(artworkId, {
        content: content.trim(),
        parentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artwork", "comments", artworkId],
      });
    },
  });
}

export function useDeleteComment(artworkId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => interactionApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artwork", "comments", artworkId],
      });
    },
  });
}
