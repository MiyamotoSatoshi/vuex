import DateTitle from './mixins/date-title'
import DateHeader from './mixins/date-header'
import DateTable from './mixins/date-table'
import DateYears from './mixins/date-years'
import Picker from '~mixins/picker'
import { createRange } from '~util/helpers'

const defaultDateFormat = val => new Date(val).toISOString().substr(0, 10)

export default {
  name: 'date-picker',

  mixins: [DateTitle, DateHeader, DateTable, DateYears, Picker],

  data () {
    return {
      tableDate: new Date(),
      originalDate: this.value,
      currentDay: null,
      currentMonth: null,
      currentYear: null,
      isSelected: false,
      isReversing: false,
      narrowDays: []
    }
  },

  props: {
    locale: {
      type: String,
      default: 'en-us'
    },
    dateFormat: {
      type: Function,
      default: defaultDateFormat
    },
    titleDateFormat: {
      type: Object,
      default: () => ({ weekday: 'short', month: 'short', day: 'numeric' })
    },
    headerDateFormat: {
      type: Object,
      default: () => ({ month: 'long', year: 'numeric' })
    },
    formattedValue: {
      required: false
    },
    allowedDates: {
      type: [Array, Object, Function],
      default: () => (null)
    },
    firstDayOfWeek: {
      type: [String, Number],
      default: 0
    }
  },

  computed: {
    firstAllowedDate () {
      const date = new Date()
      date.setHours(12, 0, 0, 0)

      if (this.allowedDates) {
        const millisecondOffset = 1 * 24 * 60 * 60 * 1000
        const valid = new Date(date)
        for (let i = 0; i < 31; i++) {
          if (this.isAllowed(valid)) return valid

          valid.setTime(valid.getTime() + millisecondOffset)
        }
      }

      return date
    },
    inputDate: {
      get () {
        if (!this.value) return this.firstAllowedDate
        if (this.value instanceof Date) return this.value
        if (!isNaN(this.value) ||
            typeof this.value === 'string' && this.value.indexOf(':') !== -1
        ) return new Date(this.value)

        return new Date(`${this.value}T12:00:00`)
      },
      set (val) {
        this.$emit('input', val ? defaultDateFormat(val) : this.originalDate)
        this.$emit('update:formattedValue', val ? this.dateFormat(val) : this.dateFormat(this.originalDate))
      }
    },
    day () {
      return this.inputDate.getDate()
    },
    month () {
      return this.inputDate.getMonth()
    },
    year () {
      return this.inputDate.getFullYear()
    },
    tableMonth () {
      return this.tableDate.getMonth()
    },
    tableYear () {
      return this.tableDate.getFullYear()
    },
    computedTransition () {
      return this.isReversing ? 'v-tab-reverse-transition' : 'v-tab-transition'
    }
  },

  watch: {
    isSelected (val) {
      val && this.$nextTick(() => {
        this.$refs.years.scrollTop = this.$refs.years.scrollHeight / 2 - 125
      })
    },
    tableDate (val, prev) {
      this.isReversing = val < prev
    },
    value (val) {
      if (val) this.tableDate = this.inputDate
    }
  },

  methods: {
    save () {
      if (this.originalDate) {
        this.originalDate = this.value
      } else {
        this.originalDate = this.inputDate
      }

      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    },
    cancel () {
      this.inputDate = this.originalDate
      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    },
    isAllowed (date) {
      if (!this.allowedDates) return true

      if (Array.isArray(this.allowedDates)) {
        return !!this.allowedDates.find(allowedDate => {
          const d = new Date(allowedDate)
          d.setHours(12, 0, 0, 0)

          return d - date === 0
        })
      } else if (this.allowedDates instanceof Function) {
        return this.allowedDates(date)
      } else if (this.allowedDates instanceof Object) {
        const min = new Date(this.allowedDates.min)
        min.setHours(12, 0, 0, 0)
        const max = new Date(this.allowedDates.max)
        max.setHours(12, 0, 0, 0)

        return date >= min && date <= max
      }

      return true
    }
  },

  created () {
    const date = new Date()
    date.setDate(date.getDate() - date.getDay() + parseInt(this.firstDayOfWeek))

    createRange(7).forEach(() => {
      const narrow = date.toLocaleString(this.locale, { weekday: 'narrow' })
      this.narrowDays.push(narrow)

      date.setDate(date.getDate() + 1)
    })
  },

  mounted () {
    this.currentDay = this.tableDate.getDate()
    this.currentMonth = this.tableDate.getMonth()
    this.currentYear = this.tableDate.getFullYear()
    this.tableDate = this.inputDate
  },

  render (h) {
    const children = []

    !this.noTitle && children.push(this.genTitle())

    if (!this.isSelected) {
      const bodyChildren = []

      bodyChildren.push(this.genHeader())
      bodyChildren.push(this.genTable())

      children.push(h('div', {
        'class': 'picker__body'
      }, bodyChildren))
    } else {
      children.push(this.genYears())
    }

    this.$scopedSlots.default && children.push(this.genSlot())

    return h('v-card', {
      'class': {
        'picker picker--date': true,
        'picker--landscape': this.landscape,
        'picker--dark': this.dark,
        'picker--light': this.light && !this.dark
      }
    }, children)
  }
}
