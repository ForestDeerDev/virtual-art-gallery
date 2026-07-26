import request from '@/utils/request'
import type {
  LoginRequest,
  RegisterRequest,
  OAuthRequest,
  UserUpdateRequest,
  AuthResponse,
  User,
  UploadAvatarResponse
} from '@/types'

export default {
  // 登录
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: '/auth/login',
      method: 'post',
      data: credentials
    })
  },

  // 注册
  register(userData: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: '/auth/register',
      method: 'post',
      data: userData
    })
  },

  // 第三方登录
  oauthLogin(requestData: OAuthRequest): Promise<AuthResponse> {
    return request<AuthResponse>({
      url: `/auth/oauth/${requestData.provider}`,
      method: 'post',
      data: { code: requestData.code }
    })
  },

  // 获取用户信息
  getUserInfo(): Promise<User> {
    return request<User>({
      url: '/user/info',
      method: 'get'
    })
  },

  // 更新用户信息
  updateProfile(
    userData: UserUpdateRequest
  ): Promise<User> {
    return request<User>({
      url: '/user/profile',
      method: 'put',
      data: userData
    })
  },

  // 上传头像
  uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return request<UploadAvatarResponse>({
      url: '/upload/avatar',
      method: 'post',
      data: formData
    })
  }
}
