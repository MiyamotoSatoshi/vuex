import '../../stylus/components/_steppers.styl'

import Themeable from '../../mixins/themeable'

export default {
  name: 'v-stepper',

  mixins: [Themeable],

  provide () {
    return {
      stepClick: this.stepClick
    }
  },

  data () {
    return {
      inputValue: null,
      isBooted: false,
      steps: [],
      content: [],
      isReverse: false
    }
  },

  props: {
    nonLinear: Boolean,
    altLabels: Boolean,
    vertical: Boolean,
    value: [Number, String]
  },

  computed: {
    classes () {
      return {
        'stepper': true,
        'stepper--is-booted': this.isBooted,
        'stepper--vertical': this.vertical,
        'stepper--alt-labels': this.altLabels,
        'stepper--non-linear': this.nonLinear,
        'theme--dark': this.dark,
        'theme--light': this.light
      }
    }
  },

  watch: {
    inputValue (val, prev) {
      this.isReverse = Number(val) < Number(prev)
      for (let index = this.steps.length; --index >= 0;) {
        this.steps[index].toggle(this.inputValue)
      }
      for (let index = this.content.length; --index >= 0;) {
        this.content[index].toggle(this.inputValue, this.isReverse)
      }

      this.$emit('input', this.inputValue)
      prev && (this.isBooted = true)
    },
    value () {
      this.getSteps()
      this.$nextTick(() => (this.inputValue = this.value))
    }
  },

  mounted () {
    this.getSteps()

    this.inputValue = this.value || this.steps[0].step || 1
  },

  methods: {
    getSteps () {
      this.steps = []
      this.content = []
      for (let index = 0; index < this.$children.length; index++) {
        const child = this.$children[index]
        if (child.$options._componentTag === 'v-stepper-step') {
          this.steps.push(child)
        } else if (child.$options._componentTag === 'v-stepper-content') {
          child.isVertical = this.vertical
          this.content.push(child)
        }
      }
    },
    stepClick (step) {
      this.getSteps()
      this.$nextTick(() => (this.inputValue = step))
    }
  },

  render (h) {
    return h('div', {
      'class': this.classes
    }, this.$slots.default)
  }
}
