/**
 * 用户角色 - 使用 union type
 */
export type UserRole = 'USER' | 'ADMIN'

/**
 * 用户实体 - 匹配后端 UserDTO
 */
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: UserRole
  tags?: string[]
  enabled: boolean
  provider?: string
  providerId?: string
  createTime: string
  updateTime: string
}

/**
 * 用户更新请求
 */
export interface UserUpdateRequest {
  username?: string
  email?: string
  avatar?: string
  tags?: string[]
}
