<template>
  <div class="body banner">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
      style="position: absolute; top: 60px; left: 320px"
    >
      <el-tab-pane
        v-for="item in tabs"
        :label="item.label"
        :name="item.name"
        :key="item.name"
      >
        <el-main v-if="CountArticles">
          <div class="container">
            <article-card
              v-for="article in articles"
              :article="article"
              :key="article._id"
              @click="clickCard(article._id)"
            ></article-card>
          </div>
          <el-button
            v-if="hasNextPage"
            plain
            round
            style="display: block; margin: 20px auto"
            @click="loadingMore"
            >点击加载更多</el-button
          >
          <el-text
            v-else
            type="info"
            style="width: fit-content; display: block; margin: 20px auto"
            >难道我是什么没有底线的人吗</el-text
          >
        </el-main>
        <el-main v-else>
          <el-empty style="width: 800px" description="空空如也" />
        </el-main>
        <el-footer></el-footer>
      </el-tab-pane>
      <hr style="background-color: #333333" />
      <el-footer style="height: fit-content; margin-bottom: 20px">
        <p class="friends">我的朋友</p>
        <div style="display: flex; flex-direction: row">
          <a href="https://birdsmoon.top/">
            <el-card
              class="hover-card"
              style="
                width: 400px;
                margin-top: 30px;
                font-size: 20px;
                border-radius: 15px;
                margin-right: 20px;
              "
            >
              <img
                src="http://127.0.0.1:7001/public/uploads/xiaozhi.jpg"
                style="width: 50px; display: inline-block; border-radius: 8px"
                alt=""
              />
              <div>
                <h3 style="font-weight: 600">小智</h3>
                <p style="font-size: 15px">
                  一个分享嵌入式技术，操作系统的技术站长
                </p>
              </div>
            </el-card>
          </a>
          <a href="http://reblog.shiyio.uk">
            <el-card
              class="hover-card"
              style="
                width: 400px;
                margin-top: 30px;
                display: flex;
                /*flex布局的方向*/
                flex-direction: row;
                font-size: 20px;
                border-radius: 15px;
              "
            >
              <img
                src="http://127.0.0.1:7001/public/uploads/shiyi.jpg"
                style="width: 50px; display: inline-block; border-radius: 8px"
                alt=""
              />
              <div>
                <h3 style="font-weight: 600">shiyi</h3>
                <p style="font-size: 15px">一个分享前沿前后端技术的宝藏博主</p>
              </div>
            </el-card>
          </a>
        </div>
        <hr style="background-color: #333333; margin: 40px auto" />
        <el-text
          type="info"
          style="width: fit-content; display: block; margin: 20px auto"
          >备案/许可证 豫ICP备xxxxxxxx号</el-text
        >
      </el-footer>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ArticleCard from '@/views/article/component/articleCard.vue'
import { getAllArticle } from '@/api/article.js'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'ArticlePage'
})
const router = useRouter()
const tabs = [
  {
    label: '全部',
    name: '全部'
  },
  {
    label: '小记',
    name: '小记'
  },
  {
    label: '生活',
    name: '生活'
  },
  {
    label: '技术',
    name: '技术'
  },
  {
    label: '数学',
    name: '数学'
  },
  {
    label: '算法',
    name: '算法'
  },
  {
    label: '其他',
    name: '其他'
  }
]
const activeName = ref('全部')
const articles = ref([])
let hasNextPage = ref(true) // 默认有下一页
let CountArticles = ref(0)
const pageNum = 1
const pageSize = ref(8)
// 操控点击卡片跳转事件
// 在原标签页的代码中临时添加
const clickCard = (id) => {
  const targetRoute = router.resolve({
    name: 'detailPage',
    query: {
      // 可选：传递参数（会自动进行URL编码）
      id
    },
    hash: '#section-2' // 可选：锚点定位
  })

  // 2. 打开新标签页
  window.open(
    targetRoute.href, // 完整URL路径
    '_blank' // 目标窗口名称
  )
}
const handleClick = async (tab) => {
  hasNextPage.value = false
  if (tab.paneName !== activeName.value) {
    pageSize.value = 8
    await getArticle(tab.paneName, pageNum, pageSize.value)
    if (CountArticles.value > pageSize.value * pageNum) {
      hasNextPage.value = true
    }
  }
}
// 点击加载更多后
const loadingMore = () => {
  pageSize.value += 8
  getArticle(activeName.value, pageNum, pageSize.value)
  if (CountArticles.value <= pageSize.value * pageNum) {
    hasNextPage.value = false
  }
}
const getArticle = async (category, pageNum, pageSize) => {
  const res = await getAllArticle(category, pageNum, pageSize)
  console.log(res.data)
  articles.value = res.data.articles
  CountArticles.value = res.data.CountArticles
  console.log(CountArticles.value)
}
getArticle(activeName.value, pageNum, pageSize.value)
</script>

<style scoped lang="scss">
/* 容器优化 */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 120px;
  margin: 20px auto;
  padding: 40px 60px;
}
.body {
  background: $primary-color;
  margin-top: 60px;
  height: 100vh;
  overflow: hidden;
  .friends {
    font-size: 20px;
    font-weight: 600;
  }
}
.hover-card::v-deep(.el-card__body) {
  transition: all 0.3s ease; /* 过渡效果 */
}

.hover-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: scale(1.05); /* 悬停放大 5% */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important; /* 悬停阴影 */
}

.hover-card:hover::v-deep(.el-card__body) {
  transform: translateY(-5px); /* 内容微微上移（可选） */
}
:deep(.el-tabs__content) {
  left: -130px; // 调整整个卡片组的位置
  overflow: visible !important;
}
</style>
