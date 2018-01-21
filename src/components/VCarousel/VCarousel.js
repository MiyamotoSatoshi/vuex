import '../../stylus/components/_carousel.styl'

import VBtn from '../VBtn'
import VIcon from '../VIcon'

import Bootable from '../../mixins/bootable'
import Themeable from '../../mixins/themeable'
import { provide as RegistrableProvide } from '../../mixins/registrable'

import Touch from '../../directives/touch'

export default {
  name: 'v-carousel',

  mixins: [Bootable, Themeable, RegistrableProvide('carousel')],

  directives: { Touch },

  data () {
    return {
      inputValue: null,
      items: [],
      slideTimeout: null,
      reverse: false
    }
  },

  props: {
    cycle: {
      type: Boolean,
      default: true
    },
    delimiterIcon: {
      type: String,
      default: 'fiber_manual_record'
    },
    hideControls: Boolean,
    hideDelimiters: Boolean,
    interval: {
      type: [Number, String],
      default: 6000,
      validator: value => value > 0
    },
    prependIcon: {
      type: [Boolean, String],
      default: 'chevron_left'
    },
    appendIcon: {
      type: [Boolean, String],
      default: 'chevron_right'
    },
    value: Number
  },

  watch: {
    items () {
      if (this.inputValue >= this.items.length) {
        this.inputValue = this.items.length - 1
      }
    },
    inputValue () {
      // Evaluates items when inputValue changes to
      // account for dynamic changing of children

      const uid = (this.items[this.inputValue] || {}).uid
      for (let index = this.items.length; --index >= 0;) {
        this.items[index].open(uid, this.reverse)
      }

      this.$emit('input', this.inputValue)
      this.restartTimeout()
    },
    value (val) {
      this.inputValue = val
    },
    interval () {
      this.restartTimeout()
    },
    cycle (val) {
      if (val) {
        this.restartTimeout()
      } else {
        clearTimeout(this.slideTimeout)
        this.slideTimeout = null
      }
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    genDelimiters () {
      return this.$createElement('div', {
        staticClass: 'carousel__controls'
      }, this.genItems())
    },
    genIcon (direction, icon, fn) {
      if (!icon) return null

      return this.$createElement('div', {
        staticClass: `carousel__${direction}`
      }, [
        this.$createElement(VBtn, {
          props: {
            icon: true,
            dark: this.dark || !this.light,
            light: this.light
          },
          on: { click: fn }
        }, [
          this.$createElement(VIcon, {
            props: { 'size': '46px' }
          }, icon)
        ])
      ])
    },
    genItems () {
      return this.items.map((item, index) => {
        return this.$createElement(VBtn, {
          class: {
            'carousel__controls__item': true,
            'carousel__controls__item--active': index === this.inputValue
          },
          props: {
            icon: true,
            small: true,
            dark: this.dark || !this.light,
            light: this.light
          },
          key: index,
          on: { click: this.select.bind(this, index) }
        }, [this.$createElement(VIcon, {
          props: { size: '18px' }
        }, this.delimiterIcon)])
      })
    },
    restartTimeout () {
      this.slideTimeout && clearTimeout(this.slideTimeout)
      this.slideTimeout = null

      const raf = requestAnimationFrame || setTimeout
      raf(this.startTimeout)
    },
    init () {
      this.inputValue = this.value || 0
    },
    next () {
      this.reverse = false
      this.inputValue = (this.inputValue + 1) % this.items.length
    },
    prev () {
      this.reverse = true
      this.inputValue = (this.inputValue + this.items.length - 1) % this.items.length
    },
    select (index) {
      this.reverse = index < this.inputValue
      this.inputValue = index
    },
    startTimeout () {
      if (!this.cycle) return

      this.slideTimeout = setTimeout(() => this.next(), this.interval > 0 ? this.interval : 6000)
    },
    register (uid, open) {
      this.items.push({ uid, open })
    },
    unregister (uid) {
      this.items = this.items.filter(i => i.uid !== uid)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'carousel',
      directives: [{
        name: 'touch',
        value: {
          left: this.next,
          right: this.prev
        }
      }]
    }, [
      this.hideControls ? null : this.genIcon('left', this.prependIcon, this.prev),
      this.hideControls ? null : this.genIcon('right', this.appendIcon, this.next),
      this.hideDelimiters ? null : this.genDelimiters(),
      this.$slots.default
    ])
  }
}
