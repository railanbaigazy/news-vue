import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ActionButton from '@/components/ActionButton.vue'

const mountBtn = (props = {}) =>
  mount(ActionButton, {
    props: {
      type: 'like',
      active: false,
      disabled: false,
      showText: true,
      ...props,
    },
  })

describe('ActionButton', () => {
  it('renders text for type', () => {
    const wrapper = mountBtn({ type: 'bookmark' })
    expect(wrapper.text()).toContain('В закладки')
  })

  it('emits click when enabled', async () => {
    const wrapper = mountBtn()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit when disabled', async () => {
    const wrapper = mountBtn({ disabled: true })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('applies active class when active', () => {
    const wrapper = mountBtn({ type: 'like', active: true })
    expect(wrapper.find('button').classes()).toContain('action-btn--active')
  })
})
