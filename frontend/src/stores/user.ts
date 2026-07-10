import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi from '@/api/user'
import { cleanTags } from '@/utils/tags'
import { resetTokenExpiredFlag } from '@/utils/initialize'

function normalizeUserResponse(response: any) {
  if (response?.user?.tags) {
    response.user.tags = cleanTags(response.user.tags)
  }
  if (response?.tags) {
    response.tags = cleanTags(response.tags)
  }
  return response
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<any | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'ADMIN')

  function initializeUserInfo() {
    if (userInfo.value?.tags) {
      userInfo.value = {
        ...userInfo.value,
        tags: cleanTags(userInfo.value.tags)
      }
    }
  }

  /**
   * 设置认证数据的公共函数
   * 统一处理 token、用户信息设置和重置 token 过期处理标志
   */
  function setAuthData(response: any) {
    token.value = response.token
    normalizeUserResponse(response)
    userInfo.value = response.user
    resetTokenExpiredFlag()
  }

  async function login(credentials: any) {
    const response = await userApi.login(credentials)
    setAuthData(response)
    return response
  }

  async function register(userData: any) {
    const response = await userApi.register(userData)
    setAuthData(response)
    return response
  }

  async function oauthLogin(provider: string, code: string) {
    const response = await userApi.oauthLogin(provider, code)
    setAuthData(response)
    return response
  }

  function logout() {
    token.value = ''
    userInfo.value = null
  }

  async function updateUserInfo(userData: any) {
    const response = await userApi.updateProfile(userData)
    normalizeUserResponse(response)
    userInfo.value = response
    return response
  }

  initializeUserInfo()

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
