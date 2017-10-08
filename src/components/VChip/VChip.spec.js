import VChip from '~components/VChip'
import { mount } from 'avoriaz'
import { test } from '~util/testing'

test('VChip.vue', () => {
  it('should have a chip class', () => {
    const wrapper = mount(VChip)

    expect(wrapper.hasClass('chip')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be removable', () => {
    const wrapper = mount(VChip, {
      propsData: { close: true }
    })

    const close = wrapper.find('.chip__close')[0]

    const input = jest.fn(value => wrapper.setProps({ value }))
    wrapper.vm.$on('input', input)

    expect(wrapper.html()).toMatchSnapshot()

    close.trigger('click')
    expect(input).toBeCalledWith(false)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a colored chip', () => {
    const wrapper = mount(VChip, {
      propsData: {
        color: 'blue',
        textColor: 'green'
      }
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })

  it('should render a colored outline chip', () => {
    const wrapper = mount(VChip, {
      propsData: {
        outline: true,
        color: 'blue'
      }
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('blue--text')
  })

  it('should render a colored outline chip with text color', () => {
    const wrapper = mount(VChip, {
      propsData: {
        outline: true,
        color: 'blue',
        textColor: 'green'
      }
    })

    expect(wrapper.element.classList).toContain('blue')
    expect(wrapper.element.classList).toContain('green--text')
  })
})

