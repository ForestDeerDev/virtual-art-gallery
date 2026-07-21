import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi from '@/api/user'
import { cleanTags } from '@/utils/tags'
import { resetTokenExpiredFlag } from '@/utils/initialize'
import type { User, LoginRequest, RegisterRequest, OAuthRequest, UserUpdateRequest, AuthResponse } from '@/types'

function normalizeUserResponse(user: User): User {
  return {
    ...user,
    tags: user.tags ? cleanTags(user.tags) : []
  }
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'ADMIN')

  /**
   * 设置认证数据的公共函数
   * 统一处理 token、用户信息设置和重置 token 过期处理标志
   */
  function setAuthData(response: AuthResponse): void {
    const user = normalizeUserResponse(response.user)

    token.value = response.token
    userInfo.value = user
    resetTokenExpiredFlag()
  }

  async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await userApi.login(credentials)
    setAuthData(response)
    return response
  }

  async function register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await userApi.register(userData)
    setAuthData(response)
    return response
  }

  async function oauthLogin(requestData: OAuthRequest): Promise<AuthResponse> {
    const response = await userApi.oauthLogin(requestData)
    setAuthData(response)
    return response
  }

  function logout(): void {
    token.value = ''
    userInfo.value = null
  }

  async function updateUserInfo(userData: UserUpdateRequest): Promise<User> {
    const response = await userApi.updateProfile(userData)
    const user = normalizeUserResponse(response)
    userInfo.value = user
    return user
  }

  return {
    token,
    userInfo,
    isAuthenticated,
    isAdmin,
    login,
    register,
    oauthLogin,
    logout,
    updateUserInfo
  }
}, {
  persist: {
    key: 'art-gallery-user',
    paths: ['token', 'userInfo'],
    storage: localStorage
  }
})
