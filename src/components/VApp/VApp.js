require('../../stylus/components/_app.styl')

// Component level mixins
import AppTheme from './mixins/app-theme'
import AppBreakpoint from './mixins/app-breakpoint'

// Directives
import Resize from '../../directives/resize'

// Utilities
import PointerSupport from '../../util/pointerSupport'

export default {
  name: 'v-app',

  mixins: [
    AppBreakpoint,
    AppTheme,
    PointerSupport
  ],

  directives: {
    Resize
  },

  props: {
    id: {
      type: String,
      default: 'app'
    },
    dark: Boolean
  },

  computed: {
    classes () {
      return {
        [`theme--${this.dark ? 'dark' : 'light'}`]: true
      }
    }
  },

  mounted () {
    this.$vuetify.dark = this.dark
    window.addEventListener('load', this.runCallbacks)
  },

  watch: {
    dark () {
      this.$vuetify.dark = this.dark
    }
  },

  methods: {
    // Run all load callbacks created
    // from the load helper utility
    runCallbacks () {
      // For unit tests
      if (!document._loadCallbacks) return

      while (document._loadCallbacks.length) {
        document._loadCallbacks.pop()()
      }
    }
  },

  render (h) {
    const data = {
      staticClass: 'application',
      'class': this.classes,
      attrs: { 'data-app': true },
      domProps: { id: this.id },
      directives: [{
        name: 'resize',
        value: this.onResize
      }]
    }

    const wrapper = h('div', { staticClass: 'application--wrap' }, this.$slots.default)

    return h('div', data, [wrapper])
  }
}
