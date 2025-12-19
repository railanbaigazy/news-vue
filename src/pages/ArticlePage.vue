<template>
  <div class="article-page">
    <Header @search="handleSearch" />

    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading article...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h2>Failed to load</h2>
        <p>{{ error }}</p>
        <button @click="loadArticle" class="btn btn-primary">Try again</button>
      </div>

      <div v-else class="content-container">
        <div class="back-section">
          <button @click="goBack" class="back-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Back
          </button>
        </div>

        <div class="article-header">
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="date">{{ formatDate(article.publishedAt) }}</span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-author">
            <div class="author-info">
              <span class="author-name">{{ article.author }}</span>
            </div>
          </div>
        </div>

        <div class="article-image">
          <img :src="article.urlToImage" :alt="article.title" />
        </div>

        <div class="article-body">
          <div class="article-text" v-html="article.content"></div>
        </div>

        <div class="article-actions">
          <ActionButton type="like" :active="isLiked" :count="displayLikes" @click="toggleLike" />
          <ActionButton type="share" @click="shareArticle" />
          <ActionButton type="bookmark" :active="isBookmarked" @click="toggleBookmark" />
        </div>

        <!-- Форма комментариев -->
        <div v-show="!loading && !error" class="comments-section">
          <CommentForm @submit="handleCommentSubmit" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/AppHeader.vue'
import ActionButton from '@/components/ActionButton.vue'
import CommentForm from '@/components/CommentForm.vue'
import { useNewsStore } from '@/stores/newsStore'
import { useNewsUtils } from '@/composables/useNewsUtils.js'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useLikesStore } from '@/stores/likesStore'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const { formatDate } = useNewsUtils()
const favoritesStore = useFavoritesStore()
const likesStore = useLikesStore()

const isLiked = computed(() => likesStore.isLiked(article.id))
const isBookmarked = computed(() => favoritesStore.isFavorite(article.id))
const displayLikes = computed(() => {
  const baseLikes = Number(article.likes) || 0
  return baseLikes + (likesStore.isLiked(article.id) ? 1 : 0)
})
const loading = ref(false)
const error = ref(null)

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
    avatar: '',
  },
})

const articleId = computed(() => {
  return route.params.id || '1'
})

const getMockArticle = (id) => {
  return {
    id: id,
    title: 'Заголовок статьи не найден',
    description: 'К сожалению, статья с таким ID не была найдена.',
    content: '<p>Содержимое статьи временно недоступно.</p>',
    image: 'https://via.placeholder.com/800x400?text=Article+Not+Found',
    category: 'General',
    publishedAt: new Date(),
    likes: 0,
    comments: 0,
    author: {
      name: 'Система',
      role: 'Служба поддержки',
      avatar: 'https://via.placeholder.com/100x100?text=No+Author',
    },
  }
}

const loadArticle = async () => {
  loading.value = true
  error.value = null

  try {
    let foundArticle = newsStore.topHeadlines.articles.find((a) => String(a.id) === articleId.value)

    if (!foundArticle) {
      foundArticle = newsStore.searchResults.articles.find((a) => String(a.id) === articleId.value)
    }

    if (!foundArticle && newsStore.topHeadlines.articles.length === 0) {
      await newsStore.fetchTopHeadlines({ pageSize: 20 })
      foundArticle = newsStore.topHeadlines.articles.find((a) => String(a.id) === articleId.value)
    }

    Object.assign(article, foundArticle || getMockArticle(articleId.value))
  } catch (err) {
    error.value = 'Не удалось загрузить статью'
    console.error('Error loading article:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = (searchData) => {
  console.log('Search performed:', searchData)
}

const toggleLike = () => {
  likesStore.toggle(article)
}

const toggleBookmark = () => {
  favoritesStore.toggle(article)
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.description,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Ссылка скопирована в буфер обмена!')
  }
}

const handleCommentSubmit = (commentData) => {
  console.log('Комментарий отправлен:', commentData)
  // Здесь можно добавить логику сохранения комментария
  article.comments = (article.comments || 0) + 1
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  favoritesStore.hydrate()
  likesStore.hydrate()
  loadArticle()
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadArticle()
    }
  },
)
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background-color: #ffffff;
}

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

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content-container {
  background: white;
}

.back-section {
  margin-bottom: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  color: #3b82f6;
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
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #111827;
}

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

.article-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
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

  .back-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}

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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
