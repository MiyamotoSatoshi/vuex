import Positionable from './positionable'

/**
 * Menuable
 * 
 * @mixin
 *
 * Used for fixed or absolutely positioning
 * elements within the DOM
 * Can calculate X and Y axis overflows
 * As well as be manually positioned
 */
export default {
  mixins: [Positionable],

  data: () => ({
    absoluteX: 0,
    absoluteY: 0,
    dimensions: {
      activator: {
        top: 0, left: 0,
        bottom: 0, right: 0,
        width: 0, height: 0,
        offsetTop: 0, scrollHeight: 0
      },
      content: {
        top: 0, left: 0,
        bottom: 0, right: 0,
        width: 0, height: 0,
        offsetTop: 0, scrollHeight: 0
      },
      hasWindow: false
    },
    isContentActive: false,
    pageYOffset: 0
  }),

  props: {
    activator: { default: null },
    allowOverflow: Boolean,
    maxWidth: {
      type: [Number, String],
      default: 'auto'
    },
    minWidth: [Number, String],
    nudgeBottom: {
      type: Number,
      default: 0
    },
    nudgeLeft: {
      type: Number,
      default: 0
    },
    nudgeRight: {
      type: Number,
      default: 0
    },
    nudgeTop: {
      type: Number,
      default: 0
    },
    nudgeWidth: {
      type: Number,
      default: 0
    },
    positionX: {
      type: Number,
      default: null
    },
    positionY: {
      type: Number,
      default: null
    },
    zIndex: {
      type: [Number, String],
      default: 6
    }
  },

  computed: {
    hasActivator () {
      return !!this.$slots.activator || this.activator
    }
  },

  watch: {
    disabled (val) {
      val && this.callDeactivate()
    },
    isActive (val) {
      if (this.disabled) return

      val && this.callActivate() || this.callDeactivate()
    }
  },

  mounted () {
    this.checkForWindow()
  },

  methods: {
    absolutePosition () {
      return {
        offsetTop: 0,
        scrollHeight: 0,
        top: this.positionY || this.absoluteY,
        bottom: this.positionY || this.absoluteY,
        left: this.positionX || this.absoluteX,
        right: this.positionX || this.absoluteX,
        height: 0,
        width: 0
      }
    },
    activate () {},
    calcLeft () {
      const a = this.dimensions.activator
      const c = this.dimensions.content
      let left = this.left ? a.right - c.width : a.left

      if (this.offsetX) left += this.left ? -a.width : a.width
      if (this.nudgeLeft) left -= this.nudgeLeft
      if (this.nudgeRight) left += this.nudgeRight

      return left
    },
    calcTop () {
      const a = this.dimensions.activator
      const c = this.dimensions.content
      let top = this.top ? a.bottom - c.height : a.top

      if (this.offsetY) top += this.top ? -a.height : a.height
      if (this.nudgeTop) top -= this.nudgeTop
      if (this.nudgeBottom) top += this.nudgeBottom

      return top + this.pageYOffset
    },
    calcXOverflow (left) {
      const parsedMaxWidth = isNaN(parseInt(this.maxWidth))
        ? 0
        : parseInt(this.maxWidth)
      const innerWidth = this.getInnerWidth()
      const maxWidth = Math.max(
        this.dimensions.content.width,
        parsedMaxWidth
      )
      const totalWidth = left + maxWidth
      const availableWidth = totalWidth - innerWidth

      if ((!this.left || this.right) && availableWidth > 0) {
        left = (
          innerWidth -
          maxWidth -
          (innerWidth > 1280 ? 30 : 12) // Account for scrollbar
        )
      } else if (this.left && left < 0) left = 12

      return left
    },
    calcYOverflow (top) {
      const documentHeight = this.getInnerHeight()
      const toTop = this.pageYOffset + documentHeight
      const contentHeight = this.dimensions.content.height
      const totalHeight = top + contentHeight

      // If overflowing bottom
      if (toTop < totalHeight && !this.allowOverflow) top = toTop - contentHeight - 12
      // If overflowing top
      else if (top < this.pageYOffset && !this.allowOverflow) top = this.pageYOffset + 12

      return top < 12 ? 12 : top
    },
    callActivate () {
      this.checkForWindow()
      if (!this.hasWindow) return

      this.activate()
    },
    callDeactivate () {
      this.isContentActive = false

      this.deactivate()
    },
    checkForWindow () {
      this.hasWindow = window !== 'undefined'

      if (this.hasWindow) {
        this.pageYOffset = this.getOffsetTop()
      }
    },
    deactivate () {},
    getActivator () {
      if (this.activator) return this.activator

      return this.$refs.activator.children
        ? this.$refs.activator.children[0]
        : this.$refs.activator
    },
    getInnerHeight () {
      if (!this.hasWindow) return 0

      return window.innerHeight ||
        document.documentElement.clientHeight
    },
    getInnerWidth () {
      if (!this.hasWindow) return 0

      return window.innerWidth
    },
    getOffsetTop () {
      if (!this.hasWindow) return 0

      return window.pageYOffset ||
        document.documentElement.scrollTop
    },
    measure (el, selector) {
      el = selector ? el.querySelector(selector) : el

      if (!el) return null

      const {
        top,
        bottom,
        left,
        right,
        height,
        width
      } = el.getBoundingClientRect()

      return {
        offsetTop: el.offsetTop,
        scrollHeight: el.scrollHeight,
        top, bottom, left, right, height, width
      }
    },
    sneakPeek (cb) {
      requestAnimationFrame(() => {
        const el = this.$refs.content
        const currentDisplay = el.style.display

        el.style.display = 'inline-block'
        cb()
        el.style.display = currentDisplay
      })
    },
    startTransition () {
      requestAnimationFrame(() => (this.isContentActive = true))
    },
    updateDimensions () {
      this.sneakPeek(() => {
        this.dimensions = {
          activator: !this.hasActivator || this.absolute
            ? this.absolutePosition() : this.measure(this.getActivator()),
          content: this.measure(this.$refs.content)
        }
      })
    }
  }
}
