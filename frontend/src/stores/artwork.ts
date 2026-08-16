import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import artworkApi from '@/api/artwork'
import { cleanTags } from '@/utils/tags'
import type {
  Artwork,
  ArtworkCreateRequest,
  ArtworkUpdateRequest,
  PageQuery,
  GalleryFilterState,
  PaginationState,
  ArtworkListResponse,
} from '@/types'

function normalizeArtwork(artwork: Artwork): Artwork {
  return {
    ...artwork,
    tags: artwork.tags ? cleanTags(artwork.tags) : [],
  }
}

export const useArtworkStore = defineStore(
  'artwork',
  () => {
    const artworks = ref<Artwork[]>([])
    const featuredArtworks = ref<Artwork[]>([])
    const currentArtwork = ref<Artwork | null>(null)
    const relatedArtworks = ref<Artwork[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const categories = ref<string[]>([])
    const categoriesLoading = ref(false)

    const pagination = ref<PaginationState>({
      currentPage: 1,
      pageSize: 12,
      totalPages: 1,
      totalElements: 0,
    })

    const filters = ref<GalleryFilterState>({
      category: '',
      sortBy: 'latest',
      tags: '',
      keyword: '',
    })

    const hasArtworks = computed(() => artworks.value.length > 0)
    const isEmpty = computed(() => !loading.value && artworks.value.length === 0)

    /**
     * 统一构建查询参数：filters + pagination 合二为一
     * 所有筛选条件（keyword/category/tags/sortBy）一起传递，
     * 后端在 getArtworks 接口内统一处理，避免 keyword 走独立 API 导致其他筛选丢失。
     */
    function buildQuery(): PageQuery {
      const query: PageQuery = {
        page: pagination.value.currentPage - 1,
        pageSize: pagination.value.pageSize,
        sortBy: filters.value.sortBy,
      }
      const keyword = filters.value.keyword?.trim()
      if (keyword) query.keyword = keyword
      if (filters.value.category) query.category = filters.value.category
      if (filters.value.tags) query.tags = filters.value.tags
      return query
    }

    async function fetchArtworks(): Promise<ArtworkListResponse> {
      loading.value = true
      error.value = null
      try {
        const requestParams = buildQuery()
        const response = await artworkApi.getArtworks(requestParams)
        artworks.value = response.data.map(normalizeArtwork)
        pagination.value.totalPages = response.totalPages
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
        featuredArtworks.value = response.data.map(normalizeArtwork)
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
        currentArtwork.value = normalizeArtwork(response)

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

    async function fetchRelatedArtworks(
      category: string,
      excludeId: number,
      limit: number = 4,
    ): Promise<Artwork[]> {
      error.value = null
      try {
        const response = await artworkApi.getArtworks({ category, limit: 8 })
        relatedArtworks.value = response.data
          .map(normalizeArtwork)
          .filter((item) => item.id !== excludeId)
          .slice(0, limit)
        return relatedArtworks.value
      } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : '获取相关作品失败'
        console.error('fetchRelatedArtworks error:', err)
        relatedArtworks.value = []
        throw err
      }
    }

    async function searchArtworks(keyword: string): Promise<ArtworkListResponse> {
      const trimmedKeyword = keyword?.trim() ?? ''
      // 只更新 filters 中的 keyword，重置到第1页
      setFilters({ keyword: trimmedKeyword })
      // 统一走 fetchArtworks：buildQuery 会把 keyword + category + tags + sortBy 一起传给后端
      return fetchArtworks()
    }

    async function createArtwork(artworkData: ArtworkCreateRequest): Promise<Artwork> {
      loading.value = true
      error.value = null
      try {
        const response = await artworkApi.createArtwork(artworkData)
        artworks.value.unshift(normalizeArtwork(response))
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
        const normalizedResponse = normalizeArtwork(response)
        const index = artworks.value.findIndex((a) => a.id === id)
        if (index !== -1) {
          artworks.value[index] = normalizedResponse
        }
        if (currentArtwork.value?.id === id) {
          currentArtwork.value = normalizedResponse
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
        artworks.value = artworks.value.filter((a) => a.id !== id)
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
        artworks.value = artworks.value.filter((a) => !ids.includes(a.id))
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
      pagination.value.currentPage = 1
    }

    function resetFilters(): void {
      filters.value = {
        category: '',
        sortBy: 'latest',
        tags: '',
        keyword: '',
      }
      pagination.value.currentPage = 1
    }

    function setPage(page: number): void {
      pagination.value.currentPage = page
    }

    function setPageSize(pageSize: number): void {
      pagination.value.pageSize = pageSize
      pagination.value.currentPage = 1
    }

    function clearCurrentArtwork(): void {
      currentArtwork.value = null
      relatedArtworks.value = []
    }

    function clearError(): void {
      error.value = null
    }

    async function fetchCategories(): Promise<string[]> {
      categoriesLoading.value = true
      error.value = null
      try {
        const response = await artworkApi.getCategories()
        categories.value = response
        return response
      } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : '获取分类列表失败'
        console.error('fetchCategories error:', err)
        categories.value = []
        throw err
      } finally {
        categoriesLoading.value = false
      }
    }

    return {
      artworks,
      featuredArtworks,
      currentArtwork,
      relatedArtworks,
      loading,
      error,
      categories,
      categoriesLoading,
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
      buildQuery,
      setFilters,
      resetFilters,
      setPage,
      setPageSize,
      clearCurrentArtwork,
      clearError,
      fetchCategories,
    }
  },
  {
    persist: {
      key: 'art-gallery-artwork',
      paths: ['filters'],
      storage: localStorage,
    },
  },
)
