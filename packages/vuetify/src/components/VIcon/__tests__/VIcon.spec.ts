// Libraries
import Vue from 'vue'

// Components
import VIcon from '../VIcon'

// Utilities
import {
  createLocalVue,
  mount,
  Wrapper
} from '@vue/test-utils'

describe('VIcon', () => {
  let mountFunction: (ctx?: object, name?: string) => Wrapper<Vue>
  let localVue: typeof Vue

  beforeEach(() => {
    localVue = createLocalVue()

    mountFunction = (ctx = {}, name = 'add') => {
      return mount(VIcon, {
        localVue,
        context: Object.assign({
          children: [name],
          data: {},
          props: {}
        }, ctx)
      })
    }
  })

  it('should render component', () => {
    const wrapper = mountFunction()

    expect(wrapper.text()).toBe('add')
    expect(wrapper.element.className).toBe('v-icon material-icons theme--light')
  })

  it('should render a colored component', () => {
    const wrapper = mountFunction({ props: { color: 'green lighten-1' } })

    expect(wrapper.element.classList).toContain('green--text')
    expect(wrapper.element.classList).toContain('text--lighten-1')
  })

  it('should render a disabled component', () => {
    const wrapper = mountFunction({ props: { disabled: true } })

    expect(wrapper.element.classList).toContain('v-icon--disabled')
  })

  it('should not set font size if none provided', () => {
    const wrapper = mountFunction()

    expect(wrapper.element.style.fontSize).toBe('')
  })

  it('should render a mapped size', () => {
    const SIZE_MAP = {
      small: '16px',
      large: '36px',
      xLarge: '40px'
    }

    Object.keys(SIZE_MAP).forEach(size => {
      const wrapper = mountFunction({ props: { [size]: true } })

      expect(wrapper.element.style.fontSize).toBe(SIZE_MAP[size])
    })
  })

  it('should render a specific size with String type', () => {
    const wrapper = mountFunction({ props: { size: '112px' } })

    expect(wrapper.element.style.fontSize).toBe('112px')
  })

  it('should render a specific size with Number type', () => {
    const wrapper = mountFunction({ props: { size: '112' } })

    expect(wrapper.element.style.fontSize).toBe('112px')
  })

  it('should render a left aligned component', () => {
    const wrapper = mountFunction({ props: { left: true } })

    expect(wrapper.element.classList).toContain('v-icon--left')
  })

  it('should render a right aligned component', () => {
    const wrapper = mountFunction({ props: { right: true } })

    expect(wrapper.element.classList).toContain('v-icon--right')
  })

  it('should render a component with aria-hidden attr', () => {
    const wrapper = mountFunction({ attrs: { 'aria-hidden': 'foo' } })

    expect(wrapper.element.getAttribute('aria-hidden')).toBe('foo')
  })

  it('should allow third-party icons when using <icon>- prefix', () => {
    const wrapper = mountFunction({ props: {} }, 'fa-add')

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('v-icon fa fa-add theme--light')
  })

  it('should support font awesome 5 icons when using <icon>- prefix', () => {
    const wrapper = mountFunction({ props: {} }, 'fab fa-facebook')

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('v-icon fab fa-facebook theme--light')
  })

  it('should allow the use of v-text', () => {
    const wrapper = mountFunction({
      domProps: { textContent: 'fa-home' }
    })

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('v-icon fa fa-home theme--light')
  })

  it('should allow the use of v-html', () => {
    const wrapper = mountFunction({
      domProps: { innerHTML: 'fa-home' }
    })

    expect(wrapper.text()).toBe('')
    expect(wrapper.element.className).toBe('v-icon fa fa-home theme--light')
  })

  it('set font size from helper prop', async () => {
    const iconFactory = size => mountFunction({
      props: { [size]: true }
    })

    const small = iconFactory('small')
    expect(small.html()).toMatchSnapshot()

    const medium = iconFactory('medium')
    expect(medium.html()).toMatchSnapshot()

    const large = iconFactory('large')
    expect(large.html()).toMatchSnapshot()

    const xLarge = iconFactory('xLarge')
    expect(xLarge.html()).toMatchSnapshot()
  })

  it('should have proper classname', () => {
    const wrapper = mountFunction({
      props: {
        color: 'primary'
      },
      domProps: {
        innerHTML: 'fa-lock'
      }
    })

    expect(wrapper.element.className).toBe('v-icon fa fa-lock theme--light primary--text')
  })

  describe('for global icon', () => {
    beforeEach(() => {
      Vue.prototype.$vuetify = {
        icons: {
          values: {
            checkboxOn: 'check_box',
            prev: 'chevron_left'
          }
        }
      }
    })

    it('should render MD left icon from $vuetify.icons.checkboxOn', () => {
      const wrapper = mountFunction({}, '$vuetify.icons.checkboxOn')

      expect(wrapper.text()).toBe('check_box')
      expect(wrapper.element.className).toBe('v-icon material-icons theme--light')
    })

    it('should render MD left icon from $vuetify.icons.prev', () => {
      const wrapper = mountFunction({}, '$vuetify.icons.prev')

      expect(wrapper.text()).toBe('chevron_left')
      expect(wrapper.element.className).toBe('v-icon material-icons theme--light')
    })
  })

  describe('for component icon', () => {
    const getTestComponent = () => ({
      props: ['name'],
      render (h) {
        return h('div', {
          class: 'test-component'
        }, this.name)
      }
    })

    beforeEach(() => {
      Vue.prototype.$vuetify = {
        icons: {
          values: {
            testIcon: {
              component: getTestComponent(),
              props: {
                name: 'test icon'
              }
            }
          }
        }
      }
    })

    it('should render component', () => {
      const wrapper = mountFunction({}, '$vuetify.icons.testIcon')

      expect(wrapper.text()).toBe('test icon')
      expect(wrapper.element.className).toBe('v-icon test-component v-icon--is-component theme--light')
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render a colored component', () => {
      const wrapper = mountFunction({ props: { color: 'green lighten-1' } }, '$vuetify.icons.testIcon')

      expect(wrapper.element.classList).toContain('green--text')
      expect(wrapper.element.classList).toContain('text--lighten-1')
    })

    it('should render a disabled component', () => {
      const wrapper = mountFunction({ props: { disabled: true } }, '$vuetify.icons.testIcon')

      expect(wrapper.element.classList).toContain('v-icon--disabled')
    })

    it('should set font size from helper prop', async () => {
      const iconFactory = size => mountFunction({
        props: { [size]: true }
      }, '$vuetify.icons.testIcon')

      const small = iconFactory('small')
      expect(small.html()).toMatchSnapshot()

      const medium = iconFactory('medium')
      expect(medium.html()).toMatchSnapshot()

      const large = iconFactory('large')
      expect(large.html()).toMatchSnapshot()

      const xLarge = iconFactory('xLarge')
      expect(xLarge.html()).toMatchSnapshot()
    })

    it('should render a left aligned component', () => {
      const wrapper = mountFunction({ props: { left: true } }, '$vuetify.icons.testIcon')

      expect(wrapper.element.classList).toContain('v-icon--left')
    })

    it('should render a right aligned component', () => {
      const wrapper = mountFunction({ props: { right: true } }, '$vuetify.icons.testIcon')

      expect(wrapper.element.classList).toContain('v-icon--right')
    })

    it('should trim name', () => {
      const wrapper = mountFunction({}, ' add ')

      expect(wrapper.text()).toBe('add')
    })
  })
})
