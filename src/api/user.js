import request from '@/utils/request.js'

export const userLoginService = async (data) => {
  return await request.post('/api/user/login', data)
}
