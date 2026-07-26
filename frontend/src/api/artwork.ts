import request from '@/utils/request'
import type {
  Artwork,
  ArtworkListResponse,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  UploadResponse,
  PageQuery,
  BatchDeleteRequest,
  BatchUpdateRequest
} from '@/types'

export default {
  // 获取艺术作品列表
  getArtworks(params: PageQuery): Promise<ArtworkListResponse> {
    return request({
      url: '/artworks',
      method: 'get',
      params
    }) as Promise<ArtworkListResponse>
  },

  // 获取艺术作品详情
  getArtworkById(id: number): Promise<Artwork> {
    return request({
      url: `/artworks/${id}`,
      method: 'get'
    }) as Promise<Artwork>
  },

  // 创建艺术作品
  createArtwork(artworkData: ArtworkCreateRequest): Promise<Artwork> {
    return request({
      url: '/artworks',
      method: 'post',
      data: artworkData
    }) as Promise<Artwork>
  },

  // 更新艺术作品
  updateArtwork(id: number, artworkData: ArtworkUpdateRequest): Promise<Artwork> {
    return request({
      url: `/artworks/${id}`,
      method: 'put',
      data: artworkData
    }) as Promise<Artwork>
  },

  // 删除艺术作品
  deleteArtwork(id: number): Promise<void> {
    return request({
      url: `/artworks/${id}`,
      method: 'delete'
    })
  },

  // 批量删除艺术作品
  batchDeleteArtworks(requestData: BatchDeleteRequest): Promise<void> {
    return request({
      url: '/artworks/batch',
      method: 'delete',
      data: requestData
    })
  },

  // 批量更新艺术作品
  batchUpdateArtworks(requestData: BatchUpdateRequest): Promise<void> {
    return request({
      url: '/artworks/batch',
      method: 'put',
      data: requestData
    })
  },

  // 搜索艺术作品（支持分页）
  searchArtworks(keyword: string, page?: number, pageSize?: number): Promise<ArtworkListResponse> {
    return request({
      url: '/artworks/search',
      method: 'get',
      params: { keyword, page, pageSize }
    }) as Promise<ArtworkListResponse>
  },

  // 获取推荐作品
  getRecommendations(): Promise<Artwork[]> {
    return request({
      url: '/artworks/recommendations',
      method: 'get'
    }) as Promise<Artwork[]>
  },

  // 获取所有作品分类
  getCategories(): Promise<string[]> {
    return request({
      url: '/artworks/categories',
      method: 'get'
    }) as Promise<string[]>
  },

  // 上传作品图片
  uploadArtworkImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/upload/artwork',
      method: 'post',
      data: formData
    }) as Promise<UploadResponse>
  }
}
