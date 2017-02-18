import Contextualable from '../../mixins/contextualable'

export default {
  name: 'checkbox',

  mixins: [Contextualable],

  data () {
    return {
      focused: false,
      inputValue: this.value,
      inputDeterminate: this.indeterminate
    }
  },

  props: {
    dark: Boolean,
    disabled: Boolean,
    indeterminate: Boolean,
    label: String,
    light: Boolean,
    value: {
      required: false
    },
    valueV: {
      required: false
    }
  },

  watch: {
    inputValue () {
      if (this.indeterminate) {
        this.inputDeterminate = false
      }
      const input = this.inputValue
      if (Array.isArray(this.inputValue)) {
        const i = this.inputValue.indexOf(this.valueV)

        if (i === -1) {
          input.push(this.valueV)
        } else {
          input.splice(i, 1)
        }
      }

      this.$emit('input', input)
    },
    value () {
      if (!this.disabled) {
        this.inputValue = this.value
      }
    }
  },

  computed: {
    classes () {
      return {
        'input-group--selection-controls__container': true,
        'input-group--selection-controls__container--active': this.isActive,
        'input-group--selection-controls__container--light': this.light,
        'input-group--selection-controls__container--dark': this.dark,
        'input-group--selection-controls__container--disabled': this.disabled,
        'primary--text': this.primary,
        'secondary--text': this.secondary,
        'error--text': this.error,
        'success--text': this.success,
        'info--text': this.info,
        'warning--text': this.warning
      }
    },
    icon () {
      if (this.inputDeterminate) {
        return 'indeterminate_check_box'
      } else if (this.inputValue) {
        return 'check_box'
      } else {
        return 'check_box_outline_blank'
      }
    },
    isActive () {
      return (
        (Array.isArray(this.inputValue) &&
          this.inputValue.indexOf(this.valueV) !== -1) ||
        this.inputValue
      )
    }
  },

  methods: {
    toggle () {
      if (!this.disabled) {
        this.inputValue = !this.inputValue
      }
    }
  },
  render (h) {
    const transition = h('v-fade-transition', {}, [
      h('v-icon', {
        'class': {
          'icon--checkbox': this.icon === 'check_box'
        },
        key: this.icon
      }, this.icon)
    ])

    const ripple = h('div', {
      'class': 'input-group--selection-controls__ripple',
      on: { click: this.toggle },
      directives: [
        {
          name: 'ripple',
          value: { center: true }
        }
      ]
    })

    return h('div', {
      'class': 'input-group input-group--selection-controls'
    }, [
      h('div', { 'class': this.classes }, [transition, ripple]),
      h('label', { on: { click: this.toggle }}, this.label)
    ])
  }
}
