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
            class="filter-select"
            :loading="categoriesLoading"
            @update:model-value="handleCategoryChange"
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
            class="filter-select"
            @update:model-value="handleSortByChange"
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
            class="filter-input"
            @update:model-value="handleTagsChange"
          />
        </div>
        <div class="filter-item filter-reset">
          <el-button class="w-100 filter-btn" @click="handleReset">
            <el-icon><RefreshLeft /></el-icon> 重置
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { RefreshLeft } from '@element-plus/icons-vue'
import type { GalleryFilterState } from '@/types/gallery'

// 父组件 → 子组件：通过 props 传数据
const props = defineProps<{
  filters: GalleryFilterState
  categories: string[]
  categoriesLoading: boolean
}>()

// 子组件 → 父组件：通过 emit 发消息（事件）
const emit = defineEmits<{
  'update:filters': [value: GalleryFilterState]
  reset: []
}>()

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
