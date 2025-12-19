import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLikesStore } from '@/stores/likesStore'

describe('likesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds an article to likes', () => {
    const store = useLikesStore()

    store.add({ id: '1', title: 'Hello' })

    expect(store.liked).toHaveLength(1)
  })

  it('removes an article from likes', () => {
    const store = useLikesStore()
    store.add({ id: '1', title: 'Hello' })

    store.remove('1')

    expect(store.liked).toHaveLength(0)
  })

  it('toggle adds when not present', () => {
    const store = useLikesStore()

    const result = store.toggle({ id: '1', title: 'Hello' })

    expect(result).toBe(true)
  })

  it('toggle removes when already present', () => {
    const store = useLikesStore()
    store.add({ id: '1', title: 'Hello' })

    const result = store.toggle({ id: '1', title: 'Hello' })

    expect(result).toBe(false)
  })

  it('returns true from isLiked for saved id', () => {
    const store = useLikesStore()

    store.add({ id: '1', title: 'Hello' })

    expect(store.isLiked('1')).toBe(true)
  })

  it('hydrates state from localStorage', () => {
    localStorage.setItem('news-liked', JSON.stringify([{ id: '1' }]))

    const store = useLikesStore()
    store.hydrate()

    expect(store.liked).toHaveLength(1)
  })
})
