<template>
  <div>
    <Navbar />
    <div class="container upload-container">
      <div class="upload-wrapper">
        <el-card>
          <template #header>
            <h4>上传作品</h4>
          </template>
          <el-form @submit.prevent="handleSubmit" label-width="120px">
            <el-form-item label="作品图片 *" required>
              <el-upload
                class="artwork-uploader"
                :show-file-list="false"
                accept="image/*"
                :on-change="handleImageChange"
                :auto-upload="false"
              >
                <div v-if="imagePreview" class="preview-container">
                  <img :src="imagePreview" alt="作品预览" class="preview-image" />
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon :size="40"><Picture /></el-icon>
                  <div>点击上传图片</div>
                </div>
              </el-upload>
              <div class="form-help">支持 JPG、PNG、GIF 格式，最大 10MB</div>
              
              <div v-if="uploadingImage" class="mt-2">
                <el-progress :percentage="100" status="success" :indeterminate="true" />
              </div>
            </el-form-item>

            <el-form-item label="作品标题 *" required>
              <el-input
                v-model="form.title"
                placeholder="请输入作品标题"
              />
            </el-form-item>

            <el-form-item label="作品分类 *" required>
              <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
                <el-option label="油画" value="油画" />
                <el-option label="水彩" value="水彩" />
                <el-option label="素描" value="素描" />
                <el-option label="雕塑" value="雕塑" />
                <el-option label="摄影" value="摄影" />
                <el-option label="数字艺术" value="数字艺术" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>

            <el-form-item label="作品描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请描述您的作品..."
              />
            </el-form-item>

            <div class="form-row">
              <el-form-item label="作品尺寸">
                <el-input
                  v-model="form.dimensions"
                  placeholder="例如：100cm × 80cm"
                />
              </el-form-item>
              <el-form-item label="作品材质">
                <el-input
                  v-model="form.material"
                  placeholder="例如：布面油画"
                />
              </el-form-item>
            </div>

            <el-form-item label="作品标签">
              <div class="tags-container mb-2">
                <el-tag
                  v-for="tag in availableTags"
                  :key="tag"
                  :type="form.tags.includes(tag) ? 'primary' : 'info'"
                  class="tag-item"
                  @click="toggleTag(tag)"
                  style="cursor: pointer;"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="custom-tag-input">
                <el-input
                  v-model="customTag"
                  placeholder="添加自定义标签"
                  @keyup.enter="addCustomTag"
                >
                  <template #append>
                    <el-button @click="addCustomTag">添加</el-button>
                  </template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="form.featured">设为精选作品</el-checkbox>
            </el-form-item>

            <el-form-item>
              <div class="button-group">
                <el-button
                  type="primary"
                  native-type="submit"
                  :loading="loading"
                  :disabled="!form.imageUrl"
                >
                  {{ loading ? '提交中...' : '发布作品' }}
                </el-button>
                <el-button @click="handleCancel">取消</el-button>
              </div>
            </el-form-item>

            <el-alert v-if="error" type="error" :title="error" class="mt-3" show-icon />
            <el-alert v-if="success" type="success" :title="success" class="mt-3" show-icon />
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import artworkApi from '@/api/artwork'

const router = useRouter()

const form = ref({
  title: '',
  category: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
  tags: [],
  dimensions: '',
  material: '',
  featured: false
})

const availableTags = ['抽象', '写实', '现代', '古典', '风景', '人物', '静物', '动物', '建筑', '肖像']
const customTag = ref('')
const imagePreview = ref('')
const imageFile = ref(null)
const uploadingImage = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleImageChange = async (file) => {
  const fileObj = file.raw
  if (!fileObj) return

  if (fileObj.size > 10 * 1024 * 1024) {
    error.value = '文件大小不能超过 10MB'
    return
  }

  imageFile.value = fileObj
  imagePreview.value = URL.createObjectURL(fileObj)
  error.value = ''

  uploadingImage.value = true
  try {
    const response = await artworkApi.uploadArtworkImage(fileObj)
    form.value.imageUrl = response.url
  } catch (err) {
    error.value = '图片上传失败，请重试'
    form.value.imageUrl = ''
    imagePreview.value = ''
  } finally {
    uploadingImage.value = false
  }
}

const toggleTag = (tag) => {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  } else {
    form.value.tags.push(tag)
  }
}

const addCustomTag = () => {
  const tag = customTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  customTag.value = ''
}

const handleSubmit = async () => {
  if (!form.value.imageUrl) {
    error.value = '请先上传作品图片'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await artworkApi.createArtwork(form.value)
    success.value = '作品发布成功！'
    
    setTimeout(() => {
      router.push('/gallery')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || '发布失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.upload-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.upload-wrapper {
  max-width: 100%;
}

.artwork-uploader {
  width: 100%;
}

.preview-container {
  width: 100%;
  max-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.upload-placeholder {
  width: 100%;
  height: 200px;
  border: 2px dashed var(--gray);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.form-help {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row > div {
  flex: 1;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  margin: 0;
  transition: all 0.2s ease;
}

.tag-item:hover {
  transform: scale(1.05);
}

.custom-tag-input {
  margin-top: 0.5rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
  }
}
</style>
