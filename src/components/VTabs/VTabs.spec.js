import { test, touch } from '@util/testing'
import { createRange } from '@util/helpers'
import VTabs from './VTabs'
import VTab from './VTab'
import VTabItem from './VTabItem'
import VTabsItems from './VTabsItems'
import VTabsSlider from './VTabsSlider'

const Component = (items = ['foo', 'bar']) => {
  return {
    inheritAttrs: false,

    render (h) {
      return h(VTabs, {
        attrs: this.$attrs
      }, [
        items.map(item => h(VTab, {
          props: { href: `#${item}` }
        })),
        h(VTabsItems, items.map(item => h(VTabItem, {
          props: { id: item }
        })))
      ])
    }
  }
}

const ssrBootable = () => new Promise(resolve => requestAnimationFrame(resolve))

test('VTabs', ({ mount, shallow }) => {
  it('should provide', () => {
    const wrapper = mount(Component())

    const tab = wrapper.find(VTab)[0]
    expect(typeof tab.vm.tabClick).toBe('function')
    expect(typeof tab.vm.tabs.register).toBe('function')
    expect(typeof tab.vm.tabs.unregister).toBe('function')

    const items = wrapper.find(VTabsItems)[0]
    expect(typeof items.vm.registerItems).toBe('function')
    expect(typeof items.vm.unregisterItems).toBe('function')
  })

  it('should register tabs and items', async () => {
    const wrapper = mount(VTabs, {
      slots: {
        default: [VTab, VTabsItems]
      }
    })

    const tab = wrapper.find(VTab)[0]
    expect(wrapper.vm.tabs.length).toBe(1)
    tab.destroy()
    expect(wrapper.vm.tabs.length).toBe(0)

    const items = wrapper.find(VTabsItems)[0]
    expect(typeof wrapper.vm.tabItems).toBe('function')
    items.destroy()
    expect(wrapper.vm.tabItems).toBe(null)
  })

  it('should change tab and content when model changes', async () => {
    const wrapper = mount(Component(), {
      attachToDocument: true
    })

    const tabs = wrapper.find(VTabs)[0]
    const tab = wrapper.find(VTab)[0]
    const item = wrapper.find(VTabItem)[0]

    expect(tabs.vm.activeIndex).toBe(-1)
    expect(tab.vm.isActive).toBe(false)
    expect(item.vm.isActive).toBe(false)
    await ssrBootable()
    await wrapper.vm.$nextTick()
    expect(tabs.vm.activeIndex).toBe(0)
    expect(tab.vm.isActive).toBe(true)
    expect(item.vm.isActive).toBe(true)
  })

  it('should call slider on application resize', async () => {
    const wrapper = mount(Component())

    const tabs = wrapper.find(VTabs)[0]

    expect(tabs.vm.resizeTimeout).toBe(null)
    tabs.vm.$vuetify.application.left = 100
    await tabs.vm.$nextTick()
    expect(tabs.vm.resizeTimeout).toBeTruthy()
    tabs.setData({ resizeTimeout: null })
    expect(tabs.vm.resizeTimeout).toBe(null)
    tabs.vm.$vuetify.application.right = 100
    await tabs.vm.$nextTick()
    expect(tabs.vm.resizeTimeout).toBeTruthy()
  })

  it('should reset offset on resize', async () => {
    const wrapper = mount(Component(), {
      attachToDocument: true
    })

    await ssrBootable()

    const tabs = wrapper.find(VTabs)[0]

    tabs.setData({ scrollOffset: 1 })
    tabs.vm.onResize()
    await tabs.vm.$nextTick()
    expect(tabs.vm.scrollOffset).toBe(0)
    tabs.setData({ scrollOffset: 2 })
    await tabs.vm.$nextTick()
    tabs.destroy()
    tabs.vm.onResize()
    expect(tabs.vm.scrollOffset).toBe(2)
  })

  it('should update model when route changes', async () => {
    const $route = { path: 'bar' }
    const wrapper = mount(Component(), {
      attachToDocument: true,
      globals: {
        $route
      }
    })

    await ssrBootable()

    const tabs = wrapper.find(VTabs)[0]
    const tab = wrapper.find(VTab)[1]
    const input = jest.fn()

    tabs.vm.$on('input', input)
    tab.vm.click(new Event('click'))
    await wrapper.vm.$nextTick()

    expect(input).toHaveBeenCalled()
  })

  it('should call method if overflowing', () => {
    const wrapper = mount(VTabs)
    const fn = jest.fn()

    wrapper.vm.overflowCheck(null, fn)
    expect(fn).not.toHaveBeenCalled()
    wrapper.setData({ isOverflowing: true })
    wrapper.vm.overflowCheck(null, fn)
    expect(fn).toHaveBeenCalled()
  })

  it('should update scroll and item offset', async () => {
    const newOffset = jest.fn()
    const wrapper = mount(VTabs, {
      props: {
        showArrows: true
      }
    })

    wrapper.setMethods({ newOffset })

    await ssrBootable()

    wrapper.vm.scrollTo('append')
    wrapper.vm.scrollTo('prepend')
    expect(newOffset.mock.calls.length).toBe(2)

    wrapper.setMethods({ newOffset: () => 5 })
    await wrapper.vm.$nextTick()

    wrapper.vm.scrollTo('prepend')
    expect(wrapper.vm.scrollOffset).toBe(5)
  })

  it('should validate height prop', async () => {
    const wrapper = mount(VTabs, {
      propsData: { height: 'auto' }
    })

    expect('Invalid prop: custom validator check failed for prop "height"').toHaveBeenWarned()
    wrapper.setProps({ height: null })
    expect(wrapper.vm.containerStyles).toBe(null)
    wrapper.setProps({ height: 112 })
    expect(wrapper.vm.containerStyles.height).toBe('112px')
  })

  it('should return lazy value when accessing input', async () => {
    const wrapper = mount(VTabs)

    expect(wrapper.vm.inputValue).toBe(undefined)
    wrapper.setData({ lazyValue: 'foo' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputValue).toBe('foo')
  })

  it('should show tabs arrows', async () => {
    const wrapper = mount(VTabs, {
      propsData: { showArrows: true }
    })

    wrapper.setData({ isOverflowing: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tabs__wrapper--show-arrows')).toHaveLength(1)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have a null target with no activeTab', () => {
    const wrapper = mount(VTabs)

    expect(wrapper.vm.target).toBe(null)
  })

  it('should not conditionally render append and prepend icons', async () => {
    const scrollTo = jest.fn()
    const wrapper = mount(VTabs, {
      attachToDocument: true
    })

    expect(wrapper.vm.genIcon('prepend')).toBe(null)

    // // Mock display state
    wrapper.setData({ isOverflowing: true, scrollOffset: 1 })
    wrapper.setProps({ showArrows: true })
    wrapper.vm.$vuetify.breakpoint.width = 800
    await ssrBootable()
    wrapper.setProps({ mobileBreakPoint: 1200 })

    expect(wrapper.vm.genIcon('prepend')).toBeTruthy()

    wrapper.setMethods({ scrollTo })
    // Since the elements will have no width
    // trick append icon to show
    wrapper.setData({ scrollOffset: -1 })
    await wrapper.vm.$nextTick()

    const next = wrapper.find('.tabs__icon--append')[0]
    next.trigger('click')
    await wrapper.vm.$nextTick()
    expect(scrollTo).toHaveBeenCalledWith('append')
  })

  it('should call on touch methods', async () => {
    const wrapper = mount(VTabs, {
      attachToDocument: true
    })

    wrapper.setData({ isOverflowing: true })

    const onTouch = jest.fn()
    wrapper.setMethods({
      onTouchStart: onTouch,
      onTouchMove: onTouch,
      onTouchEnd: onTouch
    })
    await ssrBootable()

    const tabsWrapper = wrapper.find('.tabs__wrapper')[0]

    touch(tabsWrapper).start(0, 0)
    touch(tabsWrapper).end(0, 0)
    touch(tabsWrapper).move(15, 15)
    expect(onTouch.mock.calls.length).toBe(3)
  })

  it('should use a slotted slider', () => {
    const wrapper = mount(VTabs, {
      slots: {
        default: [{
          name: 'v-tabs-slider',
          render: h => h(VTabsSlider, {
            props: { color: 'pink' }
          })
        }]
      }
    })

    const slider = wrapper.find(VTabsSlider)[0]
    expect(slider.hasClass('pink')).toBe(true)
  })

  it('should handle touch events and remove container transition', async () => {
    const wrapper = mount(VTabs, {
      attachToDocument: true
    })

    wrapper.setData({ isOverflowing: true })
    const container = wrapper.find('.tabs__container')[0]

    await ssrBootable()

    expect(wrapper.vm.startX).toBe(0)
    wrapper.vm.onTouchStart({ touchstartX: 0 })
    expect(container.hasStyle('transition', 'none')).toBe(true)

    wrapper.vm.onTouchMove({ touchmoveX: -100 })
    expect(wrapper.vm.scrollOffset).toBe(100)

    wrapper.vm.onTouchEnd()
    expect(wrapper.vm.scrollOffset).toBe(0)

    wrapper.setData({ isOverflowing: false, scrollOffset: 100 })
    wrapper.vm.onTouchEnd()
    expect(wrapper.vm.scrollOffset).toBe(0)
  })

  it('should generate a v-tabs-items if none present and has v-tab-item', async () => {
    const wrapper = mount(VTabs, {
      propsData: { value: 'foo' },
      slots: {
        default: [{
          name: 'v-tab-item',
          render: h => h('div')
        }]
      }
    })

    await ssrBootable()

    expect(wrapper.find(VTabsItems).length).toBe(1)
  })

  it('should scroll active item into view if off screen', async () => {
    const wrapper = mount(VTabs, {
      attachToDocument: true,
      propsData: { value: 'bar' },
      slots: {
        default: [{
          name: 'v-tab',
          render: h => h(VTab, {
            props: { href: 'foo' }
          })
        }]
      }
    })

    await ssrBootable()

    expect(wrapper.vm.scrollIntoView()).toEqual(false)

    wrapper.setProps({ value: 'foo' })
    // Simulate being scrolled too far to the right
    wrapper.setData({ scrollOffset: 400 })
    await wrapper.vm.$nextTick()

    wrapper.vm.scrollIntoView()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.scrollOffset).toBe(0)

    // DOM elements have no actual widths
    // Trick into running else condition
    wrapper.setData({ scrollOffset: -1 })
    wrapper.vm.scrollIntoView()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.scrollOffset).toBe(0)
  })

  it('should hide slider', async () => {
    const wrapper = mount(VTabs, {
      attachToDocument: true,
      propsData: { hideSlider: true },
      slots: {
        default: [{
          name: 'v-tab',
          render: h => h(VTab)
        }]
      }
    })

    await ssrBootable()

    const slider = wrapper.find('.tabs__slider')
    expect(slider).toHaveLength(0)
  })
})
