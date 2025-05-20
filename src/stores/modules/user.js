import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { userGetInfoService } from '@/api/article.js'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (val) => {
      token.value = val
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})
    const getUser = async () => {
      // const res = await userGetInfoService()
      // user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: {
      enabled: true,
      // 以下为可选配置
      key: 'user',
      storage: localStorage,
      paths: ['token', 'user']
    }
  }
)
