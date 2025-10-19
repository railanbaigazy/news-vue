<template>
  <div class="article-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>66% Halal News</h1>
        </div>

        <nav class="navigation">
          <a href="#" class="nav-link active">All</a>
          <a href="#" class="nav-link">Business</a>
          <a href="#" class="nav-link">Entertainment</a>
          <a href="#" class="nav-link">Health</a>
          <a href="#" class="nav-link">Science</a>
          <a href="#" class="nav-link">Sports</a>
          <a href="#" class="nav-link">Technology</a>
        </nav>

        <button class="search-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-container">
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
          <button class="action-btn like-btn" :class="{ active: isLiked }" @click="toggleLike">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61C20.33 4.1 19.69 3.84 19 3.84C18.31 3.84 17.67 4.1 17.16 4.61L12 9.77L6.84 4.61C6.33 4.1 5.69 3.84 5 3.84C4.31 3.84 3.67 4.1 3.16 4.61C2.65 5.12 2.39 5.76 2.39 6.45C2.39 7.14 2.65 7.78 3.16 8.29L8.29 13.42L3.16 18.55C2.65 19.06 2.39 19.7 2.39 20.39C2.39 21.08 2.65 21.72 3.16 22.23C3.67 22.74 4.31 23 5 23C5.69 23 6.33 22.74 6.84 22.23L12 17.06L17.16 22.23C17.67 22.74 18.31 23 19 23C19.69 23 20.33 22.74 20.84 22.23C21.35 21.72 21.61 21.08 21.61 20.39C21.61 19.7 21.35 19.06 20.84 18.55L15.71 13.42L20.84 8.29C21.35 7.78 21.61 7.14 21.61 6.45C21.61 5.76 21.35 5.12 20.84 4.61Z" fill="currentColor"/>
            </svg>
            {{ article.likes }}
          </button>

          <button class="action-btn share-btn" @click="shareArticle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0039 5.24971 15.0114 5.37237L8.01141 9.37237C7.4507 8.90419 6.75736 8.6 6 8.6C4.12231 8.6 2.6 10.1223 2.6 12C2.6 13.8777 4.12231 15.4 6 15.4C6.75736 15.4 7.4507 15.0958 8.01141 14.6276L15.0114 18.6276C15.0039 18.7503 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.2426 16 16.5493 16.3042 15.9886 16.7724L8.98859 12.7724C8.99614 12.6497 9 12.5255 9 12.4C9 12.2745 8.99614 12.1503 8.98859 12.0276L15.9886 8.02763C16.5493 8.49581 17.2426 8.8 18 8.8Z" fill="currentColor"/>
            </svg>
            Поделиться
          </button>

          <button class="action-btn bookmark-btn" :class="{ active: isBookmarked }" @click="toggleBookmark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isBookmarked ? 'В закладках' : 'В закладки' }}
          </button>
        </div>

        <!-- Related Articles -->
        <div class="related-articles">
          <h3>Похожие статьи</h3>
          <div class="related-grid">
            <div v-for="related in relatedArticles" :key="related.id" class="related-item">
              <img :src="related.image" :alt="related.title" class="related-image">
              <div class="related-content">
                <h4 class="related-title">{{ related.title }}</h4>
                <p class="related-meta">{{ related.category }} • {{ formatDate(related.publishedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isLiked = ref(false)
const isBookmarked = ref(false)

const article = reactive({
  id: 1,
  title: 'Новые технологии в области искусственного интеллекта',
  description: 'Обзор последних достижений в сфере ИИ и их влияние на современный мир',
  content: `
    <p>Искусственный интеллект продолжает развиваться с невероятной скоростью, открывая новые возможности для человечества. В последние годы мы стали свидетелями революционных изменений в этой области.</p>

    <p>Одним из наиболее значимых достижений стало создание более эффективных алгоритмов машинного обучения, которые способны обрабатывать огромные объемы данных и находить скрытые закономерности.</p>

    <p>Современные ИИ-системы уже используются в медицине для диагностики заболеваний, в транспорте для создания автономных автомобилей, и во многих других сферах жизни.</p>

    <h3>Будущее ИИ</h3>
    <p>Эксперты прогнозируют, что в ближайшие годы мы увидим еще более впечатляющие достижения в области искусственного интеллекта. Это откроет новые возможности для решения глобальных проблем человечества.</p>
  `,
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  category: 'Technology',
  publishedAt: new Date('2024-01-15'),
  likes: 1247,
  author: {
    name: 'Алексей Петров',
    role: 'Технический редактор',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
})

const relatedArticles = ref([
  {
    id: 2,
    title: 'Квантовые вычисления: новая эра',
    category: 'Science',
    publishedAt: new Date('2024-01-14'),
    image: 'https://images.unsplash.com/photo-1635070041078-e43c4b3b4a0a?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    title: 'Блокчейн в здравоохранении',
    category: 'Health',
    publishedAt: new Date('2024-01-13'),
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    title: 'Роботы в производстве',
    category: 'Technology',
    publishedAt: new Date('2024-01-12'),
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop'
  }
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
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

.related-articles {
  margin-top: 3rem;
}

.related-articles h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #111827;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.related-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.related-content {
  padding: 1rem;
}

.related-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
  line-height: 1.4;
}

.related-meta {
  color: #6b7280;
  font-size: 0.875rem;
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

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
