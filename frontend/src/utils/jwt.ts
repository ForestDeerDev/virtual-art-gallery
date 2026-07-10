/**
 * JWT 工具函数
 * 用于解析和检查 JWT token 的过期状态
 */

/**
 * JWT payload 接口定义
 */
export interface JwtPayload {
  userId: number
  role: string
  sub: string
  iat: number
  exp: number

  [key: string]: unknown
}

/**
 * 解析 JWT token 的 payload 部分
 * @param token JWT token 字符串
 * @returns 解析后的 payload 对象，如果解析失败返回 null
 */
export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) {
      return null
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    const payload = JSON.parse(jsonPayload)

    if (typeof payload !== 'object' || payload === null) {
      return null
    }

    if (
      typeof payload.userId !== 'number' ||
      typeof payload.role !== 'string' ||
      typeof payload.sub !== 'string' ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      return null
    }

    return payload as JwtPayload
  } catch (error) {
    console.error('Failed to parse JWT token:', error)
    return null
  }
}

/**
 * 检查 JWT token 是否已过期
 * @param token JWT token 字符串
 * @param bufferSeconds 缓冲时间（秒），默认为 60 秒，提前 1 分钟认为 token 过期
 * @returns true 表示 token 已过期或无效，false 表示 token 有效
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  if (!token) {
    return true
  }

  const payload = parseJwtPayload(token)
  if (!payload || !payload.exp) {
    // 如果无法解析或没有 exp 字段，认为 token 无效
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const expirationTime = payload.exp
  
  // 检查是否过期（考虑缓冲时间）
  return currentTime >= (expirationTime - bufferSeconds)
}

/**
 * 获取 JWT token 的过期时间戳
 * @param token JWT token 字符串
 * @returns 过期时间戳（秒），如果解析失败返回 null
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = parseJwtPayload(token)
  return payload?.exp ?? null
}

/**
 * 获取 JWT token 的剩余有效时间（秒）
 * @param token JWT token 字符串
 * @returns 剩余有效时间（秒），如果 token 无效返回 0
 */
export function getTokenRemainingTime(token: string): number {
  const expirationTime = getTokenExpirationTime(token)
  if (!expirationTime) {
    return 0
  }
  
  const currentTime = Math.floor(Date.now() / 1000)
  const remaining = expirationTime - currentTime
  
  return Math.max(0, remaining)
}
