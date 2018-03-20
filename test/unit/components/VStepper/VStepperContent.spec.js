import { test } from '@/test'
import {
  VTabTransition,
  VTabReverseTransition
} from '@/components/transitions'
import VStepperContent from '@/components/VStepper/VStepperContent'

test('VStepperContent.js', ({ mount }) => {
  it('should set height to auto', async () => {
    const wrapper = mount(VStepperContent, {
      attachToDocument: true,
      propsData: { step: 0 }
    })

    expect(wrapper.vm.isActive).toBe(null)
    expect(wrapper.vm.height).toBe(0)

    wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.height).toBe('auto')
  })

  it('should use reverse transition', () => {
    const wrapper = mount(VStepperContent, {
      propsData: { step: 1 }
    })

    expect(wrapper.vm.computedTransition).toBe(VTabTransition)

    wrapper.setData({ isReverse: true })

    expect(wrapper.vm.computedTransition).toBe(VTabReverseTransition)
  })

  it('should accept a custom height', async () => {
    const wrapper = mount(VStepperContent, {
      attachToDocument: true,
      propsData: {
        step: 1
      }
    })

    const enter = jest.fn()
    const leave = jest.fn()
    wrapper.setMethods({
      enter,
      leave
    })
    wrapper.setData({
      isActive: true,
      isVertical: true
    })
    await wrapper.vm.$nextTick()
    const stepWrapper = wrapper.find('.stepper__wrapper')[0]

    expect(stepWrapper.element.style.height).toBe('auto')

    wrapper.setData({ isActive: false })
    await wrapper.vm.$nextTick()
    wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()
    expect(enter).toHaveBeenCalled()
    expect(leave).toHaveBeenCalled()
    expect(enter.mock.calls.length).toBe(1)
    expect(leave.mock.calls.length).toBe(1)

    wrapper.setData({
      isActive: false,
      isVertical: false
    })
    await wrapper.vm.$nextTick()
    wrapper.setData({ isActive: true })
    await wrapper.vm.$nextTick()
    expect(enter.mock.calls.length).toBe(1)
    expect(leave.mock.calls.length).toBe(1)
  })

  it('should toggle isActive state', () => {
    const wrapper = mount(VStepperContent, {
      propsData: { step: 1 }
    })

    wrapper.vm.toggle(1, false)

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.isReverse).toBe(false)

    wrapper.vm.toggle('1', false)

    expect(wrapper.vm.isActive).toBe(true)
    expect(wrapper.vm.isReverse).toBe(false)

    wrapper.vm.toggle(2, true)

    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.isReverse).toBe(true)
  })

  it('should set height', async () => {
    const wrapper = mount(VStepperContent, {
      attachToDocument: true,
      propsData: { step: 1 }
    })

    wrapper.vm.enter()

    expect(wrapper.vm.height).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 450))

    expect(wrapper.vm.height).toBe('auto')

    wrapper.vm.leave()

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(wrapper.vm.height).toBe(0)
  })

  it('should reset height', async () => {
    const wrapper = mount(VStepperContent, {
      propsData: { step: 1 }
    })

    const onTransition = jest.fn()
    const stepWrapper = wrapper.find('.stepper__wrapper')[0]

    expect(wrapper.vm.height).toBe(0)

    expect(wrapper.vm.onTransition()).toBe(undefined)

    wrapper.setData({ isActive: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.height).toBe('auto')

    wrapper.setData({ height: 0 })

    await wrapper.vm.$nextTick()

    wrapper.vm.onTransition({ propertyName: 'foo' })
    expect(wrapper.vm.height).toBe(0)

    wrapper.vm.onTransition({ propertyName: 'height' })
    expect(wrapper.vm.height).toBe('auto')

    wrapper.destroy()
  })
})
