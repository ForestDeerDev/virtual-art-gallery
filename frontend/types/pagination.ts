export interface PageResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  category?: string;
  tags?: string;
  keyword?: string;
  limit?: number;
  featured?: boolean;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
