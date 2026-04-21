<template>
  <div class="search-section">
    <el-input
      :model-value="modelValue"
      placeholder="搜索艺术作品、艺术家或标签..."
      @keyup.enter="handleSearch"
      @update:model-value="$emit('update:modelValue', $event)"
      class="search-input-group"
    >
      <template #append>
        <el-button @click="handleSearch">
          <el-icon><Search /></el-icon> 搜索
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const handleSearch = () => {
  emit('search')
}
</script>

<style scoped>
.search-section {
  margin-bottom: 2rem;
}

.search-input-group {
  max-width: 600px;
}

@media (max-width: 768px) {
  .search-input-group {
    max-width: 100%;
  }
}
</style>
