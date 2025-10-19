import { createRouter, createWebHistory } from 'vue-router'
import ArticlePage from '../pages/ArticlePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'article',
      component: ArticlePage,
      props: true
    },
    {
      path: '/article/:id?',
      name: 'article-id',
      component: ArticlePage,
      props: true
    }
  ],
})

export default router
