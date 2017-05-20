import Contextualable from '../../mixins/contextualable'
import Toggleable from '../../mixins/toggleable'
import GenerateRouteLink from '../../mixins/route-link'
import Themeable from '../../mixins/themeable'

export default {
  name: 'btn',

  mixins: [Contextualable, GenerateRouteLink, Toggleable, Themeable],

  props: {
    activeClass: {
      type: String,
      default: 'btn--active'
    },
    block: Boolean,
    default: Boolean,
    flat: Boolean,
    floating: Boolean,
    icon: Boolean,
    large: Boolean,
    loading: Boolean,
    outline: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    round: Boolean,
    small: Boolean,
    tag: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'button'
    }
  },

  computed: {
    classes () {
      return {
        'btn': true,
        'btn--active': this.isActive,
        'btn--block': this.block,
        'btn--dark': !this.light && this.dark,
        'btn--default': this.default,
        'btn--disabled': this.disabled,
        'btn--flat': this.flat,
        'btn--floating': this.floating,
        'btn--icon': this.icon,
        'btn--large': this.large,
        'btn--light': this.light || !this.dark,
        'btn--loader': this.loading,
        'btn--outline': this.outline,
        'btn--raised': !this.flat,
        'btn--round': this.round,
        'btn--small': this.small,
        'primary': this.primary && !this.outline,
        'secondary': this.secondary && !this.outline,
        'success': this.success && !this.outline,
        'info': this.info && !this.outline,
        'warning': this.warning && !this.outline,
        'error': this.error && !this.outline,
        'primary--text': this.primary && (this.outline || this.flat),
        'secondary--text': this.secondary && (this.outline || this.flat),
        'success--text': this.success && (this.outline || this.flat),
        'info--text': this.info && (this.outline || this.flat),
        'warning--text': this.warning && (this.outline || this.flat),
        'error--text': this.error && (this.outline || this.flat)
      }
    }
  },

  methods: {
    genContent (h) {
      return h('span', { 'class': 'btn__content' }, [this.$slots.default])
    },
    genLoader (h) {
      const children = []

      if (!this.$slots.loader) {
        children.push(h('v-progress-circular', {
          props: {
            indeterminate: true,
            size: 26
          }
        }))
      } else {
        children.push(this.$slots.loader)
      }

      return h('span', { 'class': 'btn__loading' }, children)
    }
  },

  render (h) {
    const { tag, data } = this.generateRouteLink()
    const children = []

    if (tag === 'button') {
      data.attrs.type = this.type
    }

    children.push(this.genContent(h))

    if (this.loading) {
      children.push(this.genLoader(h))
    }

    return h(tag, data, children)
  }
}
