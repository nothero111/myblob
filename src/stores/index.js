import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// import { useUserStore } from '@/stores/modules/article.js'
// export { useUserStore }
export * from '@/stores/modules/user.js' // 与上面等价
