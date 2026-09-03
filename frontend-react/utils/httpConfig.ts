export interface HttpDependencies {
  getToken: () => string | null;
  onTokenExpired: () => void;
  onError: (code: number | null, message: string) => void;
}

let dependencies: HttpDependencies | null = null;

/**
 * 注入 HTTP 客户端运行时依赖
 * 应在应用启动阶段(Pinia/Router 初始化之后、发起任何请求之前)调用一次
 */
export function configureHttp(deps: HttpDependencies): void {
  dependencies = deps;
}

export function getAuthToken(): string | null {
  return dependencies?.getToken() ?? null;
}

export function notifyTokenExpired(): void {
  dependencies?.onTokenExpired();
}

export function notifyError(code: number | null, message: string): void {
  dependencies?.onError(code, message);
}
