import axios from 'axios'
import { useUserStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'

const baseURL = 'http://127.0.0.1:7001' // 根目录
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' }
})

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 状态码是0是正常状态
    if (response.data.code === 0) {
      return response
    }
    // 状态码不是0是错误状态，给错误提示，并且抛出错误
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  async function (error) {
    // 401是权限不足
    if (error.response.status === 401) {
      await router.push('/login')
    }

    ElMessage.error(error.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default instance

export { baseURL }
// 按需导出和默认导出并不冲突
