import { ref } from 'vue'

export function useGalleryFilters() {
  const searchKeyword = ref('')

  const handleSearch = (searchFn: (keyword: string) => void) => {
    if (searchKeyword.value.trim()) {
      searchFn(searchKeyword.value)
    } else {
      searchFn('')
    }
  }

  const resetSearch = () => {
    searchKeyword.value = ''
  }

  return {
    searchKeyword,
    handleSearch,
    resetSearch,
  }
}
