import request from '@/utils/request'
import type { AdminStats, UserManagement, UserRole } from '@/types'

export default {
  getStats(): Promise<AdminStats> {
    return request({
      url: '/admin/stats',
      method: 'get'
    }) as Promise<AdminStats>
  },

  getAllUsers(): Promise<UserManagement[]> {
    return request({
      url: '/admin/users',
      method: 'get'
    }) as Promise<UserManagement[]>
  },

  updateUserRole(userId: number, role: UserRole): Promise<void> {
    return request({
      url: `/admin/users/${userId}/role`,
      method: 'put',
      data: { role }
    }) as Promise<void>
  },

  deleteUser(userId: number): Promise<void> {
    return request({
      url: `/admin/users/${userId}`,
      method: 'delete'
    }) as Promise<void>
  }
}
