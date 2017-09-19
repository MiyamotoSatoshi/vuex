require('../../stylus/components/_toolbar.styl')

import Applicationable from '../../mixins/applicationable'
import Themeable from '../../mixins/themeable'

export default {
  name: 'v-toolbar',

  mixins: [Applicationable, Themeable],

  data: () => ({
    heights: {
      mobileLandscape: 48,
      mobile: 56,
      desktop: 64,
      dense: 48
    },
    denseHeight: 48,
    defaultHeight: 56,
    prominentHeight: 64,
    isExtended: false,
    isScrolling: false,
    marginTop: 0,
    previousScroll: null,
    target: null
  }),

  props: {
    absolute: Boolean,
    card: Boolean,
    clippedLeft: Boolean,
    clippedRight: Boolean,
    dense: Boolean,
    extended: Boolean,
    fixed: Boolean,
    flat: Boolean,
    floating: Boolean,
    height: [Number, String],
    prominent: Boolean,
    scrollOffScreen: Boolean,
    scrollTarget: String,
    scrollThreshold: {
      type: Number,
      default: 100
    }
  },

  computed: {
    computedHeight () {
      if (this.height) return this.height
      if (this.dense) return this.dense
      if (this.prominent ||
        this.$vuetify.breakpoint.mdAndUp
      ) return this.heights.desktop
      if (this.$vuetify.breakpoint.clientWidth >
        this.$vuetify.breakpoint.clientHeight
      ) return this.mobileLandscape

      return this.heights.mobile
    },
    classes () {
      return {
        'toolbar': true,
        'elevation-0': this.flat,
        'toolbar--absolute': this.absolute,
        'toolbar--card': this.card,
        'toolbar--clipped': this.clippedLeft || this.clippedRight,
        'toolbar--dense': this.dense,
        'toolbar--fixed': this.fixed,
        'toolbar--floating': this.floating,
        'toolbar--prominent': this.prominent,
        'toolbar--extended': this.isExtended,
        'theme--dark': this.dark,
        'theme--light': this.light
      }
    },
    paddingLeft () {
      if (!this.app || this.clippedLeft) return 0

      return this.$vuetify.application.left
    },
    paddingRight () {
      if (!this.app || this.clippedRight) return 0

      return this.$vuetify.application.right
    },
    styles () {
      return {
        marginTop: this.marginTop,
        paddingLeft: `${this.paddingLeft}px`,
        paddingRight: `${this.paddingRight}px`
      }
    }
  },

  watch: {
    isScrolling (val) {
      if (!val) this.marginTop = 0
      else (this.marginTop = `${-this.$refs.content.clientHeight - 6}px`)
      this.updateApplication()
    }
  },

  destroyed () {
    if (this.app) this.$vuetify.application.top = 0
  },

  methods: {
    onScroll () {
      if (typeof window === 'undefined') return

      if (!this.target) {
        this.target = this.scrollTarget
          ? document.querySelector(this.scrollTarget)
          : window
      }

      const currentScroll = this.scrollTarget
        ? this.target.scrollTop
        : this.target.pageYOffset || document.documentElement.scrollTop

      if (currentScroll < this.scrollThreshold) return

      if (this.previousScroll === null) {
        this.previousScroll = currentScroll
      }

      this.isScrolling = this.previousScroll < currentScroll

      this.previousScroll = currentScroll
    },
    updateApplication () {
      if (!this.app) return

      this.$vuetify.application.top = !this.fixed && !this.absolute
        ? 0
        : this.isExtended && !this.isScrolling
          ? this.computedHeight * 2
          : this.computedHeight
    }
  },

  render (h) {
    this.isExtended = this.extended || !!this.$slots.extension
    this.updateApplication()

    const children = []
    const data = {
      'class': this.classes,
      style: this.styles,
      on: this.$listeners
    }

    if (this.scrollOffScreen) {
      data.directives = [{
        name: 'scroll',
        value: {
          callback: this.onScroll,
          target: this.scrollTarget
        }
      }]
    }

    children.push(h('div', {
      staticClass: 'toolbar__content',
      style: { height: `${this.computedHeight}px` },
      ref: 'content'
    }, this.$slots.default))

    if (this.isExtended) {
      children.push(h('div', {
        staticClass: 'toolbar__extension',
        style: { height: `${this.computedHeight}px` }
      }, this.$slots.extension))
    }

    return h('nav', data, children)
  }
}
