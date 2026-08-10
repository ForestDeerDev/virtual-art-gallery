<template>
  <div>
    <Navbar />
    <div class="virtual-gallery-container">
      <div ref="canvasContainer" class="canvas-container"></div>
      <GalleryControls
        :controls="controls"
        @update:move-speed="controls.moveSpeed = $event"
        @update:mouse-sensitivity="controls.mouseSensitivity = $event"
        @reset="resetCamera"
        @toggle-rotate="toggleAutoRotate"
      />
      <div class="exit-button">
        <router-link to="/gallery">
          <el-button type="danger">
            <el-icon><Back /></el-icon> 返回画廊
          </el-button>
        </router-link>
      </div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <el-icon class="is-loading" :size="40"><Loading /></el-icon>
          <p>正在加载艺术馆...</p>
          <el-progress :percentage="loadingProgress" :stroke-width="6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Back, Loading } from '@element-plus/icons-vue'
import Navbar from '@/components/Navbar.vue'
import GalleryControls from '@/components/GalleryControls.vue'
import artworkApi from '@/api/artwork'
import { useThreeGallery } from '@/composables/useThreeGallery'
import type { GalleryArtwork, GalleryControlState, GalleryConfig, GalleryInstance } from '@/types'

const router = useRouter()
const canvasContainer = ref<HTMLElement | null>(null)

// 控制状态（用户实时操作）
const controls = reactive<GalleryControlState>({
  moveSpeed: 0.5,
  mouseSensitivity: 0.3,
  autoRotate: false,
})

// 配置（初始化参数，可选）
const config: GalleryConfig = {
  roomWidth: 20,
  roomHeight: 5,
  roomDepth: 15,
  cameraHeight: 1.7,
}

const artworkImages = ref<GalleryArtwork[]>([])
const isLoading = ref(false)
const loadingProgress = ref(0)

const loadArtworks = async () => {
  try {
    const response = await artworkApi.getArtworks({ page: 0, pageSize: 20 })
    const artworksData = response.data
    artworkImages.value = artworksData.map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist,
      category: artwork.category,
      imageUrl: artwork.imageUrl,
    }))
  } catch (error: unknown) {
    console.error('获取艺术作品失败:', error)
    artworkImages.value = [
      {
        id: 1,
        title: '艺术作品 1',
        artist: '艺术家 1',
        category: '油画',
        imageUrl:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop',
      },
      {
        id: 2,
        title: '艺术作品 2',
        artist: '艺术家 2',
        category: '水彩',
        imageUrl:
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1000&fit=crop',
      },
      {
        id: 3,
        title: '艺术作品 3',
        artist: '艺术家 3',
        category: '素描',
        imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=1000&fit=crop',
      },
      {
        id: 4,
        title: '艺术作品 4',
        artist: '艺术家 4',
        category: '雕塑',
        imageUrl:
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop',
      },
      {
        id: 5,
        title: '艺术作品 5',
        artist: '艺术家 5',
        category: '摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1580136608260-4eb11f4b64fe?w=800&h=1000&fit=crop',
      },
      {
        id: 6,
        title: '艺术作品 6',
        artist: '艺术家 6',
        category: '数字艺术',
        imageUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=1000&fit=crop',
      },
      {
        id: 7,
        title: '艺术作品 7',
        artist: '艺术家 7',
        category: '油画',
        imageUrl:
          'https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&h=1000&fit=crop',
      },
      {
        id: 8,
        title: '艺术作品 8',
        artist: '艺术家 8',
        category: '水彩',
        imageUrl:
          'https://images.unsplash.com/photo-1579783483458-83d02f59ed8c?w=800&h=1000&fit=crop',
      },
    ]
  }
}

let gallery: GalleryInstance | null = null

onMounted(async () => {
  await loadArtworks()

  if (canvasContainer.value) {
    gallery = useThreeGallery({
      container: canvasContainer.value,
      artworks: artworkImages.value,
      getControls: () => controls,
      config,
      onArtworkClick: (id: number) => router.push(`/artwork/${id}`),
      onLoadingStart: () => {
        isLoading.value = true
        loadingProgress.value = 0
      },
      onLoadingProgress: (progress: number) => {
        loadingProgress.value = progress
      },
      onLoadingComplete: () => {
        isLoading.value = false
      },
    })

    gallery.mount()
  }
})

const toggleAutoRotate = () => {
  controls.autoRotate = !controls.autoRotate
}

const resetCamera = () => {
  gallery?.resetCamera()
}

onBeforeUnmount(() => {
  gallery?.dispose()
})
</script>

<style scoped>
.virtual-gallery-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px);
  overflow: hidden;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.exit-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.exit-button a {
  text-decoration: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-content p {
  margin: 20px 0;
  font-size: 18px;
}

.loading-content .el-progress {
  width: 300px;
  margin: 0 auto;
}
</style>
