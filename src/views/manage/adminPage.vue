<script setup>
// 因为是博客项目，管理系统暂时不会分页，也不做路由，组件处理，可能会在v2版本做以上处理
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import 'highlight.js/styles/github.css'
import {
  getAllArticle,
  getTags,
  uploadArticle,
  uploadImg
} from '@/api/article.js'
import { getlocaldata, setlocaldata } from '@/utils/localstorage.js'
import { formatTimestampWithDayjs } from '@/utils/daysformat.js' // 引入高亮主题样式
const drawer = ref(false)
let tableData = ref([])
const drawer_title = ref('添加文章')
const Stringtags = ref('') // 定义一个字符串用来存储自定义标签
const defaultfrom = {
  imgFile: [], // 存储图片路径
  content: '', // markdown文本
  title: '', // 标题
  category: '', // 分类
  date: '', // 发布时间
  name: '', // 作者
  summary: '', // 摘要
  tags: []
}
let tags = ref([]) // 定义一个数组用来存储标签
let imgFile = ref([]) // 创建一个文件数组，用来存储上传的文件路径，便于删除
let currentImageList = ref([]) // 定义一个数组用来存储用正则匹配到的到的图片路径
let imgUrl = ref() // 创建一个图片路径，用来存储上传的图片路径，便于预览
// markdown相关配置，包括图片上传，图片删除等等
const form = ref({
  ...defaultfrom
})
const getArticle = async () => {
  // 获取标签列表
  const re = await getTags()
  re.data.tags.forEach((item) => {
    // 定义一个choose属性，用来判断标签是否被选中
    tags.value.push({ tag: item.tag, choosed: false })
  })
  // 获取文章列表
  const res = await getAllArticle(0, -1, 0)
  console.log(res.data.articles)
  res.data.articles.forEach((item) => {
    item.date = formatTimestampWithDayjs(item.date)
  })
  tableData.value = res.data.articles
}
getArticle()
const editmyArticle = () => {
  drawer_title.value = '编辑文章'
  drawer.value = true
  // 在编辑文章的时候获取文章信息
}
watch(
  form,
  async (newVal) => {
    if (drawer_title.value === '添加文章') {
      setlocaldata('form', newVal)
    }
  },
  { deep: true }
)
// 添加文章
const addArticle = async () => {
  drawer_title.value = '添加文章'
  drawer.value = true
  // 在添加文章的时候获取文章的草稿内容
  const content = await getlocaldata('content')
  const imgFiles = await getlocaldata('imgFile')
  const form = await getlocaldata('form')
  if (form) {
    form.value = form
  }
  if (content) {
    // 确保本地有内容再取，防止content被覆盖为null而报错
    form.value.content = content
  }
  if (imgFiles) {
    // 与content相同
    imgFile.value = imgFiles
    imgUrl.value = imgFile.value[0]
  }
}
const selectOption = [
  {
    value: '小记',
    label: '小记'
  },
  {
    value: '生活',
    label: '生活'
  },
  {
    value: '代码',
    label: '代码'
  },
  {
    value: '数学',
    label: '数学'
  },
  {
    value: '技术',
    label: '技术'
  },
  {
    value: '其他',
    label: '其他'
  }
]
// 处理上传封面
const onselectFile = async (file) => {
  if (drawer_title.value === '添加文章') {
    // 判断之前是否上传过封面，如果上传过就删除之前的，上传新的
    // 如果数组0的位置为undefined说明没有上传
    imgUrl.value = URL.createObjectURL(file.raw) // 预览图片
    await uploadMyImg(0, file.raw) // 上传图片
  }
}
// 把上传图片封装成一个函数
const uploadMyImg = async (pos, file) => {
  let formdata = new FormData()
  formdata.append('file', file)
  // 调用上传图片接口
  const res = await uploadImg(formdata)
  imgFile.value[pos] = res.data.url
  setlocaldata('imgFile', imgFile.value) // 把图片数组存到本地
  return res
}
// 工具函数：从Markdown提取图片URL
function extractImagesFromMarkdown(md) {
  const imgRegex = /!\[.*?\]\((.*?)\)/g
  const matches = md.matchAll(imgRegex)
  return Array.from(matches).map((match) => match[1])
}
// 工具函数，比较两个函数的不同之处
const save = async (value) => {
  if (drawer_title.value === '添加文章') {
    form.value.content = value
    // 存入本地，v2版本引入自动保存
    setlocaldata('content', value)
    setlocaldata('imgFile', imgFile.value)
  }
}
const handleEditorImgAdd = async (pos, $file) => {
  // 判断当前是编辑文章（如果编辑文章，图片数组和markdown数据从服务器获取，
  // 如果是添加文章，图片数据和markdown数据从本地获取，相当于本地的草稿，这些不存入服务器）
  console.log(pos)
  if (drawer_title.value === '添加文章') {
    // 添加文章
    const res = await uploadMyImg(pos, $file) // 上传图片
    let url = res.data.url
    let name = $file.name
    if (name.includes('-')) {
      name = name.replace(/-/g, '')
    }
    let content = form.value.content
    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
    if (content.includes(name)) {
      let oStr = `(${pos})`
      let nStr = `(${url})`
      let index = content.indexOf(oStr)
      let str = content.replace(oStr, '')
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      form.value.content = insertStr(str, index, nStr)
    }
    setlocaldata('content', form.value.content)
  }
}
// 图片的即时删除太麻烦了，考虑到博客的流量不会太大，所以，把所有图片全部上传
// 而不在客户端做删除，在最终上传图片会附带一条markdown所有url路径的信息
// 在服务端会比对这些路径信息，删除服务端保留的不存在客户端的路径信息下的图片
const handleEditorImgDel = (pos) => {
  delete imgFile.value[pos]
  setlocaldata('imgFile', imgFile.value)
  setlocaldata('content', form.value.content)
}
// 处理用户自己的自定义标签
function getTagArray(str) {
  // 1. 用#分割字符串
  // 2. 过滤空字符串（处理开头/结尾/连续#的情况）
  // 3. 返回过滤后的数组
  return str.split('#').filter((item) => item !== '')
}
const change = async (value) => {
  // 实时更新当前图片列表
  currentImageList.value = extractImagesFromMarkdown(value)
  console.log(currentImageList.value)
  currentImageList.value.forEach((item, index) => {
    imgFile.value[index + 1] = item
  })
  console.log(form.value)
  // 在编辑文章的时候，如果修改了文章信息，需要把修改后的信息存入本地
  await setlocaldata('imgFile', imgFile.value)
  console.log(form.value.content)
  await setlocaldata('content', form.value.content)
  await setlocaldata('form', form.value)
}
// 上传文章
const Publish = async () => {
  form.value = await getlocaldata('form')
  const Arraytag = getTagArray(Stringtags.value)
  console.log(form.value.tags)
  Arraytag.forEach((item) => {
    form.value.tags.push(item)
  })
  tags.value.forEach((item) => {
    if (item.choosed) {
      form.value.tags.push(item.tag)
    }
  })
  form.value.date = Date.now().toString()
  form.value.name = (await getlocaldata('user')).user.name
  form.value.imgFile = await getlocaldata('imgFile')
  console.log(form.value.tags)
  console.log(form.value)
  // 调用上传文章接口
  await uploadArticle(form.value)
  ElMessage.success('上传成功')
  form.value = {}
  imgUrl.value = ''
  imgFile.value = []
  form.value.tags = []
  setlocaldata('imgFile', imgFile.value)
}
</script>

<template>
  <el-container>
    <el-header></el-header>
    <el-main>
      <!--      文章管理的表格-->
      <el-card class="manageArticle" style="height: auto">
        <el-button @click="addArticle"> 添加文章 </el-button>
        <el-table :data="tableData" style="width: 100%" border height="600">
          <el-table-column type="index" label="序号" align="center" />
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="category" label="分类" width="180" />
          <el-table-column
            prop="summary"
            label="摘要"
            width="180"
            height="200"
          />
          <el-table-column prop="imgFile" label="封面" width="180">
            <template #default="scope">
              <!-- 绑定 src 到当前行的 imgFile 属性 -->
              <img
                :src="scope.row.imgFile[0]"
                alt="封面"
                width="100"
                height="100"
              />
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column prop="name" label="作者" width="180" />
          <el-table-column
            prop="content"
            show-overflow-tooltip
            label="内容"
            width="300"
          />
          <el-table-column prop="operation" label="操作">
            <div style="display: flex; flex-direction: row">
              <el-button type="primary" circle>
                <el-icon><Edit @click="editmyArticle" /></el-icon>
              </el-button>
              <el-button type="danger" circle>
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </el-table-column>
        </el-table>
        <el-drawer
          v-model="drawer"
          :title="drawer_title"
          direction="rtl"
          size="1400"
        >
          <el-card class="articleForm">
            <!--          一个form表单用来提交文章信息-->
            <el-form label-width="100px">
              <el-form-item label="文章标题" style="width: 340px">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
              </el-form-item>
              <el-form-item label="文章标签">
                <el-checkbox-button
                  @click="tag.choosed = !tag.choosed"
                  v-for="tag in tags"
                  :key="tag.tag"
                  :value="tag.tag"
                >
                  {{ tag.tag }}
                </el-checkbox-button>
              </el-form-item>
              <el-form-item label="自定义标签" style="width: 340px">
                <el-input
                  v-model="Stringtags"
                  placeholder="请输入自定义标签，例如#vue#js"
                />
              </el-form-item>
              <el-form-item label="文章分类">
                <!--        下面封装成组件，属性变成了数据，需要对数据进行逻辑处理才能实现想要的功能-->
                <el-select
                  v-model="form.category"
                  style="width: 240px"
                  size="large"
                  placeholder="请选择文章分类"
                >
                  <el-option
                    v-for="item in selectOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文章摘要" style="width: 320px">
                <el-input
                  v-model="form.summary"
                  type="textarea"
                  placeholder="请输入文章文章摘要"
                />
              </el-form-item>
              <el-form-item label="文章封面">
                <!--        此处需要关闭element的自动上传-->
                <!--        此处仅需要做预览即可-->
                <!--        语法 URL.createObjectURL(...)创建本地预览的地址-->
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="onselectFile"
                >
                  <img v-if="imgUrl" :src="imgUrl" class="avatar" alt="" />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item label="文章内容">
                <div id="app">
                  <mavon-editor
                    style="height: 800px"
                    v-model="form.content"
                    :ishljs="true"
                    @imgAdd="handleEditorImgAdd"
                    @imgDel="handleEditorImgDel"
                    @save="save"
                    @change="change"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button @click="Publish" type="primary">提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-drawer>
      </el-card>
    </el-main>
  </el-container>
  <div></div>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
#app {
  width: 1200px;
  #app :deep(pre) {
    background: #f4f4f4;
  }
}
.el-container {
  width: 100vw;
  height: 100vh;
  background: url('../../assets/adminPic.png');
  align-items: center;
  .manageArticle {
    width: 95vw;
    height: 600px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    box-shadow: #333333;
  }
}
.articleForm {
  margin-bottom: 20px;
  width: 1360px;
}
</style>
