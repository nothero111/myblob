import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import postcssPxtorem from 'postcss-pxtorem'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    autoprefixer({
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8'
        //'last 10 versions', // 所有主流浏览器最近10版本用
      ],
      grid: true // 使用autoprefixer时使用css grid的bug修复
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    postcssPxtorem({
      rootValue: 192, //设计稿宽度%10 比如 1920
      exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module|src)/
      propList: ['*'], //是一个存储哪些将被转换的属性列表，这里设置为["*"]全部，假设需要仅对边框进行设置，可以写]['*','!border*']
      //selectorBlackList :['.box'],//，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法。
      replace: true, //替换包含rems的规则。
      mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
      minPixelValue: 0 //设置要替换的最小像素值(3px会被转rem)。 默认 0
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 全局引入 SCSS 文件（可添加多个，用分号分隔）
        additionalData: `
          @use "@/styles/variables.scss" as *;
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
