import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { isTokenExpired } from '@/utils/jwt'
import { handleTokenExpired } from '@/utils/initialize'

interface SilentError extends Error {
  silent?: boolean
}

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      // 检查 token 是否已过期
      if (isTokenExpired(userStore.token)) {
        console.log('Token expired, logging out before request:', config.url)
        handleTokenExpired()
        const error: SilentError = new Error('Token expired')
        error.silent = true
        // 把失败结果传递给后续 Promise 链处理
        return Promise.reject(error)
      }

      config.headers.set('Authorization', `Bearer ${userStore.token}`)
      console.log('Request with token:', config.url, userStore.token.substring(0, 20) + '...')
    } else {
      console.log('Request without token:', config.url)
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError | SilentError) => {
    // 如果是静默错误，不显示提示信息
    if ('silent' in error && error.silent) {
      return Promise.reject(error)
    }

    if ('response' in error && error.response) {
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
          const responseData = error.response.data as { message?: string }
          ElMessage.error(responseData?.message || '请求失败，请稍后重试')
      }
    } else if ('code' in error && error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  },
)

/**
 * 泛型化的 HTTP 请求封装
 * 由于响应拦截器已解包 response.data，直接返回业务数据
 * @param config Axios 请求配置
 * @returns 业务数据的 Promise
 */
function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>
}

export default request
