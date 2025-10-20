export function useNewsUtils() {
  const formatDate = (date, locale = 'ru-RU') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const formatRelativeDate = (date) => {
    const now = new Date()
    const articleDate = new Date(date)
    const diffInHours = Math.floor((now - articleDate) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Только что'
    } else if (diffInHours < 24) {
      return `${diffInHours} ч. назад`
    } else if (diffInHours < 48) {
      return 'Вчера'
    } else {
      return formatDate(date)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const extractKeywords = (text, limit = 5) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3)

    const wordCount = {}
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word)
  }

  const isDefaultImage = (imageUrl) => {
    return imageUrl.includes('placeholder') || imageUrl.includes('via.placeholder')
  }

  const generateImageAlt = (title) => {
    return `Изображение для статьи: ${title}`
  }

  return {
    formatDate,
    formatRelativeDate,
    formatNumber,
    truncateText,
    extractKeywords,
    isDefaultImage,
    generateImageAlt,
  }
}
