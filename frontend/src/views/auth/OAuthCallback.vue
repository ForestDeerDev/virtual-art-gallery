<template>
  <div class="oauth-callback">
    <div class="callback-container">
      <el-card class="callback-card" shadow="always">
        <div class="callback-body">
          <div v-if="loading" class="mb-4">
            <el-icon class="is-loading" :size="48" color="#409EFF"><Loading /></el-icon>
          </div>
          <h2 class="text-center mb-4" v-if="loading">正在处理登录...</h2>
          <h2 class="text-center mb-4 text-success" v-else-if="success">
            <el-icon :size="32" color="#67C23A"><CircleCheckFilled /></el-icon> 登录成功
          </h2>
          <h2 class="text-center mb-4 text-danger" v-else-if="error">
            <el-icon :size="32" color="#F56C6C"><CircleCloseFilled /></el-icon> 登录失败
          </h2>
          <p class="mb-4" v-if="message">{{ message }}</p>
          <el-button 
            type="primary" 
            v-if="!loading" 
            @click="redirectToHome"
          >
            返回首页
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Loading, CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { getQueryString } from '@/utils/route'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const message = ref('')



onMounted(async () => {
  try {
    // 从URL中获取授权码和提供商
    const code = getQueryString(route.query.code)
    const provider = (route.params.provider as string) || 'github'

    if (!code) {
      throw new Error('缺少授权码')
    }

    // 调用后端API完成登录
    await userStore.oauthLogin({ provider, code })
    
    success.value = true
    message.value = '登录成功，正在跳转...'
    
    // 延迟跳转，让用户看到成功信息
    setTimeout(() => {
      redirectToHome()
    }, 1500)
    
  } catch (err: unknown) {
    console.error('OAuth登录失败:', err)
    error.value = true
    message.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
})

const redirectToHome = () => {
  router.push('/home')
}
</script>

<style scoped>
.oauth-callback {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.callback-container {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
}

.callback-card {
  border-radius: 15px;
}

.callback-body {
  padding: 2rem;
  text-align: center;
}

.text-center {
  text-align: center;
}

.text-success {
  color: #67C23A;
}

.text-danger {
  color: #F56C6C;
}

.mb-4 {
  margin-bottom: 1.5rem;
}
</style>