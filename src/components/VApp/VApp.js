require("../../stylus/components/_app.styl")

import Breakpoint from '../../util/breakpoint'
import Themeable from '../../mixins/themeable'

import Resize from '../../directives/resize'

export default {
  name: 'v-app',

  mixins: [Breakpoint, Themeable],

  directives: {
    Resize
  },

  data: () => ({
    resizeTimeout: {}
  }),

  props: {
    fixedFooter: Boolean,
    footer: Boolean,
    id: {
      type: String,
      default: 'app'
    },
    toolbar: Boolean
  },

  mounted () {
    this.onResize()
  },

  render (h) {
    const data = {
      staticClass: 'application',
      'class': {
        'application--dark': this.dark,
        'application--light': !this.dark,
        'application--footer': this.footer || this.fixedFooter,
        'application--footer-fixed': this.fixedFooter,
        'application--toolbar': this.toolbar
      },
      attrs: { 'data-app': true },
      domProps: { id: this.id },
      directives: [{
        name: 'resize',
        value: this.onResize
      }]
    }

    return h('div', data, this.$slots.default)
  }
}
