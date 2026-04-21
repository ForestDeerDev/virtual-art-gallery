<template>
  <div>
    <Navbar />
    <div class="container profile-container">
      <div class="profile-row">
        <div class="profile-sidebar">
          <el-card class="user-card">
            <div class="user-card-body text-center">
              <img
                v-if="userStore.userInfo?.avatar"
                :src="userStore.userInfo.avatar"
                alt="头像"
                class="user-avatar"
              />
              <div v-else class="user-avatar-placeholder">
                <el-icon :size="80"><User /></el-icon>
              </div>
              <h4>{{ userStore.userInfo?.username }}</h4>
              <p class="text-muted">{{ userStore.userInfo?.email }}</p>
              <el-tag v-if="userStore.isAdmin" type="danger">管理员</el-tag>
            </div>
          </el-card>
        </div>

        <div class="profile-content">
          <el-card>
            <template #header>
              <div class="card-header">
                <h5>个人资料</h5>
              </div>
            </template>
            <el-form @submit.prevent="handleUpdate" label-width="100px">
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  accept="image/*"
                  :on-change="handleAvatarChange"
                  :auto-upload="false"
                >
                  <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>

              <el-form-item label="用户名">
                <el-input id="username" v-model="form.username" required />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input id="email" v-model="form.email" type="email" required />
              </el-form-item>

              <el-form-item label="兴趣标签">
                <div class="tags-container">
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
              </el-form-item>

              <el-form-item>
                <el-button type="primary" native-type="submit" :loading="loading">
                  保存更改
                </el-button>
              </el-form-item>
            </el-form>

            <el-alert v-if="error" type="error" :title="error" class="mt-3" show-icon />
            <el-alert v-if="success" type="success" :title="success" class="mt-3" show-icon />
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { useUserStore } from '@/stores/user'
import userApi from '@/api/user'

const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  tags: [],
  avatar: null
})

const availableTags = ['油画', '水彩', '素描', '雕塑', '摄影', '数字艺术', '抽象', '写实', '现代', '古典']
const avatarPreview = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(() => {
  if (userStore.userInfo) {
    form.value.username = userStore.userInfo.username || ''
    form.value.email = userStore.userInfo.email || ''
    const tags = userStore.userInfo.tags || []
    form.value.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
})

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.avatar = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
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

const handleUpdate = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // 如果有新头像，先上传头像
    if (form.value.avatar) {
      const avatarResponse = await userApi.uploadAvatar(form.value.avatar)
      const userData = {
        username: form.value.username,
        email: form.value.email,
        tags: form.value.tags,
        avatar: avatarResponse.url
      }
      await userStore.updateUserInfo(userData)
    } else {
      const userData = {
        username: form.value.username,
        email: form.value.email,
        tags: form.value.tags
      }
      await userStore.updateUserInfo(userData)
    }

    success.value = '资料更新成功'
  } catch (err) {
    error.value = err.response?.data?.message || '更新失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-row {
  display: flex;
  gap: 2rem;
}

.profile-sidebar {
  flex: 0 0 300px;
}

.profile-content {
  flex: 1;
}

.user-card-body {
  padding: 2rem;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
}

.user-avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--gray);
}

.card-header h5 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.avatar-uploader {
  display: flex;
  align-items: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 40px;
  color: var(--gray);
  cursor: pointer;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  margin: 0;
}

.text-muted {
  color: var(--text-secondary);
}

.mt-3 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .profile-row {
    flex-direction: column;
  }

  .profile-sidebar {
    flex: 0 0 auto;
  }
}
</style>

