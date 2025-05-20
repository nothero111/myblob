import axios from 'axios'
import { useUserStore } from '@/stores/index.js'

// 然后在拦截器中使用
import router from '@/router/index.js'
const baseURL = 'http://127.0.0.1:7001' // 根目录
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' }
})
const userUseStore = useUserStore() // 正确用法
// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    if (userUseStore.token) {
      config.headers.Authorization = userUseStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 状态码是0是正常状态
    if (response.data.code === 0) {
      return response
    }
    // 状态码不是0是错误状态，给错误提示，并且抛出错误
    ElMessage.success(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  async function (error) {
    console.log(error)
    ElMessage.error(error.response.data.message || '服务异常')
    // 401是权限不足
    if (error.status === 401) {
      await router.push('/login')
      return Promise.reject(new Error('未授权，已跳转登录页')) // 明确返回拒绝
    }
    return Promise.reject(error)
  }
)
export default instance

export { baseURL }
// 按需导出和默认导出并不冲突
