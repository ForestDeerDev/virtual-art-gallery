/**
 * 分页响应 - 匹配后端 PageResponse<T>
 */
export interface PageResponse<T> {
  data: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  page?: number
  pageSize?: number
  sortBy?: string
  category?: string
  tags?: string
  keyword?: string
  limit?: number
  featured?: boolean
}
