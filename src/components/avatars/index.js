const Avatar = {
  functional: true,

  render (h, context) {
    const children = context.children
    const data = {
      'class': `avatar ${context.data.staticClass || ''}`
    }

    return h('div', data, children)
  }
}

export default {
  Avatar
}
