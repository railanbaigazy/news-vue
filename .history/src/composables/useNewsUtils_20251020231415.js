import { ref, reactive, readonly } from 'vue'
import newsApiService from '../services/newsApi.js'

const cache = reactive(new Map())
const loading = ref(false)
const error = ref(null)

export function useNewsApi() {
  const getTopHeadlines = async (params = {}) => {
    const cacheKey = `headlines_${JSON.stringify(params)}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const result = await newsApiService.getTopHeadlines(params)
      cache.set(cacheKey, result)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchNews = async (query, params = {}) => {
    const cacheKey = `search_${query}_${JSON.stringify(params)}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const result = await newsApiService.searchNews(query, params)
      cache.set(cacheKey, result)
      return result.articles
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getNewsByCategory = async (category, params = {}) => {
    const cacheKey = `category_${category}_${JSON.stringify(params)}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const result = await newsApiService.getNewsByCategory(category, params)
      cache.set(cacheKey, result)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getArticle = async (id) => {
    const cacheKey = `article_${id}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const result = await newsApiService.getArticleById(id)
      cache.set(cacheKey, result)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getRelatedArticles = async (article, limit = 3) => {
    const cacheKey = `related_${article.id}_${limit}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    loading.value = true
    error.value = null

    try {
      const result = await newsApiService.getNewsByCategory(article.category)
      const relatedArticles = result.articles
        .filter(item => item.id !== article.id)
        .slice(0, limit)

      cache.set(cacheKey, relatedArticles)
      return relatedArticles
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCache = () => {
    cache.clear()
  }

  const clearCacheKey = (key) => {
    cache.delete(key)
  }

  const isLoading = () => loading.value

  const getError = () => error.value

  const clearError = () => {
    error.value = null
  }

  return {
    getTopHeadlines,
    searchNews,
    getNewsByCategory,
    getArticle,
    getRelatedArticles,

    clearCache,
    clearCacheKey,
    isLoading,
    getError,
    clearError,

    loading: readonly(loading),
    error: readonly(error)
  }
}

export function useNewsUtils() {
  const formatDate = (date, locale = 'ru-RU') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)

    const wordCount = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
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
    generateImageAlt
  }
}
