/**
 * 应用初始化工具
 * 用于在应用启动时执行必要的初始化操作
 */

import { useUserStore } from '@/stores/user'
import { isTokenExpired } from '@/utils/jwt'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 防止重复处理 token 过期的标志位
let isHandlingTokenExpired = false

/**
 * 统一处理 token 过期逻辑
 * 包括：退出登录、跳转登录页、显示提示信息
 */
export function handleTokenExpired() {
  // 防止重复处理
  if (isHandlingTokenExpired) {
    return
  }

  isHandlingTokenExpired = true

  const userStore = useUserStore()

  console.log('Token expired, handling logout')
  userStore.logout()

  // 如果当前不在登录页，则跳转到登录页
  if (router.currentRoute.value.name !== 'Login') {
    router.replace({ name: 'Login' }).catch(() => {})
  }

  ElMessage.error('登录已过期，请重新登录')
}

/**
 * 重置 token 过期处理标志位
 * 在用户重新登录成功后调用，允许下次 token 过期能够正常处理
 */
export function resetTokenExpiredFlag() {
  isHandlingTokenExpired = false
}

/**
 * 初始化认证状态
 * 检查 token 是否过期，如果过期则自动退出
 */
export function initializeAuth() {
  const userStore = useUserStore()

  // 检查 token 是否过期
  if (userStore.token && isTokenExpired(userStore.token)) {
    console.log('Token expired on app initialization')
    handleTokenExpired()
  }
}

/**
 * 应用初始化函数
 * 执行所有必要的初始化操作
 */
export function initializeApp() {
  initializeAuth()
}
