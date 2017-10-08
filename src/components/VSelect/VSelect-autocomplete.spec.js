import { test } from '~util/testing'
import { mount } from 'avoriaz'
import VSelect from '~components/VSelect'

test('VSelect - autocomplete', () => {
  it('should have -1 tabindex when disabled', () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        disabled: true
      }
    })

    expect(wrapper.vm.$refs.input.tabIndex).toBe(-1)
    expect(wrapper.vm.$el.tabIndex).toBe(-1)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should have explicit tabindex passed through when autocomplete', () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        tabindex: 10
      }
    })

    expect(wrapper.vm.$refs.input.tabIndex).toBe(10)
    expect(wrapper.vm.$el.tabIndex).toBe(-1)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should have explicit tabindex passed through when not autocomplete', () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        tabindex: 10
      }
    })

    expect(wrapper.vm.$refs.input.tabIndex).toBe(-1)
    expect(wrapper.vm.$el.tabIndex).toBe(10)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should emit search input changes', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true,
        debounceSearch: 0
      }
    })

    const input = wrapper.find('input')[0]

    const update = jest.fn()
    wrapper.vm.$on('update:searchInput', update)

    await wrapper.vm.$nextTick()

    input.element.value = 'test'
    input.trigger('input')
    await new Promise(resolve => setTimeout(resolve, 1))

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

    expect(wrapper.vm.filteredItems).toHaveLength(1)
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

    expect(wrapper.vm.filteredItems).toHaveLength(1)
    expect(wrapper.vm.filteredItems[0]).toBe(1)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should activate when search changes and not active', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        items: [1, 2, 3, 4],
        multiple: true
      }
    })

    wrapper.vm.isActive = true
    await wrapper.vm.$nextTick()
    wrapper.vm.searchValue = 2
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isActive).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should set searchValue to null when deactivated', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        items: [1, 2, 3, 4],
        multiple: true
      }
    })

    wrapper.vm.isActive = true
    wrapper.vm.searchValue = 2
    await wrapper.vm.$nextTick()
    wrapper.vm.isActive = false
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.searchValue).toBe(null)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should render role=combobox correctly when autocomplete', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true
      }
    })

    const inputGroup = wrapper.find('.input-group--select')[0]
    expect(inputGroup.element.getAttribute('role')).toBeFalsy()

    const input = wrapper.find('input')[0]
    expect(input.getAttribute('role')).toBe('combobox')

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should render role=combobox correctly when not autocomplete)', async () => {
    const wrapper = mount(VSelect)

    const inputGroup = wrapper.find('.input-group--select')[0]
    expect(inputGroup.element.getAttribute('role')).toBe('combobox')

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should not duplicate items after items update when caching is turned on', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        autocomplete: true,
        cacheItems: true,
        returnObject: true,
        itemText: 'text',
        itemValue: 'id',
        items: [],
      }
    })

    wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
    wrapper.setProps({ items: [{ id: 1, text: 'A' }] })
    expect(wrapper.vm.computedItems).toHaveLength(1)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should not display list with no items and autocomplete', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        items: []
      }
    })

    const input = wrapper.find('.input-group__input')[0]

    input.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.menuIsActive).toBe(false)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should cache items', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        cacheItems: true,
        items: []
      }
    })

    wrapper.setProps({ items: ['bar', 'baz'] })
    expect(wrapper.vm.computedItems).toHaveLength(2)

    wrapper.setProps({ items: ['foo'] })
    expect(wrapper.vm.computedItems).toHaveLength(3)

    wrapper.setProps({ items: ['bar'] })
    expect(wrapper.vm.computedItems).toHaveLength(3)

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should allow changing of browser autocomplete', () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        browserAutocomplete: 'off'
      }
    })

    const input = wrapper.find('input')[0]

    expect(input.getAttribute('autocomplete')).toBe('off')
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should show input when focused and autocomplete', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true
      }
    })

    const input = wrapper.find('input')[0]

    expect(input.hasStyle('display', 'none'))

    wrapper.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(input.hasStyle('display', 'block'))

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should not filter text with no items', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        autocomplete: true,
        items: ['foo', 'bar']
      }
    })

    wrapper.setProps({ searchInput: 'asdf' })
    wrapper.update()
    await wrapper.vm.$nextTick()
    const tile = wrapper.find('.list__tile__title')[0]

    expect(tile.text()).toBe('No data available')
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })
})
