<template>
  <div class="home-page">
    <Header @search="handleSearch" />

    <main class="main-content">
      <h1 class="page-heading">
        {{ pageHeading }}
      </h1>

      <div v-if="loading && articles.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Loading news...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h2>Failed to load</h2>
        <p>{{ error }}</p>
        <button @click="loadArticles" class="btn btn-primary">Try again</button>
      </div>

      <div v-else class="articles-grid">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          @like="handleLike"
          @bookmark="handleBookmark"
        />
      </div>

      <div v-if="articles.length > 0 && !loading" class="pagination-controls">
        <button
          @click="goToPreviousPage"
          :disabled="!hasPrevious || loading"
          class="btn btn-outline"
          :class="{ disabled: !hasPrevious }"
        >
          ← Previous
        </button>

        <span class="page-info"> Page {{ currentPage }} of {{ totalPages }} </span>

        <button
          @click="goToNextPage"
          :disabled="!hasNext || loading"
          class="btn btn-outline"
          :class="{ disabled: !hasNext }"
        >
          Next →
        </button>
      </div>

      <div v-if="articles.length === 0 && !loading && !error" class="no-results">
        <p>No articles found.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/AppHeader.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useNewsStore } from '@/stores/newsStore'
import { capitalize } from 'vue'

const route = useRoute()
const newsStore = useNewsStore()

const loading = ref(false)
const error = ref(null)
const pageSize = 6
const currentPage = ref(1)

const articles = computed(() => newsStore.topHeadlines.articles)
const totalResults = computed(() => newsStore.topHeadlines.totalResults)
const totalPages = computed(() => Math.ceil(totalResults.value / pageSize))
const hasPrevious = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)

const pageHeading = computed(() => {
  const path = route.path

  if (path === '/') return 'Latest News'

  return capitalize(getCategoryFromPath()) || 'News'
})

const loadArticles = async () => {
  loading.value = true
  error.value = null

  const category = getCategoryFromPath()

  try {
    await newsStore.fetchTopHeadlines({
      category,
      page: currentPage.value,
      pageSize: pageSize,
    })
  } catch (err) {
    error.value = 'Failed to load news'
    console.error('Error loading articles:', err)
  } finally {
    loading.value = false
  }
}

const goToPreviousPage = () => {
  if (hasPrevious.value) {
    currentPage.value--
    loadArticles()
  }
}

const goToNextPage = () => {
  if (hasNext.value) {
    currentPage.value++
    loadArticles()
  }
}

const handleSearch = (searchData) => {
  console.log('Search:', searchData)
}

const handleLike = ({ article, liked }) => {
  console.log('Liked:', article.title, liked)
}

const handleBookmark = ({ article, bookmarked }) => {
  console.log('Bookmarked:', article.title, bookmarked)
}

const getCategoryFromPath = () => {
  const path = route.path
  const categoryMap = {
    '/category/business': 'business',
    '/category/entertainment': 'entertainment',
    '/category/health': 'health',
    '/category/science': 'science',
    '/category/sports': 'sports',
    '/category/technology': 'technology',
  }

  return categoryMap[path] || ''
}

onMounted(async () => {
  await loadArticles()
})

watch(
  () => route.path,
  async () => {
    currentPage.value = 1
    await loadArticles()
  },
)
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-heading {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 0 1rem;
}

.page-info {
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background-color: white;
  transition: all 0.3s ease;
}

.btn-outline {
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-outline:hover:not(:disabled) {
  background-color: #eff6ff;
  transform: translateY(-2px);
}

.btn:disabled,
.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.no-results {
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
  font-style: italic;
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

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .page-heading {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
