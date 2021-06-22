// Components
import { VResponsive } from '..'

// Utilities
import { createVuetify } from '@/framework'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'

describe('VResponsive', () => {
  const vuetify = createVuetify()

  function mountFunction (options = {}) {
    return mount(VResponsive, {
      global: { plugins: [vuetify] },
      ...options,
    })
  }

  it('should force aspect ratio', () => {
    const wrapper = mountFunction({
      propsData: { aspectRatio: 16 / 9 },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render content', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('div', ['content']),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set height', () => {
    const wrapper = mountFunction({
      propsData: { height: 100, maxHeight: 200 },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
