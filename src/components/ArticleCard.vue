<template>
  <article class="article-card" :class="cardClasses">
    <div class="article-image">
      <img
        :src="article.urlToImage || defaultImageUrl"
        :alt="article.title"
        @error="handleImageError"
      />

      <div class="article-category" v-if="article.category">
        {{ article.category }}
      </div>
    </div>

    <div class="article-content">
      <div class="article-meta">
        <span class="article-date">{{ formatDate(article.publishedAt) }}</span>
        <span class="article-author" v-if="article.author">
          {{ article.author }}
        </span>
      </div>

      <h3 class="article-title">
        <router-link :to="`/article/${article.id}`" class="title-link">
          {{ article.title }}
        </router-link>
      </h3>

      <p class="article-description" v-if="article.description">
        {{ truncateText(article.description, maxDescriptionLength) }}
      </p>

      <div class="article-footer">
        <div class="article-stats">
          <span class="stat-item" v-if="article.likes !== undefined">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61C20.33 4.1 19.69 3.84 19 3.84C18.31 3.84 17.67 4.1 17.16 4.61L12 9.77L6.84 4.61C6.33 4.1 5.69 3.84 5 3.84C4.31 3.84 3.67 4.1 3.16 4.61C2.65 5.12 2.39 5.76 2.39 6.45C2.39 7.14 2.65 7.78 3.16 8.29L8.29 13.42L3.16 18.55C2.65 19.06 2.39 19.7 2.39 20.39C2.39 21.08 2.65 21.72 3.16 22.23C3.67 22.74 4.31 23 5 23C5.69 23 6.33 22.74 6.84 22.23L12 17.06L17.16 22.23C17.67 22.74 18.31 23 19 23C19.69 23 20.33 22.74 20.84 22.23C21.35 21.72 21.61 21.08 21.61 20.39C21.61 19.7 21.35 19.06 20.84 18.55L15.71 13.42L20.84 8.29C21.35 7.78 21.61 7.14 21.61 6.45C21.61 5.76 21.35 5.12 20.84 4.61Z"
                fill="currentColor"
              />
            </svg>
            {{ formatNumber(article.likes) }}
          </span>
          <span class="stat-item" v-if="article.comments !== undefined">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ formatNumber(article.comments) }}
          </span>
        </div>

        <div class="article-actions" v-if="showActions">
          <button
            class="action-btn like-btn"
            :class="{ active: isLiked }"
            @click="handleLike"
            title="Лайк"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                fill="currentColor"
              />
            </svg>
            <span v-if="article.likes">{{ formatNumber(article.likes) }}</span>
          </button>

          <button
            class="action-btn bookmark-btn"
            :class="{ active: isBookmarked }"
            @click="handleBookmark"
            title="Сохранить"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'featured', 'compact', 'minimal'].includes(value),
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  maxDescriptionLength: {
    type: Number,
    default: 150,
  },
})

const emit = defineEmits(['like', 'bookmark', 'click'])

const defaultImageUrl =
  'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'

const isLiked = ref(false)
const isBookmarked = ref(false)
const imageError = ref(false)

const cardClasses = computed(() => [
  `article-card--${props.variant}`,
  {
    'article-card--image-error': imageError.value,
  },
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleImageError = () => {
  imageError.value = true
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like', { article: props.article, liked: isLiked.value })
}

const handleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  emit('bookmark', { article: props.article, bookmarked: isBookmarked.value })
}
</script>

<style scoped>
.article-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.article-card--featured {
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.article-card--compact {
  display: flex;
  gap: 1rem;
  flex-direction: row;
}

.article-card--compact .article-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.article-card--compact .article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card--minimal {
  border: none;
  box-shadow: none;
  background: transparent;
}

.article-card--minimal:hover {
  transform: none;
  box-shadow: none;
}

.article-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.article-date {
  font-weight: 500;
}

.article-author {
  font-weight: 600;
  color: #3b82f6;
}

.article-title {
  margin-bottom: 0.75rem;
}

.title-link {
  color: #111827;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.title-link:hover {
  color: #3b82f6;
}

.article-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.article-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #6b7280;
}

.action-btn:hover {
  background-color: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.action-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.like-btn.active {
  background-color: #ef4444;
  border-color: #ef4444;
}

.bookmark-btn.active {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

@media (max-width: 768px) {
  .article-card--compact {
    flex-direction: column;
  }

  .article-card--compact .article-image {
    width: 100%;
    height: 200px;
  }

  .article-content {
    padding: 1rem;
  }

  .article-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    margin-top: 1rem;
  }

  .article-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .action-btn {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
