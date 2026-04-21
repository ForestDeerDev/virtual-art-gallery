import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import artworkApi from '@/api/artwork'

export const useArtworkStore = defineStore('artwork', () => {
  const artworks = ref<any[]>([])
  const featuredArtworks = ref<any[]>([])
  const currentArtwork = ref<any | null>(null)
  const relatedArtworks = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const pagination = ref({
    currentPage: 1,
    pageSize: 12,
    totalPages: 1,
    totalElements: 0
  })

  const filters = ref({
    category: '',
    sortBy: 'latest',
    tags: '',
    keyword: ''
  })

  const hasArtworks = computed(() => artworks.value.length > 0)
  const isEmpty = computed(() => !loading.value && artworks.value.length === 0)

  async function fetchArtworks(params: any = {}) {
    loading.value = true
    error.value = null
    try {
      const requestParams = {
        page: pagination.value.currentPage - 1,
        pageSize: pagination.value.pageSize,
        category: filters.value.category,
        sortBy: filters.value.sortBy,
        tags: filters.value.tags,
        ...params
      }
      
      const response = await artworkApi.getArtworks(requestParams)
      artworks.value = response.data || []
      pagination.value.totalPages = response.totalPages || 1
      pagination.value.totalElements = response.totalElements || 0
      
      return response
    } catch (err: any) {
      error.value = err.message || '获取作品列表失败'
      console.error('fetchArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedArtworks(pageSize: number = 12) {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.getArtworks({ page: 0, pageSize })
      featuredArtworks.value = response.data || []
      return featuredArtworks.value
    } catch (err: any) {
      error.value = err.message || '获取精选作品失败'
      console.error('fetchFeaturedArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchArtworkById(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.getArtworkById(id)
      currentArtwork.value = response.data || response
      
      if (currentArtwork.value?.category) {
        await fetchRelatedArtworks(currentArtwork.value.category, id)
      }
      
      return currentArtwork.value
    } catch (err: any) {
      error.value = err.message || '获取作品详情失败'
      console.error('fetchArtworkById error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRelatedArtworks(category: string, excludeId: number, limit: number = 4) {
    try {
      const response = await artworkApi.getArtworks({ category, limit: 8 })
      relatedArtworks.value = (response.data || [])
        .filter((item: any) => item.id !== excludeId)
        .slice(0, limit)
      return relatedArtworks.value
    } catch (err: any) {
      console.error('fetchRelatedArtworks error:', err)
      relatedArtworks.value = []
      return []
    }
  }

  async function searchArtworks(keyword: string) {
    if (!keyword?.trim()) {
      return fetchArtworks()
    }
    
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.searchArtworks(keyword)
      artworks.value = response.data || []
      pagination.value.totalPages = 1
      pagination.value.totalElements = artworks.value.length
      filters.value.keyword = keyword
      return response
    } catch (err: any) {
      error.value = err.message || '搜索作品失败'
      console.error('searchArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createArtwork(artworkData: any) {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.createArtwork(artworkData)
      artworks.value.unshift(response)
      pagination.value.totalElements += 1
      return response
    } catch (err: any) {
      error.value = err.message || '创建作品失败'
      console.error('createArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateArtwork(id: number, artworkData: any) {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.updateArtwork(id, artworkData)
      const index = artworks.value.findIndex((a: any) => a.id === id)
      if (index !== -1) {
        artworks.value[index] = response
      }
      if (currentArtwork.value?.id === id) {
        currentArtwork.value = { ...currentArtwork.value, ...response }
      }
      return response
    } catch (err: any) {
      error.value = err.message || '更新作品失败'
      console.error('updateArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteArtwork(id: number) {
    loading.value = true
    error.value = null
    try {
      await artworkApi.deleteArtwork(id)
      artworks.value = artworks.value.filter((a: any) => a.id !== id)
      pagination.value.totalElements = Math.max(0, pagination.value.totalElements - 1)
      if (currentArtwork.value?.id === id) {
        currentArtwork.value = null
      }
      return true
    } catch (err: any) {
      error.value = err.message || '删除作品失败'
      console.error('deleteArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function batchDeleteArtworks(ids: number[]) {
    loading.value = true
    error.value = null
    try {
      await artworkApi.batchDeleteArtworks(ids)
      artworks.value = artworks.value.filter((a: any) => !ids.includes(a.id))
      pagination.value.totalElements -= ids.length
      return true
    } catch (err: any) {
      error.value = err.message || '批量删除失败'
      console.error('batchDeleteArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: any) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      category: '',
      sortBy: 'latest',
      tags: '',
      keyword: ''
    }
  }

  function setPage(page: number) {
    pagination.value.currentPage = page
  }

  function clearCurrentArtwork() {
    currentArtwork.value = null
    relatedArtworks.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    artworks,
    featuredArtworks,
    currentArtwork,
    relatedArtworks,
    loading,
    error,
    pagination,
    filters,
    hasArtworks,
    isEmpty,
    fetchArtworks,
    fetchFeaturedArtworks,
    fetchArtworkById,
    fetchRelatedArtworks,
    searchArtworks,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    batchDeleteArtworks,
    setFilters,
    resetFilters,
    setPage,
    clearCurrentArtwork,
    clearError
  }
}, {
  persist: {
    key: 'art-gallery-artwork',
    paths: ['filters'],
    storage: localStorage
  }
})
