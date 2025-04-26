<script setup>
import { useRoute } from 'vue-router'
import { Search, Moon, Sunny } from '@element-plus/icons-vue'
const Route = useRoute()
console.log(Route.path)

const handleSelect = () => {}
</script>
<template>
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
        style="display: flex; flex-direction: row; align-items: center"
      >
        <div class="icon"><img src="../assets/myicon.png" alt="" /></div>
        <el-menu-item index="/welcomePage">欢迎</el-menu-item>
        <el-menu-item index="/home">首页</el-menu-item>
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
  <router-view></router-view>
</template>

<style lang="scss" scoped>
.icon {
  margin-right: 800px;
  img {
    width: 40px;
  }
}
.search :deep(.el-input__wrapper) {
  border-radius: 10px;
}
.el-menu--horizontal {
  --el-menu-horizontal-height: 60px;
  background-color: $primary-color;
  margin: 0 20px;
  width: 100%;
  .el-menu-item {
    font-size: 15px;
    font-weight: 500;
    color: grey;
  }
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
