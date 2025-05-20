import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

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
      component: () => import('@/views/manage/adminPage.vue') // 明确加载组件
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/manage/loginPage.vue') // 明确加载组件
    }
  ]
})
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  if (to.path === '/login') {
    return true
  }
  if (!userStore.token && to.path === '/managePage') {
    return { name: '/login' }
  }
  if (
    userStore.token &&
    to.path === 'managePage' &&
    userStore.user.level !== 'super'
  ) {
    ElMessage.warning('您没有权限访问该页面')
    return { name: '/welcomePage' }
  }
  // 将用户重定向到登录页面
})
export default router
