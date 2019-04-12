// Components
import VInput from '../../components/VInput'

// Mixins
import Rippleable from '../rippleable'
import Comparable from '../comparable'

// Utilities
import mixins from '../../util/mixins'

/* @vue/component */
export default mixins(
  VInput,
  Rippleable,
  Comparable
).extend({
  name: 'selectable',

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  props: {
    color: {
      type: String,
      default: 'accent'
    },
    id: String,
    inputValue: null as any,
    falseValue: null as any,
    trueValue: null as any,
    multiple: {
      type: Boolean,
      default: null
    },
    label: String
  },

  data () {
    return {
      lazyValue: this.inputValue
    }
  },

  computed: {
    computedColor (): string | undefined {
      return this.isActive ? this.color : this.validationState
    },
    isMultiple (): boolean {
      return this.multiple === true || (this.multiple === null && Array.isArray(this.internalValue))
    },
    isActive (): boolean {
      const value = this.value
      const input = this.internalValue

      if (this.isMultiple) {
        if (!Array.isArray(input)) return false

        return input.some(item => this.valueComparator(item, value))
      }

      if (this.trueValue === undefined || this.falseValue === undefined) {
        return value
          ? this.valueComparator(value, input)
          : Boolean(input)
      }

      return this.valueComparator(input, this.trueValue)
    },
    isDirty (): boolean {
      return this.isActive
    }
  },

  watch: {
    inputValue (val) {
      this.lazyValue = val
    }
  },

  methods: {
    genLabel () {
      const label = VInput.options.methods.genLabel.call(this)

      if (!label) return label

      label!.data!.on = { click: this.onChange }

      return label
    },
    genInput (type: string, attrs: object) {
      return this.$createElement('input', {
        attrs: Object.assign({
          'aria-label': this.label,
          'aria-checked': this.isActive.toString(),
          disabled: this.isDisabled,
          id: this.id,
          role: type,
          type
        }, attrs),
        domProps: {
          value: this.value,
          checked: this.isActive
        },
        on: {
          blur: this.onBlur,
          change: this.onChange,
          focus: this.onFocus,
          keydown: this.onKeydown
        },
        ref: 'input'
      })
    },
    onBlur () {
      this.isFocused = false
    },
    onChange () {
      if (this.isDisabled) return

      const value = this.value
      let input = this.internalValue

      if (this.isMultiple) {
        if (!Array.isArray(input)) {
          input = []
        }

        const length = input.length

        input = input.filter((item: any) => !this.valueComparator(item, value))

        if (input.length === length) {
          input.push(value)
        }
      } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
        input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue
      } else if (value) {
        input = this.valueComparator(input, value) ? null : value
      } else {
        input = !input
      }

      this.validate(true, input)
      this.internalValue = input
    },
    onFocus () {
      this.isFocused = true
    },
    /** @abstract */
    onKeydown (e: Event) {}
  }
})
