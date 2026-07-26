import type { PageResponse } from './pagination'

/**
 * 艺术品实体 - 匹配后端 ArtworkDTO
 * 注意：后端 enabled 字段为 Boolean 类型，而非枚举状态
 */
export interface Artwork {
  id: number
  title: string
  artist: string        // 艺术家用户名
  artistId: number      // 艺术家ID
  category: string
  description?: string
  imageUrl: string
  videoUrl?: string
  tags?: string[]
  dimensions?: string
  material?: string
  artworkCreateTime?: string
  viewCount: number
  likeCount: number
  featured: boolean
  enabled: boolean
  createTime: string
  updateTime: string
}

/**
 * 艺术品创建请求 - 匹配后端 ArtworkCreateRequest
 */
export interface ArtworkCreateRequest {
  title: string
  category: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  tags?: string[]
  dimensions?: string
  material?: string
  featured?: boolean
}

/**
 * 管理后台艺术品创建请求 - 继承 ArtworkCreateRequest，增加 artist 字段
 */
export interface AdminArtworkCreateRequest extends ArtworkCreateRequest {
  artist?: string
}

/**
 * 艺术品更新请求 - 匹配后端 ArtworkUpdateRequest
 */
export interface ArtworkUpdateRequest {
  title?: string
  category?: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  tags?: string[]
  dimensions?: string
  material?: string
  featured?: boolean
  enabled?: boolean
}

/**
 * 艺术品列表响应
 */
export interface ArtworkListResponse extends PageResponse<Artwork> {}

/**
 * 图片上传响应
 */
export interface UploadResponse {
  url: string
}

/**
 * 推荐结果 - 由推荐系统返回的业务领域数据
 */
export interface Recommendation extends Artwork {
  matchingTags: string[]
  relevanceScore: string
  randomScore?: number
}
