import { createRouter, createWebHistory } from 'vue-router'
import { useFavoritesStore } from '@/stores/favoritesStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/category/:category',
      name: 'category',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/article/:id?',
      name: 'article-id',
      component: () => import('@/pages/ArticlePage.vue'),
      props: true,
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('@/pages/BookmarksPage.vue'),
      children: [
        {
          path: 'stats',
          name: 'bookmarks-stats',
          component: () => import('@/pages/BookmarkStats.vue'),
          meta: { requiresFavorites: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta?.requiresFavorites) {
    const favoritesStore = useFavoritesStore()
    favoritesStore.hydrate()

    if (!favoritesStore.count) {
      return { name: 'bookmarks' }
    }
  }

  return true
})

export default router
