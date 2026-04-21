import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrollAnimation() {
  const elements = ref<HTMLElement[]>([])

  const checkVisibility = () => {
    elements.value.forEach(el => {
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add('visible')
        }
      }
    })
  }

  const addElement = (el: HTMLElement) => {
    if (el && !elements.value.includes(el)) {
      elements.value.push(el)
      // 立即检查是否可见
      setTimeout(() => checkVisibility(), 100)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', checkVisibility)
    setTimeout(() => checkVisibility(), 100)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', checkVisibility)
  })

  return {
    addElement,
    checkVisibility
  }
}
