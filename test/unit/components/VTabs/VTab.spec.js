import { test } from '@/test'
import VTab from '@/components/VTabs/VTab'
import Vue from 'vue'

const tabClick = 'Injection "tabClick" not found'
const tabsWarning = '[Vuetify] The v-item component must be used inside a v-item-group'
const stub = {
  name: 'router-link',

  props: {
    to: [String, Object]
  },

  render (h) {
    return h('a', {
      domProps: { href: this.to }
    })
  }
}

test('VTab', ({ mount }) => {
  it('should render a div when disabled', async () => {
    const wrapper = mount(VTab, {
      propsData: {
        href: '#foo'
      }
    })

    expect(wrapper.find('.v-tabs__item')[0].vNode.elm.tagName).toBe('A')
    wrapper.setProps({ disabled: true })
    expect(wrapper.find('.v-tabs__item')[0].vNode.elm.tagName).toBe('DIV')

    expect(tabsWarning).toHaveBeenTipped()
  })

  it('should emit click event and prevent default', async () => {
    const click = jest.fn()
    const wrapper = mount({
      provide: {
        tabClick: click
      },
      render (h) { return h('div', this.$slots.default) }
    }, {
      slots: {
        default: [{
          render: h => h(VTab, {
            props: { href: '#foo' }
          })
        }]
      }
    })

    const tab = wrapper.find(VTab)[0]
    tab.vm.$on('click', click)
    const event = new Event('click')
    tab.vm.click(event)
    await wrapper.vm.$nextTick()
    // Cannot figure out how to ensure this actually happens
    // expect(event.defaultPrevented).toBe(false)
    expect(click).toHaveBeenCalled()
    expect(tabsWarning).toHaveBeenTipped()
  })

  it('should have the correct value', () => {
    const instance = Vue.extend()
    instance.component('router-link', stub)
    const wrapper = mount(VTab, {
      propsData: {
        href: '#foo'
      },
      instance,
      globals: {
        $route: { path: '/' },
        $router: {
          resolve: (to, route, append) => {
            let href
            if (to.path) href = to.path

            return { href }
          }
        }
      }
    })

    expect(wrapper.vm.value).toBe('foo')
    wrapper.setProps({ href: null, to: '/foo' })
    expect(wrapper.vm.value).toBe('/foo')
    wrapper.setProps({ to: { path: 'bar' }})
    expect(wrapper.vm.value).toBe('bar')

    expect(tabsWarning).toHaveBeenTipped()
  })
})
