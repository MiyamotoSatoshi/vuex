import { test } from '@/test'
import { VWindow, VWindowItem } from '@/components/VWindow'

test('VWindowItem.ts', ({ mount }) => {
  it('should transition content', async () => {
    const wrapper = mount(VWindow, {
      slots: {
        default: [VWindowItem]
      }
    })

    const item = wrapper.first(VWindowItem.options)
    // Before enter
    expect(wrapper.vm.isActive).toBe(false)
    item.vm.onBeforeEnter()
    expect(wrapper.vm.isActive).toBe(true)

    // Enter
    const el = document.createElement('div')
    expect(wrapper.vm.internalHeight).toBe(undefined)
    item.vm.onEnter(el)
    await new Promise(resolve => window.requestAnimationFrame(resolve))
    expect(wrapper.vm.internalHeight).toBe('0px')

    // After enter
    item.vm.onAfterEnter()
    await new Promise(resolve => window.requestAnimationFrame(resolve))
    expect(wrapper.vm.internalHeight).toBe(undefined)
    expect(wrapper.vm.isActive).toBe(false)

    // Leave
    item.vm.onLeave(el)
    expect(wrapper.vm.internalHeight).toBe('0px')

    // Canceling
    item.vm.onBeforeEnter()
    item.vm.onEnter(el)
    item.vm.onEnterCancelled()

    expect(item.vm.wasCancelled).toBe(true)
    expect(wrapper.vm.isActive).toBe(true)

    item.vm.onAfterEnter()

    await new Promise(resolve => requestAnimationFrame(resolve))

    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should use custom transition', () => {
    const wrapper = mount(VWindowItem, {
      propsData: {
        transition: 'foo',
        reverseTransition: 'bar'
      },
      data: {
        windowGroup: {
          internalReverse: false,
          register: () => {},
          unregister: () => {}
        }
      }
    })

    expect(wrapper.vm.computedTransition).toBe('foo')

    wrapper.setProps({ transition: false })
    expect(wrapper.vm.computedTransition).toBe('')

    wrapper.vm.windowGroup.internalReverse = true
    expect(wrapper.vm.computedTransition).toBe('bar')

    wrapper.setProps({ reverseTransition: false })
    expect(wrapper.vm.computedTransition).toBe('')
  })

  it('should only call done when the transition is on the window-item', () => {
    const done = jest.fn()

    const wrapper = mount(VWindowItem, {
      data: {
        done,
        windowGroup: {
          internalReverse: false,
          register: () => {},
          unregister: () => {}
        }
      }
    })

    // Incorrect property
    wrapper.vm.onTransitionEnd({
      propertyName: 'border-color'
    })

    expect(done).not.toBeCalled()

    // Incorrect target
    wrapper.vm.onTransitionEnd({
      propertyName: 'transform',
      target: document.createElement('div')
    })

    expect(done).not.toBeCalled()

    // Should work
    wrapper.vm.onTransitionEnd({
      propertyName: 'transform',
      target: wrapper.vm.$el
    })

    expect(done).toHaveBeenCalledTimes(1)
  })
})
