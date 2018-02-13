// Mixins
import Colorable from '../../mixins/colorable'
import DatePickerTable from './mixins/date-picker-table'

// Utils
import { pad, createNativeLocaleFormatter } from './util'

export default {
  name: 'v-date-picker-month-table',

  mixins: [
    Colorable,
    DatePickerTable
  ],

  computed: {
    formatter () {
      return this.format || createNativeLocaleFormatter(this.locale, { month: 'short', timeZone: 'UTC' }, { start: 5, length: 2 })
    }
  },

  methods: {
    calculateTableDate (delta) {
      return `${parseInt(this.tableDate, 10) + Math.sign(delta || 1)}`
    },
    genTBody () {
      const children = []
      const cols = Array(3).fill(null)
      const rows = 12 / cols.length

      for (let row = 0; row < rows; row++) {
        const tds = cols.map((_, col) => {
          const month = row * cols.length + col
          return this.$createElement('td', {
            key: month
          }, [
            this.genButton(`${this.displayedYear}-${pad(month + 1)}`, false)
          ])
        })

        children.push(this.$createElement('tr', {
          key: row
        }, tds))
      }

      return this.$createElement('tbody', children)
    }
  },

  render (h) {
    return this.genTable('date-picker-table date-picker-table--month', [
      this.genTBody()
    ])
  }
}
