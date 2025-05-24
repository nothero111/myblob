import dayjs from 'dayjs'

// 时间戳转 YYYY-MM-DD
export function formatTimestampWithDayjs(timestamp) {
  timestamp = timestamp * 1 // 这里要乘1的原因是timestamp是字符串，这里需要转为数字类型
  return dayjs(timestamp).format('YYYY-MM-DD')
}
