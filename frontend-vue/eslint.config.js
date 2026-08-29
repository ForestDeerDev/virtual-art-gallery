import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // JavaScript 推荐规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  // Vue 3 推荐规则（flat config）
  ...pluginVue.configs['flat/recommended'],

  // 全局：配置浏览器环境全局变量 + .vue 文件 TypeScript 解析器
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // 自定义规则（可根据团队规范调整）
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-required-prop-with-default': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-case-declarations': 'off',
    },
  },

  // 必须放在最后：禁用所有与 Prettier 冲突的格式化规则
  eslintConfigPrettier,

  // 忽略构建产物和依赖目录
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
