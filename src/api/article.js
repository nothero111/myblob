import request from '@/utils/request.js'

// 上传文章的插图
export const uploadImg = async (formdata) => {
  return await request.post('/api/articledbs/uploadImg', formdata)
}
// 上传文章
export const uploadArticle = async (formdata) => {
  return await request.post('/api/articledbs/add', formdata)
}
