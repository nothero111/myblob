import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // 注册自定义全局变量
        ElMessage: 'readonly',
        ElLoading: 'readonly',
        ElMessageBox: 'readonly'
      }
    }
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  skipFormatting,
  {
    rules: {
      // prettier专注于代码的美观度 (格式化工具)
      // 前置：
      // ESLint关注于规范, 如果不符合规范，报错
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验 (props解构丢失响应式)
      // 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-undef': 'error'
    }
  }
])
