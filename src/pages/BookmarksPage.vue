<template>
  <div class="bookmarks-page">
    <Header />

    <main class="main-content">
      <div class="page-heading">
        <router-link class="stats-link" to="/bookmarks/stats">View stats</router-link>
        <div class="heading-main">
          <h1>Bookmarks</h1>
          <p class="subheading">Saved news you want to return to</p>
        </div>
        <router-view />
      </div>

      <template v-if="bookmarks.length === 0">
        <transition name="fade" appear>
          <div key="empty" class="empty-state">
            <p>You have no saved articles yet.</p>
            <router-link to="/" class="btn btn-primary">Browse news</router-link>
          </div>
        </transition>
      </template>

      <transition-group v-else name="fade" tag="div" class="articles-grid" appear>
        <ArticleCard
          v-for="article in bookmarks"
          :key="article.id"
          :article="article"
          @bookmark="handleBookmark"
        />
      </transition-group>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Header from '@/components/AppHeader.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

const favoritesStore = useFavoritesStore()
onMounted(() => favoritesStore.hydrate())

const bookmarks = computed(() => favoritesStore.favorites)

const handleBookmark = ({ article, bookmarked }) => {
  if (!bookmarked) {
    favoritesStore.remove(article.id)
  }
}
</script>

<style scoped>
.bookmarks-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-heading {
  position: relative;
  margin-bottom: 1.5rem;
  text-align: center;
}

.heading-main {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.page-heading h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.subheading {
  color: #6b7280;
  font-weight: 500;
}

.stats-link {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.stats-link:hover {
  background: #3b82f6;
  color: white;
}

@media (max-width: 768px) {
  .page-heading {
    padding-right: 0;
  }

  .stats-link {
    position: static;
    display: inline-block;
    margin-top: 0.75rem;
  }
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background-color: white;
  transition: all 0.3s ease;
  text-decoration: none;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
