<template>
  <section class="bookmark-stats">
    <h2>Bookmark Stats</h2>
    <p>Total saved articles: <strong>{{ count }}</strong></p>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

const favoritesStore = useFavoritesStore()

onMounted(() => favoritesStore.hydrate())

const count = computed(() => favoritesStore.count)
</script>

<style scoped>
.bookmark-stats {
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}
</style>
