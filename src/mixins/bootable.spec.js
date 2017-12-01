import Vue from 'vue'
import { test } from '~util/testing'
import Bootable from '~mixins/bootable'

test('bootable.js', ({ mount }) => {
  it('should be booted after activation', async () => {
    const wrapper = mount({
      data: () => ({
        isActive: false,
      }),
      mixins: [ Bootable ],
      render: h => h('div')
    })

    expect(wrapper.vm.isBooted).toBe(false)
    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isBooted).toBe(true)
  })

  it('should be return lazy content', async () => {
    const wrapper = mount({
      mixins: [ Bootable ],
      render: h => h('div')
    })

    expect(wrapper.vm.showLazyContent('content')).toBe('content')

    const wrapperLazy = mount({
      data: () => ({
        isActive: false,
      }),
      mixins: [ Bootable ],
      render: h => h('div')
    }, {
      propsData: {
        lazy: true
      }
    })

    expect(wrapperLazy.vm.showLazyContent('content')).toBe(null)
    wrapperLazy.vm.isActive = true
    await wrapper.vm.$nextTick()
    expect(wrapperLazy.vm.showLazyContent('content')).toBe('content')
    wrapperLazy.vm.isActive = false
    await wrapper.vm.$nextTick()
    expect(wrapperLazy.vm.showLazyContent('content')).toBe('content')
  })
})
