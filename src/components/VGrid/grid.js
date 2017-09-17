export default function Grid (name) {
  return {
    name: `v-${name}`,

    functional: true,

    props: {
      id: String
    },

    render: (h, { props, data, children }) => {
      data.staticClass = (`${name} ${data.staticClass || ''}`).trim()

      if (data.attrs) {
        const classes = []

        Object.keys(data.attrs).forEach(key => {
          const value = data.attrs[key]

          if (typeof value === 'string') classes.push(key)
          else if (value) classes.push(key)
        })

        data.staticClass += ` ${classes.join(' ')}`
        delete data.attrs
      }

      if (props.id) {
        data.domProps = data.domProps || {}
        data.domProps.id = props.id
      }

      return h('div', data, children)
    }
  }
}
