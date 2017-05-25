import Picker from '../../mixins/picker'
import TimeTitle from './mixins/time-title'
import TimeBody from './mixins/time-body'

export default {
  name: 'time-picker',

  mixins: [Picker, TimeBody, TimeTitle],

  data () {
    return {
      isDragging: false,
      rotate: 0,
      originalTime: this.value,
      period: 'am',
      selectingHour: true
    }
  },

  props: {
    format: {
      type: String,
      default: 'ampm',
      validator (val) {
        return ['ampm', '24hr'].includes(val)
      }
    }
  },

  computed: {
    is24hr () {
      return this.format !== 'ampm'
    },
    divider () {
      if (!this.selectingHour) return 60
      return this.is24hr ? 24 : 12
    },
    degrees () {
      return this.degreesPerUnit * Math.PI / 180
    },
    degreesPerUnit () {
      return 360 / this.divider
    },
    inputTime: {
      get () {
        if (this.value && !(this.value instanceof Date)) return this.value
        let value = new Date()

        if (this.value instanceof Date) {
          value = this.value
        }

        let hour = value.getHours()
        const minute = value.getMinutes()
        let period = ''

        if (!this.is24hr) {
          hour = hour > 12 ? hour - 12 : hour
          period = this.period
        }

        return `${hour}:${minute}${period}`
      },
      set (val) {
        return this.$emit('input', val)
      }
    },
    timeArray () {
      return this.inputTime.replace(/(am|pm)/, '').split(':')
    },
    hour: {
      get () {
        return parseInt(this.timeArray[0])
      },
      set (val) {
        if (!this.is24hr) {
          val = val > 12 ? val - 12 : val < 1 ? 12 : val
        } else {
          val = val < 10 ? `0${val}` : val > 23 ? '00' : val
        }

        this.inputTime = `${val}:${this.minute}${!this.is24hr ? this.period : ''}`
      }
    },
    minute: {
      get () {
        const minute = parseInt(this.timeArray[1])

        return minute < 10 ? `0${minute}` : minute > 59 ? '00' : minute
      },
      set (val) {
        val = val < 10 ? `0${parseInt(val)}` : val > 59 ? '00' : val
        let hour = this.hour

        if (this.is24hr && hour < 10) {
          hour = `0${hour}`
        }

        this.inputTime = `${hour}:${val}${!this.is24hr ? this.period : ''}`
      }
    },
    clockHand () {
      if (this.selectingHour) return this.degreesPerUnit * this.hour
      return this.degreesPerUnit * this.minute
    },
    radius () {
      return this.clockSize / 2
    },
    clockSize: {
      get () {
        return this.size
      },
      set (val) {
        this.size = val
      }
    },
    size () {
      return this.landscape ? 250 : 280
    }
  },

  watch: {
    period (val) {
      this.inputTime = `${this.hour}:${this.minute}${val}`
    },
    value (val) {
      if (this.isSaving) {
        this.originalTime = this.inputTime
        this.isSaving = false
      }
    }
  },

  methods: {
    save () {
      if (this.originalTime) {
        this.originalTime = this.value
      } else {
        this.inputTime = this.inputTime
        this.originalTime = this.inputTime
      }

      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    },
    cancel () {
      this.inputTime = this.originalTime
      if (this.$parent && this.$parent.isActive) this.$parent.isActive = false
    }
  },

  render (h) {
    const children = [this.genBody()]

    !this.noTitle && children.unshift(this.genTitle())
    this.$scopedSlots.default && children.push(this.genSlot())

    return h('v-card', {
      'class': {
        'picker picker--time': true,
        'picker--landscape': this.landscape,
        'picker--dark': this.dark,
        'picker--time--hours': this.selectingHour
      }
    }, children)
  }
}
