<template>
  <div id="app">
    <!-- 页面过渡效果 -->
    <router-view v-slot="{ Component }">
      <transition name="page-transition" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// App组件逻辑
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 页面过渡动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 全局样式 */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-primary);
  color: var(--text-primary);
  background-color: var(--light-color);
}

/* 防止布局抖动 */
img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>

