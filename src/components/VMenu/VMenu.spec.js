import VBtn from '@components/VBtn'
import VCard from '@components/VCard'
import VMenu from '@components/VMenu'
import { test } from '@util/testing'

// TODO: Most of these have exactly the same snapshots
test('VMenu.js', ({ mount }) => {
  it('should work', async () => {
    const wrapper = mount(VMenu, {
      propsData: {
        value: false
      },
      slots: {
        activator: [VBtn],
        default: [VCard]
      }
    })

    const activator = wrapper.find('.menu__activator')[0]
    const input = jest.fn()
    wrapper.instance().$on('input', input)
    activator.trigger('click')

    await wrapper.vm.$nextTick()

    expect(input).toBeCalledWith(true)
    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom top and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        top: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom bottom and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        bottom: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom left and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        left: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom right and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        right: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom fullWidth and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        fullWidth: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom auto and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        auto: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom offsetX and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        offsetX: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom offsetY and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        offsetY: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom disabled and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom maxHeight and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        maxHeight: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom nudgeTop and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        nudgeTop: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom nudgeBottom and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        nudgeBottom: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom nudgeLeft and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        nudgeLeft: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom nudgeRight and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        nudgeRight: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom nudgeWidth and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        nudgeWidth: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom openOnClick and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        openOnClick: false
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom openOnHover and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        openOnHover: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom lazy and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        lazy: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom closeOnClick and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        closeOnClick: false
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom closeOnContentClick and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        closeOnContentClick: false
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom activator and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        activator: [VBtn]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom origin and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        origin: 'top right'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom transition and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        transition: 'fade-transition'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom positionX and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        positionX: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom positionY and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        positionY: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom absolute and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        absolute: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom maxWidth and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        maxWidth: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should render component with custom minWidth and match snapshot', () => {
    const wrapper = mount(VMenu, {
      propsData: {
        minWidth: 100
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should round dimensions', async () => {
    const wrapper = mount(VMenu, {
      propsData: {
        value: false
      },
      slots: {
        activator: [VBtn]
      }
    })

    const content = wrapper.find('.menu__content')[0]

    const getBoundingClientRect = () => {
      return {
        width: 100.5,
        height: 100.25,
        top: 0.75,
        left: 50.123,
        right: 75.987,
        bottom: 4,
        x: 0,
        y: 0
      }
    }

    wrapper.vm.$refs.activator.querySelector('.btn').getBoundingClientRect = getBoundingClientRect
    wrapper.vm.$refs.content.getBoundingClientRect = getBoundingClientRect

    wrapper.setProps({ value: true })

    await new Promise(resolve => requestAnimationFrame(resolve))

    expect(content.getAttribute('style')).toMatchSnapshot()
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })
})
