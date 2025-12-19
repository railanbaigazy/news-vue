import { defineStore } from 'pinia'

const STORAGE_KEY = 'news-comments'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [],
    initialized: false,
  }),

  getters: {
    getCommentsByArticleId: (state) => (articleId) => {
      return state.comments.filter((comment) => String(comment.articleId) === String(articleId))
    },
    getCommentCount: (state) => (articleId) => {
      return state.comments.filter((comment) => String(comment.articleId) === String(articleId))
        .length
    },
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
        this.comments = raw ? JSON.parse(raw) : []
      } catch (err) {
        console.error('Failed to load comments from storage:', err)
        this.comments = []
      } finally {
        this.initialized = true
      }
    },

    persist() {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.comments))
    },

    add(articleId, commentData) {
      this.hydrate()

      const newComment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        articleId: String(articleId),
        name: commentData.name,
        email: commentData.email,
        comment: commentData.comment,
        timestamp: commentData.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      this.comments.push(newComment)
      this.persist()

      return newComment
    },

    remove(commentId) {
      this.hydrate()
      this.comments = this.comments.filter((comment) => comment.id !== commentId)
      this.persist()
    },

    removeByArticleId(articleId) {
      this.hydrate()
      this.comments = this.comments.filter(
        (comment) => String(comment.articleId) !== String(articleId),
      )
      this.persist()
    },
  },
})

