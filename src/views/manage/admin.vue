<script setup>
// 因为是博客项目，管理系统暂时不会分页，也不做路由，组件处理，可能会在v2版本做以上处理
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import 'highlight.js/styles/github.css'
import { uploadImg } from '@/api/article.js'
import { getlocaldata, setlocaldata } from '@/utils/localstorage.js' // 引入高亮主题样式
const drawer = ref(false)
const tableData = [
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  },
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  },
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  },
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  },
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  },
  {
    date: '2016-05-03',
    title: '标题',
    name: '小浪花',
    content: '内容，，。。。。。。。。。。。。。。。。。。'
  }
]
const drawer_title = ref('添加文章')
const editmyArticle = () => {
  drawer_title.value = '编辑文章'
  drawer.value = true
  // 在编辑文章的时候获取文章信息
}

// 添加文章
const addArticle = async () => {
  drawer_title.value = '添加文章'
  drawer.value = true
  // 在添加文章的时候获取文章的草稿内容
  form.value.content = await getlocaldata('content')
  imgFile = getlocaldata('imgFile')
}
const defaultfrom = {
  imgFile: [], // 存储图片路径
  content: '', // markdown文本
  title: '', // 标题
  category: '', // 分类
  data: '', // 发布时间
  name: '' // 作者
}
// markdown相关配置，包括图片上传，图片删除等等
const form = ref({
  ...defaultfrom
})
const md = ref()
let imgFile = [] // 创建一个文件数组，用来存储上传的文件路径，便于删除
const imgUrl = ref() // 创建一个图片路径，用来存储上传的图片路径，便于预览
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
    value: '其他',
    label: '其他'
  }
]
// 处理上传封面
const onselectFile = async (file) => {
  if (drawer_title.value === '添加文章') {
    // 判断之前是否上传过封面，如果上传过就删除之前的，上传新的
    if (!imgFile[0]) {
      // 如果数组0的位置为undefined说明没有上传
      imgUrl.value = URL.createObjectURL(file.raw) // 预览图片
      await uploadMyImg(0, file.raw) // 上传图片
    } else {
      // 否则的话要先做删除操作
      // 删除图片
      handleEditorImgDel(0)
      // 删除图片后重新上传
      imgUrl.value = URL.createObjectURL(file.raw) // 预览图片
      await uploadMyImg(0, file.raw) // 上传图片
    }
  }
}
// 把上传图片封装成一个函数
const uploadMyImg = async (pos, file) => {
  let formdata = new FormData()
  formdata.append('file', file)
  // 调用上传图片接口
  const res = await uploadImg(formdata)
  imgFile[pos] = res.data.url
  return res
}
const save = (value) => {
  if (drawer_title.value === '添加文章') {
    // 添加文章
    form.value.content = value
    // 存入本地，v2版本引入自动保存
    setlocaldata('content', value)
    setlocaldata('imgFile', imgFile)
  }
}
const handleEditorImgAdd = async (pos, $file) => {
  // 判断当前是编辑文章（如果编辑文章，图片数组和markdown数据从服务器获取，
  // 如果是添加文章，图片数据和markdown数据从本地获取，相当于本地的草稿，这些不存入服务器）
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
  }
}
const handleEditorImgDel = (pos) => {
  delete imgFile[pos]
}
// 上传文件
const Publish = () => {}
</script>

<template>
  <el-container>
    <el-header></el-header>
    <el-main>
      <!--      文章管理的表格-->
      <el-card class="manageArticle">
        <el-button @click="addArticle"> 添加文章 </el-button>
        <el-table :data="tableData" style="width: 100%" border height="250">
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column prop="title" label="标题  " width="180" />
          <el-table-column prop="name" label="文章名称" width="180" />
          <el-table-column prop="content" label="内容" />
          <el-table-column prop="operation" label="操作">
            <el-button type="primary" circle>
              <el-icon><Edit @click="editmyArticle" /></el-icon>
            </el-button>
            <el-button type="danger" circle>
              <el-icon><Delete /></el-icon>
            </el-button>
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
            <el-form v-model="form" ref="formRef" label-width="100px">
              <el-form-item label="文章标题" prop="title" style="width: 340px">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
              </el-form-item>
              <el-form-item label="文章分类" prop="category">
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
              <el-form-item label="文章封面" prop="cover_img">
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
              <el-form-item label="文章内容" prop="content">
                <div id="app">
                  <mavon-editor
                    style="height: 800px"
                    :ref="md"
                    v-model="form.content"
                    :ishljs="true"
                    @imgAdd="handleEditorImgAdd"
                    @imgDel="handleEditorImgDel"
                    @save="save"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button @click="Publish" type="primary">发布</el-button>
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
    width: 80vw;
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
