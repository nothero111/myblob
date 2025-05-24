<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Share,
  Link,
  ArrowLeft,
  Calendar,
  User,
  Collection,
  View,
  Timer,
  Document,
  Sunrise,
  Star
} from '@element-plus/icons-vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { getArticleDetail } from '@/api/article.js'
import { formatTimestampWithDayjs } from '@/utils/daysformat.js'
import { markdownToHtml } from '@/utils/markdown.js'
import getWordNumAndReadTime from '@/utils/getWordNumAndReadTime.js'
const route = useRoute()

// 模拟文章数据，实际应用中应该从API获取
const article = ref({
  id: 1,
  title: '了解Vue3的组合式API',
  summary:
    'Vue 3的组合式API为开发者提供了更灵活、更强大的组件逻辑复用方式，本文详细介绍了组合式API的核心概念和使用方法，帮助你更好地理解和使用Vue 3进行开发。',
  content: `
  <p>Vue 3 的组合式 API (Composition API) 是 Vue 3 中引入的一种新的编写组件逻辑的方式，它是对 Vue 2 中选项式 API 的补充。</p>

  <h2>为什么需要组合式 API？</h2>
  <p>随着组件变得越来越复杂，代码的可读性和可维护性会变得越来越困难。在大型组件中，相关联的逻辑可能会分散在不同的选项中，这使得理解和维护代码变得困难。</p>

  <h2>组合式 API 的核心功能</h2>
  <p>组合式 API 的核心是一系列新的函数，如 ref()、reactive()、computed()、watch() 等。这些函数允许你创建和管理响应式状态、计算属性、侦听器等，而不需要依赖 this 上下文。</p>

  <h3>1. ref() 和 reactive()</h3>
  <p>ref() 用于创建一个响应式的引用，而 reactive() 用于创建一个响应式的对象。这两个函数是组合式 API 中最基本的函数。</p>

  <pre><code class="language-javascript">
  import { ref, reactive } from 'vue'

  // 使用 ref
  const count = ref(0)
  console.log(count.value) // 0

  // 使用 reactive
  const state = reactive({
    count: 0,
    message: 'Hello'
  })
  console.log(state.count) // 0
  </code></pre>

  <h3>2. computed()</h3>
  <p>computed() 用于创建一个计算属性。它接收一个 getter 函数，并返回一个只读的响应式引用。</p>

  <pre><code class="language-javascript">
  import { ref, computed } from 'vue'

  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  </code></pre>

  <h3>3. watch() 和 watchEffect()</h3>
  <p>watch() 用于侦听一个或多个响应式数据源，并在数据源变化时调用回调函数。watchEffect() 会立即执行一次回调函数，并自动追踪其依赖的所有响应式状态，当依赖变化时重新执行回调。</p>

  <pre><code class="language-javascript">
  import { ref, watch, watchEffect } from 'vue'

  const count = ref(0)

  // 使用 watch
  watch(count, (newValue, oldValue) => {
    console.log(\`count changed from \${oldValue} to \${newValue}\`)
  })

  // 使用 watchEffect
  watchEffect(() => {
    console.log(\`count is \${count.value}\`)
  })
  </code></pre>

  <h2>结论</h2>
  <p>组合式 API 提供了一种更灵活、更可组合的方式来编写 Vue 组件。它使得代码更易于理解和维护，特别是在大型组件中。</p>
  `,
  author: '张三',
  authorTitle: '一个平平无奇的前端学习者',
  date: '2023-04-15',
  category: '前端开发',
  tags: ['123', 'Vue3', 'JavaScript', '前端框架', 'Composition API'],
  readTime: '8分钟阅读',
  views: 1024,
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  coverImage: 'https://picsum.photos/800/300'
})
const myGetArticleDetail = async () => {
  // 从页面路由拿到
  const res = await getArticleDetail(route.query.id)
  console.log(res.data.article)
  article.value.category = res.data.article.category
  article.value.content = markdownToHtml(res.data.article.content)
  const { wordCount, readingTime } = getWordNumAndReadTime(
    res.data.article.content
  )
  article.value.readTime = readingTime + '分钟阅读'
  article.value.views = wordCount + '字数'
  article.value.date = formatTimestampWithDayjs(res.data.article.date) // 格式化时间戳直接返回yyyy-mm-dd格式的日期
  article.value.coverImage = res.data.article.imgFile[0]
  article.value.author = res.data.article.name
  article.value.title = res.data.article.title
  article.value.summary = res.data.article.summary
  article.value.tags = res.data.article.tags
  article.value.id = res.data.article._id
}
myGetArticleDetail()
// 用于切换显示全文
const showFullContent = ref(true)

// 页面滚动进度
const scrollProgress = ref(0)

// 模拟加载状态
const isLoading = ref(false)

// 提示框显示状态
const shareDialogVisible = ref(false)
const shareLink = computed(() => {
  // 在实际应用中，这应该是一个真实的URL
  return `${window.location.origin}/article/${article.value.id}`
})

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(article.value.date)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 获取阅读进度
const handleScroll = () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight
  scrollProgress.value = (scrollTop / (scrollHeight - clientHeight)) * 100
}

// 分享功能
const shareArticle = () => {
  // 在浏览器中复制链接到剪贴板
  navigator.clipboard
    .writeText(shareLink.value)
    .then(() => {
      ElMessage({
        message: '链接已复制到剪贴板！',
        type: 'success',
        duration: 2000
      })
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制链接')
    })

  // 显示分享链接弹窗
  shareDialogVisible.value = true
}

// 返回上一页
const goBack = () => {
  // 可选：自动关闭当前标签页
  window.close()
}

// 高亮代码
const highlightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightElement(block)
  })
}

onMounted(() => {
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll)

  // 在实际应用中，这里会从API获取文章数据
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    // 加载完成后，高亮代码块
    setTimeout(() => {
      highlightCode()
    }, 100)

    // 显示欢迎通知
    ElNotification({
      title: '欢迎阅读',
      message: `您正在阅读《${article.value.title}》`,
      type: 'success',
      duration: 3000
    })
  }, 800)
})
</script>

<template>
  <div class="article-detail-container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button type="primary" :icon="ArrowLeft" circle @click="goBack" />
    </div>

    <!-- 阅读进度条 -->
    <div class="reading-progress-container">
      <div
        class="reading-progress-bar"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>

    <div v-if="isLoading" class="loading">
      <el-skeleton style="width: 100%" animated>
        <template #template>
          <div style="padding: 20px">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 200px"
            />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex; align-items: center; margin-top: 16px">
                <el-skeleton-item
                  variant="circle"
                  style="margin-right: 16px; width: 40px; height: 40px"
                />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
              <div style="margin-top: 16px">
                <el-skeleton-item variant="text" style="width: 100%" />
                <el-skeleton-item variant="text" style="width: 100%" />
                <el-skeleton-item variant="text" style="width: 60%" />
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <div v-else class="article-content">
      <!-- 文章封面图 -->
      <div class="article-cover">
        <img :src="article.coverImage" alt="文章封面" />
        <div class="article-cover-overlay">
          <div class="article-category-badge">
            <el-icon><Collection /></el-icon>
            {{ article.category }}
          </div>
        </div>
      </div>

      <!-- 文章头部信息 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 文章摘要 -->
        <div class="article-summary">
          <el-icon><Document /></el-icon>
          <p>{{ article.summary }}</p>
        </div>

        <!-- 文章元数据卡片 -->
        <div class="article-meta-card">
          <div class="meta-left">
            <div class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>发布于: {{ formattedDate }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Timer /></el-icon>
              <span>{{ article.readTime }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Document /></el-icon>
              <span>{{ article.views }}</span>
            </div>
          </div>
          <div class="meta-right">
            <el-button
              size="small"
              type="primary"
              :icon="Share"
              @click="shareArticle"
            >
              分享
            </el-button>
          </div>
        </div>

        <!-- 标签 -->
        <div class="article-tags">
          <div class="tags-header">
            <el-icon><Star /></el-icon>
            <span>标签:</span>
          </div>
          <div class="tags-list">
            <el-tag
              v-for="(tag, index) in article.tags"
              :key="index"
              :type="['', 'success', 'warning', 'danger', 'info'][index % 5]"
              class="tag"
              effect="light"
              round
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <!-- 作者信息 -->
        <div class="author-info">
          <div class="author-avatar">
            <el-avatar :size="60" :src="article.avatar" />
          </div>
          <div class="author-details">
            <div class="author-name">
              <el-icon><User /></el-icon>
              {{ article.author }}
            </div>
            <div class="author-title">{{ article.authorTitle }}</div>
            <div class="article-date">
              <el-icon><Sunrise /></el-icon>
              {{ article.date }}
            </div>
          </div>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="article-body">
        <div
          v-html="article.content"
          :class="{ 'content-truncated': !showFullContent }"
          class="content-wrapper"
        ></div>
        <div v-if="!showFullContent" class="read-more">
          <el-button type="primary" @click="showFullContent = true">
            阅读全文
          </el-button>
        </div>
      </div>

      <!-- 文章尾部 -->
      <div class="article-footer">
        <div class="article-end-mark">
          <span>● 文章结束 ●</span>
        </div>
        <el-divider>
          <el-icon><Document /></el-icon>
        </el-divider>
        <div class="share-buttons">
          <el-button type="primary" plain :icon="Share" @click="shareArticle">
            分享文章
          </el-button>
        </div>
      </div>
    </div>

    <!-- 分享对话框 -->
    <el-dialog v-model="shareDialogVisible" title="分享文章" width="30%" center>
      <div class="share-dialog-content">
        <p>复制以下链接分享给朋友：</p>
        <el-input v-model="shareLink" placeholder="分享链接" readonly>
          <template #append>
            <el-button
              :icon="Link"
              @click="navigator.clipboard.writeText(shareLink)"
            />
          </template>
        </el-input>

        <div class="qr-code-container">
          <p>或使用二维码分享：</p>
          <img
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`"
            alt="分享二维码"
            class="qr-code"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="shareDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.article-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 40px 0;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  /* 响应式布局 */
  @media (max-width: 1200px) {
    max-width: 100%;
    border-radius: 0;
  }
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
}

.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #409eff, #e6a23c);
  width: 0%;
  transition: width 0.2s ease;
}

.loading {
  min-height: 500px;
  display: flex;
  align-items: center;
}

.article-cover {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .article-cover-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 30px 20px 15px;

    .article-category-badge {
      display: inline-flex;
      align-items: center;
      background-color: #409eff;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

      .el-icon {
        margin-right: 5px;
      }
    }
  }
}

.article-header {
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
}

.article-title {
  font-size: 36px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 20px;
  line-height: 1.3;
  position: relative;

  @media (max-width: 768px) {
    font-size: 28px;
  }
}

.article-summary {
  display: flex;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 4px solid #409eff;

  .el-icon {
    color: #409eff;
    font-size: 20px;
    margin-right: 10px;
    margin-top: 2px;
  }

  p {
    color: #606266;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
  }
}

.article-meta-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;

  .meta-left {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    color: #606266;
    font-size: 14px;

    .el-icon {
      color: #409eff;
      margin-right: 6px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .meta-left {
      margin-bottom: 15px;
    }
  }
}

.article-tags {
  margin: 20px 0;

  .tags-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .el-icon {
      color: #e6a23c;
      margin-right: 6px;
      font-size: 18px;
    }

    span {
      font-weight: 600;
      color: #606266;
    }
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

.author-info {
  display: flex;
  align-items: center;
  margin: 25px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }

  .author-avatar {
    margin-right: 20px;

    .el-avatar {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      border: 3px solid white;
    }
  }

  .author-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .author-name {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #303133;

    .el-icon {
      margin-right: 5px;
      font-size: 16px;
      color: #409eff;
    }
  }

  .author-title {
    font-size: 14px;
    color: #909399;
    margin-left: 21px;
  }

  .article-date {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #606266;
    margin-top: 5px;

    .el-icon {
      margin-right: 5px;
      font-size: 16px;
      color: #409eff;
    }
  }
}

.article-body {
  padding: 0 30px;
  margin-bottom: 40px;
  line-height: 1.8;
  color: #303133;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  .content-wrapper {
    background-color: #fafafa;
    padding: 30px;
    border-radius: 8px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);

    h2 {
      font-size: 28px;
      font-weight: 600;
      margin: 30px 0 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #ebeef5;
      color: #303133;
      position: relative;

      &::before {
        content: '#';
        color: #409eff;
        margin-right: 8px;
        font-weight: 700;
      }
    }

    h3 {
      font-size: 22px;
      font-weight: 600;
      margin: 25px 0 15px;
      color: #303133;
      position: relative;
      padding-left: 15px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 5px;
        height: 18px;
        background-color: #409eff;
        border-radius: 3px;
      }
    }

    p {
      margin-bottom: 20px;
      color: #303133;
      font-size: 16px;
      line-height: 1.8;
    }

    pre {
      background-color: #282c34;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
      position: relative;

      &::before {
        content: 'code';
        position: absolute;
        top: 0;
        right: 0;
        background-color: #4d4d4d;
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 0 8px 0 8px;
      }

      code {
        font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }

  .content-truncated {
    max-height: 500px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 150px;
      background: linear-gradient(
        to bottom,
        rgba(250, 250, 250, 0),
        rgba(250, 250, 250, 0)
      );
      pointer-events: none;
    }
  }
}

.read-more {
  text-align: center;
  margin: 25px 0;
}

.article-footer {
  padding: 0 30px;
  margin-top: 50px;

  .article-end-mark {
    text-align: center;
    margin-bottom: 20px;

    span {
      color: #909399;
      font-size: 14px;
    }
  }

  .share-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

.share-dialog-content {
  text-align: center;

  p {
    margin-bottom: 15px;
    color: #606266;
  }

  .qr-code-container {
    margin-top: 25px;

    .qr-code {
      margin-top: 10px;
      border: 1px solid #ebeef5;
      padding: 5px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

/* 动画效果 */
.article-content {
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
