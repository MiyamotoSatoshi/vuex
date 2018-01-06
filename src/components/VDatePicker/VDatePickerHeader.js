require('../../stylus/components/_date-picker-header.styl')

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Mixins
import Colorable from '../../mixins/colorable'

// Utils
import { createNativeLocaleFormatter, monthChange } from './util'

export default {
  name: 'v-date-picker-header',

  components: {
    VBtn,
    VIcon
  },

  mixins: [Colorable],

  data () {
    return {
      isReversing: false,
      defaultColor: 'accent'
    }
  },

  props: {
    appendIcon: {
      type: String,
      default: 'chevron_right'
    },
    format: {
      type: Function,
      default: null
    },
    locale: {
      type: String,
      default: 'en-us'
    },
    prependIcon: {
      type: String,
      default: 'chevron_left'
    },
    value: {
      type: [Number, String],
      required: true
    }
  },

  computed: {
    formatter () {
      if (this.format) {
        return this.format
      } else if (String(this.value).split('-')[1]) {
        return createNativeLocaleFormatter(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }, { length: 7 })
      } else {
        return createNativeLocaleFormatter(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 })
      }
    }
  },

  watch: {
    value (newVal, oldVal) {
      this.isReversing = newVal < oldVal
    }
  },

  methods: {
    genBtn (change) {
      return this.$createElement('v-btn', {
        props: {
          dark: this.dark,
          icon: true
        },
        nativeOn: {
          click: e => {
            e.stopPropagation()
            this.$emit('input', this.calculateChange(change))
          }
        }
      }, [
        this.$createElement('v-icon', change < 0 ? this.prependIcon : this.appendIcon)
      ])
    },
    calculateChange (sign) {
      const [year, month] = String(this.value).split('-').map(v => 1 * v)

      if (month == null) {
        return `${year + sign}`
      } else {
        return monthChange(String(this.value), sign)
      }
    },
    genHeader () {
      const header = this.$createElement('strong', {
        'class': this.addTextColorClassChecks(),
        key: String(this.value),
        on: {
          click: () => this.$emit('toggle')
        }
      }, [this.$slots.default || this.formatter(String(this.value))])

      const transition = this.$createElement('transition', {
        props: {
          name: this.isReversing ? 'tab-reverse-transition' : 'tab-transition'
        }
      }, [header])

      return this.$createElement('div', {
        'class': 'date-picker-header__value'
      }, [transition])
    }
  },

  render (h) {
    return this.$createElement('div', {
      staticClass: 'date-picker-header'
    }, [
      this.genBtn(-1),
      this.genHeader(),
      this.genBtn(+1)
    ])
  }
}
