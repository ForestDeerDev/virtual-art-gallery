<template>
  <div>
    <Navbar />
    
    <div class="container detail-container" v-if="!artworkStore.loading && artworkStore.currentArtwork">
      <div class="detail-row">
        <div class="detail-main">
          <el-card class="mb-4">
            <div class="artwork-image-container">
              <img
                v-if="artworkStore.currentArtwork.imageUrl"
                :src="artworkStore.currentArtwork.imageUrl"
                :alt="artworkStore.currentArtwork.title"
                class="artwork-image"
              />
              <div v-else class="image-placeholder">
                <el-icon :size="100" color="#ccc"><Picture /></el-icon>
              </div>
            </div>
          </el-card>

          <!-- Video if available -->
          <el-card v-if="artworkStore.currentArtwork.videoUrl" class="mb-4">
            <div class="video-container">
              <video
                :src="artworkStore.currentArtwork.videoUrl"
                controls
                class="artwork-video"
              ></video>
            </div>
          </el-card>

          <!-- Description -->
          <el-card>
            <template #header>
              <h5>作品描述</h5>
            </template>
            <p class="card-text">{{ artworkStore.currentArtwork.description || '暂无描述' }}</p>
            <div v-if="artworkStore.currentArtwork.tags && (Array.isArray(artworkStore.currentArtwork.tags) ? artworkStore.currentArtwork.tags.length > 0 : artworkStore.currentArtwork.tags.trim().length > 0)" class="mt-3">
              <strong>标签：</strong>
              <el-tag
                v-for="tag in parseCommaSeparated(artworkStore.currentArtwork.tags)"
                :key="tag"
                type="info"
                class="me-2"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>

          <!-- Like and Comment Section -->
          <el-card class="my-4">
            <template #header>
              <div class="interaction-header">
                <h5>互动区</h5>
                <el-button
                  :type="interactionStore.likeStatus.isLiked ? 'danger' : 'primary'"
                  :plain="!interactionStore.likeStatus.isLiked"
                  @click="toggleLike"
                >
                  <el-icon><component :is="interactionStore.likeStatus.isLiked ? 'StarFilled' : 'Star'" /></el-icon>
                  <span class="ms-1">{{ interactionStore.likeStatus.likeCount }}</span>
                </el-button>
              </div>
            </template>

            <!-- Comment Form -->
            <div class="comment-form">
              <h6 class="mb-3">发表评论</h6>
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="3"
                placeholder="写下您的评论..."
              />
              <el-button
                type="primary"
                @click="submitComment"
                :disabled="!commentContent.trim()"
                class="mt-2"
              >
                发布评论
              </el-button>
            </div>
          </el-card>

          <!-- Comments List -->
          <el-card>
            <template #header>
              <h5>评论 ({{ interactionStore.comments.length }})</h5>
            </template>
            <div v-if="interactionStore.comments.length === 0" class="text-muted">
              暂无评论，快来发表第一条评论吧！
            </div>
            <div v-else>
              <div
                v-for="comment in interactionStore.comments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-header">
                  <div class="user-info">
                    <img
                      :src="comment.user.avatar || 'https://via.placeholder.com/50'"
                      :alt="comment.user.username"
                      class="user-avatar"
                    />
                    <div>
                      <h6>{{ comment.user.username }}</h6>
                      <small class="text-muted">{{ formatDate(comment.createTime) }}</small>
                    </div>
                  </div>
                  <el-button
                    v-if="userStore.userInfo && userStore.userInfo.username === comment.user.username"
                    type="danger"
                    size="small"
                    circle
                    @click="deleteComment(comment.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <div class="comment-actions">
                  <el-button
                    type="primary"
                    size="small"
                    text
                    @click="toggleReply(comment)"
                  >
                    <el-icon><ChatDotRound /></el-icon> 回复 ({{ comment.replyCount }})
                  </el-button>
                </div>

                <!-- Reply Form -->
                <div v-if="replyingTo === comment.id" class="reply-form">
                  <el-input
                    v-model="replyContent"
                    type="textarea"
                    :rows="2"
                    placeholder="写下您的回复..."
                  />
                  <div class="reply-actions">
                    <el-button size="small" @click="cancelReply">取消</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="submitReply(comment.id)"
                      :disabled="!replyContent.trim()"
                    >
                      发布回复
                    </el-button>
                  </div>
                </div>

                <!-- Replies -->
                <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                  <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="reply-item"
                  >
                    <div class="comment-header">
                      <div class="user-info">
                        <img
                          :src="reply.user.avatar || 'https://via.placeholder.com/40'"
                          :alt="reply.user.username"
                          class="user-avatar small"
                        />
                        <div>
                          <h6>{{ reply.user.username }}</h6>
                          <small class="text-muted">{{ formatDate(reply.createTime) }}</small>
                        </div>
                      </div>
                      <el-button
                        v-if="userStore.userInfo && userStore.userInfo.username === reply.user.username"
                        type="danger"
                        size="small"
                        circle
                        @click="deleteComment(reply.id)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                    <p class="comment-content">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <div class="detail-sidebar">
          <el-card class="mb-4">
            <template #header>
              <h5>作品信息</h5>
            </template>
            <div class="artwork-info">
              <h3 class="card-title mb-3">{{ artworkStore.currentArtwork.title }}</h3>
              <p class="info-item">
                <el-icon><User /></el-icon>
                <strong>艺术家：</strong>
                {{ artworkStore.currentArtwork.artist }}
              </p>
              <p class="info-item">
                <el-icon><PriceTag /></el-icon>
                <strong>分类：</strong>
                <el-tag type="primary">{{ artworkStore.currentArtwork.category }}</el-tag>
              </p>
              <p class="info-item">
                <el-icon><Calendar /></el-icon>
                <strong>创作时间：</strong>
                {{ artworkStore.currentArtwork.createTime || '未知' }}
              </p>
              <p class="info-item">
                <el-icon><Ruler /></el-icon>
                <strong>尺寸：</strong>
                {{ artworkStore.currentArtwork.dimensions || '未知' }}
              </p>
              <p class="info-item">
                <el-icon><Brush /></el-icon>
                <strong>材质：</strong>
                {{ artworkStore.currentArtwork.material || '未知' }}
              </p>
            </div>
          </el-card>

          <el-card>
            <template #header>
              <h5>相关作品</h5>
            </template>
            <div v-if="artworkStore.relatedArtworks.length === 0" class="text-muted">
              暂无相关作品
            </div>
            <div v-else class="related-grid">
              <div
                v-for="related in artworkStore.relatedArtworks"
                :key="related.id"
                class="related-item"
              >
                <router-link :to="`/artwork/${related.id}`">
                  <img
                    :src="related.imageUrl || '/placeholder.jpg'"
                    :alt="related.title"
                    class="related-image"
                  />
                  <p class="related-title">{{ related.title }}</p>
                </router-link>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <div v-else-if="artworkStore.loading" class="loading-spinner">
      <el-icon class="is-loading" :size="50"><Loading /></el-icon>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArtworkStore } from '@/stores/artwork'
import { useInteractionStore } from '@/stores/interaction'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { parseCommaSeparated } from '@/utils/tags'

const route = useRoute()
const userStore = useUserStore()
const artworkStore = useArtworkStore()
const interactionStore = useInteractionStore()

const commentContent = ref('')
const replyContent = ref('')
const replyingTo = ref(null)

onMounted(async () => {
  const artworkId = route.params.id
  try {
    await artworkStore.fetchArtworkById(artworkId)
    await interactionStore.fetchLikeStatus(artworkId)
    await interactionStore.fetchComments(artworkId)
  } catch (error) {
    console.error('加载作品详情失败:', error)
  }
})

onUnmounted(() => {
  artworkStore.clearCurrentArtwork()
  interactionStore.clearComments()
  interactionStore.resetLikeStatus()
})

async function toggleLike() {
  const artworkId = artworkStore.currentArtwork?.id
  if (artworkId) {
    await interactionStore.toggleLike(artworkId)
  }
}

async function submitComment() {
  const artworkId = artworkStore.currentArtwork?.id
  if (artworkId && commentContent.value.trim()) {
    await interactionStore.submitComment(artworkId, commentContent.value)
    commentContent.value = ''
  }
}

async function submitReply(commentId) {
  const artworkId = artworkStore.currentArtwork?.id
  if (artworkId && replyContent.value.trim()) {
    await interactionStore.submitReply(artworkId, replyContent.value, commentId)
    replyContent.value = ''
    replyingTo.value = null
  }
}

function toggleReply(comment) {
  if (replyingTo.value === comment.id) {
    replyingTo.value = null
    replyContent.value = ''
  } else {
    replyingTo.value = comment.id
    replyContent.value = ''
  }
}

function cancelReply() {
  replyingTo.value = null
  replyContent.value = ''
}

async function deleteComment(commentId) {
  if (confirm('确定要删除这条评论吗？')) {
    const artworkId = artworkStore.currentArtwork?.id
    if (artworkId) {
      await interactionStore.deleteComment(commentId, artworkId)
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}
</script>

<style scoped>
.detail-container {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.detail-row {
  display: flex;
  gap: 2rem;
}

.detail-main {
  flex: 1;
  min-width: 0;
}

.detail-sidebar {
  flex: 0 0 350px;
}

.artwork-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--light-color);
  padding: 1rem;
}

.artwork-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-gray);
}

.video-container {
  width: 100%;
}

.artwork-video {
  width: 100%;
  max-height: 600px;
}

.interaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-form {
  padding: 1rem 0;
}

.comment-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--light-gray);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar.small {
  width: 40px;
  height: 40px;
}

.comment-content {
  margin: 0.5rem 0;
}

.comment-actions {
  margin-top: 0.5rem;
}

.reply-form {
  margin-top: 1rem;
  padding-left: 2rem;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.replies-list {
  margin-top: 1rem;
  padding-left: 2rem;
}

.reply-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-gray);
}

.artwork-info p {
  margin-bottom: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.related-item {
  text-decoration: none;
}

.related-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.related-title {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: var(--primary-color);
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.my-4 {
  margin: 1.5rem 0;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.ms-1 {
  margin-left: 0.25rem;
}

.text-muted {
  color: var(--text-secondary);
}

.card-text {
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 992px) {
  .detail-row {
    flex-direction: column;
  }

  .detail-sidebar {
    flex: 0 0 auto;
  }
}
</style>

