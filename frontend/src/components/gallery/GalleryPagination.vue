<template>
  <div class="pagination-section">
    <el-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      @current-change="handlePageChange"
      layout="prev, pager, next"
      class="pagination"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['page-change'])

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
