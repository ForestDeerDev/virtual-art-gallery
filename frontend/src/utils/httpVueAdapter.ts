/**
 * HTTP 客户端 Vue 适配器
 *
 * 把 Vue 生态(Pinia / Element Plus / Vue Router)的具体实现
 * 注入到框架无关的 httpConfig 注册中心。
 *
 * React 重写时只需新增 httpReactAdapter.ts 提供等价实现,
 * request.ts 及其下游 API 层无需任何改动。
 */

import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { handleTokenExpired } from '@/utils/initialize'
import { configureHttp } from '@/utils/httpConfig'

/**
 * 初始化 Vue 版 HTTP 依赖
 * 必须在 Pinia 安装之后、发起任何请求之前调用一次
 */
export function initHttpVueAdapter(): void {
  configureHttp({
    getToken: () => useUserStore().token,
    onTokenExpired: () => handleTokenExpired(),
    onError: (_code, message) => {
      ElMessage.error(message)
    },
  })
}
