<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <h1>66% Halal News</h1>
        </router-link>
      </div>

      <nav class="navigation">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="category.path"
          class="nav-link"
          :class="{ active: $route.path === category.path }"
        >
          {{ category.name }}
        </router-link>
      </nav>

      <div class="search-container">
        <div class="search-input-wrapper" :class="{ active: isSearchActive }">
          <input
            v-model="searchQuery"
            @focus="isSearchActive = true"
            @blur="handleSearchBlur"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск новостей..."
            class="search-input"
          />
          <button class="search-btn" @click="performSearch">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div v-if="searchResults.length > 0 && isSearchActive" class="search-results">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="search-result-item"
            @click="selectSearchResult(result)"
          >
            <img
              :src="
                result.urlToImage ||
                result.image ||
                'https://via.placeholder.com/60x60?text=No+Image'
              "
              :alt="result.title"
              class="search-result-image"
            />
            <div class="search-result-content">
              <h4 class="search-result-title">{{ result.title }}</h4>
              <p class="search-result-meta">
                {{ result.category || 'General' }} • {{ formatDate(result.publishedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsUtils } from '@/composables/useNewsUtils'
import { useNewsStore } from '@/stores/newsStore'

const emit = defineEmits(['search'])

const router = useRouter()
const newsStore = useNewsStore()
const { formatDate } = useNewsUtils()

const isSearchActive = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

const categories = reactive([
  { id: 1, name: 'All', path: '/' },
  { id: 2, name: 'Business', path: '/category/business' },
  { id: 3, name: 'Entertainment', path: '/category/entertainment' },
  { id: 4, name: 'Health', path: '/category/health' },
  { id: 5, name: 'Science', path: '/category/science' },
  { id: 6, name: 'Sports', path: '/category/sports' },
  { id: 7, name: 'Technology', path: '/category/technology' },
])

const performSearch = async () => {
  const query = searchQuery.value.trim()

  if (!query) return

  try {
    await newsStore.searchArticles({
      query,
      pageSize: 5,
    })

    searchResults.value = newsStore.articles.slice(0, 5)

    emit('search', { query, results: searchResults.value })
  } catch (error) {
    console.error('Ошибка поиска:', error)
    searchResults.value = []
  }
}

const selectSearchResult = (result) => {
  router.push(`/article/${result.id}`)
  resetSearch()
}

const resetSearch = () => {
  isSearchActive.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const handleSearchBlur = () => {
  setTimeout(resetSearch, 200)
}

watch(searchQuery, async (newQuery) => {
  if (newQuery & (newQuery.length > 2)) {
    await performSearch()
  } else {
    searchResults.value = []
  }
})
</script>

<style scoped>
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

.logo-link {
  text-decoration: none;
  color: white;
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
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link.active {
  color: #3b82f6;
  font-weight: 600;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  min-width: 300px;
}

.search-input-wrapper.active {
  box-shadow: 0 0 0 2px #3b82f6;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.3s ease;
}

.search-btn:hover {
  color: #3b82f6;
}

.search-btn svg {
  color: currentColor;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f3f4f6;
}

.search-result-item:hover {
  background-color: #f9fafb;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.search-result-content {
  flex: 1;
}

.search-result-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.search-result-meta {
  font-size: 0.75rem;
  color: #6b7280;
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

  .search-input-wrapper {
    min-width: 250px;
  }
}
</style>
