export default {
  name: 'list',

  props: {
    dense: Boolean,

    subHeader: Boolean,

    threeLine: Boolean,

    twoLine: Boolean
  },

  computed: {
    classes () {
      return {
        'list': true,
        'list--two-line': this.twoLine,
        'list--dense': this.dense,
        'list--three-line': this.threeLine,
        'list--sub-header': this.subHeader
      }
    }
  },

  render (createElement) {
    const data = {
      'class': this.classes,
      attrs: {
        'data-uid': this._uid
      }
    }

    return createElement('ul', data, [this.$slots.default])
  }
}
