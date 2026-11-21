import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import artworkApi from "@/api/artwork";
import { normalizeTaggable } from "@/utils/normalize";
import { buildArtworkQuery } from "@/utils/artworkQuery";
import type { Artwork, GalleryFilterState, PaginationState } from "@/types";

const PAGE_SIZE = 12;

export function useGallery(
  filters: GalleryFilterState,
  pageSize = PAGE_SIZE,
  initialPage = 1,
) {
  return useInfiniteQuery({
    queryKey: ["gallery", "artworks", filters, pageSize, initialPage],
    queryFn: async ({ pageParam }) => {
      const pagination: PaginationState = {
        currentPage: pageParam as number,
        pageSize,
        totalPages: 1,
        totalElements: 0,
      };
      const params = buildArtworkQuery(filters, pagination);
      const artworkListResponse = await artworkApi.getArtworks(params);
      return {
        ...artworkListResponse,
        data: artworkListResponse.data.map(normalizeTaggable),
      };
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30 * 1000,
  });
}

export function useGalleryCategories() {
  return useQuery<string[]>({
    queryKey: ["gallery", "categories"],
    queryFn: () => artworkApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useGalleryTags() {
  return useQuery<string[]>({
    queryKey: ["gallery", "tags"],
    queryFn: async () => {
      const tags = await artworkApi.getTags();
      return [...tags].sort((a, b) => a.localeCompare(b, "en"));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export type { Artwork };
