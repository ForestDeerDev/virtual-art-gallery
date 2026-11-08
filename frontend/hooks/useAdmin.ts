import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminApi from "@/api/admin";
import artworkApi from "@/api/artwork";
import { normalizeTaggable } from "@/utils/normalize";
import type {
  AdminStats,
  Artwork,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  BatchUpdateRequest,
  PageResponse,
  UserManagement,
  UserRole,
} from "@/types";

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers() {
  return useQuery<UserManagement[]>({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.getAllUsers(),
  });
}

export function useAdminArtworks(pageSize = 100, featured?: boolean) {
  return useQuery<PageResponse<Artwork>>({
    queryKey: ["admin", "artworks", pageSize, featured],
    queryFn: async () => {
      const artworkListResponse = await artworkApi.getArtworks({
        page: 0,
        pageSize,
        sortBy: "latest",
        ...(featured === undefined ? {} : { featured }),
      });
      return {
        ...artworkListResponse,
        data: artworkListResponse.data.map(normalizeTaggable),
      };
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

function useInvalidateArtworks() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "artworks"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["artworks"] });
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
  };
}

export function useCreateArtwork() {
  const invalidateArtworks = useInvalidateArtworks();
  return useMutation({
    mutationFn: (artworkData: ArtworkCreateRequest) =>
      artworkApi.createArtwork(artworkData),
    onSuccess: () => invalidateArtworks(),
  });
}

export function useUpdateArtwork() {
  const invalidateArtworks = useInvalidateArtworks();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArtworkUpdateRequest }) =>
      artworkApi.updateArtwork(id, data),
    onSuccess: () => invalidateArtworks(),
  });
}

export function useDeleteArtwork() {
  const invalidateArtworks = useInvalidateArtworks();
  return useMutation({
    mutationFn: (artworkId: number) => artworkApi.deleteArtwork(artworkId),
    onSuccess: () => invalidateArtworks(),
  });
}

export function useBatchDeleteArtworks() {
  const invalidateArtworks = useInvalidateArtworks();
  return useMutation({
    mutationFn: (ids: number[]) => artworkApi.batchDeleteArtworks({ ids }),
    onSuccess: () => invalidateArtworks(),
  });
}

export function useBatchUpdateArtworks() {
  const invalidateArtworks = useInvalidateArtworks();
  return useMutation({
    mutationFn: (updates: BatchUpdateRequest["updates"]) =>
      artworkApi.batchUpdateArtworks({ updates }),
    onSuccess: () => invalidateArtworks(),
  });
}
