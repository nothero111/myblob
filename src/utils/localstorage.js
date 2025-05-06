// 本地存储存入数据
export const setlocaldata = async (key, value) => {
  await localStorage.setItem(key, JSON.stringify(value))
}
// 本地存储拿到数据
export const getlocaldata = async (key) => {
  return JSON.parse(localStorage.getItem(key))
}
