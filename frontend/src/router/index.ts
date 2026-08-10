import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/oauth/callback/:provider',
    name: 'OAuthCallback',
    component: () => import('@/views/auth/OAuthCallback.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/views/Gallery.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/virtual-gallery',
    name: 'VirtualGallery',
    component: () => import('@/views/VirtualGallery.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/artwork/:id',
    name: 'ArtworkDetail',
    component: () => import('@/views/ArtworkDetail.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/upload',
    name: 'ArtworkUpload',
    component: () => import('@/views/ArtworkUpload.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/artworks',
    name: 'AdminArtworks',
    component: () => import('@/views/admin/AdminArtworks.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/AdminUsers.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/recommendations',
    name: 'Recommendations',
    component: () => import('@/views/Recommendations.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
// to: 即将进入的目标路由对象
// _from: 当前导航正要离开的路由（下划线前缀表示未使用该参数）
// next: 必须调用的函数，用于控制导航流程
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  // 如果目标路由需要认证且用户未登录
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // 重定向到登录页，并携带原始路径作为 redirect 参数，登录后可返回原页面
    next({ name: 'Login', query: { redirect: to.fullPath } })
    // 如果目标路由需要管理员权限且用户不是管理员
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'Home' })
  } else {
    // 其他情况正常通过
    next()
  }
})

export default router
