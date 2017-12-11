import { test, touch } from '~util/testing'
import VSwitch from '~components/VSwitch'

test('VSwitch.js', ({ mount }) => {
  it('should set ripple data attribute based on ripple prop state', () => {
    const wrapper = mount(VSwitch, {
      propsData: {
        inputValue: false,
        ripple: false
      }
    })

    const ripple = wrapper.find('.input-group--selection-controls__ripple')[0]

    expect(ripple.getAttribute('data-ripple')).toBe('false')

    wrapper.setProps({ ripple: true })

    expect(ripple.getAttribute('data-ripple')).toBe('true')
  })

  it('should emit change event on swipe right', async () => {
    const wrapper = mount(VSwitch, {
      props: {
        inputValue: false
      }
    })

    const change = jest.fn()
    wrapper.vm.$on('change', change)
    touch(wrapper.find('.input-group--selection-controls__ripple')[0]).start(0, 0).end(20, 0)
    expect(change).toBeCalledWith(true)

    wrapper.setProps({ inputValue: true })
    touch(wrapper.find('.input-group--selection-controls__ripple')[0]).start(0, 0).end(-20, 0)
    expect(change).toBeCalledWith(false)
  })

  it('should render component with error', async () => {
    const wrapper = mount(VSwitch, {
      props: {
        errorMessages: ['error']
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
