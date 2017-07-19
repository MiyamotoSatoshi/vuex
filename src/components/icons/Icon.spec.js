import Icon from '~components/icons/Icon'
import { test } from '~util/testing'

test('Icon.js', ({ mount, functionalContext }) => {
  it('should render correctly', () => {
    const context = functionalContext({}, 'add')
    const wrapper = mount(Icon, context)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should throw warning when using deprecated prop mdi', () => {
    const context = functionalContext({ props: { mdi: true } }, 'add')
    const wrapper = mount(Icon, context)

    expect(console.warn).toBeCalled()
  })

  it('should still render correctly when using deprecated prop mdi', () => {
    const context = functionalContext({ props: { mdi: true } }, 'add')
    const wrapper = mount(Icon, context)

    expect(wrapper.hasClass('mdi')).toBe(true)
    expect(wrapper.hasClass('mdi-add')).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('should throw warning when using deprecated prop fa', () => {
    const context = functionalContext({ props: { fa: true } }, 'add')
    const wrapper = mount(Icon, context)

    expect(console.warn).toBeCalled()
  })

  it('should still render correctly when using deprecated prop fa', () => {
    const context = functionalContext({ props: { fa: true } }, 'add')
    const wrapper = mount(Icon, context)

    expect(wrapper.hasClass('fa')).toBe(true)
    expect(wrapper.hasClass('fa-add')).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('should allow third-party icons when using <icon>- prefix', () => {
    const context = functionalContext({ props: {} }, 'fa-add')
    const wrapper = mount(Icon, context)

    expect(wrapper.hasClass('fa')).toBe(true)
    expect(wrapper.hasClass('fa-add')).toBe(true)
    expect(wrapper.text()).toBe('')
  })
})
