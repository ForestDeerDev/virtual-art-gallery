/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Locale } from 'element-plus'
  const locale: Locale
  export default locale
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_GITHUB_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
