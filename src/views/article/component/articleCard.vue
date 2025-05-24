<script setup>
// 这里的组件划分组件有问题，应该是仅仅把单个卡片拿出来
// 然后根据数据循环渲染多个卡片，但是不会改，会在v2版本改
import { formatTimestampWithDayjs } from '@/utils/daysformat.js'

// 示例数据（需要保证数组长度为偶数）
defineProps({
  article: {
    type: Object,
    required: true
  }
})
// 日期格式化
const formatDate = (dateString) => {
  return formatTimestampWithDayjs(dateString)
}
</script>

<template>
  <el-card class="article-card">
    <!-- 封面容器 -->
    <div class="cover-wrapper">
      <img
        :src="
          article.imgFile[0] ||
          'http://127.0.0.1:7001/public/uploads/88db277a-f6c4-4431-b1f8-aa963dd33402.jpg'
        "
        class="article-cover"
        alt="封面"
      />
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <h3 class="article-title">{{ article.title }}</h3>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <el-tag
            size="small"
            type="info"
            style="margin-left: 5px; margin-bottom: 4px"
            >{{ article.category }}</el-tag
          >
        </div>
        <div style="margin-left: 1.3021rem; margin-top: 40px; font-size: 15px">
          作者:{{ article.name }}
        </div>
      </div>
    </div>
    <el-divider />
    <p class="article-summary">
      <i>{{ article.summary }}</i>
    </p>
  </el-card>
</template>

<style scoped lang="scss">
/* 卡片样式 */
.article-card {
  position: relative;
  min-height: 280px;
  width: 3.125rem;
  min-width: 450px;
  border-radius: 12px;
  background: #e8f5e9;
  overflow: visible !important; /* 允许封面超出卡片 */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
  }
  p {
    margin-left: 30px;
    font-size: 20px;
  }
}

/* 封面样式 */
.cover-wrapper {
  position: absolute;
  left: -70px; /* 向左偏移 */
  top: 10px;
  transform: translateY(-50%);
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px #eae8e3 solid;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 2; /* 确保封面在上层 */
}

.article-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* 内容区域 */
.content-wrapper {
  margin-left: 180px; /* 留出封面空间 */
  height: 180px;
  display: flex;
  flex-direction: column;
  .article-meta {
    margin-left: 20px;
    margin-top: 20px;
  }
  h3 {
    padding-top: 30px;
    font-weight: bold;
    font-size: 20px;
    margin-left: 20px;
  }
  h3:hover {
    color: #409eff;
  }
}

/* 交互效果 */
.article-card:hover {
  cursor: pointer;
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);

  .article-cover {
    transform: scale(1.05);
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .cover-wrapper {
    width: 200px;
    height: 150px;
    left: -15px;
  }

  .content-wrapper {
    margin-left: 180px;
    padding: 25px 30px;
  }
}

@media (max-width: 992px) {
  .container {
    padding: 30px;
  }

  .article-card {
    min-height: auto;
  }

  .cover-wrapper {
    position: relative;
    left: 0;
    top: 0;
    transform: none;
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }

  .content-wrapper {
    margin-left: 0;
    padding: 20px;
  }
}
</style>
