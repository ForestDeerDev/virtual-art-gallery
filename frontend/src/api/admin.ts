import request from '@/utils/request'

export default {
  getStats() {
    return request({
      url: '/admin/stats',
      method: 'get'
    })
  },

  getAllUsers() {
    return request({
      url: '/admin/users',
      method: 'get'
    })
  },

  updateUserRole(userId: number, role: string) {
    return request({
      url: `/admin/users/${userId}/role`,
      method: 'put',
      data: { role }
    })
  },

  deleteUser(userId: number) {
    return request({
      url: `/admin/users/${userId}`,
      method: 'delete'
    })
  }
}
