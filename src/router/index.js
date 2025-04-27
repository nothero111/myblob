import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout', // 可选名称
      redirect: '/welcomePage', // 重定向
      component: () => import('@/views/navBar.vue'), // 明确加载组件
      children: [
        {
          path: 'welcomePage', //欢迎页面
          name: 'welcomePage',
          component: () => import('@/views/welcomePage.vue') // 明确加载组件
        },
        {
          path: 'Article', //文章页面
          name: 'ArticlePage',
          component: () => import('@/views/article/myArticle.vue') // 明确加载组件
        }
      ]
    },
    {
      path: '/managePage',
      name: 'managePage',
      component: () => import('@/views/manage/admin.vue') // 明确加载组件
    }
  ]
})

export default router
