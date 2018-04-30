// Styles
import '../../stylus/components/_inputs.styl'

// Components
import VIcon from '../VIcon'
import VMessages from '../VMessages'

// Mixins
import Loadable from '../../mixins/loadable'
import Themeable from '../../mixins/themeable'
import Validatable from '../../mixins/validatable'

// Utilities
import { convertToUnit } from '../../util/helpers'

export default {
  name: 'v-input',

  mixins: [
    Loadable,
    Themeable,
    Validatable
  ],

  data: vm => ({
    lazyValue: vm.value,
    isFocused: false
  }),

  props: {
    appendIcon: String,
    appendIconCb: Function,
    disabled: Boolean,
    height: [Number, String],
    hideDetails: Boolean,
    hint: String,
    persistentHint: Boolean,
    prependIcon: String,
    prependIconCb: Function,
    readonly: Boolean,
    tabindex: { default: 0 },
    value: { required: false }
  },

  computed: {
    classesInput () {
      return {
        ...this.classes,
        'v-input--has-state': this.hasState,
        'v-input--hide-details': this.hideDetails,
        'v-input--is-label-active': this.isLabelActive,
        'v-input--is-dirty': this.isDirty,
        'v-input--is-disabled': this.disabled,
        'v-input--is-focused': this.isFocused,
        'v-input--is-loading': this.loading !== false,
        ...this.classesColor,
        ...this.addTextColorClassChecks({}, this.validationState),
        ...this.themeClasses
      }
    },
    // Implementing components can
    // use dynamicHeight to override
    // the default conditional
    computedHeight () {
      return convertToUnit(this.dynamicHeight)
    },
    directivesInput () {
      return []
    },
    dynamicHeight () {
      return this.height || 32
    },
    hasHint () {
      return !this.hasMessages &&
        this.hint &&
        (this.persistentHint || this.isFocused)
    },
    // Proxy for `lazyValue`
    // This allows an input
    // to function without
    // a provided model
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val
        this.$emit('input', val)
      }
    },
    isDirty () {
      return !!this.lazyValue
    },
    isLabelActive () {
      return this.isDirty
    }
  },

  watch: {
    value (val) {
      this.lazyValue = val
    }
  },

  methods: {
    genContent () {
      return this.$createElement('div', {
        staticClass: 'v-input__control'
      }, [
        this.genInputSlot(),
        this.genMessages()
      ])
    },
    genDefaultSlot () {
      return this.$slots.default
    },
    genIcon (type, cb) {
      cb = cb || this[`${type}IconCb`]

      const data = {
        props: {
          color: this.validationState,
          disabled: this.disabled
        },
        on: {
          click: e => {
            e.preventDefault()
            e.stopPropagation()

            if (cb) cb()
            else this.onClick()
          }
        }
      }

      return this.$createElement('div', {
        staticClass: `v-input__icon v-input__icon--${type}`
      }, [
        this.$createElement(
          VIcon,
          data,
          this[`${type}Icon`]
        )
      ])
    },
    genInputSlot () {
      return this.$createElement('div', {
        staticClass: 'v-input__slot',
        'class': this.addTextColorClassChecks(
          {},
          this.hasState ? this.validationState : this.color
        ),
        style: {
          height: this.computedHeight
        },
        on: {
          click: this.onClick
        }
      }, this.genDefaultSlot())
    },
    genMessages () {
      if (this.hideDetails) return null

      const messages = this.hasHint
        ? [this.hint]
        : this.validations

      return this.$createElement(VMessages, {
        props: {
          color: this.hasHint ? '' : this.validationState,
          value: (this.hasMessages || this.hasHint) ? messages : []
        }
      })
    },
    genSlot (ref, location, slot) {
      if (!slot.length) return null

      return this.$createElement('div', {
        staticClass: `v-input__${ref}-${location}`
      }, slot)
    },
    genPrependSlot () {
      const slot = []

      // Backwards compat
      // TODO: Deprecate prepend-icon slot 2.0
      if (this.$slots['prepend-icon']) {
        slot.push(this.$slots['prepend-icon'])
      } else if (this.$slots['prepend']) {
        slot.push(this.$slots['prepend'])
      } else if (this.prependIcon) {
        slot.push(this.genIcon('prepend'))
      }

      return this.genSlot('prepend', 'outer', slot)
    },
    genAppendSlot () {
      const slot = []

      // Append icon for text field was really
      // an appended inner icon, v-text-field
      // will overwrite this method in order to obtain
      // backwards compat
      if (this.$slots['append']) {
        slot.push(this.$slots['append'])
      } else if (this.appendIcon) {
        slot.push(this.genIcon('append'))
      }

      return this.genSlot('append', 'outer', slot)
    },
    onClick (e) {
      this.$emit('click', e)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'v-input',
      attrs: this.attrsInput,
      'class': this.classesInput,
      directives: this.directivesInput
    }, [
      this.genPrependSlot(),
      this.genContent(),
      this.genAppendSlot()
    ])
  }
}
