<template>
  <div class="register-page">
    <el-container>
      <el-main>
        <div class="register-container">
          <el-card class="register-card" shadow="always">
            <h2 class="register-title">注册</h2>
            
            <el-form @submit.prevent="handleRegister" :model="form" label-position="top">
              <el-form-item label="用户名">
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  required
                />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input
                  v-model="form.email"
                  type="email"
                  placeholder="请输入邮箱"
                  required
                />
              </el-form-item>

              <el-form-item label="密码">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  required
                  minlength="6"
                  show-password
                />
              </el-form-item>

              <el-form-item label="确认密码">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  required
                  show-password
                />
              </el-form-item>

              <el-form-item label="头像（可选）">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  accept="image/*"
                  :auto-upload="false"
                >
                  <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>

              <el-form-item label="兴趣标签（可选）">
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
                <el-button
                  type="primary"
                  class="w-100"
                  :loading="loading"
                  :disabled="form.password !== form.confirmPassword"
                  @click="handleRegister"
                >
                  注册
                </el-button>
              </el-form-item>
            </el-form>

            <div class="login-link">
              已有账号？
              <router-link to="/login">立即登录</router-link>
            </div>

            <el-alert
              v-if="error"
              type="error"
              :title="error"
              :closable="false"
              class="mt-3"
            />
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  tags: [],
  avatar: null
})

const availableTags = ['油画', '水彩', '素描', '雕塑', '摄影', '数字艺术', '抽象', '写实', '现代', '古典']
const avatarPreview = ref('')
const loading = ref(false)
const error = ref('')

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

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const userData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      tags: form.value.tags
    }

    await userStore.register(userData)

    // 如果有头像，上传头像
    if (form.value.avatar) {
      await userStore.updateUserInfo({ avatar: form.value.avatar })
    }

    router.push('/home')
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
}

.register-title {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-uploader {
  text-align: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  margin: 0;
}

.login-link {
  text-align: center;
}

.w-100 {
  width: 100%;
}

.mt-3 {
  margin-top: 12px;
}
</style>

