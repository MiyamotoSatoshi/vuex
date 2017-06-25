import Themeable from '~mixins/themeable'

export default {
  mixins: [Themeable],

  props: {
    card: Boolean,
    dense: Boolean,
    extended: Boolean,
    fixed: Boolean,
    flat: Boolean,
    floating: Boolean,
    prominent: Boolean
  },

  computed: {
    classes () {
      return {
        'toolbar': true,
        'toolbar--card': this.card,
        'toolbar--fixed': this.fixed,
        'elevation-0': this.flat,
        'toolbar--floating': this.floating,
        'toolbar--dense': this.dense,
        'toolbar--prominent': this.prominent,
        'theme--dark': this.dark,
        'theme--light': this.light
      }
    }
  },

  render (h) {
    const children = []
    const data = {
      'class': this.classes
    }

    children.push(h('div', {
      'class': 'toolbar__content'
    }, this.$slots.default))

    this.extended && children.push(h('div', {
      'class': 'toolbar__extension'
    }, this.$slots.extension))

    return h('nav', data, children)
  }
}
