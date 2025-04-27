<script setup>
import { useRoute } from 'vue-router'
import { Search, Moon, Sunny } from '@element-plus/icons-vue'
import { ref } from 'vue'
const Route = useRoute()
console.log(Route.path)
const input = ref('')
const handleSelect = () => {}
</script>
<template>
  <el-container>
    <el-header
      style="position: fixed; top: 0; width: 100%; z-index: 1000; padding: 0"
    >
      <div class="menuContain">
        <el-menu
          router="router"
          :default-active="Route.path"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
          "
        >
          <div
            class="icon"
            style="
              margin-right: 800px;
              width: 40px;
              height: 40px;
              margin-left: 20px;
              box-sizing: border-box; /* 包含 padding 和 border */
              overflow: hidden; /* 隐藏溢出内容（可选） */
            "
          >
            <img
              class="pic"
              style="
                max-width: 100%;
                max-height: 100%;
                object-fit: cover; /* 控制图片缩放方式（可选） */
              "
              src="../assets/myicon.png"
              alt=""
            />
          </div>
          <el-menu-item index="/welcomePage">欢迎</el-menu-item>
          <el-menu-item index="/Article">文章</el-menu-item>
          <el-menu-item index="/util">工具</el-menu-item>
          <el-menu-item index="/picture">图库</el-menu-item>
          <el-menu-item index="/station">站长</el-menu-item>
          <div class="search">
            <el-input
              v-model="input"
              placeholder="请输入内容"
              :prefix-icon="Search"
              style="
                height: 40px;
                width: 200px;
                margin-right: 100px;
                margin-left: 200px;
              "
            ></el-input>
          </div>
          <el-button round>
            <el-icon><Moon /></el-icon>
            <div style="width: 10px"></div>
            <el-icon><Sunny color="#F66927" /></el-icon>
          </el-button>
        </el-menu>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-main {
  width: 100vw;
  height: 100vh;
  --el-main-padding: 0;
}
.el-menu--horizontal {
  --el-menu-horizontal-height: 60px;
  background-color: $primary-color;
  width: 100% !important;
  .el-menu-item {
    font-size: 15px;
    font-weight: 500;
    color: grey;
  }
}
.menuContain {
  background-color: $primary-color;
  width: 100%;
}
.menuContain :deep(.el-menu-item:hover) {
  background-color: $primary-color !important;
  color: $primary-font-color !important;
}
.menuContain :deep(.el-menu-item.is-active) {
  background-color: $primary-color !important;
  color: $primary-font-color !important;
}
</style>
