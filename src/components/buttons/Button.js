import Contextualable from '../../mixins/contextualable'
import GenerateRouteLink from '../../mixins/route-link'

export default {
  name: 'button',

  mixins: [Contextualable, GenerateRouteLink],

  data () {
    return {
      activeClass: 'btn--active'
    }
  },

  props: {
    block: Boolean,
    dark: Boolean,
    default: Boolean,
    flat: Boolean,
    floating: Boolean,
    icon: Boolean,
    large: Boolean,
    light: Boolean,
    loading: Boolean,
    outline: Boolean,
    progress: Boolean,
    raised: {
      type: Boolean,
      default: true
    },
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    round: Boolean,
    small: Boolean,
    type: {
      type: String,
      default: 'button'
    }
  },

  computed: {
    classes () {
      return {
        'btn': true,
        'btn--block': this.block,
        'btn--dark': this.dark,
        'btn--default': this.default,
        'btn--disabled': this.disabled,
        'btn--flat': this.flat,
        'btn--floating': this.floating,
        'btn--icon': this.icon,
        'btn--large': this.large,
        'btn--light': this.light && !this.dark,
        'btn--loader': this.loading,
        'btn--outline': this.outline,
        'btn--raised': this.raised,
        'btn--round': this.round,
        'btn--small': this.small,
        'primary': this.primary && !this.outline,
        'secondary': this.secondary && !this.outline,
        'success': this.success && !this.outline,
        'info': this.info && !this.outline,
        'warning': this.warning && !this.outline,
        'error': this.error && !this.outline,
        'primary--text': this.primary && this.outline,
        'secondary--text': this.secondary && this.outline,
        'success--text': this.success && this.outline,
        'info--text': this.info && this.outline,
        'warning--text': this.warning && this.outline,
        'error--text': this.error && this.outline
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
    data.attrs.type = this.type

    children.push(this.genContent(h))

    if (this.loading) {
      children.push(this.genLoader(h))
    }

    return h(tag, data, children)
  }
}
