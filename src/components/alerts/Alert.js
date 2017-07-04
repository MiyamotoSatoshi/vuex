import Contextualable from '~mixins/contextualable'
import Toggleable from '~mixins/toggleable'
import Transitionable from '~mixins/transitionable'

export default {
  name: 'alert',

  mixins: [Contextualable, Toggleable, Transitionable],

  props: {
    dismissible: Boolean,
    hideIcon: Boolean,
    icon: String
  },

  computed: {
    classes () {
      return {
        'alert': true,
        'alert--dismissible': this.dismissible,
        'error': this.error,
        'info': this.info,
        'success': this.success,
        'warning': this.warning,
        'primary': this.primary,
        'secondary': this.secondary
      }
    },

    mdIcon () {
      switch (true) {
        case Boolean(this.icon): return this.icon
        case this.error: return 'warning'
        case this.info: return 'info'
        case this.success: return 'check_circle'
        case this.warning: return 'priority_high'
      }
    }
  },

  render (h) {
    const children = [h('div', this.$slots.default)]

    !this.hideIcon && this.mdIcon && children.unshift(h('v-icon', {
      'class': 'alert__icon',
      props: { large: true }
    }, this.mdIcon))

    if (this.dismissible) {
      children.push(h('a', {
        'class': 'alert__dismissible',
        domProps: { href: 'javascript:;' },
        on: { click: () => (this.$emit('input', false)) }
      }, [h('v-icon', { props: { right: true, large: true } }, 'cancel')]))
    }

    const alert = h('div', {
      'class': this.classes,
      directives: [{
        name: 'show',
        value: this.isActive
      }]
    }, children)

    if (!this.transition) return alert

    return h('transition', {
      props: {
        name: this.transition,
        origin: this.origin,
        mode: this.mode
      }
    }, [alert])
  }
}
