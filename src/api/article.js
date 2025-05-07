import request from '@/utils/request.js'

// 上传文章的插图
export const uploadImg = async (formdata) => {
  return await request.post('/api/articledbs/uploadImg', formdata)
}

// 删除文章相关图片
export const DeleteImg = async (data) => {
  return await request.post('/api/articledbs/deleteImg', data)
}
// 上传文章
export const uploadArticle = async (formdata) => {
  return await request.post('/api/articledbs/add', formdata)
}
