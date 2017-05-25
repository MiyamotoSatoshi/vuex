export default {
  methods: {
    measure (el, selector, getParent = false) {
      el = selector ? el.querySelector(selector) : el

      if (!el) return null

      const { top, bottom, left, right, height, width } = el.getBoundingClientRect()

      return {
        offsetTop: el.offsetTop,
        scrollHeight: el.scrollHeight,
        top, bottom, left, right, height, width
      }
    },
    initWindow () {
      this.isBooted = true

      if (this.window === window) return

      this.window = window
      this.window.addEventListener('resize', this.windowResizeHandler)
    }
  }
}
