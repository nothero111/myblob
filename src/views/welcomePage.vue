<script setup></script>

<template>
  <div>
    <router-link>
      <div class="title">
        <h1>FLY&nbsp;</h1>
        <h1>welcome</h1>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
div {
  //width: 100vw;
  height: 200vh;
  background: $primary-color;
  background-size: cover;
  .title {
    height: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    font-size: 100px;
    font-weight: 900;
  }
  .title:first-child {
    margin-right: 100px;
  }
}
</style>
