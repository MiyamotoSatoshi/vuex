// Styles
import '../../stylus/components/_counters.styl'

export default {
  functional: true,

  name: 'v-counter',

  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    max: [Number, String]
  },

  render (h, { props }) {
    const max = parseInt(props.max, 10)
    const value = parseInt(props.value, 10)
    const content = max ? `${value} / ${max}` : props.value
    const isGreater = max && (value > max)

    return h('div', {
      staticClass: 'v-counter',
      class: isGreater ? ['error--text'] : []
    }, content)
  }
}
