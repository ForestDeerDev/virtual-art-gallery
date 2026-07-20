<template>
  <div>
    <Navbar />
    <div class="admin-users-container">
      <div class="dashboard-row">
        <div class="dashboard-sidebar">
          <el-card>
            <template #header>
              <h5>管理菜单</h5>
            </template>
            <el-menu
              :default-active="activeMenu"
              router
              class="admin-menu"
            >
              <el-menu-item index="/admin">
                <el-icon><Odometer /></el-icon>
                <span>仪表盘</span>
              </el-menu-item>
              <el-menu-item index="/admin/artworks">
                <el-icon><Picture /></el-icon>
                <span>作品管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </div>

        <div class="dashboard-content">
          <h2 class="mb-4">用户管理</h2>

          <el-card>
            <div v-if="loading" class="loading-spinner">
              <el-icon class="is-loading" :size="50"><Loading /></el-icon>
            </div>
            <div v-else-if="users.length === 0" class="text-center py-5 text-muted">
              暂无用户
            </div>
            <el-table v-else :data="users" stripe>
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column label="头像" width="80">
                <template #default="{ row }">
                  <img
                    v-if="row.avatar"
                    :src="row.avatar"
                    alt="头像"
                    class="user-avatar"
                  />
                  <el-icon v-else :size="40" color="#ccc"><User /></el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column label="角色" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'primary'">
                    {{ row.role === 'ADMIN' ? '管理员' : '普通用户' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="注册时间" width="180" />
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEditRole(row)"
                    class="me-2"
                  >
                    <el-icon><Setting /></el-icon> 修改角色
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDeleteUser(row)"
                  >
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>

    <!-- Edit Role Dialog -->
    <el-dialog v-model="showEditRoleModal" title="修改用户角色" width="500px">
      <div class="mb-3">
        <label class="form-label">用户：{{ editingUser?.username }}</label>
      </div>
      <div class="mb-3">
        <label class="form-label">角色</label>
        <el-select v-model="newRole" style="width: 100%">
          <el-option label="普通用户" value="USER" />
          <el-option label="管理员" value="ADMIN" />
        </el-select>
      </div>
      <template #footer>
        <el-button @click="showEditRoleModal = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateRole" :loading="submitting">
          更新
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import adminApi from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User, UserRole } from '@/types'

const route = useRoute()

const activeMenu = computed(() => route.path)

const users = ref<User[]>([])
const loading = ref(true)
const showEditRoleModal = ref(false)
const editingUser = ref<User | null>(null)
const newRole = ref<UserRole>('USER')
const submitting = ref(false)

onMounted(() => {
  loadUsers()
})

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await adminApi.getAllUsers()
    users.value = response || []
  } catch (error: unknown) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleEditRole = (user: User) => {
  editingUser.value = user
  newRole.value = user.role
  showEditRoleModal.value = true
}

const handleUpdateRole = async () => {
  submitting.value = true
  try {
    await adminApi.updateUserRole(editingUser.value!.id, newRole.value)
    
    const user = users.value.find(u => u.id === editingUser.value!.id)
    if (user) {
      user.role = newRole.value
    }
    
    showEditRoleModal.value = false
    ElMessage.success('角色更新成功')
  } catch (error: unknown) {
    ElMessage.error('更新失败：' + '更新失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleDeleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await adminApi.deleteUser(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
    ElMessage.success('用户删除成功')
  } catch (error: unknown) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + '删除失败，请重试')
    }
  }
}
</script>

<style scoped>
.admin-users-container {
  max-width: 1600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.dashboard-row {
  display: flex;
  gap: 2rem;
}

.dashboard-sidebar {
  flex: 0 0 250px;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
}

.admin-menu {
  border: none;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: var(--primary-color);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--text-secondary);
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

@media (max-width: 992px) {
  .dashboard-row {
    flex-direction: column;
  }

  .dashboard-sidebar {
    flex: 0 0 auto;
  }
}
</style>

