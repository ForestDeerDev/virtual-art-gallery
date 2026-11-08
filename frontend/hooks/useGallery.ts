import { useQuery } from "@tanstack/react-query";
import artworkApi from "@/api/artwork";
import { normalizeTaggable } from "@/utils/normalize";
import { buildArtworkQuery } from "@/utils/artworkQuery";
import type { Artwork, GalleryFilterState, PaginationState } from "@/types";

const PAGE_SIZE = 12;

export function useGallery(
  filters: GalleryFilterState,
  page: number,
  pageSize = PAGE_SIZE,
) {
  const pagination: PaginationState = {
    currentPage: page,
    pageSize,
    totalPages: 1,
    totalElements: 0,
  };

  return useQuery({
    queryKey: ["gallery", "artworks", filters, page, pageSize],
    queryFn: async () => {
      const params = buildArtworkQuery(filters, pagination);
      const artworkListResponse = await artworkApi.getArtworks(params);
      return {
        ...artworkListResponse,
        data: artworkListResponse.data.map(normalizeTaggable),
      };
    },
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
      const TAG_PAGE_SIZE = 100;
      const MAX_PAGES = 20;

      const firstPageResponse = await artworkApi.getArtworks({
        page: 0,
        pageSize: TAG_PAGE_SIZE,
      });
      const artworks = [...firstPageResponse.data];
      const totalPages = Math.min(firstPageResponse.totalPages, MAX_PAGES);

      const remainingPageResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          artworkApi.getArtworks({
            page: i + 1,
            pageSize: TAG_PAGE_SIZE,
          }),
        ),
      );
      remainingPageResponses.forEach((pageResponse) =>
        artworks.push(...pageResponse.data),
      );

      const tags = new Set<string>();
      artworks.map(normalizeTaggable).forEach((artwork) => {
        artwork.tags.forEach((tag) => tags.add(tag));
      });
      return Array.from(tags).sort((a, b) => a.localeCompare(b, "zh"));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export type { Artwork };
