import { defineStore } from 'pinia'

const STORAGE_KEY = 'news-favorites'

const pickArticleFields = (article) => ({
  id: article.id,
  title: article.title,
  description: article.description,
  content: article.content,
  url: article.url,
  urlToImage: article.urlToImage,
  publishedAt: article.publishedAt,
  author: article.author,
  source: article.source,
  category: article.category || 'General',
})

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    initialized: false,
  }),

  getters: {
    isFavorite: (state) => (id) => state.favorites.some((item) => String(item.id) === String(id)),
    count: (state) => state.favorites.length,
  },

  actions: {
    hydrate() {
      if (this.initialized) return

      if (typeof window === 'undefined') {
        this.initialized = true
        return
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        this.favorites = raw ? JSON.parse(raw) : []
      } catch (err) {
        console.error('Failed to load favorites from storage:', err)
        this.favorites = []
      } finally {
        this.initialized = true
      }
    },

    persist() {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites))
    },

    add(article) {
      this.hydrate()
      if (!article?.id || this.isFavorite(article.id)) return

      this.favorites.push(pickArticleFields(article))
      this.persist()
    },

    remove(id) {
      this.hydrate()
      this.favorites = this.favorites.filter((item) => String(item.id) !== String(id))
      this.persist()
    },

    toggle(article) {
      this.hydrate()
      if (this.isFavorite(article.id)) {
        this.remove(article.id)
        return false
      }

      this.add(article)
      return true
    },
  },
})
