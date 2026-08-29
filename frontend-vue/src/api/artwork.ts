import request from '@/utils/request'
import type {
  Artwork,
  ArtworkListResponse,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  UploadResponse,
  PageQuery,
  BatchDeleteRequest,
  BatchUpdateRequest,
  CategoryStats,
} from '@/types'

export default {
  // 获取艺术作品列表
  getArtworks(params: PageQuery): Promise<ArtworkListResponse> {
    return request<ArtworkListResponse>({
      url: '/artworks',
      method: 'get',
      params,
    })
  },

  // 获取艺术作品详情
  getArtworkById(id: number): Promise<Artwork> {
    return request<Artwork>({
      url: `/artworks/${id}`,
      method: 'get',
    })
  },

  // 创建艺术作品
  createArtwork(artworkData: ArtworkCreateRequest): Promise<Artwork> {
    return request<Artwork>({
      url: '/artworks',
      method: 'post',
      data: artworkData,
    })
  },

  // 更新艺术作品
  updateArtwork(id: number, artworkData: ArtworkUpdateRequest): Promise<Artwork> {
    return request<Artwork>({
      url: `/artworks/${id}`,
      method: 'put',
      data: artworkData,
    })
  },

  // 删除艺术作品
  deleteArtwork(id: number): Promise<void> {
    return request<void>({
      url: `/artworks/${id}`,
      method: 'delete',
    })
  },

  // 批量删除艺术作品
  batchDeleteArtworks(requestData: BatchDeleteRequest): Promise<void> {
    return request<void>({
      url: '/artworks/batch',
      method: 'delete',
      data: requestData,
    })
  },

  // 批量更新艺术作品
  batchUpdateArtworks(requestData: BatchUpdateRequest): Promise<void> {
    return request<void>({
      url: '/artworks/batch',
      method: 'put',
      data: requestData,
    })
  },

  // 搜索艺术作品（支持分页）
  searchArtworks(keyword: string, page?: number, pageSize?: number): Promise<ArtworkListResponse> {
    return request<ArtworkListResponse>({
      url: '/artworks/search',
      method: 'get',
      params: { keyword, page, pageSize },
    })
  },

  // 获取推荐作品
  getRecommendations(): Promise<Artwork[]> {
    return request<Artwork[]>({
      url: '/artworks/recommendations',
      method: 'get',
    })
  },

  // 获取所有作品分类
  getCategories(): Promise<string[]> {
    return request<string[]>({
      url: '/artworks/categories',
      method: 'get',
    })
  },

  // 获取所有分类的作品数量统计
  getCategoryStats(): Promise<CategoryStats[]> {
    return request<CategoryStats[]>({
      url: '/artworks/category-stats',
      method: 'get',
    })
  },

  // 上传作品图片
  uploadArtworkImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/upload/artwork',
      method: 'post',
      data: formData,
    }) as Promise<UploadResponse>
  },
}
