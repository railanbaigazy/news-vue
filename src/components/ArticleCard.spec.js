import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ArticleCard from '@/components/ArticleCard.vue'

const sampleArticle = {
  id: 'source::title::123',
  title: 'Sample Title',
  description: 'Short description text',
  urlToImage: 'https://via.placeholder.com/300x200',
  publishedAt: new Date().toISOString(),
  author: 'John Doe',
  likes: 12,
  comments: 3,
  category: 'General',
}

const mountCard = (overrides = {}) =>
  mount(ArticleCard, {
    props: { article: { ...sampleArticle, ...overrides }, showActions: true },
    global: {
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })

describe('ArticleCard', () => {
  it('renders title and description', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain(sampleArticle.title)
    expect(wrapper.text()).toContain('Short description')
  })

  it('emits like when like button clicked', async () => {
    const wrapper = mountCard()
    const likeBtn = wrapper.find('.action-btn.like-btn')
    await likeBtn.trigger('click')
    expect(wrapper.emitted('like')).toBeTruthy()
  })

  it('emits bookmark when bookmark clicked', async () => {
    const wrapper = mountCard()
    const bookmarkBtn = wrapper.find('.action-btn.bookmark-btn')
    await bookmarkBtn.trigger('click')
    expect(wrapper.emitted('bookmark')).toBeTruthy()
  })
})
