import { VList, VListGroup } from '@components/VList'
import { test } from '@util/testing'

// TODO: Test actual behaviour instead of classes
test('VListGroup.js', ({ mount }) => {
  it('should render component and match snapshot', () => {
    const wrapper = mount(VList, {
      slots: {
        default: [VListGroup]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a lazy component and match snapshot', () => {
    const wrapper = mount(VList, {
      propsData: {
        lazy: true
      },
      slots: {
        default: [VListGroup]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a component with no padding for action icon and match snapshot', () => {
    const wrapper = mount(VList, {
      propsData: {
        noAction: true
      },
      slots: {
        default: [VListGroup]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a component with route namespace and match snapshot', () => {
    const $route = { path: '' }
    const wrapper = mount(VList, {
      propsData: {
        group: 'listGroup'
      },
      slots: {
        default: [VListGroup]
      },
      globals: {
        $route
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should toggle based upon matching uid', () => {
    const listClick = jest.fn()
    const wrapper = mount(VListGroup, {
      provide: {
        listClick: listClick,
        list: {
          register: () => {},
          unregister: () => {}
        }
      }
    })

    expect(wrapper.vm.isActive).toBe(false)
    wrapper.vm.toggle(wrapper.vm._uid)
    expect(wrapper.vm.isActive).toBe(true)
    wrapper.vm.toggle(null)
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should accept a custom active class', () => {
    const wrapper = mount(VListGroup, {
      attachToDocument: true,
      propsData: {
        activeClass: 'foo',
        value: true
      }
    })

    const header = wrapper.find('.list__group__header__prepend-icon')[0]

    expect(header.hasClass('foo')).toBe(true)
    wrapper.setProps({ activeClass: 'bar' })
    expect(header.hasClass('bar')).toBe(true)

    expect('Injection "listClick" not found').toHaveBeenWarned()
    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })

  it('should open if no value provided and group matches route', async () => {
    const $route = { path: '/foo' }
    const listClick = jest.fn()
    const wrapper = mount(VListGroup, {
      attachToDocument: true,
      propsData: {
        group: 'foo'
      },
      provide: {
        listClick
      },
      globals: {
        $route
      }
    })

    await wrapper.vm.$nextTick()
    expect(listClick).toBeCalledWith(wrapper.vm._uid)

    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })

  it('should toggle when clicked', async () => {
    const wrapper = mount(VListGroup, {
      attachToDocument: true,
      provide: {
        listClick: () => {}
      }
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)
    wrapper.vm.click()
    await wrapper.vm.$nextTick()
    expect(input).toBeCalledWith(true)

    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })

  it('should unregister when destroyed', async () => {
    const unregister = jest.fn()
    const wrapper = mount(VListGroup, {
      attachToDocument: true,
      provide: {
        listClick: () => {},
        list: {
          register: () => {},
          unregister
        }
      }
    })

    wrapper.destroy()
    await wrapper.vm.$nextTick()
    expect(unregister).toBeCalledWith(wrapper.vm._uid)    
  })

  it('should render a custom append icon', async () => {
    const wrapper = mount(VListGroup, {
      slots: {
        appendIcon: {
          render: h => h('span', 'bar')
        }
      }
    })

    const icon = wrapper.find('span')[0]
    expect(icon.html()).toBe('<span>bar</span>')

    expect('Injection "listClick" not found').toHaveBeenWarned()
    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })

  it('should only render custom prepend icon', async () => {
    const wrapper = mount(VListGroup, {
      slots: {
        prependIcon: {
          render: h => h('span', 'bar')
        }
      }
    })

    const icon = wrapper.find('span')[0]
    expect(icon.html()).toBe('<span>bar</span>')

    expect('Injection "listClick" not found').toHaveBeenWarned()
    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })

  it('should render a default prepended icon', async () => {
    const wrapper = mount(VListGroup, {
      propsData: {
        subGroup: true
      }
    })

    const icon = wrapper.find('.icon')[0]

    expect(icon.text()).toBe('arrow_drop_down')

    expect('Injection "listClick" not found').toHaveBeenWarned()
    expect('The v-list-group component must be used inside a v-list.').toHaveBeenTipped()
  })
})
