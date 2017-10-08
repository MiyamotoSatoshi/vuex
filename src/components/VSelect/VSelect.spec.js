import Vue from 'vue'
import { test } from '~util/testing'
import { mount } from 'avoriaz'
import VSelect from '~components/VSelect'

test('VSelect', () => {
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
    wrapper.vm.$on('change', change)
    wrapper.vm.selectItem(item)

    expect(change).toBeCalledWith([0])
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should be in an error state', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        value: null,
        items: [0, 1, 2],
        rules: [(v) => !!v || 'Required']
      }
    })

    wrapper.vm.focus()
    wrapper.vm.blur()
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

    expect(item.element.getAttribute('disabled')).toBe('disabled')
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should warn when using incorrect item together with segmented prop', async () => {
    const items = [
      { text: 'Hello', callback: () => {} },
      { text: 'Hello' }
    ]

    const wrapper = mount(VSelect, {
      propsData: {
        segmented: true,
        items
      }
    })

    wrapper.vm.inputValue = items[1]

    await wrapper.vm.$nextTick()

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
    expect('items must contain both a text and callback property').toHaveBeenTipped()
  })

  it('should render buttons correctly when using items array with segmented prop', async () => {
    const items = [
      { text: 'Hello', callback: () => {} }
    ]

    const wrapper = mount(VSelect, {
      propsData: {
        segmented: true,
        items
      }
    })

    wrapper.vm.inputValue = items[0]

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should render buttons correctly when using slot with segmented prop', async () => {
    const items = [
      { text: 'Hello' }
    ]

    const vm = new Vue()
    const selection = props => vm.$createElement('div', [props.item])
    const component = Vue.component('test', {
      components: {
        VSelect
      },
      render (h) {
        return h('v-select', {
          props: {
            segmented: true,
            items
          },
          scopedSlots: {
            selection
          }
        })
      }
    })

    const wrapper = mount(component)

    wrapper.vm.$children[0].inputValue = items[0]

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toMatchSnapshot()
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should not close menu when using multiple prop', async () => {
    const wrapper = mount(VSelect, {
      attachToDocument: true,
      propsData: {
        items: [1, 2, 3, 4],
        multiple: true
      }
    })

    const blur = jest.fn()
    wrapper.vm.$on('blur', blur)

    wrapper.trigger('click')
    wrapper.trigger('blur')

    await wrapper.vm.$nextTick()

    const item = wrapper.find('li')[0]
    item.trigger('click')

    await wrapper.vm.$nextTick()

    expect(blur).not.toBeCalled()
    expect(wrapper.vm.isActive).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should render aria-hidden=true on arrow icon', async () => {
    const wrapper = mount(VSelect)

    const icon = wrapper.find('.input-group__append-icon')[0]
    expect(icon.hasAttribute('aria-hidden')).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should display a default value', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        value: 'foo',
        items: ['foo']
      }
    })

    expect(wrapper.vm.selectedItems).toEqual(['foo'])
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should not display a default value that is not in items', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        value: 'foo',
        items: ['bar']
      }
    })

    expect(wrapper.vm.selectedItems).toHaveLength(0)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should update the displayed value when items changes', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        value: 1,
        items: []
      }
    })

    wrapper.setProps({ items: [{ text: 'foo', value: 1 }] })
    expect(wrapper.vm.selectedItems).toContainEqual({ text: 'foo', value: 1 })

    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })
})
