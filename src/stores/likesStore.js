import { defineStore } from 'pinia'

const STORAGE_KEY = 'news-liked'

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

export const useLikesStore = defineStore('likes', {
  state: () => ({
    liked: [],
    initialized: false,
  }),

  getters: {
    isLiked: (state) => (id) => state.liked.some((item) => String(item.id) === String(id)),
    count: (state) => state.liked.length,
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
        this.liked = raw ? JSON.parse(raw) : []
      } catch (err) {
        console.error('Failed to load likes from storage:', err)
        this.liked = []
      } finally {
        this.initialized = true
      }
    },

    persist() {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.liked))
    },

    add(article) {
      this.hydrate()
      if (!article?.id || this.isLiked(article.id)) return

      this.liked.push(pickArticleFields(article))
      this.persist()
    },

    remove(id) {
      this.hydrate()
      this.liked = this.liked.filter((item) => String(item.id) !== String(id))
      this.persist()
    },

    toggle(article) {
      this.hydrate()
      if (!article?.id) return false

      if (this.isLiked(article.id)) {
        this.remove(article.id)
        return false
      }

      this.add(article)
      return true
    },
  },
})
