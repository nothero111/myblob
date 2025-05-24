const getWordNumAndReadTime = (markdown) => {
  // 统计图片数量
  const imageCount = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length

  // 处理Markdown文本，提取纯文字内容
  let text = markdown
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // 提取图片alt文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 提取链接文本
    .replace(/\*\*(.*?)\*\*/g, '$1') // 去除粗体
    .replace(/(\*|_)(.*?)\1/g, '$2') // 去除斜体
    .replace(/`([^`]*)`/g, '$1') // 去除行内代码
    .replace(/```.*?\n/g, '') // 去除代码块开始标记
    .replace(/```/g, '') // 去除剩余代码块标记
    .replace(/^#+\s+/gm, '') // 去除标题标记
    .replace(/^\s*[-*+]?\d+\.?\s+/gm, '') // 去除列表标记
    .replace(/^>\s*/gm, '') // 去除引用块标记
    .replace(/-{3,}/g, '') // 去除水平线
    .replace(/\s+/g, ' ') // 合并多余空白
    .trim() // 去除首尾空格

  // 统计文字数目（去除所有空格后的字符数）
  const wordCount = text.replace(/\s/g, '').length

  // 计算阅读时间（分钟）
  const readingTime = ((wordCount / 100) * 60 + imageCount * 10) / 60

  return {
    wordCount: wordCount,
    readingTime: Math.round(readingTime)
  }
}
export default getWordNumAndReadTime
