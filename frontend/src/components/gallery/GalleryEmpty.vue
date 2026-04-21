<template>
  <el-empty description="暂无作品">
    <template #image>
      <el-icon :size="60"><Box /></el-icon>
    </template>
    <p class="empty-text">
      没有找到符合条件的艺术作品，请尝试调整筛选条件或搜索关键词。
    </p>
    <el-button type="primary" @click="handleReset">
      <el-icon><RefreshLeft /></el-icon> 重置所有筛选
    </el-button>
  </el-empty>
</template>

<script setup lang="ts">
import { Box, RefreshLeft } from '@element-plus/icons-vue'

const emit = defineEmits(['reset'])

const handleReset = () => {
  emit('reset')
}
</script>

<style scoped>
.empty-text {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
}
</style>
