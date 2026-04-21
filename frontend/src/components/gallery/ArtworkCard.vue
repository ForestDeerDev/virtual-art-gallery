<template>
  <div class="artwork-item fade-in" ref="cardRef">
    <div class="card artwork-card h-100 hover-lift">
      <div class="artwork-image-container">
        <router-link :to="`/artwork/${artwork.id}`" class="artwork-link">
          <img
            v-lazy="artwork.imageUrl || '/placeholder.jpg'"
            :alt="artwork.title"
            class="artwork-image"
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
      <div class="card-body artwork-body">
        <h5 class="card-title artwork-title text-truncate">{{ artwork.title }}</h5>
        <p class="card-text text-muted small mb-2 artwork-artist">
          <el-icon><User /></el-icon> {{ artwork.artist }}
        </p>
        <div v-if="hasTags" class="artwork-tags mb-2">
          <el-tag
            v-for="tag in cleanTags(artwork.tags).slice(0, 3)"
            :key="tag"
            size="small"
            class="artwork-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { View, User } from '@element-plus/icons-vue'
import { cleanTags } from '@/utils/tags'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null)

const hasTags = computed(() => {
  if (!props.artwork.tags) return false
  const tags = cleanTags(props.artwork.tags)
  return Array.isArray(tags) ? tags.length > 0 : tags.trim().length > 0
})

onMounted(() => {
  if (cardRef.value) {
    setTimeout(() => {
      cardRef.value?.classList.add('visible')
    }, 100)
  }
})
</script>

<style scoped>
.artwork-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.artwork-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.artwork-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
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

.artwork-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.artwork-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.artwork-artist {
  margin-bottom: 0.75rem;
}

.artwork-tags {
  margin-top: auto;
}

.artwork-tag {
  background-color: var(--light-color);
  color: var(--text-secondary);
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.h-100 {
  height: 100%;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-muted {
  color: var(--text-secondary);
}

.small {
  font-size: 0.875rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .artwork-image-container {
    height: 250px;
  }
}

@media (max-width: 576px) {
  .artwork-image-container {
    height: 200px;
  }

  .artwork-body {
    padding: 1rem;
  }

  .artwork-title {
    font-size: 1rem;
  }
}
</style>
