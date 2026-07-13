import request from '@/utils/request'
import type { ArtworkResponse, ArtworkListResponse, ArtworkDetailResponse } from '@/types/gallery'

export default {
  // 获取艺术作品列表
  getArtworks(params: { page?: number; pageSize?: number; limit?: number; sortBy?: string }): Promise<ArtworkListResponse> {
    return request({
      url: '/artworks',
      method: 'get',
      params
    }) as Promise<ArtworkListResponse>
  },

  // 获取艺术作品详情
  getArtworkById(id: number): Promise<ArtworkDetailResponse> {
    return request({
      url: `/artworks/${id}`,
      method: 'get'
    }) as Promise<ArtworkDetailResponse>
  },

  // 创建艺术作品
  createArtwork(artworkData: Partial<ArtworkResponse>): Promise<ArtworkResponse> {
    return request({
      url: '/artworks',
      method: 'post',
      data: artworkData
    }) as Promise<ArtworkResponse>
  },

  // 更新艺术作品
  updateArtwork(id: number, artworkData: Partial<ArtworkResponse>): Promise<ArtworkResponse> {
    return request({
      url: `/artworks/${id}`,
      method: 'put',
      data: artworkData
    }) as Promise<ArtworkResponse>
  },

  // 删除艺术作品
  deleteArtwork(id: number) {
    return request({
      url: `/artworks/${id}`,
      method: 'delete'
    })
  },

  // 批量删除艺术作品
  batchDeleteArtworks(ids: number[]) {
    return request({
      url: '/artworks/batch',
      method: 'delete',
      data: { ids }
    })
  },

  // 批量更新艺术作品
  batchUpdateArtworks(updates: any[]) {
    return request({
      url: '/artworks/batch',
      method: 'put',
      data: { updates }
    })
  },

  // 搜索艺术作品
  searchArtworks(keyword: string) {
    return request({
      url: '/artworks/search',
      method: 'get',
      params: { keyword }
    })
  },

  // 获取推荐作品
  getRecommendations() {
    return request({
      url: '/artworks/recommendations',
      method: 'get'
    })
  },

  // 获取所有作品分类
  getCategories() {
    return request({
      url: '/artworks/categories',
      method: 'get'
    })
  },

  // 上传作品图片
  uploadArtworkImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/upload/artwork',
      method: 'post',
      data: formData
    })
  }
}
