import { defineStore } from 'pinia'
import { getTopHeadlines, searchNews } from '@/services/newsService'
import { generateArticleId } from '@/helpers/generateArticleId'

export const useNewsStore = defineStore('news', {
  state: () => ({
    topHeadlines: {
      articles: [],
      totalResults: 0,
    },
    searchResults: {
      articles: [],
      totalResults: 0,
    },
    loading: false,
    error: null,
    country: 'us',
    category: '',
    sources: '',
    query: '',
    page: 1,
    pageSize: 20,
  }),

  actions: {
    async fetchTopHeadlines(filters = {}) {
      this.loading = true
      this.error = null

      const params = {
        country: filters.country || this.country,
        query: filters.query ?? this.query,
        category: filters.category || this.category,
        sources: filters.sources || this.sources,
        page: filters.page || this.page,
        pageSize: filters.pageSize || this.pageSize,
      }

      try {
        const res = await getTopHeadlines(
          params.country,
          params.query,
          params.category,
          params.sources,
          params.page,
          params.pageSize,
        )

        this.topHeadlines.articles = res.data.articles.map((article) => ({
          ...article,
          id: generateArticleId(article),
          category: params.category || 'Top Headlines',
        }))

        this.topHeadlines.totalResults = res.data.totalResults

        this.country = params.country
        this.category = params.category
        this.sources = params.sources
        this.query = params.query
        this.page = params.page
        this.pageSize = params.pageSize
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },

    async searchArticles(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const res = await searchNews(
          filters.query || this.query,
          filters.searchIn,
          filters.from,
          filters.to,
          filters.language,
          filters.sortBy,
          filters.domains,
          filters.excludeDomains,
          filters.page || this.page,
          filters.pageSize || this.pageSize,
        )

        this.searchResults.articles = res.data.articles.map((article) => ({
          ...article,
          id: generateArticleId(article),
          category: 'Searched',
        }))

        this.searchResults.totalResults = res.data.totalResults
        this.page = filters.page || 1
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },
  },
})
