import Themeable from '../../mixins/themeable'

export default {
  functional: true,

  mixins: [Themeable],

  props: {
    fa: Boolean,
    large: Boolean,
    left: Boolean,
    medium: Boolean,
    right: Boolean,
    xLarge: Boolean
  },

  render (h, { props, data, children }) {
    const icon = props.fa ? 'fa' : 'material-icons'
    data.staticClass = data.staticClass ? `${icon} icon ${data.staticClass} ` : `${icon} icon `

    const classes = {
      'icon--dark': !props.light || props.dark,
      'icon--large': props.large,
      'icon--left': props.left,
      'icon--light': props.light || !props.dark,
      'icon--medium': props.medium,
      'icon--right': props.right,
      'icon--x-large': props.xLarge
    }

    data.staticClass += Object.keys(classes).filter(k => classes[k]).join(' ')

    if (props.fa) {
      const text = children.pop().text

      if (text.indexOf(' ') === -1) data.staticClass += ` fa-${text}`
      else data.staticClass += ` ${text.split(' ').join('fa- ')}`
    }

    return h('i', data, children)
  }
}
