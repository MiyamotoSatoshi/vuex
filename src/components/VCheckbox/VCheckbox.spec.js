﻿import { test } from '~util/testing'
import { mount } from 'avoriaz'
import VCheckbox from '~components/VCheckbox'

test('VCheckbox.js', () => {
  it('should return true when clicked', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false
      }
    })

    const ripple = wrapper.find('.input-group--selection-controls__ripple')[0]

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    ripple.trigger('click')
    expect(change).toBeCalledWith(true)
  })

  it('should return a value when toggled on with a specified value', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        value: 'John',
        inputValue: null
      }
    })

    const ripple = wrapper.find('.input-group--selection-controls__ripple')[0]

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    ripple.trigger('click')
    expect(change).toBeCalledWith('John')
  })

  it('should return null when toggled off with a specified value', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        value: 'John',
        inputValue: 'John'
      }
    })

    const ripple = wrapper.find('.input-group--selection-controls__ripple')[0]

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    ripple.trigger('click')
    expect(change).toBeCalledWith(null)
  })

  it('should toggle when label is clicked', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        label: 'Label',
        value: null
      },
      attrs: {}
    })

    const label = wrapper.find('label')[0]

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    label.trigger('click')
    expect(change).toBeCalled()
  })

  it('should render role and aria-checked attributes on input group', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false
      }
    })

    const inputGroup = wrapper.find('.input-group')[0]

    expect(inputGroup.getAttribute('role')).toBe('checkbox')
    expect(inputGroup.getAttribute('aria-checked')).toBe('false')

    wrapper.setProps({ 'inputValue': true })
    expect(inputGroup.getAttribute('aria-checked')).toBe('true')

    wrapper.setProps({ 'indeterminate': true })
    expect(inputGroup.getAttribute('aria-checked')).toBe('mixed')
  })

  it('should render aria-label attribute with label value on input group', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        label: 'Test'
      },
      attrs: {}
    })

    const inputGroup = wrapper.find('.input-group')[0]
    expect(inputGroup.getAttribute('aria-label')).toBe('Test')
  })

  it('should not render aria-label attribute with no label value on input group', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        label: null
      }
    })

    const inputGroup = wrapper.find('.input-group')[0]
    expect(inputGroup.element.getAttribute('aria-label')).toBeFalsy()
  })

  it('should toggle on space and enter with default toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    wrapper.trigger('keydown.enter')
    wrapper.trigger('keydown.space')

    expect(change.mock.calls).toHaveLength(2)
  })

  it('should not toggle on space or enter with blank toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false,
        toggleKeys: []
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    wrapper.trigger('keydown.enter')
    wrapper.trigger('keydown.space')

    expect(change).not.toBeCalled()
  })

  it('should toggle only on custom toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false,
        toggleKeys: [32] // space
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    wrapper.trigger('keydown.enter')
    expect(change).not.toBeCalled()

    wrapper.trigger('keydown.space')
    expect(change).toBeCalled()
  })
})
