// 假设设计稿为1920px

const size = 192 //设计稿宽度%10 比如 1920

// 设置rem 函数
function setRem() {
  //计算出 比例来 当前分辨率的宽%设计稿宽度
  const scale = window.innerWidth / 1920
  // 给根元素设置font-size
  document.documentElement.style.fontSize = size * Math.min(scale, 2) + 'px'
}
setRem()
window.onresize = function () {
  setRem()
}
