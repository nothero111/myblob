<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import 'highlight.js/styles/github.css' // 引入高亮主题样式
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
}
// 添加文章
const addArticle = () => {
  drawer_title.value = '添加文章'
  drawer.value = true
}
const content = ref()
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
          <div id="app">
            <mavon-editor
              style="height: 800px"
              v-model="content"
              :ishljs="true"
            />
          </div>
        </el-drawer>
      </el-card>
    </el-main>
  </el-container>
  <div></div>
</template>

<style scoped lang="scss">
#app {
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
</style>
