/**
 * HTTP 客户端依赖注入配置
 *
 * 把认证 token 获取、token 过期处理、错误提示这些
 * 与 UI 库 / 状态管理 / 路由相关的副作用抽象为接口,
 * 由具体框架(Vue/React)的适配器在应用启动时注入实现。
 * request.ts 只依赖本文件 + axios + 纯工具函数,
 * 不再直接耦合 Pinia / Element Plus / Vue Router。
 */

export interface HttpDependencies {
  /** 获取当前认证 token,未登录时返回 null */
  getToken: () => string | null
  /** token 过期时的统一处理(退出登录、跳转登录页、提示) */
  onTokenExpired: () => void
  /** 通用错误提示,code 为 null 表示无 HTTP 状态码(如网络错误、超时) */
  onError: (code: number | null, message: string) => void
}

let dependencies: HttpDependencies | null = null

/**
 * 注入 HTTP 客户端运行时依赖
 * 应在应用启动阶段(Pinia/Router 初始化之后、发起任何请求之前)调用一次
 */
export function configureHttp(deps: HttpDependencies): void {
  dependencies = deps
}

export function getAuthToken(): string | null {
  return dependencies?.getToken() ?? null
}

export function notifyTokenExpired(): void {
  dependencies?.onTokenExpired()
}

export function notifyError(code: number | null, message: string): void {
  dependencies?.onError(code, message)
}
