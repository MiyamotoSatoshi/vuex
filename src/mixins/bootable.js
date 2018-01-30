/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
export default {
  name: 'bootable',

  data: () => ({
    isBooted: false
  }),

  props: {
    lazy: Boolean
  },

  watch: {
    isActive () {
      this.isBooted = true
    }
  },

  methods: {
    showLazyContent (content) {
      return (this.isBooted || !this.lazy || this.isActive)
        ? content
        : null
    }
  }
}
