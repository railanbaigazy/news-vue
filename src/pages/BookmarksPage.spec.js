import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, vi, expect } from 'vitest'
import BookmarksPage from '@/pages/BookmarksPage.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

const mountBookmarksPage = (favorites = []) => {
  const pinia = createPinia()
  setActivePinia(pinia)

  const favoritesStore = useFavoritesStore()
  favoritesStore.favorites = favorites
  favoritesStore.hydrate = vi.fn()

  const wrapper = mount(BookmarksPage, {
    global: {
      plugins: [pinia],
      stubs: {
        Header: { template: '<header />' },
        ArticleCard: { template: '<article class="article-card" />' },
        RouterLink: { template: '<a><slot /></a>' },
      },
    },
  })

  return { wrapper, favoritesStore }
}

describe('BookmarksPage', () => {
  it('shows empty state text', () => {
    const { wrapper } = mountBookmarksPage([])

    expect(wrapper.text()).toContain('You have no saved articles yet.')
  })

  it('renders no article cards when empty', () => {
    const { wrapper } = mountBookmarksPage([])

    expect(wrapper.findAll('.article-card')).toHaveLength(0)
  })

  it('renders a card for each bookmark', () => {
    const bookmarked = [
      { id: '1', title: 'Article One' },
      { id: '2', title: 'Article Two' },
    ]

    const { wrapper } = mountBookmarksPage(bookmarked)

    expect(wrapper.findAll('.article-card')).toHaveLength(bookmarked.length)
  })

  it('uses transition-group wrapper', () => {
    const { wrapper } = mountBookmarksPage([{ id: '1' }])

    expect(wrapper.findComponent({ name: 'TransitionGroup' }).exists()).toBe(true)
  })

  it('calls hydrate on mount', () => {
    const { favoritesStore } = mountBookmarksPage([{ id: '1' }])

    expect(favoritesStore.hydrate).toHaveBeenCalledTimes(1)
  })
})
