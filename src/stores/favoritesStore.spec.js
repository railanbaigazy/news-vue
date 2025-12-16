import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '@/stores/favoritesStore'

describe('favoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds an article to favorites', () => {
    const store = useFavoritesStore()

    store.add({ id: '1', title: 'Hello' })

    expect(store.favorites).toHaveLength(1)
  })

  it('removes an article from favorites', () => {
    const store = useFavoritesStore()
    store.add({ id: '1', title: 'Hello' })

    store.remove('1')

    expect(store.favorites).toHaveLength(0)
  })

  it('toggle adds when not present', () => {
    const store = useFavoritesStore()

    const result = store.toggle({ id: '1', title: 'Hello' })

    expect(result).toBe(true)
  })

  it('toggle removes when already present', () => {
    const store = useFavoritesStore()
    store.add({ id: '1', title: 'Hello' })

    const result = store.toggle({ id: '1', title: 'Hello' })

    expect(result).toBe(false)
  })

  it('returns true from isFavorite for saved id', () => {
    const store = useFavoritesStore()

    store.add({ id: '1', title: 'Hello' })

    expect(store.isFavorite('1')).toBe(true)
  })

  it('hydrates state from localStorage', () => {
    localStorage.setItem('news-favorites', JSON.stringify([{ id: '1' }]))

    const store = useFavoritesStore()
    store.hydrate()

    expect(store.favorites).toHaveLength(1)
  })
})
