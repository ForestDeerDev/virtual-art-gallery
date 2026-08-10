<template>
  <div>
    <Navbar />
    <div class="admin-dashboard-container">
      <div class="dashboard-row">
        <div class="dashboard-sidebar">
          <el-card>
            <template #header>
              <h5>管理菜单</h5>
            </template>
            <el-menu :default-active="activeMenu" router class="admin-menu">
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
          <h2 class="mb-4">管理仪表盘</h2>

          <div v-if="loading" class="loading-state">
            <el-icon class="is-loading" :size="50"><Loading /></el-icon>
            <p class="mt-2">加载统计数据中...</p>
          </div>

          <div v-else>
            <div class="stats-grid mb-4">
              <el-card class="stat-card text-center">
                <div class="stat-body">
                  <el-icon :size="32" color="#409EFF"><Picture /></el-icon>
                  <h3 class="mt-3">{{ stats.totalArtworks }}</h3>
                  <p class="text-muted mb-0">总作品数</p>
                  <small class="text-success">启用: {{ stats.enabledArtworks }}</small>
                </div>
              </el-card>
              <el-card class="stat-card text-center">
                <div class="stat-body">
                  <el-icon :size="32" color="#67C23A"><User /></el-icon>
                  <h3 class="mt-3">{{ stats.totalUsers }}</h3>
                  <p class="text-muted mb-0">总用户数</p>
                  <small class="text-success">启用: {{ stats.enabledUsers }}</small>
                </div>
              </el-card>
              <el-card class="stat-card text-center">
                <div class="stat-body">
                  <el-icon :size="32" color="#909399"><View /></el-icon>
                  <h3 class="mt-3">{{ stats.totalViews }}</h3>
                  <p class="text-muted mb-0">总浏览量</p>
                </div>
              </el-card>
              <el-card class="stat-card text-center">
                <div class="stat-body">
                  <el-icon :size="32" color="#F56C6C"><Star /></el-icon>
                  <h3 class="mt-3">{{ stats.totalLikes }}</h3>
                  <p class="text-muted mb-0">总点赞数</p>
                  <small class="text-warning">精选: {{ stats.featuredArtworks }}</small>
                </div>
              </el-card>
            </div>

            <div class="stats-row mb-4">
              <el-card>
                <template #header>
                  <h5>分类统计</h5>
                </template>
                <div v-if="Object.keys(stats.categoryStats).length === 0" class="text-muted">
                  暂无数据
                </div>
                <div v-else>
                  <div
                    v-for="(count, category) in stats.categoryStats"
                    :key="category"
                    class="stat-item"
                  >
                    <span>{{ category }}</span>
                    <el-tag type="primary">{{ count }}件</el-tag>
                  </div>
                </div>
              </el-card>
              <el-card>
                <template #header>
                  <h5>角色统计</h5>
                </template>
                <div v-if="Object.keys(stats.roleStats).length === 0" class="text-muted">
                  暂无数据
                </div>
                <div v-else>
                  <div v-for="(count, role) in stats.roleStats" :key="role" class="stat-item">
                    <span>{{ role === 'USER' ? '普通用户' : '管理员' }}</span>
                    <el-tag :type="role === 'USER' ? 'success' : 'warning'">{{ count }}人</el-tag>
                  </div>
                </div>
              </el-card>
            </div>

            <el-card>
              <template #header>
                <h5>最近添加的作品</h5>
              </template>
              <div v-if="recentArtworks.length === 0" class="text-muted">暂无作品</div>
              <el-table v-else :data="recentArtworks" stripe>
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="artist" label="艺术家" />
                <el-table-column label="分类">
                  <template #default="{ row }">
                    <el-tag type="primary">{{ row.category }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <router-link :to="`/artwork/${row.id}`">
                      <el-button type="primary" size="small">查看</el-button>
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import artworkApi from '@/api/artwork'
import adminApi from '@/api/admin'
import type { Artwork, AdminStats } from '@/types'

const route = useRoute()

const activeMenu = computed(() => route.path)

const stats = ref<AdminStats>({
  totalArtworks: 0,
  totalUsers: 0,
  totalViews: 0,
  totalLikes: 0,
  enabledArtworks: 0,
  enabledUsers: 0,
  featuredArtworks: 0,
  categoryStats: {},
  roleStats: {},
  totalComments: 0,
})

const recentArtworks = ref<Artwork[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const [statsResponse, artworksResponse] = await Promise.all([
      adminApi.getStats(),
      artworkApi.getArtworks({ limit: 10, sortBy: 'latest' }),
    ])

    stats.value = statsResponse
    recentArtworks.value = artworksResponse.data
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-dashboard-container {
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--primary-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-body h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-gray);
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--text-secondary);
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mb-0 {
  margin-bottom: 0;
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
