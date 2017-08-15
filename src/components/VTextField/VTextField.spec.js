import { test } from '~util/testing'
import VTextField from '~components/VTextField'

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
    expect(inputGroup.hasAttribute('aria-label', 'Test')).toBe(true)
    expect(`$attrs is readonly`).toHaveBeenWarned()
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
    expect(`$attrs is readonly`).toHaveBeenWarned()
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
    expect(`$attrs is readonly`).toHaveBeenWarned()
  })

  it('should start out as invalid', () => {
    const wrapper = mount(VTextField, {})

    expect(wrapper.data().valid).toEqual(false)
  })

  it('should start validating on input', async () => {
    const wrapper = mount(VTextField, {})

    expect(wrapper.data().shouldValidate).toEqual(false)
    wrapper.setProps({ value: 'asd' })
    await wrapper.vm.$nextTick()
    expect(wrapper.data().shouldValidate).toEqual(true)
  })

  // This test breaks everything
  // it('should start validating on blur', async () => {
  //   const wrapper = mount(VTextField, {})

  //   const input = wrapper.find('input')[0]
  //   expect(wrapper.data().shouldValidate).toEqual(false)
  //   input.trigger('focus')
  //   await wrapper.vm.$nextTick()
  //   input.trigger('blur')
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.data().shouldValidate).toEqual(true)
  // })

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
})
