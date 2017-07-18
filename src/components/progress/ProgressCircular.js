export default {
  name: 'progress-circular',

  props: {
    button: Boolean,

    fill: {
      type: String,
      default: () => this.indeterminate ? 'none' : 'transparent'
    },

    indeterminate: Boolean,

    rotate: {
      type: Number,
      default: 0
    },

    size: {
      type: [Number, String],
      default: 32
    },

    width: {
      type: Number,
      default: 4
    },

    value: {
      type: Number,
      default: 0
    }
  },

  computed: {
    calculatedSize () {
      let size = Number(this.size)

      if (this.button) {
        size += 8
      }

      return size
    },

    circumference () {
      return 2 * Math.PI * this.radius
    },

    classes () {
      return {
        'progress-circular': true,
        'progress-circular--indeterminate': this.indeterminate,
        'progress-circular--button': this.button
      }
    },

    cxy () {
      return this.indeterminate && !this.button ? 50 : this.calculatedSize / 2
    },

    normalizedValue () {
      if (this.value < 0) {
        return 0
      }

      if (this.value > 100) {
        return 100
      }

      return this.value
    },

    radius () {
      return this.indeterminate && !this.button ? 20 : (this.calculatedSize - this.width) / 2
    },

    strokeDashArray () {
      return Math.round(this.circumference * 1000) / 1000
    },

    strokeDashOffset () {
      return ((100 - this.normalizedValue) / 100) * this.circumference + 'px'
    },

    styles () {
      return {
        height: `${this.calculatedSize}px`,
        width: `${this.calculatedSize}px`
      }
    },

    svgSize () {
      return this.indeterminate ? false : this.calculatedSize
    },

    svgStyles () {
      return {
        transform: `rotate(${this.rotate}deg)`
      }
    },

    viewBox () {
      return this.indeterminate ? '25 25 50 50' : false
    }
  },

  methods: {
    genCircle (h, name, offset) {
      return h('circle', {
        class: `progress-circular__${name}`,
        attrs: {
          fill: 'transparent',
          cx: this.cxy,
          cy: this.cxy,
          r: this.radius,
          'stroke-width': this.width,
          'stroke-dasharray': this.strokeDashArray,
          'stroke-dashoffset': offset
        }
      })
    },
    genSvg (h) {
      const children = [
        !this.indeterminate && this.genCircle(h, 'underlay', 0),
        this.genCircle(h, 'overlay', this.strokeDashOffset)
      ]

      return h('svg', {
        style: this.svgStyles,
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          height: this.svgSize,
          width: this.svgSize,
          viewBox: this.viewBox
        }
      }, children)
    }
  },

  render (h) {
    const info = h('div', { class: 'progress-circular__info' }, [this.$slots.default])
    const svg = this.genSvg(h)

    return h('div', {
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    }, [svg, info])
  }
}

/*
<template lang="pug">
  div(
    class="progress-circular"
    v-bind:class="classes"
    v-bind:style="styles"
    v-on="$listeners"
  )
    svg(
      xmlns="http://www.w3.org/2000/svg"
      v-bind:height="svgSize"
      v-bind:width="svgSize"
      v-bind:viewBox="viewBox"
      v-bind:style="svgStyles"
    )
      circle(
        class="progress-circular__underlay"
        fill="transparent"
        v-bind:cx="cxy"
        v-bind:cy="cxy"
        v-bind:r="radius"
        v-bind:stroke-width="width"
        v-bind:stroke-dasharray="strokeDashArray"
        v-bind:stroke-dashoffset="0"
        v-if="!indeterminate"
      )
      circle(
        class="progress-circular__overlay"
        v-bind:fill="fill"
        v-bind:cx="cxy"
        v-bind:cy="cxy"
        v-bind:r="radius"
        v-bind:stroke-width="width"
        v-bind:stroke-dasharray="strokeDashArray"
        v-bind:stroke-dashoffset="strokeDashOffset"
      )
    div(class="progress-circular__info")
      slot
</template>
*/
