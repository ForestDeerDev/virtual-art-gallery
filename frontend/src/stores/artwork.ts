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

    async function fetchArtworks(): Promise<ArtworkListResponse> {
      loading.value = true
      error.value = null
      try {
        // requestParams 构建请求参数 作为查询条件发送给后端
        // 只在参数有实际值时才添加，避免空字符串导致后端查询失败
        const requestParams: PageQuery = {
          page: pagination.value.currentPage - 1,
          pageSize: pagination.value.pageSize,
          sortBy: filters.value.sortBy,
        }

        if (filters.value.category) {
          requestParams.category = filters.value.category
        }
        if (filters.value.tags) {
          requestParams.tags = filters.value.tags
        }

        // response 处理响应数据 作为查询结果返回给前端，然后存入 store 的状态中
        // 调用 API 获取作品列表，等待后端响应
        const response = await artworkApi.getArtworks(requestParams)
        // 将返回的作品列表存入 store
        artworks.value = response.data.map(normalizeArtwork)
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

      // 使用 setFilters 更新关键词，自动重置页码
      setFilters({ keyword: trimmedKeyword })

      // 搜索关键词为空时，返回所有作品
      if (!trimmedKeyword) {
        return fetchArtworks()
      }

      loading.value = true
      error.value = null
      try {
        // 传递分页参数，后端已支持分页
        const response = await artworkApi.searchArtworks(
          trimmedKeyword,
          pagination.value.currentPage - 1,
          pagination.value.pageSize,
        )
        artworks.value = response.data.map(normalizeArtwork)
        pagination.value.totalPages = response.totalPages
        pagination.value.totalElements = response.total
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
