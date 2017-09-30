import { mount } from 'avoriaz'
import VSnackbar from '~components/VSnackbar'

describe('VSnackbar.vue', () => {
  it('should have a snack class', () => {
    const wrapper = mount(VSnackbar)

    expect(wrapper.hasClass('snack')).toBe(true)
  })

  it('should have a color class', () => {
    const wrapper = mount(VSnackbar, {
      propsData: {
        color: 'orange lighten-2'
      }
    })

    expect(wrapper.hasClass('orange')).toBe(true)
    expect(wrapper.hasClass('lighten-2')).toBe(true)
  })

  it('should have a snack__content class only when active', async () => {
    const wrapper = mount(VSnackbar, {
      propsData: {
        value: false,
        timeout: 1000
      }
    })

    expect(wrapper.find('div .snack__content')).toHaveLength(0)

    wrapper.setProps({ value: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('div .snack__content')).toHaveLength(1)
  })

  it('should timeout correctly', async () => {
    jest.useFakeTimers()
    const wrapper = mount(VSnackbar, {
      propsData: {
        value: false,
        timeout: 3141
      }
    })

    const value = jest.fn()

    wrapper.instance().$on('input', value)
    wrapper.setProps({ value: true })
    wrapper.update()

    await wrapper.vm.$nextTick()

    expect(setTimeout.mock.calls).toHaveLength(1)
    expect(setTimeout.mock.calls[0][1]).toBe(3141)

    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.data().isActive).toBe(false)
    expect(value).toBeCalledWith(false)
  })

  it('should timeout correctly when initial value is true', async () => {
    jest.useFakeTimers()
    const wrapper = mount(VSnackbar, {
      propsData: {
        value: true,
        timeout: 3141
      }
    })

    const value = jest.fn()

    wrapper.instance().$on('input', value)

    await wrapper.vm.$nextTick()

    expect(setTimeout.mock.calls).toHaveLength(1)
    expect(setTimeout.mock.calls[0][1]).toBe(3141)

    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.data().isActive).toBe(false)
    expect(value).toBeCalledWith(false)
  })
})
