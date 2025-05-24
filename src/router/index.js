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
          component: () => import('@/views/article/myArticle.vue'), // 明确加载组件
          meta: { keepAlive: true, scrollPosition: 0 } // 通过meta标记是否需要加载缓存,以及记录滚动的位置
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
    },
    {
      path: '/detailPage',
      name: 'detailPage',
      component: () => import('@/views/ArticleDetail/detailPage.vue') // 明确加载组件
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition // 浏览器后退/前进时恢复位置
    } else {
      return { top: to.meta.scrollPosition || 0 }
    }
  }
})
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  if (to.path === '/login') {
    return true
  }
  if (!userStore.token && to.path === '/managePage') {
    return { name: 'login' }
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
