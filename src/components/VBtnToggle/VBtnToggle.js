import '../../stylus/components/_button-toggle.styl'

import ButtonGroup from '../../mixins/button-group'
import Themeable from '../../mixins/themeable'
import { consoleWarn } from '../../util/console'

export default {
  name: 'v-btn-toggle',

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  mixins: [ButtonGroup, Themeable],

  props: {
    inputValue: {
      required: false
    },
    mandatory: Boolean,
    multiple: Boolean
  },

  computed: {
    classes () {
      return {
        'btn-toggle': true,
        'btn-toggle--selected': this.hasValue,
        'theme--light': this.light,
        'theme--dark': this.dark
      }
    },
    hasValue () {
      return (this.multiple && this.inputValue.length) ||
        (!this.multiple && this.inputValue !== null &&
          typeof this.inputValue !== 'undefined')
    }
  },

  watch: {
    inputValue: {
      handler () {
        this.update()
      },
      deep: true
    }
  },

  methods: {
    isSelected (i) {
      const item = this.getValue(i)
      if (!this.multiple) {
        return this.inputValue === item
      }

      return this.inputValue.includes(item)
    },
    updateValue (i) {
      const item = this.getValue(i)
      if (!this.multiple) {
        if (this.mandatory && this.inputValue === item) return
        return this.$emit('change', this.inputValue === item ? null : item)
      }

      const items = this.inputValue.slice()

      const index = items.indexOf(item)
      if (index > -1) {
        if (this.mandatory && items.length === 1) return
        items.length >= 1 && items.splice(index, 1)
      } else {
        items.push(item)
      }

      this.$emit('change', items)
    },
    updateAllValues () {
      if (!this.multiple) {
        return
      }

      const items = []

      for (let i = 0; i < this.buttons.length; ++i) {
        const item = this.getValue(i)
        const index = this.inputValue.indexOf(item)
        if (index !== -1) {
          items.push(item)
        }
      }

      this.$emit('change', items)
    }
  },

  created () {
    if (this.multiple && !Array.isArray(this.inputValue)) {
      consoleWarn('v-btn-toggle model must be bound to an array if the multiple property is true.')
    }
  },

  render (h) {
    return h('div', { class: this.classes }, this.$slots.default)
  }
}
