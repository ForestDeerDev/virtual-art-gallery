import type { GalleryFilterState, PaginationState, PageQuery } from '@/types'

/**
 * 默认的画廊筛选状态
 * 用于初始化和重置筛选条件
 */
export function createDefaultFilters(): GalleryFilterState {
  return {
    category: '',
    sortBy: 'latest',
    tags: '',
    keyword: '',
  }
}

/**
 * 根据筛选条件和分页状态构建后端查询参数
 * 把前端 currentPage(1-based) 转为后端 page(0-based)
 * 只把非空字段加入查询参数，避免覆盖后端默认值
 */
export function buildArtworkQuery(
  filters: GalleryFilterState,
  pagination: PaginationState,
): PageQuery {
  const query: PageQuery = {
    page: pagination.currentPage - 1,
    pageSize: pagination.pageSize,
    sortBy: filters.sortBy,
  }
  const keyword = filters.keyword?.trim()
  if (keyword) query.keyword = keyword
  if (filters.category) query.category = filters.category
  if (filters.tags) query.tags = filters.tags
  return query
}
