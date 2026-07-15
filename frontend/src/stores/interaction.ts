import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import interactionApi from '@/api/interaction'
import type { Comment, LikeStatus } from '@/types'

export const useInteractionStore = defineStore('interaction', () => {
  const likeStatus = ref<LikeStatus>({
    isLiked: false,
    likeCount: 0
  })
  
  const comments = ref<Comment[]>([])
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
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取点赞状态失败'
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
        await interactionApi.unlikeArtwork(artworkId)
        response = { likeCount: likeStatus.value.likeCount - 1 }
      } else {
        response = await interactionApi.likeArtwork(artworkId)
      }
      
      likeStatus.value = {
        likeCount: response.likeCount || 0,
        isLiked: !likeStatus.value.isLiked
      }
      
      return likeStatus.value
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '点赞操作失败'
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
      // 先获取顶层评论列表
      const response = await interactionApi.getTopLevelComments(artworkId)
      comments.value = response
      
      const commentsWithReplies = await Promise.all(
        comments.value.map(async comment => {
          try {
            // 对每条评论，需要异步获取它的回复列表
            const replies = await interactionApi.getReplies(comment.id)
            return { ...comment, replies }
          } catch {
            return { ...comment, replies: [] }
          }
        })
      )
      
      comments.value = commentsWithReplies
      return comments.value
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取评论列表失败'
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
        parentId: parentId || undefined
      })
      
      await fetchComments(artworkId)
      await fetchLikeStatus(artworkId)
      
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交评论失败'
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
      // filter 方法在内部遍历时，会依次把每个评论对象传入给 c 回调函数
      // 删除 id 等于 commentId 的评论，保留所有不匹配的评论
      comments.value = comments.value.filter(c => c.id !== commentId)
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '删除评论失败'
      console.error('deleteComment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitReply(artworkId: number, content: string, commentId: number) {
    return submitComment(artworkId, content, commentId)
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
