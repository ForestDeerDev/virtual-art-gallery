<template>
  <div class="gallery-page">
    <Navbar />
    
    <main class="gallery-main">
      <div class="container">
        <GalleryHeader />
        <GallerySearch 
          v-model="searchKeyword" 
          @search="handleSearch" 
        />
        <!-- 监听 update:filters 事件 -->
        <GalleryFilters 
          :filters="artworkStore.filters"
          @update:filters="handleFilterChange"
          @reset="resetFilters"
        />
        <GalleryLoading v-if="artworkStore.loading" />
        <GalleryEmpty 
          v-else-if="artworkStore.isEmpty" 
          @reset="resetFilters" 
        />
        <div v-else class="artworks-grid">
          <ArtworkCard
            v-for="artwork in artworkStore.artworks"
            :key="artwork.id"
            :artwork="artwork"
          />
        </div>
        <GalleryPagination 
          v-if="artworkStore.pagination.totalPages > 1"
          :current-page="artworkStore.pagination.currentPage"
          :total-pages="artworkStore.pagination.totalPages"
          @page-change="changePage"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import GalleryHeader from '@/components/gallery/GalleryHeader.vue'
import GallerySearch from '@/components/gallery/GallerySearch.vue'
import GalleryFilters from '@/components/gallery/GalleryFilters.vue'
import GalleryLoading from '@/components/gallery/GalleryLoading.vue'
import GalleryEmpty from '@/components/gallery/GalleryEmpty.vue'
import GalleryPagination from '@/components/gallery/GalleryPagination.vue'
import ArtworkCard from '@/components/gallery/ArtworkCard.vue'
import { useArtworkStore } from '@/stores/artwork'
import type { GalleryFilterState } from '@/types/gallery'
import { getQueryString } from '@/utils/route'

const route = useRoute()
const artworkStore = useArtworkStore()
const searchKeyword = ref('')



onMounted(async () => {
  if (route.query.category) {
    artworkStore.setFilters({ category: getQueryString(route.query.category) ?? '' })
  }
  await artworkStore.fetchArtworks()
})

watch(() => route.query.category, async (newCategory) => {
  artworkStore.setFilters({ category: getQueryString(newCategory) ?? '' })
  await artworkStore.fetchArtworks()
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    artworkStore.searchArtworks(searchKeyword.value)
  } else {
    artworkStore.resetFilters()
    artworkStore.fetchArtworks()
  }
}

const handleFilterChange = (newFilters: GalleryFilterState) => {
  artworkStore.setFilters(newFilters)
  artworkStore.fetchArtworks()
}

const resetFilters = () => {
  searchKeyword.value = ''
  artworkStore.resetFilters()
  artworkStore.fetchArtworks()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= artworkStore.pagination.totalPages) {
    artworkStore.setPage(page)
    artworkStore.fetchArtworks()
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }
}
</script>

<style>
@import '@/styles/gallery.css';
</style>

