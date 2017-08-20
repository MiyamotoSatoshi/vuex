import { test } from '~util/testing'
import VSelect from '~components/VSelect'

test('VSelect.js', ({ mount, shallow }) => {
  it('should return numeric 0', () => {
    const item = { value: 0, text: '0' }
    const wrapper = mount(VSelect, {
      propsData: {
        value: null,
        items: [item],
        multiple: true
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)
    wrapper.instance().selectItem(item)

    expect(change).toBeCalledWith([0])
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should be in an error state', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        value: null,
        items: [0, 1, 2],
        rules: [(v) => !!v || 'Required']
      }
    })

    wrapper.instance().focus()
    await wrapper.vm.$nextTick()
    wrapper.instance().blur()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasError).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should disable list items', () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        items: [{
          text: 'item',
          disabled: true
        }]
      }
    })

    const item = wrapper.find('li')[0]

    expect(item.element.__vue__.$options.propsData.disabled).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should emit search input changes', () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true
      }
    })

    const update = jest.fn()

    wrapper.vm.$on('update:searchInput', update)
    wrapper.vm.searchValue = 'test'

    expect(update).toBeCalledWith('test')
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should filter autocomplete search results', () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true,
        items: ['foo', 'bar']
      }
    })

    wrapper.vm.searchValue = 'foo'

    expect(wrapper.vm.filteredItems.length).toBe(1)
    expect(wrapper.vm.filteredItems[0]).toBe('foo')
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should filter numeric primitives', () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true,
        items: [1, 2]
      }
    })

    wrapper.vm.searchValue = 1

    expect(wrapper.vm.filteredItems.length).toBe(1)
    expect(wrapper.vm.filteredItems[0]).toBe(1)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })
})
