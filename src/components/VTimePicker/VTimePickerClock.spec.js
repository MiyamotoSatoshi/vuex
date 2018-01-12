import VTimePickerClock from './VTimePickerClock'
import { test, touch } from '@util/testing'

test('VTimePickerClock.js', ({ mount }) => {
  it('should render component', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        allowedValues: n => n % 2,
        max: 59,
        min: 0,
        size: 280,
        step: 5,
        value: 10
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with double prop', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        allowedValues: n => n % 2,
        double: true,
        max: 59,
        min: 0,
        size: 280,
        step: 5,
        value: 10
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit input event on wheel if scrollable', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        max: 59,
        min: 3,
        value: 59,
        scrollable: true
      }
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)
    wrapper.trigger('wheel')
    expect(input).toBeCalledWith(3)
  })

  it('should not emit input event on wheel if not scrollable', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        max: 59,
        min: 3,
        value: 59,
        scrollable: false
      }
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)
    wrapper.trigger('wheel')
    expect(input).not.toBeCalled()
  })

  it('should emit change event on mouseup/touchend', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        value: 59,
        min: 0,
        max: 60
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    wrapper.trigger('mouseup')
    expect(change).toBeCalledWith(59)

    wrapper.setProps({ value: 55 })
    wrapper.trigger('touchend')
    expect(change).toBeCalledWith(55)
  })

  it('should emit change event on mouseleave', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        value: 59,
        min: 0,
        max: 60
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)

    wrapper.trigger('mouseleave')
    expect(change).not.toBeCalled()

    wrapper.vm.isDragging = true
    wrapper.trigger('mouseleave')
    expect(change).toBeCalledWith(59)
  })

  it('should calculate angle', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        value: 59,
        min: 0,
        max: 60
      }
    })

    const center = { x: 1, y: 1 }
    const angle = p => Math.round(wrapper.vm.angle(center, p))
    expect(angle({ x: 2, y: 1 })).toBe(90)
    expect(angle({ x: 2, y: 2 })).toBe(45)
    expect(angle({ x: 0, y: 2 })).toBe(315)
    expect(angle({ x: 0, y: 0 })).toBe(225)
    expect(angle({ x: 2, y: 0 })).toBe(135)
  })

  it('should change with touch move', () => {
    const wrapper = mount(VTimePickerClock, {
      propsData: {
        min: 0,
        max: 7,
        value: 0,
        size: 100,
        double: true
      }
    })

    wrapper.vm.$refs.clock.getBoundingClientRect = () => {
      return {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 0,
        x: 0,
        y: 0
      }
    }

    const input = jest.fn()
    const finger = touch(wrapper).start(0, 0)
    wrapper.vm.$on('input', input)

    finger.move(100, 50)
    expect(input).toBeCalledWith(1)
    finger.move(50, 100)
    expect(input).toBeCalledWith(2)
    finger.move(50, 70)
    expect(input).toBeCalledWith(6)

    // edge case
    finger.move(40, 0)
    expect(input).toBeCalledWith(0)
    finger.move(45, 30)
    expect(input).toBeCalledWith(7)
  })
})
