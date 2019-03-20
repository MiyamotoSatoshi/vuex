// Components
import VDialog from '../VDialog'

// Utilities
import {
  mount,
  Wrapper
} from '@vue/test-utils'

describe('VDialog.ts', () => {
  type Instance = InstanceType<typeof VDialog>
  let mountFunction: (options?: object) => Wrapper<Instance>
  let el
  (global as any).requestAnimationFrame = cb => cb()

  beforeEach(() => {
    el = document.createElement('div')
    el.setAttribute('data-app', 'true')
    document.body.appendChild(el)
    mountFunction = (options = {}) => {
      return mount(VDialog, {
        mocks: {
          $vuetify: {
            theme: {},
            breakpoint: {}
          }
        },
        ...options
      })
    }
  })

  afterEach(() => {
    document.body.removeChild(el)
  })

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a disabled component and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a persistent component and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        persistent: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a fullscreen component and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        fullscreen: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a eager component and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        eager: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a scrollable component and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        scrollable: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom origin and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        origin: 'top right'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom width (max-width) and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        maxWidth: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom width and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        width: '50%'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom transition and match snapshot', () => {
    const wrapper = mountFunction({
      propsData: {
        transition: 'fade-transition'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should open dialog on activator click', async () => {
    const input = jest.fn()
    const wrapper = mountFunction({
      slots: {
        activator: ['<span>activator</span>']
      }
    })

    wrapper.vm.$on('input', input)

    expect(wrapper.vm.isActive).toBe(false)
    wrapper.find('.v-dialog__activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
    await wrapper.vm.$nextTick()
    expect(input).toHaveBeenCalledWith(true)
  })

  it('not should open disabed dialog on activator click', async () => {
    const input = jest.fn()
    const wrapper = mountFunction({
      propsData: {
        disabled: true
      },
      slots: {
        activator: ['<span>activator</span>']
      }
    })

    wrapper.vm.$on('input', input)

    expect(wrapper.vm.isActive).toBe(false)
    wrapper.find('.v-dialog__activator').trigger('click')
    expect(wrapper.vm.isActive).toBe(false)
    await wrapper.vm.$nextTick()
    expect(input).not.toHaveBeenCalled()
  })

  it('not change state on v-model update', async () => {
    const wrapper = mountFunction({
      propsData: {
        value: false
      },
      slots: {
        activator: ['<span>activator</span>']
      }
    })

    expect(wrapper.vm.isActive).toBe(false)

    wrapper.setProps({
      value: true
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)

    wrapper.setProps({
      value: false
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should emit keydown event', async () => {
    const keydown = jest.fn()
    const wrapper = mountFunction({
      propsData: { value: true }
    })
    wrapper.vm.$on('keydown', keydown)

    await wrapper.vm.$nextTick()
    wrapper.vm.$refs.content.dispatchEvent(new Event('keydown'))
    expect(keydown).toHaveBeenCalled()
  })

  // https://github.com/vuetifyjs/vuetify/issues/3101
  it('should always remove scrollbar when fullscreen', async () => {
    const wrapper = mountFunction()

    wrapper.setProps({ value: true })

    await wrapper.vm.$nextTick()

    expect(document.documentElement.className).not.toContain('overflow-y-hidden')

    wrapper.setProps({ fullscreen: true })

    await wrapper.vm.$nextTick()

    expect(document.documentElement.className).toContain('overflow-y-hidden')
  })

  it('should not attach event handlers to the activator container if disabled', async () => {
    const wrapper = mountFunction({
      propsData: {
        disabled: true
      },
      slots: {
        activator: ['<button></button>']
      }
    })

    const activator = wrapper.find('.v-dialog__activator')
    activator.trigger('click')

    expect(wrapper.vm.isActive).toBe(false)
  })

  // https://github.com/vuetifyjs/vuetify/issues/6115
  it('should have activator', () => {
    const wrapper = mountFunction()
    expect(wrapper.vm.hasActivator).toBe(false)
    expect(wrapper.element.style.display).toBe('block')

    const wrapper2 = mountFunction({
      slots: {
        activator: ['<div></div>']
      }
    })
    expect(wrapper2.element.style.display).toBe('inline-block')
    expect(wrapper2.vm.hasActivator).toBe(true)

    const wrapper3 = mountFunction({
      scopedSlots: {
        activator () {
          return this.$createElement('span')
        }
      }
    })
    const dialog = wrapper3.find(VDialog)
    expect(wrapper2.element.style.display).toBe('inline-block')
    expect(dialog.vm.hasActivator).toBe(true)
  })
})
