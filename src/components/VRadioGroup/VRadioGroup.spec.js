import { test } from '~util/testing'
import { VRadioGroup /*, VRadio */ } from '~components/VRadioGroup'

test('VRadioGroup.vue', ({ mount }) => {
  it('should render role on radio group', () => {
    const wrapper = mount(VRadioGroup)

    expect(wrapper.html()).toMatchSnapshot()

    const radioGroup = wrapper.find('.radio-group')[0]
    expect(radioGroup.getAttribute('role')).toBe('radiogroup')
  })

  // TODO: Test ability to toggle multiple data types
})
