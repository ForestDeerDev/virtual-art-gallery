<template>
  <div>
    <Navbar />
    
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- 背景装饰 -->
      <div class="hero-bg"></div>
      <div class="hero-pattern"></div>
      
      <div class="container hero-container">
        <div class="hero-row">
          <div class="hero-content fade-in" ref="heroContent">
            <el-tag class="hero-badge" type="primary">艺术无界，创意无限</el-tag>
            <h1 class="hero-title">
              欢迎来到 <span class="gradient-text">虚拟艺术画廊</span>
            </h1>
            <p class="hero-subtitle">
              探索数字艺术的无限可能，发现来自世界各地的精美艺术作品。
              在这里，每一件作品都讲述着独特的故事，等待您的发现。
            </p>
            <div class="hero-buttons">
              <router-link to="/gallery">
                <el-button size="large" class="hover-lift">
                  开始探索 <el-icon class="ms-2"><ArrowRight /></el-icon>
                </el-button>
              </router-link>
              <router-link to="/virtual-gallery">
                <el-button size="large" plain class="hover-lift">
                  <el-icon class="me-2"><Promotion /></el-icon> 进入虚拟画廊
                </el-button>
              </router-link>
            </div>
            
            <!-- 统计数据 -->
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">艺术作品</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">签约艺术家</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">100K+</div>
                <div class="stat-label">艺术爱好者</div>
              </div>
            </div>
          </div>
          <div class="hero-image fade-in" ref="heroImage">
            <div class="hero-image-wrapper">
              <div class="artwork-showcase">
                <div class="artwork-item" v-for="(artwork, index) in heroArtworks" :key="artwork.id" :class="`artwork-${index + 1}`">
                  <img
                    :src="artwork.imageUrl || 'https://via.placeholder.com/300x400'"
                    :alt="artwork.title"
                    class="hero-artwork-image loaded"
                    style="opacity: 1 !important"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Artworks -->
    <section class="featured-section">
      <div class="container">
        <div class="text-center fade-in" ref="featuredHeader">
          <h2 class="section-title">精选作品</h2>
          <div class="divider"></div>
          <p class="section-subtitle">
            我们精心挑选了一些最具代表性的艺术作品，展示来自世界各地艺术家的创作才华和独特视角。
          </p>
        </div>
        
        <div v-if="artworkStore.loading" class="loading-spinner">
          <el-icon class="is-loading" :size="40"><Loading /></el-icon>
          <p>加载中...</p>
        </div>
        <div v-else class="artworks-grid">
          <div
            v-for="(artwork, index) in artworkStore.featuredArtworks"
            :key="artwork.id"
            class="artwork-item fade-in"
            :ref="(el) => { featuredItems[index] = el as HTMLElement }"
          >
            <el-card class="artwork-card hover-lift" shadow="hover">
              <div class="artwork-image-container">
                <router-link :to="`/artwork/${artwork.id}`" class="artwork-link">
                  <img
                  :src="artwork.imageUrl || 'https://via.placeholder.com/300x300'"
                  :alt="artwork.title"
                  class="artwork-image loaded"
                  style="opacity: 1 !important"
                />
                  <div class="artwork-overlay">
                    <div class="artwork-overlay-content">
                      <el-icon :size="24"><View /></el-icon>
                      <span>查看详情</span>
                    </div>
                  </div>
                </router-link>
                <div class="artwork-category-badge">
                  {{ artwork.category }}
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title text-truncate">{{ artwork.title }}</h5>
                <p class="card-text text-muted small">
                  艺术家：{{ artwork.artist }}
                </p>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 查看更多按钮 -->
        <div class="text-center mt-12 fade-in" ref="viewMore">
          <router-link to="/gallery">
            <el-button type="primary" size="large">
              查看全部作品 <el-icon class="ms-2"><ArrowRight /></el-icon>
            </el-button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section">
      <div class="container">
        <div class="text-center fade-in" ref="categoriesHeader">
          <h2 class="section-title">艺术分类</h2>
          <div class="divider"></div>
          <p class="section-subtitle">
            探索不同类型的艺术作品，找到您喜欢的风格和主题。
          </p>
        </div>
        
        <div v-if="categoriesLoading" class="text-center" style="padding: 3rem;">
          <el-icon :size="48" class="text-muted is-loading"><Loading /></el-icon>
          <p class="text-muted mt-3">加载中...</p>
        </div>
        <div v-else-if="categories.length === 0" class="text-center" style="padding: 3rem;">
          <el-icon :size="48" class="text-muted"><DocumentRemove /></el-icon>
          <p class="text-muted mt-3">暂无数据</p>
        </div>
        <div v-else class="categories-grid">
          <div
            v-for="(category, index) in categories"
            :key="category.name"
            class="category-item fade-in"
            :ref="(el) => { categoryItems[index] = el as HTMLElement }"
          >
            <router-link 
              :to="`/gallery?category=${category.name}`" 
              class="category-card hover-lift"
            >
              <div class="category-icon-wrapper">
                <el-icon :size="40" class="category-icon"><component :is="category.icon" /></el-icon>
              </div>
              <h3 class="category-title">{{ category.name }}</h3>
              <p class="category-count text-muted">{{ category.count }} 件作品</p>
              <div class="category-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-bg"></div>
      <div class="container relative z-10">
        <div class="text-center fade-in" ref="ctaContent">
          <h2 class="section-title">加入我们的艺术社区</h2>
          <p class="section-subtitle">
            无论您是艺术家还是艺术爱好者，都可以在这里找到属于自己的艺术天地。
            分享您的作品，发现更多精彩，与全球艺术爱好者交流互动。
          </p>
          <div class="cta-buttons">
            <router-link to="/register">
              <el-button size="large" class="hover-lift">
                立即注册 <el-icon class="ms-2"><UserFilled /></el-icon>
              </el-button>
            </router-link>
            <router-link to="/upload">
              <el-button size="large" plain class="hover-lift">
                <el-icon class="me-2"><Upload /></el-icon> 上传作品
              </el-button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useArtworkStore } from '@/stores/artwork'
import type { Artwork } from '@/types'
import artworkApi from '@/api/artwork'

const artworkStore = useArtworkStore()

const heroArtworks = ref<Artwork[]>([])

// 用于动画的引用
const heroContent = ref<HTMLElement | null>(null)
const heroImage = ref<HTMLElement | null>(null)
const featuredHeader = ref<HTMLElement | null>(null)
const featuredItems = ref<(HTMLElement | null)[]>([])
const viewMore = ref<HTMLElement | null>(null)
const categoriesHeader = ref<HTMLElement | null>(null)
const categoryItems = ref<(HTMLElement | null)[]>([])
const ctaContent = ref<HTMLElement | null>(null)

interface ArtworkCategory {
  name: string
  icon: string
  count: number
}

const categories = ref<ArtworkCategory[]>([])
const categoriesLoading = ref(false)

// 分类图标映射
const categoryIconMap: Record<string, string> = {
  '油画': 'Brush',
  '水彩': 'Collection',
  '素描': 'Edit',
  '雕塑': 'Box',
  '摄影': 'Camera',
  '数字艺术': 'Monitor',
}

// 从 API 获取分类统计数据
const fetchCategoryStats = async () => {
  categoriesLoading.value = true
  try {
    const stats = await artworkApi.getCategoryStats()
    categories.value = stats.map(stat => ({
      name: stat.category,
      icon: categoryIconMap[stat.category] || 'Picture',
      count: stat.count
    }))
  } catch (error) {
    console.error('获取分类统计失败:', error)
    // 失败时清空分类，显示"暂无数据"
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

// 获取DOM元素（处理Vue组件实例情况）
interface VueComponentInstance {
  $el: HTMLElement
}

const isVueComponent = (el: unknown): el is VueComponentInstance => {
  return typeof el === 'object' && el !== null && '$el' in el
}

const getElement = (el: HTMLElement | VueComponentInstance | null): HTMLElement | null => {
  if (!el) return null
  if (isVueComponent(el)) {
    return el.$el
  }
  return el
}

// 图片懒加载和进入视口检测
const checkVisibility = () => {
  const elements: (HTMLElement | null)[] = [
    heroContent.value,
    heroImage.value,
    featuredHeader.value,
    viewMore.value,
    categoriesHeader.value,
    ctaContent.value,
    ...featuredItems.value,
    ...categoryItems.value
  ]
  
  elements.forEach(el => {
    const element = getElement(el)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.85) {
        element.classList.add('visible')
      }
    }
  })
}

// 从作品列表中随机选择n个作品
const getRandomArtworks = (artworks: Artwork[], count: number) => {
  const shuffled = [...artworks].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

onMounted(async () => {
  try {
    await artworkStore.fetchFeaturedArtworks(12)
    heroArtworks.value = getRandomArtworks(artworkStore.featuredArtworks, 3)
  } catch (error: unknown) {
    console.error('获取精选作品失败:', error)
    const mockArtworks: Artwork[] = [
      { id: 1, title: '抽象风景', artist: '张三', category: '油画', imageUrl: 'https://via.placeholder.com/300x400', artistId: 1, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['抽象', '风景'] },
      { id: 2, title: '城市印象', artist: '李四', category: '水彩', imageUrl: 'https://via.placeholder.com/300x300', artistId: 2, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['城市', '印象'] },
      { id: 3, title: '人物肖像', artist: '王五', category: '素描', imageUrl: 'https://via.placeholder.com/250x350', artistId: 3, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['人物', '肖像'] },
      { id: 4, title: '现代雕塑', artist: '赵六', category: '雕塑', imageUrl: 'https://via.placeholder.com/300x400', artistId: 4, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['雕塑', '现代'] },
      { id: 5, title: '自然风光', artist: '孙七', category: '摄影', imageUrl: 'https://via.placeholder.com/300x300', artistId: 5, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['自然', '风光'] },
      { id: 6, title: '数字梦境', artist: '周八', category: '数字艺术', imageUrl: 'https://via.placeholder.com/250x350', artistId: 6, viewCount: 0, likeCount: 0, featured: true, enabled: true, createTime: new Date().toISOString(), updateTime: new Date().toISOString(), tags: ['数字', '梦境'] }
    ]
    artworkStore.featuredArtworks = mockArtworks
    heroArtworks.value = getRandomArtworks(mockArtworks, 3)
  }

  // 获取分类统计数据（不阻塞动画）
  fetchCategoryStats()
  
  setTimeout(() => {
    checkVisibility()
    window.addEventListener('scroll', checkVisibility)
  }, 100)
})

watch(
  () => artworkStore.featuredArtworks.length,
  () => {
    setTimeout(() => {
      checkVisibility()
    }, 100)
  }
)
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* Hero Section */
.cta-section {
  padding: 6rem 0;
  background: var(--primary-gradient);
  position: relative;
  overflow: hidden;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.relative {
  position: relative;
}

.z-10 {
  z-index: 10;
}

.hero-section {
  padding: 6rem 0;
  overflow: hidden;
  position: relative;
  background: var(--primary-gradient);
  color: white;
}

.hero-container {
  position: relative;
  z-index: 10;
}

.hero-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  min-width: 0;
}

.hero-image {
  flex: 1;
  min-width: 0;
}

.hero-image-wrapper {
  position: relative;
  height: 500px;
  margin-top: 2rem;
}

.artwork-showcase {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

.artwork-1 {
  position: absolute;
  width: 280px;
  height: 380px;
  top: 5%;
  left: -5%;
  z-index: 3;
  transform: rotate(-5deg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.artwork-1:hover {
  transform: rotate(-5deg) translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.artwork-2 {
  position: absolute;
  width: 240px;
  height: 320px;
  bottom: 10%;
  left: 50%;
  z-index: 2;
  transform: rotate(3deg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.artwork-2:hover {
  transform: rotate(3deg) translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.artwork-3 {
  position: absolute;
  width: 200px;
  height: 280px;
  top: 15%;
  right: -30%;
  z-index: 1;
  transform: rotate(-3deg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.artwork-3:hover {
  transform: rotate(-3deg) translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .hero-row {
    flex-direction: column;
  }
  
  .hero-image {
    display: none;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E');
  opacity: 0.3;
  z-index: 1;
}

.hero-badge {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-item {
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 3rem;
}

.stat-number {
  font-weight: 800;
  font-size: 3rem;
  color: white;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.7;
  color: white;
}

/* Section Styles */
.text-center {
  text-align: center;
}

.mt-12 {
  margin-top: 3rem;
}

.divider {
  width: 80px;
  height: 4px;
  background: var(--primary-gradient);
  margin: 1rem auto;
  border-radius: 2px;
}

.max-w-3xl {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.section-subtitle {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Featured Section */
.featured-section {
  padding: 6rem 0;
  background-color: white;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.artwork-item {
  opacity: 1;
  transition: all 0.6s ease;
}

.artwork-item.fade-in {
  opacity: 0;
  transform: translateY(30px);
}

.artwork-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.category-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.card-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.card-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.text-muted {
  color: var(--text-secondary);
}

.small {
  font-size: 0.875rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Featured Artworks */
.artwork-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.artwork-image-container {
  position: relative;
  overflow: hidden;
  height: 300px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.artwork-link {
  display: block;
  position: relative;
  height: 100%;
}

.artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  opacity: 0;
}

.artwork-image.loaded {
  opacity: 1;
}

.artwork-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  color: white;
}

.artwork-card:hover .artwork-overlay {
  opacity: 1;
}

.artwork-overlay-content {
  text-align: center;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.artwork-card:hover .artwork-overlay-content {
  transform: translateY(0);
}

.artwork-overlay-content i {
  margin-bottom: 0.5rem;
}

.artwork-category-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--primary-gradient);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Categories Section */
.categories-section {
  padding: 6rem 0;
  background-color: var(--light-color);
}

/* Categories */
.category-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-gradient-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.category-icon {
  font-size: 3rem;
  color: var(--primary-color);
}

.category-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.category-count {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.category-arrow {
  margin-top: auto;
  font-size: 1.2rem;
  color: var(--primary-color);
  opacity: 0;
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.text-decoration-none {
  text-decoration: none;
}

.block {
  display: block;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* CTA Section */
.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

/* Responsive Design */
@media (max-width: 991px) {
  .hero-section {
    padding: 12rem 0 8rem;
  }
  
  .hero-stats {
    margin-top: 2rem;
  }
  
  .hero-image-wrapper {
    height: 400px;
    margin-top: 3rem;
  }
  
  /* 首页卡片 */
  .artwork-1 {
    width: 250px;
    height: 350px;
    top: 10%;
    left: 5%;
  }
  
  .artwork-2 {
    width: 200px;
    height: 300px;
    bottom: 5%;
    left: 35%;
  }
  
  .artwork-3 {
    width: 150px;
    height: 250px;
    top: 5%;
    right: 10%;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 10rem 0 6rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .artwork-showcase {
    display: none;
  }
  
  .hero-image-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-xl);
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-image-wrapper::after {
    content: '🎨';
    font-size: 8rem;
    opacity: 0.5;
  }
  
  .artworks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 8rem 0 4rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .artworks-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

