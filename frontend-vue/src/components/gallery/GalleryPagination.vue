<template>
  <div class="pagination-section">
    <el-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      layout="prev, pager, next"
      class="pagination"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
  },
)

const emit = defineEmits<{
  'page-change': [page: number]
}>()

// Element Plus 组件触发 @current-change 事件，page 由 Element Plus 内部生成并传入
const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style scoped>
.pagination-section {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.pagination {
  justify-content: center;
}
</style>
