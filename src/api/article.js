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
// 获取全部文章
export const getAllArticle = async (category, pageNum, pageSize) => {
  return await request.get('/api/articledbs/getArticle', {
    params: {
      category,
      pageNum, // 当pageNum为-1时，表示获取全部文章
      pageSize
    }
  })
}
// 获取文章详情
export const getArticleDetail = async (id) => {
  return await request.get('/api/articledbs/getArticleDetail/' + id)
}
// 获取标签
export const getTags = async () => {
  return await request.get('/api/articledbs/getTags')
}
