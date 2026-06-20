<template>
  <div>
    <Navbar />
    <div class="admin-artworks-container">
      <div class="dashboard-row">
        <div class="dashboard-sidebar">
          <el-card>
            <template #header>
              <h5>管理菜单</h5>
            </template>
            <el-menu
              :default-active="activeMenu"
              router
              class="admin-menu"
            >
              <el-menu-item index="/admin">
                <el-icon><Odometer /></el-icon>
                <span>仪表盘</span>
              </el-menu-item>
              <el-menu-item index="/admin/artworks">
                <el-icon><Picture /></el-icon>
                <span>作品管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </div>

        <div class="dashboard-content">
          <div class="page-header mb-4">
            <h2>作品管理</h2>
            <el-button type="primary" @click="showCreateModal = true">
              <el-icon><Plus /></el-icon> 添加作品
            </el-button>
          </div>

          <!-- Batch Actions -->
          <el-card v-if="selectedArtworks.length > 0" class="mb-4">
            <div class="batch-actions">
              <span>已选择 {{ selectedArtworks.length }} 件作品</span>
              <div>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleBatchDelete"
                  class="me-2"
                >
                  <el-icon><Delete /></el-icon> 批量删除
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="showBatchUpdateModal = true"
                >
                  <el-icon><Edit /></el-icon> 批量修改
                </el-button>
              </div>
            </div>
          </el-card>

          <!-- Artworks Table -->
          <el-card>
            <div v-if="artworkStore.loading" class="loading-spinner">
              <el-icon class="is-loading" :size="50"><Loading /></el-icon>
            </div>
            <div v-else-if="artworkStore.artworks.length === 0" class="text-center py-5 text-muted">
              暂无作品
            </div>
            <el-table v-else :data="artworkStore.artworks" stripe @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column label="预览" width="100">
                <template #default="{ row }">
                  <img
                    :src="row.imageUrl || '/placeholder.jpg'"
                    :alt="row.title"
                    class="artwork-preview"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="artist" label="艺术家" />
              <el-table-column label="分类" width="120">
                <template #default="{ row }">
                  <el-tag type="primary">{{ row.category }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(row)"
                    class="me-2"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDelete(row.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="showCreateModal"
      :title="editingArtwork ? '编辑作品' : '添加作品'"
      width="700px"
      @close="closeModal"
    >
      <el-form @submit.prevent="handleSubmit" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="艺术家" required>
          <el-input v-model="form.artist" />
        </el-form-item>
        <el-form-item label="分类" required>
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="请选择" value="" />
            <el-option label="油画" value="油画" />
            <el-option label="水彩" value="水彩" />
            <el-option label="素描" value="素描" />
            <el-option label="雕塑" value="雕塑" />
            <el-option label="摄影" value="摄影" />
            <el-option label="数字艺术" value="数字艺术" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="form.imageUrl" type="url" />
        </el-form-item>
        <el-form-item label="视频URL（可选）">
          <el-input v-model="form.videoUrl" type="url" />
        </el-form-item>
        <el-form-item label="标签（用逗号分隔）">
          <el-input v-model="form.tagsInput" placeholder="例如：抽象,现代,色彩丰富" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editingArtwork ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Batch Update Dialog -->
    <el-dialog
      v-model="showBatchUpdateModal"
      title="批量修改"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="分类">
          <el-select v-model="batchUpdateForm.category" style="width: 100%">
            <el-option label="不修改" value="" />
            <el-option label="油画" value="油画" />
            <el-option label="水彩" value="水彩" />
            <el-option label="素描" value="素描" />
            <el-option label="雕塑" value="雕塑" />
            <el-option label="摄影" value="摄影" />
            <el-option label="数字艺术" value="数字艺术" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchUpdateModal = false">取消</el-button>
        <el-button type="primary" @click="handleBatchUpdate" :loading="submitting">
          更新
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { useArtworkStore } from '@/stores/artwork'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const artworkStore = useArtworkStore()

const activeMenu = computed(() => route.path)


const selectedArtworks = ref([])
const showCreateModal = ref(false)
const showBatchUpdateModal = ref(false)
const editingArtwork = ref(null)
const submitting = ref(false)

const form = ref({
  title: '',
  artist: '',
  category: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
  tagsInput: ''
})

const batchUpdateForm = ref({
  category: ''
})

const allSelected = computed(() => {
  return artworkStore.artworks.length > 0 && selectedArtworks.value.length === artworkStore.artworks.length
})

onMounted(() => {
  loadArtworks()
})

const loadArtworks = async () => {
  try {
    await artworkStore.fetchArtworks({ pageSize: 100 })
  } catch (error) {
    console.error('获取作品列表失败:', error)
  }
}

const handleSelectionChange = (selection) => {
  selectedArtworks.value = selection.map(item => item.id)
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedArtworks.value = []
  } else {
    selectedArtworks.value = artworks.value.map(a => a.id)
  }
}

const handleEdit = (artwork) => {
  editingArtwork.value = artwork
  form.value = {
    title: artwork.title || '',
    artist: artwork.artist || '',
    category: artwork.category || '',
    description: artwork.description || '',
    imageUrl: artwork.imageUrl || '',
    videoUrl: artwork.videoUrl || '',
    tagsInput: (artwork.tags || []).join(',')
  }
  showCreateModal.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这件作品吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await artworkStore.deleteArtwork(id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + (error.response?.data?.message || error.message))
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedArtworks.value.length} 件作品吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await artworkStore.batchDeleteArtworks(selectedArtworks.value)
    selectedArtworks.value = []
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败：' + (error.response?.data?.message || error.message))
    }
  }
}

const handleBatchUpdate = async () => {
  if (selectedArtworks.value.length === 0) return

  submitting.value = true
  try {
    const updates = selectedArtworks.value.map(id => ({
      id,
      category: batchUpdateForm.value.category || undefined
    })).filter(u => u.category)

    if (updates.length > 0) {
      await artworkApi.batchUpdateArtworks(updates)
      // 更新本地数据
      updates.forEach(update => {
        const artwork = artworks.value.find(a => a.id === update.id)
        if (artwork) {
          artwork.category = update.category
        }
      })
      showBatchUpdateModal.value = false
      selectedArtworks.value = []
      batchUpdateForm.value = { category: '' }
      ElMessage.success('批量更新成功')
    }
  } catch (error) {
    ElMessage.error('批量更新失败：' + (error.response?.data?.message || error.message))
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const artworkData = {
      ...form.value,
      tags: form.value.tagsInput.split(',').map(t => t.trim()).filter(t => t)
    }
    delete artworkData.tagsInput

    if (editingArtwork.value) {
      await artworkStore.updateArtwork(editingArtwork.value.id, artworkData)
      ElMessage.success('更新成功')
    } else {
      await artworkStore.createArtwork(artworkData)
      ElMessage.success('创建成功')
    }

    closeModal()
  } catch (error) {
    ElMessage.error((editingArtwork.value ? '更新' : '创建') + '失败：' + (error.response?.data?.message || error.message))
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingArtwork.value = null
  form.value = {
    title: '',
    artist: '',
    category: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    tagsInput: ''
  }
}
</script>

<style scoped>
.admin-artworks-container {
  max-width: 1600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.dashboard-row {
  display: flex;
  gap: 2rem;
}

.dashboard-sidebar {
  flex: 0 0 250px;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
}

.admin-menu {
  border: none;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: var(--primary-color);
}

.artwork-preview {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--text-secondary);
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

@media (max-width: 992px) {
  .dashboard-row {
    flex-direction: column;
  }

  .dashboard-sidebar {
    flex: 0 0 auto;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .batch-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>

