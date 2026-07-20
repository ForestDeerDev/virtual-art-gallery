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
    return request({
      url: '/auth/login',
      method: 'post',
      data: credentials
    }) as Promise<AuthResponse>
  },

  // 注册
  register(userData: RegisterRequest): Promise<AuthResponse> {
    return request({
      url: '/auth/register',
      method: 'post',
      data: userData
    }) as Promise<AuthResponse>
  },

  // 第三方登录
  oauthLogin(requestData: OAuthRequest): Promise<AuthResponse> {
    return request({
      url: `/auth/oauth/${requestData.provider}`,
      method: 'post',
      data: { code: requestData.code }
    }) as Promise<AuthResponse>
  },

  // 获取用户信息
  getUserInfo(): Promise<User> {
    return request({
      url: '/user/info',
      method: 'get'
    }) as Promise<User>
  },

  // 更新用户信息
  updateProfile(
    userData: UserUpdateRequest
  ): Promise<User> {
    return request({
      url: '/user/profile',
      method: 'put',
      data: userData
    }) as Promise<User>
  },

  // 上传头像
  uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/upload/avatar',
      method: 'post',
      data: formData
    }) as Promise<UploadAvatarResponse>
  }
}
