<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    :ellipsis="false"
    class="navbar"
    :class="{ scrolled: isScrolled }"
  >
    <div class="container">
      <el-menu-item index="home" class="brand-item">
        <router-link to="/home" class="navbar-brand">
          <el-icon><Brush /></el-icon>
          <span class="brand-text">虚拟艺术画廊</span>
        </router-link>
      </el-menu-item>

    <el-menu-item index="/home" @click="router.push('/home')">
      <el-icon><House /></el-icon>
      <span>首页</span>
    </el-menu-item>

    <el-menu-item index="/gallery" @click="router.push('/gallery')">
      <el-icon><Grid /></el-icon>
      <span>画廊</span>
    </el-menu-item>

    <el-menu-item v-if="userStore.isAuthenticated" index="/recommendations" @click="router.push('/recommendations')">
      <el-icon><Star /></el-icon>
      <span>推荐</span>
    </el-menu-item>

    <el-menu-item v-if="userStore.isAuthenticated" index="/upload" @click="router.push('/upload')">
      <el-icon><Upload /></el-icon>
      <span>上传作品</span>
    </el-menu-item>

    <el-menu-item v-if="userStore.isAdmin" index="/admin" @click="router.push('/admin')">
      <el-icon><Setting /></el-icon>
      <span>管理</span>
    </el-menu-item>

      <div class="flex-grow" />

    <div v-if="!userStore.isAuthenticated" class="auth-buttons">
      <el-menu-item index="/login" @click="router.push('/login')">
        <el-icon><Right /></el-icon>
        <span>登录</span>
      </el-menu-item>
      <el-menu-item index="/register" @click="router.push('/register')">
        <el-icon><UserFilled /></el-icon>
        <span>注册</span>
      </el-menu-item>
    </div>

    <el-dropdown v-if="userStore.isAuthenticated" class="user-dropdown" trigger="click">
      <span class="user-dropdown-link">
        <div class="user-avatar">
          <img
            v-if="userStore.userInfo?.avatar"
            :src="userStore.userInfo.avatar"
            alt="头像"
          />
          <el-icon v-else :size="20"><User /></el-icon>
        </div>
        <span class="user-name">{{ userStore.userInfo?.username || '用户' }}</span>
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push('/profile')">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="userStore.isAdmin" @click="router.push('/admin')">
            <el-icon><Setting /></el-icon>
            <span>管理后台</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isScrolled = ref(false)

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  if (route.path === '/') return '/home'
  return route.path
})

// 滚动监听处理
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 退出登录处理
const handleLogout = () => {
  userStore.logout()
  router.push('/home')
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border: none !important;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.95) 0%, rgba(0, 184, 148, 0.95) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
  height: 60px;
}

.navbar.scrolled {
  padding: 0;
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  height: 60px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.navbar.scrolled :deep(.el-menu-item),
.navbar.scrolled .brand-text {
  color: var(--text-primary) !important;
}

.navbar.scrolled :deep(.el-menu-item.is-active) {
  color: var(--primary-color) !important;
  border-bottom-color: var(--primary-color) !important;
}

.brand-item {
  padding: 0 !important;
}

.brand-item :deep(.el-menu-item__content) {
  padding: 0 !important;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white !important;
}

.navbar.scrolled .navbar-brand {
  font-size: 1.3rem;
}

.brand-text {
  background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.navbar.scrolled .brand-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.flex-grow {
  flex-grow: 1;
}

.auth-buttons {
  display: flex;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent !important;
  padding: 0 1rem !important;
  font-size: 0.95rem;
  height: 60px !important;
  line-height: 60px !important;
}

:deep(.el-menu-item:hover) {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-menu-item.is-active) {
  color: white !important;
  border-bottom-color: #ffd700 !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

:deep(.el-menu-item__content) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: 100%;
  line-height: normal;
}

.user-dropdown {
  margin-left: 1rem;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  color: white !important;
}

.user-dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.navbar.scrolled .user-dropdown-link {
  color: var(--text-primary) !important;
}

.navbar.scrolled .user-dropdown-link:hover {
  background-color: rgba(108, 92, 231, 0.05);
}

.user-avatar {
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.navbar.scrolled .user-avatar {
  background: var(--primary-gradient);
  border: none;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: white !important;
  transition: all 0.3s ease;
}

.navbar.scrolled .user-name {
  color: var(--text-primary) !important;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.2rem;
  }

  .brand-text {
    font-size: 1rem;
  }

  .user-dropdown-link {
    padding: 0.25rem 0.5rem;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
  }

  .user-name {
    font-size: 0.9rem;
  }
}
</style>

