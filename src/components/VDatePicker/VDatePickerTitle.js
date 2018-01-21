import '../../stylus/components/_date-picker-title.styl'

// Components
import VIcon from '../VIcon'

// Mixins
import PickerButton from '../../mixins/picker-button'

export default {
  name: 'v-date-picker-title',

  components: {
    VIcon
  },

  mixins: [PickerButton],

  data: () => ({
    isReversing: false
  }),

  props: {
    date: {
      type: String,
      default: ''
    },
    selectingYear: Boolean,
    year: {
      type: [Number, String],
      default: ''
    },
    yearIcon: {
      type: String
    }
  },

  computed: {
    computedTransition () {
      return this.isReversing ? 'picker-reverse-transition' : 'picker-transition'
    }
  },

  watch: {
    date: 'setReversing',
    year: 'setReversing'
  },

  methods: {
    genYearIcon () {
      return this.$createElement('v-icon', {
        props: {
          dark: true
        }
      }, this.yearIcon)
    },
    getYearBtn () {
      return this.genPickerButton('selectingYear', true, [
        this.year,
        this.yearIcon ? this.genYearIcon() : null
      ], 'date-picker-title__year')
    },
    genTitleText () {
      return this.$createElement('transition', {
        props: {
          name: this.computedTransition
        }
      }, [
        this.$createElement('div', {
          domProps: { innerHTML: this.date },
          key: this.date
        })
      ])
    },
    genTitleDate (title) {
      return this.genPickerButton('selectingYear', false, this.genTitleText(title), 'date-picker-title__date')
    },
    setReversing (val, prev) {
      this.isReversing = val < prev
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'date-picker-title'
    }, [
      this.getYearBtn(),
      this.genTitleDate()
    ])
  }
}
