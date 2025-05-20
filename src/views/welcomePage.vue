<script setup></script>
<template>
  <div class="body">
    <div class="title">
      <svg width="400" height="200">
        <text
          x="90"
          y="75"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="none"
          stroke="black"
          stroke-width="0.5"
          transform="scale(2 2)"
          font-size="60"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0 100%; 100% 0"
            dur="2s"
            repeatCount="1"
          />

          小浪花
        </text>
      </svg>
      <h1>welcome</h1>
      <h4>路虽远，行则将至</h4>
      <h5>欢迎来到浪花小站</h5>
      <div class="last">
        <h6>传送门：</h6>

        <a href="https://github.com/nothero111?tab=repositories">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-github"></use>
          </svg>
        </a>
        <a href="https://gitee.com/one__fly">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gitee"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.body {
  width: 100%;
  min-width: 1000px;
  min-height: 600px;
  height: 100vh;
  overflow: hidden;
  background: $primary-color url('../assets/welcome.png') no-repeat right top;
  background-size: 50%; /* 拉伸填充 */
  .title {
    padding-top: 60px;
    margin-left: 150px;
    font-size: 100px;
    user-select: none;
    svg {
      font-size: 100px;
    }
    h1 {
      font-weight: 900;
      font-size: 0.77rem;
    }
    h4 {
      font-size: 0.5rem;
    }
    h5 {
      margin-top: 10px;
      font-size: 0.25rem;
      margin-bottom: 60px;
    }
    .last {
      display: flex;
      align-items: center;
      h6 {
        font-size: 20px;
        width: 80px;
      }
      .icon {
        margin-right: 5px;
        font-size: 20px;
        display: block;
      }
    }
  }
}
</style>
