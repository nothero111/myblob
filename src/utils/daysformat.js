import dayjs from 'dayjs'
// 时间戳转 YYYY-MM-DD
export function formatTimestampWithDayjs(timestamp) {
  // 直接传入时间戳（毫秒级）
  return dayjs(timestamp).format('YYYY-MM-DD')
}
