// Styles
import './VAlert.sass'

// Extensions
import VSheet from '../VSheet'

// Components
import VBtn from '../VBtn'
import VIcon from '../VIcon'

// Mixins
import Toggleable from '../../mixins/toggleable'
import Themeable from '../../mixins/themeable'
import Transitionable from '../../mixins/transitionable'

// Types
import { VNodeData } from 'vue'
import { VNode } from 'vue/types'
import mixins from '../../util/mixins'
import { deprecate } from '../../util/console'

/* @vue/component */
export default mixins(
  VSheet,
  Toggleable,
  Transitionable
).extend({
  name: 'v-alert',

  props: {
    border: {
      type: String,
      validator (val: string) {
        return [
          'top',
          'right',
          'bottom',
          'left'
        ].includes(val)
      }
    },
    coloredBorder: Boolean,
    closeLabel: {
      type: String,
      default: '$vuetify.close'
    },
    dense: Boolean,
    dismissible: Boolean,
    icon: {
      type: [Boolean, String],
      validator (val: boolean | string) {
        return typeof val === 'string' || val === false
      }
    },
    outline: Boolean,
    outlined: Boolean,
    prominent: Boolean,
    text: Boolean,
    type: {
      type: String,
      validator (val: string) {
        return [
          'info',
          'error',
          'success',
          'warning'
        ].includes(val)
      }
    },
    value: {
      type: Boolean,
      default: true
    }
  },

  created () {
    /* istanbul ignore if */
    if (this.outline) deprecate('outline', 'outlined')
  },

  computed: {
    __cachedBorder (): VNode | null {
      if (!this.border) return null

      let data: VNodeData = {
        staticClass: 'v-alert__border',
        class: {
          [`v-alert__border--${this.border}`]: true
        }
      }

      if (this.coloredBorder) {
        data = this.setBackgroundColor(this.computedColor, data)
        data.class['v-alert__border--has-color'] = true
      }

      return this.$createElement('div', data)
    },
    __cachedDismissible (): VNode | null {
      if (!this.dismissible) return null

      const color = this.iconColor

      return this.$createElement(VBtn, {
        staticClass: 'v-alert__dismissible',
        props: {
          color,
          icon: true
        },
        attrs: {
          'aria-label': this.$vuetify.lang.t(this.closeLabel)
        },
        on: {
          click: () => (this.isActive = false)
        }
      }, [
        this.$createElement(VIcon, {
          props: { color }
        }, '$vuetify.icons.cancel')
      ])
    },
    __cachedIcon (): VNode | null {
      if (!this.computedIcon) return null

      return this.$createElement(VIcon, {
        staticClass: 'v-alert__icon',
        props: { color: this.iconColor }
      }, this.computedIcon)
    },
    classes (): object {
      const classes: Record<string, boolean> = {
        ...VSheet.options.computed.classes.call(this),
        'v-alert--border': Boolean(this.border),
        'v-alert--dense': this.dense,
        'v-alert--outline': this.hasOutline,
        'v-alert--prominent': this.prominent,
        'v-alert--text': this.text
      }

      if (this.border) {
        classes[`v-alert--border-${this.border}`] = true
      }

      return classes
    },
    computedColor (): string {
      return this.color || this.type
    },
    computedIcon (): string | boolean {
      if (!this.icon) return false
      if (this.icon != null) return this.icon

      switch (this.type) {
        case 'info': return '$vuetify.icons.info'
        case 'error': return '$vuetify.icons.error'
        case 'success': return '$vuetify.icons.success'
        case 'warning': return '$vuetify.icons.warning'
        default: return false
      }
    },
    hasColoredIcon (): boolean {
      return (
        this.hasText ||
        (Boolean(this.border) && this.coloredBorder)
      )
    },
    // TODO: remove deprecated
    hasOutline (): boolean {
      return this.outline || this.outlined
    },
    hasText (): boolean {
      return this.text || this.hasOutline
    },
    iconColor (): string | undefined {
      return this.hasColoredIcon ? this.computedColor : undefined
    },
    isDark (): boolean {
      if (
        this.type &&
        !this.coloredBorder &&
        !this.hasOutline
      ) return true

      return Themeable.options.computed.isDark.call(this)
    }
  },

  methods: {
    genAlert (): VNode {
      const children = [
        this.$slots.prepend || this.__cachedIcon,
        this.__cachedBorder,
        this.genContent(),
        this.$slots.append,
        this.$scopedSlots.close
          ? this.$scopedSlots.close({ toggle: this.toggle })
          : this.__cachedDismissible
      ]
      let data: VNodeData = {
        staticClass: 'v-alert',
        class: this.classes,
        style: this.styles,
        directives: [{
          name: 'show',
          value: this.isActive
        }]
      }

      if (!this.coloredBorder) {
        const setColor = this.hasText ? this.setTextColor : this.setBackgroundColor
        data = setColor(this.computedColor, data)
      }

      return this.$createElement('div', data, children)
    },
    genContent (): VNode {
      return this.$createElement('div', {
        staticClass: 'v-alert__content'
      }, this.$slots.default)
    },
    /** @public */
    toggle () {
      this.isActive = !this.isActive
    }
  },

  render (h): VNode {
    const render = this.genAlert()

    if (!this.transition) return render

    return h('transition', {
      props: {
        name: this.transition,
        origin: this.origin,
        mode: this.mode
      }
    }, [render])
  }
})
