import Ripple from '../directives/ripple'

/** @mixin */
export default {
  directives: { Ripple },

  props: {
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  methods: {
    genRipple (data = { directives: [] }) {
      data.class = this.rippleClasses || 'input-group--selection-controls__ripple'
      data.directives.push({
        name: 'ripple',
        value: this.ripple && !this.disabled && { center: true }
      })
      data.on = Object.assign({
        click: this.toggle
      }, this.$listeners)

      return this.$createElement('div', data)
    }
  }
}
