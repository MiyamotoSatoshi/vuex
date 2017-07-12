import Themeable from '~mixins/themeable'

export default {
  functional: true,

  mixins: [Themeable],

  props: {
    flat: Boolean,
    height: {
      type: String,
      default: 'auto'
    },
    hover: Boolean,
    img: String,
    raised: Boolean,
    tile: Boolean
  },

  render (h, { data, props, children }) {
    data.staticClass = (`card ${data.staticClass || ''}`).trim()
    data.style = data.style || {}
    data.style.height = props.height

    if (props.dark) data.staticClass += ' theme--dark'
    if (props.flat) data.staticClass += ' card--flat'
    if (props.horizontal) data.staticClass += ' card--horizontal'
    if (props.hover) data.staticClass += ' card--hover'
    if (props.light) data.staticClass += ' theme--light'
    if (props.raised) data.staticClass += ' card--raised'
    if (props.tile) data.staticClass += ' card--tile'

    if (props.img) {
      data.style.background = `url(${props.img}) center center / cover no-repeat`
    }

    return h('div', data, children)
  }
}
