import { test } from '~util/testing'
import Vue from 'vue/dist/vue.common'
import VTextField from '~components/VTextField'
import VProgressLinear from '~components/VProgressLinear'

test('VTextField.js', ({ mount }) => {
  it('should render component and match snapshot', () => {
    const wrapper = mount(VTextField)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should pass events to internal input field', () => {
    const keyup = jest.fn()
    const component = {
      render (h) {
        return h(VTextField, { on: { keyUp: keyup }, props: { download: '' }, attrs: {} })
      }
    }
    const wrapper = mount(component)

    const input = wrapper.find('input')[0]
    input.trigger('keyUp', { keyCode: 65 })

    expect(keyup).toBeCalled()
  })

  it('should render aria-label attribute on text field element with label value and no id', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        label: 'Test'
      },
      attrs: {}
    })

    const inputGroup = wrapper.find('input')[0]
    expect(inputGroup.getAttribute('aria-label')).toBe('Test')
  })

  it('should not render aria-label attribute on text field element with no label value or id', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        label: null
      },
      attrs: {}
    })

    const inputGroup = wrapper.find('input')[0]
    expect(inputGroup.element.getAttribute('aria-label')).toBeFalsy()
  })

  it('should not render aria-label attribute on text field element with id', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        label: 'Test'
      },
      attrs: {
        id: 'Test'
      }
    })

    const inputGroup = wrapper.find('input')[0]
    expect(inputGroup.element.getAttribute('aria-label')).toBeFalsy()
  })

  it('should start out as invalid', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        rules: [(v) => !!v || 'Required']
      }
    })

    expect(wrapper.data().valid).toEqual(false)
  })

  it('should start validating on input', async () => {
    const wrapper = mount(VTextField, {})

    expect(wrapper.data().shouldValidate).toEqual(false)
    wrapper.setProps({ value: 'asd' })
    await wrapper.vm.$nextTick()
    expect(wrapper.data().shouldValidate).toEqual(true)
  })

  it('should not start validating on input if validate-on-blur prop is set', async () => {
    const wrapper = mount(VTextField, {
      propsData: {
        validateOnBlur: true
      }
    })

    expect(wrapper.data().shouldValidate).toEqual(false)
    wrapper.setProps({ value: 'asd' })
    await wrapper.vm.$nextTick()
    expect(wrapper.data().shouldValidate).toEqual(false)
  })

  it('should not display counter when set to false', async () => {
    const wrapper = mount(VTextField, {
      propsData: {
        counter: true,
        max: 50
      }
    })

    expect(wrapper.find('.input-group__counter')[0]).not.toBe(undefined)
    expect(wrapper.html()).toMatchSnapshot()

    wrapper.setProps({ counter: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('.input-group__counter')[0]).toBe(undefined)
  })

  it('should have readonly attribute', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        readonly: true
      }
    })

    const input = wrapper.find('input')[0]

    expect(input.getAttribute('readonly')).toBe('readonly')
  })

  it('should clear input value', async () => {
    const wrapper = mount(VTextField, {
      propsData: {
        clearable: true,
        value: 'foo'
      }
    })

    const clear = wrapper.find('.input-group__append-icon')[0]
    const input = jest.fn()
    wrapper.vm.$on('input', input)

    expect(wrapper.vm.inputValue).toBe('foo')

    clear.trigger('click')

    await wrapper.vm.$nextTick()

    expect(input).toHaveBeenCalledWith(null)
  })

  it('should not clear input if not clearable and has appended icon (with callback)', async () => {
    const appendIconCb = jest.fn()
    const wrapper = mount(VTextField, {
      propsData: {
        value: 'foo',
        appendIcon: 'block',
        appendIconCb
      }
    })

    const icon = wrapper.find('.input-group__append-icon')[0]
    icon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputValue).toBe('foo')
    expect(appendIconCb.mock.calls).toHaveLength(1)
  })

  it('should not clear input if not clearable and has appended icon (without callback)', async () => {
    const wrapper = mount(VTextField, {
      propsData: {
        value: 'foo',
        appendIcon: 'block',
      }
    })

    const icon = wrapper.find('.input-group__append-icon')[0]
    icon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputValue).toBe('foo')
  })

  it('should start validating on blur', async () => {
    const wrapper = mount(VTextField, {})

    const input = wrapper.find('input')[0]
    expect(wrapper.data().shouldValidate).toEqual(false)
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.data().shouldValidate).toEqual(true)
  })

  it('should keep its value on blur', async () => {
    const wrapper = mount(VTextField, {
      propsData: {
        value: 'asd'
      }
    })

    const input = wrapper.find('input')[0]

    input.element.value = 'fgh'
    input.trigger('input')
    input.trigger('blur')

    expect(input.element.value).toBe('fgh')
  })

  it('should update if value is changed externally', async () => {
    const wrapper = mount(VTextField, {})

    const input = wrapper.find('input')[0]

    wrapper.setProps({ value: 'fgh' })
    expect(input.element.value).toBe('fgh')

    input.trigger('focus')
    wrapper.setProps({ value: 'jkl' })
    expect(input.element.value).toBe('jkl')
  })

  it('should fire a single change event on blur', async () => {
    let value = 'asd'
    const change = jest.fn()

    const component = {
      render (h) {
        return h(VTextField, {
          on: {
            input: (i) => value = i,
            change
          },
          props: { value }
        })
      }
    }
    const wrapper = mount(component)

    const input = wrapper.find('input')[0]

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.element.value = 'fgh'
    input.trigger('input')

    await wrapper.vm.$nextTick()
    input.trigger('blur')
    await wrapper.vm.$nextTick()

    expect(change).toBeCalledWith('fgh')
    expect(change.mock.calls).toHaveLength(1)
  })

  it('should not make prepend icon clearable', () => {
    const wrapper = mount(VTextField, {
      propsData: {
        prependIcon: 'check',
        appendIcon: 'check',
        value: 'test',
        clearable: true
      }
    })

    const prepend = wrapper.find('.input-group__prepend-icon')[0]
    expect(prepend.text()).toBe('check')
    expect(prepend.element.classList).not.toContain('input-group__icon-cb')
  })

  it('should not emit change event if value has not changed', async () => {
    const change = jest.fn()
    let value = 'test'
    const component = {
      render (h) {
        return h(VTextField, {
          on: {
            input: i => value = i,
            change
          },
          props: { value }
        })
      }
    }
    const wrapper = mount(component)

    const input = wrapper.find('input')[0]

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.trigger('blur')
    await wrapper.vm.$nextTick()

    expect(change.mock.calls.length).toBe(0)
  })

  it('should render component with async loading and match snapshot', () => {
    const wrapper = mount(VTextField, {
      components: {
        VProgressLinear
      },
      propsData: {
        loading: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with async loading and custom progress and match snapshot', () => {
    const progress = Vue.component('test', {
      components: {
        VProgressLinear
      },
      render (h) {
        return h('v-progress-linear', {
          props: {
            indeterminate: true,
            height: 7,
            color: 'orange'
          }
        })
      }
    })

    const wrapper = mount(VTextField, {
      propsData: {
        loading: true
      },
      slots: {
        progress: [progress]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
