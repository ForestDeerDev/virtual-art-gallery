import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi from '@/api/user'
import { cleanTags } from '@/utils/tags'

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

  async function login(credentials: any) {
    const response = await userApi.login(credentials)
    token.value = response.token
    normalizeUserResponse(response)
    userInfo.value = response.user
    return response
  }

  async function register(userData: any) {
    const response = await userApi.register(userData)
    token.value = response.token
    normalizeUserResponse(response)
    userInfo.value = response.user
    return response
  }

  async function oauthLogin(provider: string, code: string) {
    const response = await userApi.oauthLogin(provider, code)
    token.value = response.token
    normalizeUserResponse(response)
    userInfo.value = response.user
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
