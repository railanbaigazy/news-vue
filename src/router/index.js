import { createRouter, createWebHistory } from 'vue-router'
import ArticlePage from '@/pages/ArticlePage.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/category/:category',
      name: 'category',
      component: HomePage,
    },
    {
      path: '/article/:id?',
      name: 'article-id',
      component: ArticlePage,
      props: true,
    },
  ],
})

export default router
