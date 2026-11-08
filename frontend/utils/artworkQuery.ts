import type { GalleryFilterState, PaginationState, PageQuery } from "@/types";

export function createDefaultFilters(): GalleryFilterState {
  return {
    category: "",
    sortBy: "latest",
    tags: "",
    keyword: "",
  };
}

export function buildArtworkQuery(
  filters: GalleryFilterState,
  pagination: PaginationState,
): PageQuery {
  const query: PageQuery = {
    page: pagination.currentPage - 1,
    pageSize: pagination.pageSize,
    sortBy: filters.sortBy,
  };
  const keyword = filters.keyword?.trim();
  if (keyword) query.keyword = keyword;
  if (filters.category) query.category = filters.category;
  if (filters.tags) query.tags = filters.tags;
  return query;
}
