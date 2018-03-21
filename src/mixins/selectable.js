// Components
import VInput from '../components/VInput'
import VLabel from '../components/VLabel'

export default {
  name: 'selectable',

  extends: VInput,

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
    inputValue: null,
    falseValue: null,
    label: String,
    trueValue: null
  },

  computed: {
    classesSelectable () {
      return this.addTextColorClassChecks(
        {},
        this.isDirty ? this.color : this.validationState
      )
    },
    isActive () {
      if ((Array.isArray(this.inputValue))) {
        return this.inputValue.indexOf(this.value) !== -1
      }

      if (!this.trueValue || !this.falseValue) {
        return this.value
          ? this.value === this.inputValue
          : Boolean(this.inputValue)
      }

      return this.inputValue === this.trueValue
    },
    isDirty: {
      get: 'isActive'
    }
  },

  methods: {
    genLabel () {
      return this.$createElement(VLabel, {
        on: { click: this.toggle },
        attrs: {
          for: this.id
        },
        props: {
          color: 'error',
          focused: this.hasState
        }
      }, this.$slots.label || this.label)
    },
    genInput (type, attrs) {
      return this.$createElement('input', {
        attrs: Object.assign({}, attrs, {
          'aria-label': this.label,
          role: type,
          type,
          value: this.inputValue
        }),
        on: {
          blur: this.onBlur,
          change: this.toggle, // TODO: change this name
          focus: this.onFocus
        }
      })
    },
    onBlur () {
      this.isFocused = false
    },
    toggle () {
      if (this.disabled) return

      let input = this.inputValue
      if (Array.isArray(input)) {
        input = input.slice()
        const i = input.indexOf(this.value)

        if (i === -1) {
          input.push(this.value)
        } else {
          input.splice(i, 1)
        }
      } else if (this.trueValue || this.falseValue) {
        input = input === this.trueValue ? this.falseValue : this.trueValue
      } else if (this.value) {
        input = this.value === this.inputValue
          ? null
          : this.value
      } else {
        input = !input
      }

      this.validate(true, input)

      this.$emit('change', input)
    },
    onFocus () {
      this.isFocused = true
    }
  }
}
