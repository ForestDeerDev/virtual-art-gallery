import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { isTokenExpired } from '@/utils/jwt'
import { handleTokenExpired } from '@/utils/initialize'

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
})


// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      // 检查 token 是否已过期
      if (isTokenExpired(userStore.token)) {
        console.log('Token expired, logging out before request:', config.url)
        handleTokenExpired()
        const error = new Error('Token expired') as any
        error.silent = true
        // 把失败结果传递给后续 Promise 链处理
        return Promise.reject(error)
      }
      
      config.headers.Authorization = `Bearer ${userStore.token}`
      console.log('Request with token:', config.url, userStore.token.substring(0, 20) + '...')
    } else {
      console.log('Request without token:', config.url)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    // 如果是静默错误，不显示提示信息
    if ((error as any).silent) {
      return Promise.reject(error)
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Received 401 response, logging out')
          handleTokenExpired()
          break
        case 403:
          ElMessage.error('权限不足，您没有访问该资源的权限')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error((error.response.data as any)?.message || '请求失败，请稍后重试')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default request
