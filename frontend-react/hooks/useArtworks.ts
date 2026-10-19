import { useQuery } from "@tanstack/react-query";
import artworkApi from "@/api/artwork";
import type { Artwork, CategoryStats } from "@/types";

export function useFeaturedArtworks(limit = 12) {
  return useQuery<Artwork[]>({
    queryKey: ["artworks", "featured", limit],
    queryFn: async () => {
      const artworkListResponse = await artworkApi.getArtworks({
        featured: true,
        page: 0,
        pageSize: limit,
      });
      return artworkListResponse.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryStats() {
  return useQuery<CategoryStats[]>({
    queryKey: ["artworks", "category-stats"],
    queryFn: () => artworkApi.getCategoryStats(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryThumbnails(pageSize = 50) {
  return useQuery<Artwork[]>({
    queryKey: ["artworks", "category-thumbnails", pageSize],
    queryFn: async () => {
      const artworkListResponse = await artworkApi.getArtworks({
        page: 0,
        pageSize,
      });
      return artworkListResponse.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
