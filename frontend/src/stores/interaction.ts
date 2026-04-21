import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import interactionApi from '@/api/interaction'

export const useInteractionStore = defineStore('interaction', () => {
  const likeStatus = ref({
    isLiked: false,
    likeCount: 0
  })
  
  const comments = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasComments = computed(() => comments.value.length > 0)
  const commentCount = computed(() => comments.value.length)

  async function fetchLikeStatus(artworkId: number) {
    loading.value = true
    error.value = null
    try {
      const [countResponse, statusResponse] = await Promise.all([
        interactionApi.getLikeCount(artworkId),
        interactionApi.checkLikeStatus(artworkId)
      ])
      
      likeStatus.value = {
        likeCount: countResponse.likeCount || 0,
        isLiked: statusResponse.isLiked || false
      }
      
      return likeStatus.value
    } catch (err: any) {
      error.value = err.message || '获取点赞状态失败'
      console.error('fetchLikeStatus error:', err)
      likeStatus.value = { isLiked: false, likeCount: 0 }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleLike(artworkId: number) {
    loading.value = true
    error.value = null
    try {
      let response
      if (likeStatus.value.isLiked) {
        response = await interactionApi.unlikeArtwork(artworkId)
      } else {
        response = await interactionApi.likeArtwork(artworkId)
      }
      
      likeStatus.value = {
        likeCount: response.likeCount || 0,
        isLiked: !likeStatus.value.isLiked
      }
      
      return likeStatus.value
    } catch (err: any) {
      error.value = err.message || '点赞操作失败'
      console.error('toggleLike error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchComments(artworkId: number) {
    loading.value = true
    error.value = null
    try {
      const response = await interactionApi.getTopLevelComments(artworkId)
      comments.value = response || []
      
      const commentsWithReplies = await Promise.all(
        comments.value.map(async (comment) => {
          try {
            const replies = await interactionApi.getReplies(comment.id)
            return { ...comment, replies: replies || [] }
          } catch {
            return { ...comment, replies: [] }
          }
        })
      )
      
      comments.value = commentsWithReplies
      return comments.value
    } catch (err: any) {
      error.value = err.message || '获取评论列表失败'
      console.error('fetchComments error:', err)
      comments.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitComment(artworkId: number, content: string, parentId: number | null = null) {
    loading.value = true
    error.value = null
    try {
      await interactionApi.createComment(artworkId, {
        content: content.trim(),
        parentId
      })
      
      await fetchComments(artworkId)
      await fetchLikeStatus(artworkId)
      
      return true
    } catch (err: any) {
      error.value = err.message || '提交评论失败'
      console.error('submitComment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteComment(commentId: number, _artworkId: number) {
    loading.value = true
    error.value = null
    try {
      await interactionApi.deleteComment(commentId)
      comments.value = comments.value.filter((c: any) => c.id !== commentId)
      return true
    } catch (err: any) {
      error.value = err.message || '删除评论失败'
      console.error('deleteComment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitReply(artworkId: number, commentId: number, content: string) {
    loading.value = true
    error.value = null
    try {
      await interactionApi.createComment(artworkId, {
        content: content.trim(),
        parentId: commentId
      })
      
      await fetchComments(artworkId)
      await fetchLikeStatus(artworkId)
      
      return true
    } catch (err: any) {
      error.value = err.message || '提交回复失败'
      console.error('submitReply error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function resetLikeStatus() {
    likeStatus.value = { isLiked: false, likeCount: 0 }
  }

  function clearComments() {
    comments.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    likeStatus,
    comments,
    loading,
    error,
    hasComments,
    commentCount,
    fetchLikeStatus,
    toggleLike,
    fetchComments,
    submitComment,
    deleteComment,
    submitReply,
    resetLikeStatus,
    clearComments,
    clearError
  }
})
