import type { User } from './user'

/**
 * 登录请求 - 匹配后端 LoginRequest
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 注册请求 - 匹配后端 RegisterRequest
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
  tags?: string[]
}

/**
 * OAuth 登录请求
 */
export interface OAuthRequest {
  provider: string
  code: string
}

/**
 * 认证响应 - 匹配后端 AuthResponse
 */
export interface AuthResponse {
  token: string
  user: User
}
