import type { User } from './user'
import type { ArtworkUpdateRequest } from './artwork'

/**
 * 批量修改表单
 * 用于管理后台选择多个作品后修改属性
 * 注意：enabled 等状态类字段直接使用 boolean，与后端 ArtworkUpdateRequest 对齐
 */
export interface ArtworkBatchUpdateForm {
  category?: string
}

/**
 * 管理统计 - 匹配后端 StatsDTO
 */
export interface AdminStats {
  totalUsers: number
  totalArtworks: number
  totalComments: number
  totalLikes: number
  totalViews: number
  enabledArtworks: number
  enabledUsers: number
  featuredArtworks: number
  categoryStats: Record<string, number>
  roleStats: Record<string, number>
}

/**
 * 用户管理信息
 */
export interface UserManagement extends User {
  artworkCount?: number
}

/**
 * 批量删除请求 - 匹配后端 BatchDeleteRequest
 */
export interface BatchDeleteRequest {
  ids: number[]
}

/**
 * 批量更新单项 - 匹配后端 BatchUpdateItem
 */
export interface BatchUpdateItem {
  id: number
  data: ArtworkUpdateRequest
}

/**
 * 批量更新请求 - 匹配后端 BatchUpdateRequest
 */
export interface BatchUpdateRequest {
  updates: BatchUpdateItem[]
}
