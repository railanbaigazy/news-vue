import { createRouter, createWebHistory } from 'vue-router'
import ArticlePage from '../pages/ArticlePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../pages/HomePage.vue')
    // },
    {
      path: '/',
      name: 'article',
      component: ArticlePage,
      props: true
    },
    // {
    //   path: '/favorites',
    //   name: 'favorites',
    //   component: () => import('../pages/FavoritesPage.vue')
    // }
  ],
})

export default router
