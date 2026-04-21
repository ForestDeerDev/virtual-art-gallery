import request from '@/utils/request'

export default {
  // 登录
  login(credentials: any) {
    return request({
      url: '/auth/login',
      method: 'post',
      data: credentials
    })
  },

  // 注册
  register(userData: any) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: userData
    })
  },

  // 第三方登录
  oauthLogin(provider: string, code: string) {
    return request({
      url: `/auth/oauth/${provider}`,
      method: 'post',
      data: { code }
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: '/user/info',
      method: 'get'
    })
  },

  // 更新用户信息
  updateProfile(userData: any) {
    return request({
      url: '/user/profile',
      method: 'put',
      data: userData
    })
  },

  // 上传头像
  uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: '/upload/avatar',
      method: 'post',
      data: formData
    })
  }
}
