<template>
  <div>
    <Navbar />
    
    <div class="container recommendations-container">
      <h2 class="mb-4">
        <el-icon color="#f59e0b" class="me-2"><Star /></el-icon>
        为您推荐
      </h2>
      <p class="text-muted mb-4">
        基于您的兴趣标签和浏览历史，我们为您精心挑选了以下作品
      </p>

      <div v-if="loading" class="loading-spinner">
        <el-icon class="is-loading" :size="50"><Loading /></el-icon>
      </div>

      <div v-else-if="recommendations.length === 0" class="empty-state">
        <el-icon :size="64" color="#ccc"><Inbox /></el-icon>
        <p class="text-muted mt-3">暂无推荐，请先设置您的兴趣标签</p>
        <router-link to="/profile">
          <el-button type="primary">去设置兴趣标签</el-button>
        </router-link>
      </div>

      <div v-else>
        <!-- Recommendation Reasons -->
        <el-alert type="info" class="mb-4" show-icon>
          <template #title>
            <div class="alert-title">
              <el-icon class="me-2"><Lightbulb /></el-icon>推荐理由
            </div>
          </template>
          <p class="mb-0">
            根据您的兴趣标签：
            <el-tag
              v-for="tag in userTags"
              :key="tag"
              type="primary"
              class="me-2"
            >
              {{ tag }}
            </el-tag>
            ，我们为您推荐了以下作品
          </p>
        </el-alert>

        <!-- Recommended Artworks -->
        <div class="artworks-grid">
          <el-card
            v-for="artwork in recommendations"
            :key="artwork.id"
            class="artwork-card"
            shadow="hover"
          >
            <router-link :to="`/artwork/${artwork.id}`">
              <img
                :src="artwork.imageUrl || '/placeholder.jpg'"
                :alt="artwork.title"
                class="artwork-image"
              />
            </router-link>
            <div class="card-body">
              <h5 class="card-title">{{ artwork.title }}</h5>
              <p class="card-text text-muted small mb-2">
                <el-icon><User /></el-icon> {{ artwork.artist }}
              </p>
              <p class="card-text text-muted small mb-2">
                <el-icon><PriceTag /></el-icon> {{ artwork.category }}
              </p>
              <div v-if="artwork.matchingTags && artwork.matchingTags.length > 0" class="mb-2">
                <small class="text-muted">匹配标签：</small>
                <el-tag
                  v-for="tag in artwork.matchingTags"
                  :key="tag"
                  type="success"
                  size="small"
                  class="me-1"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="mt-2">
                <el-tag type="warning">
                  <el-icon class="me-1"><StarFilled /></el-icon>
                  推荐度: {{ artwork.relevanceScore || '高' }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>

        <!-- Refresh Recommendations -->
        <div class="text-center mt-4">
          <el-button @click="loadRecommendations">
            <el-icon class="me-2"><RefreshRight /></el-icon>
            刷新推荐
          </el-button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useUserStore } from '@/stores/user'
import artworkApi from '@/api/artwork'

const userStore = useUserStore()

const recommendations = ref([])
const loading = ref(true)

const userTags = computed(() => {
  const tags = userStore.userInfo?.tags
  console.log('User tags raw data:', tags)
  if (!tags) return []
  if (Array.isArray(tags)) {
    // 过滤掉无效的标签值，包括仅包含问号的标签
    return tags.filter(tag => tag && tag.trim() !== '' && !/^\?+$/.test(tag))
  }
  // 如果tags是字符串，将其分割为数组
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag && tag !== '' && !/^\?+$/.test(tag))
})

onMounted(async () => {
  // 清除localStorage中的旧数据，确保只使用最新的用户信息
  localStorage.removeItem('userInfo')
  
  // 先获取最新的用户信息，确保标签数据正确
  try {
    const userInfo = await userApi.getUserInfo()
    userStore.userInfo = userInfo
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  // 然后加载推荐作品
  loadRecommendations()
})

const loadRecommendations = async () => {
  loading.value = true
  try {
    const response = await artworkApi.getRecommendations()
    recommendations.value = response.data || []
    
    // 如果没有推荐，基于用户标签生成推荐
    if (recommendations.value.length === 0 && userTags.value.length > 0) {
      const allArtworks = await artworkApi.getArtworks({ pageSize: 50 })
      const all = allArtworks.data || []
      
      // 根据标签匹配推荐
      recommendations.value = all
        .map(artwork => {
          const artworkTags = Array.isArray(artwork.tags) ? artwork.tags : (artwork.tags || '').split(',').map(t => t.trim()).filter(t => t)
          const matchingTags = artworkTags.filter(tag =>
            userTags.value.includes(tag)
          )
          return {
            ...artwork,
            matchingTags,
            relevanceScore: matchingTags.length > 0 ? '高' : '中',
            // 添加随机分数，用于后续随机化
            randomScore: Math.random()
          }
        })
        .filter(artwork => artwork.matchingTags.length > 0)
        .sort((a, b) => {
          // 先按匹配标签数量排序
          if (b.matchingTags.length !== a.matchingTags.length) {
            return b.matchingTags.length - a.matchingTags.length
          }
          // 匹配标签数量相同时，按随机分数排序，增加随机性
          return b.randomScore - a.randomScore
        })
        .slice(0, 12)
    }
  } catch (error) {
    console.error('获取推荐失败:', error)
    // 使用模拟数据
    recommendations.value = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `推荐作品 ${i + 1}`,
      artist: `艺术家 ${i + 1}`,
      category: ['油画', '水彩', '素描'][i % 3],
      imageUrl: 'https://via.placeholder.com/300',
      matchingTags: userTags.value.slice(0, 2),
      relevanceScore: '高'
    }))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.recommendations-container {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.alert-title {
  display: flex;
  align-items: center;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.artwork-card {
  height: 100%;
  transition: all 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-5px);
}

.artwork-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-text {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.small {
  font-size: 0.875rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
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

.mt-4 {
  margin-top: 1.5rem;
}

.me-1 {
  margin-right: 0.25rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.text-muted {
  color: var(--text-secondary);
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>

