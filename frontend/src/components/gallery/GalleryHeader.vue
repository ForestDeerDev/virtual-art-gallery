<template>
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">艺术画廊</h1>
      <p class="page-subtitle">探索来自世界各地的精美艺术作品</p>
    </div>
    <div class="header-actions">
      <router-link to="/virtual-gallery">
        <el-button type="success" class="hover-lift">
          <el-icon><Promotion /></el-icon> 进入虚拟画廊
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
  min-width: 200px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .page-title {
    font-size: 1.75rem;
  }
}
</style>
