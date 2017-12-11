import VIcon from '~components/VIcon'
import { test, functionalContext } from '~util/testing'

test('VIcon.js', ({ mount, compileToFunctions }) => {
  it('should render component', () => {
    const context = functionalContext({}, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.text()).toBe('add')
    expect(wrapper.element.className).toBe('material-icons icon')
  })

  it('should render a colored component', () => {
    const context = functionalContext({ props: { color: 'green lighten-1' } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.classList).toContain('green--text')
    expect(wrapper.element.classList).toContain('text--lighten-1')
  })

  it('should render a disabled component', () => {
    const context = functionalContext({ props: { disabled: true } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.classList).toContain('icon--disabled')
  })

  it('should render a mapped size', () => {
    const SIZE_MAP = {
      small: '16px',
      default: '24px',
      medium: '28px',
      large: '36px',
      xLarge: '40px'
    }

    Object.keys(SIZE_MAP).forEach(size => {
      const context = functionalContext({ props: { [size]: true } }, 'add')
      const wrapper = mount(VIcon, context)

      expect(wrapper.element.style.fontSize).toBe(SIZE_MAP[size])
    })
  })

  it('should render a specific size', () => {
    const context = functionalContext({ props: { size: '112px' } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.style.fontSize).toBe('112px')
  })

  it('should render a left aligned component', () => {
    const context = functionalContext({ props: { left: true } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.classList).toContain('icon--left')
  })

  it('should render a right aligned component', () => {
    const context = functionalContext({ props: { right: true } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.classList).toContain('icon--right')
  })

  it('should render a component with aria-hidden attr', () => {
    const context = functionalContext({ attrs: { 'aria-hidden': 'foo' } }, 'add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.element.getAttribute('aria-hidden')).toBe('foo')
  })

  it('should allow third-party icons when using <icon>- prefix', () => {
    const context = functionalContext({ props: {} }, 'fa-add')
    const wrapper = mount(VIcon, context)

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('fa icon fa-add')
  })

  it('should allow the use of v-text', () => {
    const wrapper = mount(VIcon, functionalContext({
      domProps: { textContent: 'fa-home' }
    }))

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('fa icon fa-home')
  })

  it('should allow the use of v-html', () => {
    const wrapper = mount(VIcon, functionalContext({
      domProps: { innerHTML: 'fa-home' }
    }))

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('fa icon fa-home')
  })
})
