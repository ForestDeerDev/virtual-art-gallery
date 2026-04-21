<template>
  <div class="loading-spinner">
    <el-icon class="is-loading" :size="40"><Loading /></el-icon>
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  gap: 1rem;
}
</style>
