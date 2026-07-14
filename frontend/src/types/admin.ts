import type { User } from './user'
import type { ArtworkUpdateRequest } from './artwork'

/**
 * 管理统计 - 匹配后端 StatsDTO
 */
export interface AdminStats {
  totalUsers: number
  totalArtworks: number
  totalComments: number
  totalLikes: number
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
 * 批量更新请求 - 匹配后端 BatchUpdateRequest
 */
export interface BatchUpdateRequest {
  updates: Array<{
    id: number
    data: ArtworkUpdateRequest
  }>
}
