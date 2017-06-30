import Input from '~mixins/input'
import { addOnceEventListener, createRange } from '~util/helpers'

export default {
  name: 'slider',

  mixins: [Input],

  data () {
    return {
      app: {},
      isActive: false,
      inputWidth: 0
    }
  },

  props: {
    inverted: Boolean,
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    step: {
      type: [Number, String],
      default: null
    },
    thumbLabel: Boolean,
    value: [Number, String],
    vertical: Boolean,
    snap: Boolean
  },

  computed: {
    classes () {
      return {
        'input-group input-group--slider': true,
        'input-group--active': this.isActive,
        'input-group--dirty': this.inputWidth > 0,
        'input-group--disabled': this.disabled,
        'input-group--ticks': !this.disabled && this.step
      }
    },
    inputValue: {
      get () {
        return this.value
      },
      set (val) {
        val = val < this.min ? this.min : val > this.max ? this.max : val
        if (Math.ceil(val) !== Math.ceil(this.lazyValue)) {
          this.inputWidth = this.calculateWidth(val)
        }

        const value = this.snap ? Math.round(val / this.step) * this.step : parseInt(val)
        this.lazyValue = value

        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    },
    interval () {
      return 100 / (this.max - this.min) * this.step
    },
    thumbContainerClasses () {
      return {
        'slider__thumb-container': true,
        'slider__thumb-container--label': this.thumbLabel
      }
    },
    thumbStyles () {
      return {
        left: `${this.inputWidth}%`
      }
    },
    tickContainerStyles () {
      return {
        transform: `translate3d(0, -50%, 0)`
      }
    },
    trackStyles () {
      const scaleX = this.calculateScale(1 - (this.inputWidth / 100))
      const translateX = this.inputWidth < 1 && !this.isActive ? `${8}px` : 0
      return {
        transform: `scaleX(${scaleX}) translateX(${translateX})`
      }
    },
    trackFillStyles () {
      const scaleX = this.calculateScale(this.inputWidth / 100)
      const translateX = this.inputWidth > 99 && !this.thumbLabel ? `${-8}px` : 0
      return {
        transform: `scaleX(${scaleX}) translateX(${translateX})`
      }
    },
    numTicks () {
      return parseInt((this.max - this.min) / this.step)
    }
  },

  watch: {
    value () {
      this.inputValue = this.value
    }
  },

  mounted () {
    this.inputValue = this.value
    this.$nextTick(() => this.inputWidth = this.calculateWidth(this.inputValue))

    // Without a v-app, iOS does not work with body selectors
    this.app = document.querySelector('[data-app]') ||
      console.warn('The v-slider component requires the present of v-app or a non-body wrapping element with the [data-app] attribute.')
  },

  methods: {
    calculateWidth (val) {
      if (this.snap) {
        val = Math.round(val / this.step) * this.step
      }

      val = (val - this.min) / (this.max - this.min) * 100

      return val < 0.15 ? 0 : val
    },
    calculateScale (scale) {
      if (scale < 0.02 && !this.thumbLabel) {
        return 0
      }

      return this.disabled ? scale - 0.015 : scale
    },
    onMouseDown (e) {
      this.isActive = true

      if ('touches' in e) {
        this.app.addEventListener('touchmove', this.onMouseMove, { passive: true })
        addOnceEventListener(this.app, 'touchend', this.onMouseUp)
      } else {
        this.app.addEventListener('mousemove', this.onMouseMove, { passive: true })
        addOnceEventListener(this.app, 'mouseup', this.onMouseUp)
      }
    },
    onMouseUp () {
      this.isActive = false
      this.app.removeEventListener('touchmove', this.onMouseMove, { passive: true })
      this.app.removeEventListener('mousemove', this.onMouseMove, { passive: true })
    },
    onMouseMove (e) {
      const { left: offsetLeft, width: trackWidth } = this.$refs.track.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      let left = (
        ((clientX - offsetLeft) / trackWidth) * 100
      )

      left = left < 0 ? 0 : left > 100 ? 100 : left

      this.inputValue = this.min + ((left / 100) * (this.max - this.min))
    },
    onKeyDown (e) {
      if (!e.keyCode === 37 && !e.keyCode === 39) return

      const direction = e.keyCode === 37 && -1 || e.keyCode === 39 && 1 || 0
      const multiplier = e.shiftKey && 3 || e.ctrlKey && 2 || 1
      const amount = this.snap && this.step || 1

      this.inputValue = this.inputValue + (direction * amount * multiplier)
    },
    sliderMove (e) {
      if (!this.isActive) {
        this.onMouseMove(e)
      }
    }
  },

  render (h) {
    const children = []
    const trackChildren = []
    const thumbChildren = []

    trackChildren.push(h('div', { 'class': 'slider__track', style: this.trackStyles }))
    trackChildren.push(h('div', { 'class': 'slider__track-fill', style: this.trackFillStyles }))
    children.push(h('div', { 'class': 'slider__track__container', ref: 'track' }, trackChildren))

    if (this.step) {
      const ticks = createRange(this.numTicks + 1).map((i) => {
        const span = h('span', {
          class: 'slider__tick',
          style: {
            left: `${i * (100 / this.numTicks)}%`
          }
        })

        return span
      })

      children.push(h('div', { 'class': 'slider__ticks-container', style: this.tickContainerStyles }, ticks))
    }

    thumbChildren.push(h('div', { 'class': 'slider__thumb' }))

    if (this.thumbLabel) {
      thumbChildren.push(
        h('v-scale-transition', { props: { origin: 'bottom center' } }, [
          h('div', {
            'class': 'slider__thumb--label__container',
            directives: [
              {
                name: 'show',
                value: this.isActive
              }
            ]
          }, [
            h('div', { 'class': 'slider__thumb--label' }, [
              h('span', {}, parseInt(this.inputValue))
            ])
          ])
        ])
      )
    }

    const thumbContainer = h('div', {
      'class': this.thumbContainerClasses,
      style: this.thumbStyles,
      on: {
        touchstart: this.onMouseDown,
        mousedown: this.onMouseDown
      },
      ref: 'thumb'
    }, thumbChildren)

    children.push(thumbContainer)

    const slider = h('div', { 'class': 'slider' }, children)

    return this.genInputGroup([slider], {
      attrs: {
        role: 'slider',
        tabindex: this.tabindex
      },
      on: {
        mouseup: this.sliderMove,
        keydown: this.onKeyDown
      },
      directives: [{
        name: 'click-outside'
      }]
    })
  }
}
