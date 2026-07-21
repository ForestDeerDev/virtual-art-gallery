import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import artworkApi from '@/api/artwork'
import type { Artwork, ArtworkCreateRequest, ArtworkUpdateRequest, PageQuery, GalleryFilterState, PaginationState, ArtworkListResponse } from '@/types'

export const useArtworkStore = defineStore('artwork', () => {
  const artworks = ref<Artwork[]>([])
  const featuredArtworks = ref<Artwork[]>([])
  const currentArtwork = ref<Artwork | null>(null)
  const relatedArtworks = ref<Artwork[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const pagination = ref<PaginationState>({
    currentPage: 1,
    pageSize: 12,
    totalPages: 1,
    totalElements: 0
  })

  const filters = ref<GalleryFilterState>({
    category: '',
    sortBy: 'latest',
    tags: '',
    keyword: ''
  })

  const hasArtworks = computed(() => artworks.value.length > 0)
  const isEmpty = computed(() => !loading.value && artworks.value.length === 0)

  async function fetchArtworks(params: Partial<PageQuery> = {}): Promise<ArtworkListResponse> {
    loading.value = true
    error.value = null
    try {
      // requestParams 构建请求参数 作为查询条件发送给后端
      const requestParams: PageQuery = {
        page: pagination.value.currentPage - 1,
        pageSize: pagination.value.pageSize,
        category: filters.value.category,
        sortBy: filters.value.sortBy,
        tags: filters.value.tags,
        ...params
      }
      
      // response 处理响应数据 作为查询结果返回给前端，然后存入 store 的状态中
      // 调用 API 获取作品列表，等待后端响应
      const response = await artworkApi.getArtworks(requestParams)
      // 将返回的作品列表存入 store
      artworks.value = response.data
      // 更新总页数
      pagination.value.totalPages = response.totalPages
      // 更新总条数
      pagination.value.totalElements = response.total
      
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取作品列表失败'
      console.error('fetchArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedArtworks(pageSize: number = 12): Promise<Artwork[]> {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.getArtworks({ page: 0, pageSize })
      featuredArtworks.value = response.data
      return featuredArtworks.value
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取精选作品失败'
      console.error('fetchFeaturedArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchArtworkById(id: number): Promise<Artwork | null> {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.getArtworkById(id)
      currentArtwork.value = response
      
      if (currentArtwork.value?.category) {
        await fetchRelatedArtworks(currentArtwork.value.category, id)
      }
      
      return currentArtwork.value
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取作品详情失败'
      console.error('fetchArtworkById error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRelatedArtworks(category: string, excludeId: number, limit: number = 4): Promise<Artwork[]> {
    try {
      const response = await artworkApi.getArtworks({ category, limit: 8 })
      relatedArtworks.value = response.data
        .filter(item => item.id !== excludeId)
        .slice(0, limit)
      return relatedArtworks.value
    } catch (err: unknown) {
      console.error('fetchRelatedArtworks error:', err)
      relatedArtworks.value = []
      return []
    }
  }

  async function searchArtworks(keyword: string): Promise<ArtworkListResponse> {
    // 搜索关键词为空时，返回所有作品
    if (!keyword?.trim()) {
      return fetchArtworks()
    }
    
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.searchArtworks(keyword)
      artworks.value = response.data
      pagination.value.totalPages = 1
      pagination.value.totalElements = artworks.value.length
      filters.value.keyword = keyword
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '搜索作品失败'
      console.error('searchArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createArtwork(artworkData: ArtworkCreateRequest): Promise<Artwork> {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.createArtwork(artworkData)
      artworks.value.unshift(response)
      pagination.value.totalElements += 1
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '创建作品失败'
      console.error('createArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateArtwork(id: number, artworkData: ArtworkUpdateRequest): Promise<Artwork> {
    loading.value = true
    error.value = null
    try {
      const response = await artworkApi.updateArtwork(id, artworkData)
      const index = artworks.value.findIndex(a => a.id === id)
      if (index !== -1) {
        artworks.value[index] = response
      }
      if (currentArtwork.value?.id === id) {
        currentArtwork.value = { ...currentArtwork.value, ...response }
      }
      return response
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '更新作品失败'
      console.error('updateArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteArtwork(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await artworkApi.deleteArtwork(id)
      artworks.value = artworks.value.filter(a => a.id !== id)
      pagination.value.totalElements = Math.max(0, pagination.value.totalElements - 1)
      // 如果被删除的是“当前正在看的作品”，就清空详情页
      if (currentArtwork.value?.id === id) {
        currentArtwork.value = null
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '删除作品失败'
      console.error('deleteArtwork error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function batchDeleteArtworks(ids: number[]): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await artworkApi.batchDeleteArtworks({ ids })
      // 保留那些不在删除列表中的作品
      artworks.value = artworks.value.filter(a => !ids.includes(a.id))
      // 用新的筛选条件覆盖旧的，同时保留没改的条件
      pagination.value.totalElements -= ids.length
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '批量删除失败'
      console.error('batchDeleteArtworks error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 新值覆盖旧值，保留未修改的字段
  // emit('update:filters', { ...props.filters, category: value }) 传入 newFilters 的初始值
  function setFilters(newFilters: Partial<GalleryFilterState>): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = {
      category: '',
      sortBy: 'latest',
      tags: '',
      keyword: ''
    }
  }

  function setPage(page: number): void {
    pagination.value.currentPage = page
  }

  function clearCurrentArtwork(): void {
    currentArtwork.value = null
    relatedArtworks.value = []
  }

  function clearError(): void {
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
