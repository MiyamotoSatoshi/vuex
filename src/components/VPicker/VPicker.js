require('../../stylus/components/_pickers.styl')

// Components
import VCard from '../VCard'

// Mixins
import Colorable from '../../mixins/colorable'
import Themeable from '../../mixins/themeable'

export default {
  name: 'v-picker',

  components: {
    VCard
  },

  mixins: [Colorable, Themeable],

  data () {
    return {
      defaultColor: 'primary'
    }
  },

  props: {
    landscape: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    }
  },

  computed: {
    computedTitleColor () {
      const darkTheme = this.dark || (!this.light && this.$vuetify.dark)
      const defaultTitleColor = darkTheme ? null : this.computedColor
      return this.color || defaultTitleColor
    }
  },

  methods: {
    genTitle () {
      return this.$createElement('div', {
        staticClass: 'picker__title',
        'class': this.addBackgroundColorClassChecks({
          'picker__title--landscape': this.landscape
        }, this.computedTitleColor)
      }, this.$slots.title)
    },
    genBodyTransition () {
      return this.$createElement('transition', {
        props: {
          name: this.transition
        }
      }, this.$slots.default)
    },
    genBody () {
      return this.$createElement('div', {
        staticClass: 'picker__body'
      }, [this.genBodyTransition()])
    },
    genActions () {
      return this.$createElement('div', {
        staticClass: 'picker__actions card__actions'
      }, this.$slots.actions)
    }
  },

  render (h) {
    return h('v-card', {
      staticClass: 'picker',
      'class': {
        'picker--landscape': this.landscape,
        ...this.themeClasses
      }
    }, [
      this.$slots.title ? this.genTitle() : null,
      this.genBody(),
      this.$slots.actions ? this.genActions() : null
    ])
  }
}
