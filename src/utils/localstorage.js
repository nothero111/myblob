// 本地存储存入数据
export const setlocaldata = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
// 本地存储拿到数据
export const getlocaldata = async (key) => {
  return JSON.parse(localStorage.getItem(key))
}
export const removeLocalData = (key) => {
  localStorage.removeItem(key)
}
