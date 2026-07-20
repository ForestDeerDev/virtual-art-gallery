<template>
  <div class="filters-section">
    <el-card class="filters-card" shadow="never">
      <template #header>
        <h3 class="filters-title">筛选条件</h3>
      </template>
      <div class="filters-grid">
        <!-- Vue 事件机制通过事件名匹配，而不是函数名或参数名。只要事件名相同，无论 emit 来自哪个函数，都会被同一个监听器接收。 -->
        <div class="filter-item">
          <label class="form-label">分类</label>
          <el-select 
            :model-value="filters.category" 
            @update:model-value="handleCategoryChange"
            class="filter-select"
            :loading="loading"
          >
            <el-option label="全部" value="" />
            <el-option 
              v-for="category in categories" 
              :key="category" 
              :label="category" 
              :value="category" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="form-label">排序</label>
          <el-select 
            :model-value="filters.sortBy" 
            @update:model-value="handleSortByChange"
            class="filter-select"
          >
            <el-option label="最新" value="latest" />
            <el-option label="最受欢迎" value="popular" />
            <el-option label="标题" value="title" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="form-label">标签</label>
          <el-input
            :model-value="filters.tags"
            placeholder="输入标签..."
            @keyup.enter="handleTagsSearch"
            @update:model-value="handleTagsChange"
            class="filter-input"
          />
        </div>
        <div class="filter-item filter-reset">
          <el-button @click="handleReset" class="w-100 filter-btn">
            <el-icon><RefreshLeft /></el-icon> 重置
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import artworkApi from '@/api/artwork'
import type { GalleryFilterState } from '@/types/gallery'

// 父组件 → 子组件：通过 props 传值
const props = defineProps<{
  filters: GalleryFilterState
}>()

// 子组件 → 父组件：通过 emit 传值
const emit = defineEmits<{
  'update:filters': [value: GalleryFilterState]
  'reset': []
}>()

const categories = ref<string[]>([])
const loading = ref(false)

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await artworkApi.getCategories()
    categories.value = response
  } catch (error: unknown) {
    console.error('获取分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

// 函数都 emit 同一个事件名：'update:filters'，只是传递的数据内容不同。
const handleCategoryChange = (value: string) => {
  emit('update:filters', { ...props.filters, category: value })
}

const handleSortByChange = (value: string) => {
  emit('update:filters', { ...props.filters, sortBy: value })
}

const handleTagsChange = (value: string) => {
  emit('update:filters', { ...props.filters, tags: value })
}

const handleTagsSearch = () => {
  emit('update:filters', { ...props.filters })
}

const handleReset = () => {
  emit('reset')
}
</script>

<style scoped>
.filters-section {
  margin-bottom: 2rem;
}

.filters-card {
  border-radius: var(--radius-lg);
}

.filters-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-select,
.filter-input {
  width: 100%;
}

.filter-btn {
  margin-top: 1.5rem;
}

.w-100 {
  width: 100%;
}

@media (max-width: 991px) {
  .filters-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-reset {
    margin-top: 0.5rem;
  }
}
</style>
