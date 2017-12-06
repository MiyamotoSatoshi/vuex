import { test } from '~util/testing'
import VSelect from '~components/VSelect'
import VMenu from '~components/VMenu'

test('VSelect - combobox', ({ mount }) => {
  it('should emit custom value on blur', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        combobox: true,
        value: null
      }
    })

    const input = wrapper.find('input')[0]

    const change = jest.fn()
    wrapper.vm.$on('input', change)

    input.trigger('focus')
    await wrapper.vm.$nextTick()

    input.element.value = 'foo'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    wrapper.vm.blur()
    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalledWith('foo')
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should evaluate the range of an integer', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        combobox: true,
        value: 11
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentRange).toBe(2)

    wrapper.setProps({ value: 0 })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.currentRange).toBe(1)

    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })

  it('should not use search input when blurring', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        combobox: true,
        items: [1, 12]
      }
    })

    const event = jest.fn()
    wrapper.vm.$on('input', event)

    const input = wrapper.find('input')[0]
    input.trigger('focus')
    await wrapper.vm.$nextTick()

    wrapper.setProps({ searchInput: '1' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchValue).toBe('1')

    const list = wrapper.find('.list li')[1]
    list.trigger('click')
    await wrapper.vm.$nextTick()
    expect(event).toBeCalledWith(12)
    expect('Unable to locate target [data-app]').toHaveBeenTipped()
  })
})
