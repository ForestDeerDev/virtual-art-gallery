import request from '@/utils/request'
import type { AdminStats, UserManagement, UserRole } from '@/types'

const adminApi = {
  getStats(): Promise<AdminStats> {
    return request<AdminStats>({
      url: '/admin/stats',
      method: 'get',
    })
  },

  getAllUsers(): Promise<UserManagement[]> {
    return request<UserManagement[]>({
      url: '/admin/users',
      method: 'get',
    })
  },

  updateUserRole(userId: number, role: UserRole): Promise<void> {
    return request<void>({
      url: `/admin/users/${userId}/role`,
      method: 'put',
      data: { role },
    })
  },

  deleteUser(userId: number): Promise<void> {
    return request<void>({
      url: `/admin/users/${userId}`,
      method: 'delete',
    })
  },
}

export default adminApi
