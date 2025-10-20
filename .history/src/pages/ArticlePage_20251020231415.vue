<template>
  <div class="article-page">
    <!-- Header -->
    <Header @search="handleSearch" />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загружаем статью...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <h2>Ошибка загрузки</h2>
        <p>{{ error }}</p>
        <button @click="loadArticle" class="btn btn-primary">Попробовать снова</button>
      </div>

      <!-- Article Content -->
      <div v-else class="content-container">
        <!-- Article Header -->
        <div class="article-header">
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="date">{{ formatDate(article.publishedAt) }}</span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-author">
            <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
            <div class="author-info">
              <span class="author-name">{{ article.author.name }}</span>
              <span class="author-role">{{ article.author.role }}</span>
            </div>
          </div>
        </div>

        <!-- Article Image -->
        <div class="article-image">
          <img :src="article.image" :alt="article.title" />
        </div>

        <!-- Article Content -->
        <div class="article-body">
          <div class="article-text" v-html="article.content"></div>
        </div>

        <!-- Article Actions -->
        <div class="article-actions">
          <ActionButton
            type="like"
            :active="isLiked"
            :count="article.likes"
            @click="toggleLike"
          />
          <ActionButton
            type="share"
            @click="shareArticle"
          />
          <ActionButton
            type="bookmark"
            :active="isBookmarked"
            @click="toggleBookmark"
          />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import ActionButton from '../components/ActionButton.vue'
import ArticleCard from '../components/ArticleCard.vue'
import { useNewsApi, useNewsUtils } from '../composables/useNewsApi.js'

const route = useRoute()

const isLiked = ref(false)
const isBookmarked = ref(false)
const loading = ref(false)
const error = ref(null)

const { getArticle } = useNewsApi()
const { formatDate, formatRelativeDate } = useNewsUtils()

const article = reactive({
  id: null,
  title: '',
  description: '',
  content: '',
  image: '',
  category: '',
  publishedAt: null,
  likes: 0,
  comments: 0,
  author: {
    name: '',
    role: '',
    avatar: ''
  }
})


const articleId = computed(() => {
  return route.params.id || '1'
})

const loadArticle = async () => {
  loading.value = true
  error.value = null

  try {
    const articleData = await getArticle(articleId.value)

    Object.assign(article, articleData)

  } catch (err) {
    error.value = err.message
    console.error('Error loading article:', err)
  } finally {
    loading.value = false
  }
}


const handleSearch = (searchData) => {
  console.log('Search performed:', searchData)
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    article.likes++
  } else {
    article.likes--
  }
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.description,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Ссылка скопирована в буфер обмена!')
  }
}

onMounted(() => {
  loadArticle()
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadArticle()
  }
})
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background-color: #ffffff;
}

/* Header Styles */
.header {
  background-color: #000000;
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.navigation {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link.active {
  color: #3b82f6;
  font-weight: 600;
}

.search-btn {
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #f3f4f6;
}

.search-btn svg {
  color: #000000;
}

/* Main Content */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content-container {
  background: white;
}

.article-header {
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category {
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #111827;
}

.article-description {
  font-size: 1.25rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #111827;
}

.author-role {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Article Image */
.article-image {
  margin: 2rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.article-body {
  margin: 2rem 0;
}

.article-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #374151;
}

.article-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: #111827;
}

.article-text p {
  margin-bottom: 1.5rem;
}

/* Article Actions */
.article-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #f9fafb;
  border-color: #3b82f6;
}

.action-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}


/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .navigation {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-content {
    padding: 1rem;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-actions {
    flex-direction: column;
  }
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}
</style>
