<template>
  <div class="login-page">
    <el-container>
      <el-main>
        <div class="login-container">
          <el-card class="login-card" shadow="always">
            <h2 class="login-title">登录</h2>
            
            <el-form @submit.prevent="handleLogin" :model="form" label-position="top">
              <el-form-item label="用户名">
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  required
                />
              </el-form-item>

              <el-form-item label="密码">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  required
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="form.remember">记住我</el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  class="w-100"
                  :loading="loading"
                  @click="handleLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>

            <el-divider>或使用第三方账号登录</el-divider>

            <div class="oauth-buttons">
              <el-button
                type="primary"
                plain
                @click="handleOAuthLogin('github')"
              >
                <el-icon><Promotion /></el-icon> GitHub
              </el-button>
              <el-button
                type="primary"
                plain
                @click="handleOAuthLogin('wechat')"
                disabled
              >
                <el-icon><ChatDotRound /></el-icon> 微信
              </el-button>
            </div>

            <div class="register-link">
              还没有账号？
              <router-link to="/register">立即注册</router-link>
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
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { isAxiosError } from 'axios'
import type { LoginRequest } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref<LoginRequest & { remember: boolean }>({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await userStore.login(form.value)
    const redirect = (route.query.redirect as string) ?? '/home'
    router.push(redirect)
  } catch (err: unknown) {
    if (isAxiosError<{ message?: string }>(err)) {
      error.value = err.response?.data?.message ?? '登录失败，请检查用户名和密码'
    } else {
      error.value = '登录失败，请检查用户名和密码'
    }
  } finally {
    loading.value = false
  }
}

const handleOAuthLogin = (provider: string) => {
  if (provider === 'github') {
    // GitHub OAuth登录：重定向到GitHub授权页面
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = `${window.location.origin}/oauth/callback/github`
    const scope = 'user:email,read:user'
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    window.location.href = githubAuthUrl
  } else {
    // 其他第三方登录暂未实现
    alert('该第三方登录方式暂未实现')
  }
}
</script>

<style scoped>
.login-page {
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 15px;
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
}

.oauth-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.register-link {
  text-align: center;
}

.w-100 {
  width: 100%;
}

.mt-3 {
  margin-top: 12px;
}
</style>

