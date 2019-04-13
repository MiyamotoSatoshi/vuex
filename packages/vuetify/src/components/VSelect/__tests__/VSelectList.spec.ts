// Libraries
import Vue from 'vue'

// Components
import VSelectList from '../VSelectList'

// Utilities
import {
  mount,
  Wrapper
} from '@vue/test-utils'

describe('.ts', () => {
  type Instance = InstanceType<typeof VSelectList>
  let mountFunction: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VSelectList, {
        ...options
      })
    }
  })

  it('should generate a divider', () => {
    const wrapper = mountFunction()

    const divider = wrapper.vm.genDivider({
      inset: true
    })

    expect(divider.data.props.inset).toBe(true)
  })

  // TODO: wat
  it.skip('should generate a header', () => {
    const wrapper = mount(VSelectList)

    const divider = wrapper.vm.genHeader({
      light: true,
      header: 'foobar'
    })

    expect(divider.data.props.light).toBe(true)

    // Check that header exists
    expect(divider.children).toHaveLength(1)
    expect(divider.children[0].text).toBe('foobar')
  })

  it('should use no-data slot', () => {
    const wrapper = mountFunction({
      slots: {
        'no-data': [{
          render: h => h('div', 'foo')
        }]
      }
    })
    expect(wrapper.vm.$slots['no-data']).toHaveLength(1)
  })

  it('should display no-data-text when item slot is provided', async () => {
    const vm = new Vue()
    const itemSlot = () => vm.$createElement('div', ['this is not ok'])
    const component = Vue.component('test', {
      render (h) {
        return h(VSelectList, {
          props: {
            items: [],
            noDataText: 'this is ok'
          },
          scopedSlots: {
            item: itemSlot
          }
        })
      }
    })

    const wrapper = mountFunction()
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate children', () => {
    const wrapper = mountFunction({
      propsData: {
        items: [
          { header: true },
          { divider: true },
          'foo'
        ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should return defined item value', async () => {
    const wrapper = mountFunction({
      propsData: {
        itemValue: 'foo'
      }
    })

    const getValue = wrapper.vm.getValue
    const getText = wrapper.vm.getText

    expect(getValue({ fizz: 'buzz' })).toEqual(getText({ fizz: 'buzz' }))

    wrapper.setProps({ itemValue: 'fizz' })

    expect(getValue({ fizz: 'buzz' })).toEqual('buzz')
  })

  it('should hide selected items', async () => {
    const wrapper = mountFunction({
      propsData: {
        selectedItems: ['foo'],
        hideSelected: true,
        items: ['foo', 'bar', 'fizz']
      }
    })

    expect(wrapper.findAll('.v-list-item')).toHaveLength(2)

    wrapper.setProps({ selectedItems: ['foo', 'bar'] })

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.v-list-item')).toHaveLength(1)
  })

  // https://github.com/vuetifyjs/vuetify/issues/4431
  it('should display falsy items', () => {
    const wrapper = mountFunction({
      propsData: {
        items: [0, null, false, undefined, '']
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
