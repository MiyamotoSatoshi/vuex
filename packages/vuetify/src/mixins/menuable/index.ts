// Mixins
import Positionable from '../positionable'
import Stackable from '../stackable'

// Utilities
import { consoleError } from '../../util/console'
import mixins, { ExtractVue } from '../../util/mixins'

// Types
import { VNode } from 'vue'
import { PropValidator } from 'vue/types/options'

const baseMixins = mixins(
  Stackable,
  Positionable
)

interface options extends ExtractVue<typeof baseMixins> {
  attach: boolean | string | Element
  offsetY: boolean
  offsetX: boolean
  $refs: {
    content: HTMLElement
    activator: HTMLElement
  }
}

/* @vue/component */
export default baseMixins.extend<options>().extend({
  name: 'menuable',

  props: {
    activator: {
      default: null,
      validator: (val: string | object) => {
        return ['string', 'object'].includes(typeof val)
      }
    } as PropValidator<string | HTMLElement>,
    allowOverflow: Boolean,
    light: Boolean,
    dark: Boolean,
    disabled: Boolean,
    maxWidth: {
      type: [Number, String],
      default: 'auto'
    },
    minWidth: [Number, String],
    nudgeBottom: {
      type: [Number, String],
      default: 0
    },
    nudgeLeft: {
      type: [Number, String],
      default: 0
    },
    nudgeRight: {
      type: [Number, String],
      default: 0
    },
    nudgeTop: {
      type: [Number, String],
      default: 0
    },
    nudgeWidth: {
      type: [Number, String],
      default: 0
    },
    offsetOverflow: Boolean,
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
      default: null
    }
  },

  data: () => ({
    absoluteX: 0,
    absoluteY: 0,
    activatedBy: null as EventTarget | null,
    activatorNode: null as null | VNode | VNode[],
    dimensions: {
      activator: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        offsetTop: 0,
        scrollHeight: 0,
        offsetLeft: 0
      },
      content: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        offsetTop: 0,
        scrollHeight: 0
      }
    },
    hasJustFocused: false,
    hasWindow: false,
    inputActivator: false,
    isContentActive: false,
    pageWidth: 0,
    pageYOffset: 0,
    stackClass: 'v-menu__content--active',
    stackMinZIndex: 6
  }),

  computed: {
    computedLeft () {
      const a = this.dimensions.activator
      const c = this.dimensions.content
      const activatorLeft = (this.isAttached ? a.offsetLeft : a.left) || 0
      const minWidth = Math.max(a.width, c.width)
      let left = 0
      left += this.left ? activatorLeft - (minWidth - a.width) : activatorLeft
      if (this.offsetX) {
        const maxWidth = isNaN(Number(this.maxWidth))
          ? a.width
          : Math.min(a.width, Number(this.maxWidth))

        left += this.left ? -maxWidth : a.width
      }
      if (this.nudgeLeft) left -= parseInt(this.nudgeLeft)
      if (this.nudgeRight) left += parseInt(this.nudgeRight)

      return left
    },
    computedTop () {
      const a = this.dimensions.activator
      const c = this.dimensions.content
      let top = 0

      if (this.top) top += a.height - c.height
      if (this.isAttached) top += a.offsetTop
      else top += a.top + this.pageYOffset
      if (this.offsetY) top += this.top ? -a.height : a.height
      if (this.nudgeTop) top -= parseInt(this.nudgeTop)
      if (this.nudgeBottom) top += parseInt(this.nudgeBottom)

      return top
    },
    hasActivator (): boolean {
      return !!this.$slots.activator || !!this.$scopedSlots.activator || !!this.activator || !!this.inputActivator
    },
    isAttached (): boolean {
      return this.attach !== false
    }
  },

  watch: {
    disabled (val) {
      val && this.callDeactivate()
    },
    isActive (val) {
      if (this.disabled) return

      val ? this.callActivate() : this.callDeactivate()
    },
    positionX: 'updateDimensions',
    positionY: 'updateDimensions'
  },

  beforeMount () {
    this.checkForWindow()
  },

  methods: {
    absolutePosition () {
      return {
        offsetTop: 0,
        offsetLeft: 0,
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
    calcLeft (menuWidth: number) {
      return `${this.isAttached
        ? this.computedLeft
        : this.calcXOverflow(this.computedLeft, menuWidth)
      }px`
    },
    calcTop () {
      return `${this.isAttached
        ? this.computedTop
        : this.calcYOverflow(this.computedTop)
      }px`
    },
    calcXOverflow (left: number, menuWidth: number) {
      const xOverflow = left + menuWidth - this.pageWidth + 12

      if ((!this.left || this.right) && xOverflow > 0) {
        left = Math.max(left - xOverflow, 0)
      } else {
        left = Math.max(left, 12)
      }

      return left + this.getOffsetLeft()
    },
    calcYOverflow (top: number) {
      const documentHeight = this.getInnerHeight()
      const toTop = this.pageYOffset + documentHeight
      const activator = this.dimensions.activator
      const contentHeight = this.dimensions.content.height
      const totalHeight = top + contentHeight
      const isOverflowing = toTop < totalHeight

      // If overflowing bottom and offset
      // TODO: set 'bottom' position instead of 'top'
      if (isOverflowing &&
        this.offsetOverflow &&
        // If we don't have enough room to offset
        // the overflow, don't offset
        activator.top > contentHeight
      ) {
        top = this.pageYOffset + (activator.top - contentHeight)
      // If overflowing bottom
      } else if (isOverflowing && !this.allowOverflow) {
        top = toTop - contentHeight - 12
      // If overflowing top
      } else if (top < this.pageYOffset && !this.allowOverflow) {
        top = this.pageYOffset + 12
      }

      return top < 12 ? 12 : top
    },
    callActivate () {
      if (!this.hasWindow) return

      this.activate()
    },
    callDeactivate () {
      this.isContentActive = false

      this.deactivate()
    },
    checkForWindow () {
      if (!this.hasWindow) {
        this.hasWindow = typeof window !== 'undefined'
      }
    },
    checkForPageYOffset () {
      if (this.hasWindow) {
        this.pageYOffset = this.getOffsetTop()
      }
    },
    deactivate () {},
    getActivator (e?: Event): HTMLElement | null {
      if (this.inputActivator) {
        return this.$el.querySelector('.v-input__slot')
      }

      if (this.activator) {
        return typeof this.activator === 'string'
          ? document.querySelector(this.activator)
          : this.activator
      }

      if (this.$refs.activator) {
        return this.$refs.activator.children.length > 0
          ? this.$refs.activator.children[0] as HTMLElement
          : this.$refs.activator
      }

      if (e) this.activatedBy = e.currentTarget || e.target

      if (this.activatedBy) return this.activatedBy as HTMLElement

      if (this.activatorNode) {
        const activator = Array.isArray(this.activatorNode) ? this.activatorNode[0] : this.activatorNode
        const el = activator && activator.elm

        if (el) return el as HTMLElement
      }

      consoleError('No activator found')
      return null
    },
    getInnerHeight () {
      if (!this.hasWindow) return 0

      return window.innerHeight ||
        document.documentElement.clientHeight
    },
    getOffsetLeft () {
      if (!this.hasWindow) return 0

      return window.pageXOffset ||
        document.documentElement.scrollLeft
    },
    getOffsetTop () {
      if (!this.hasWindow) return 0

      return window.pageYOffset ||
        document.documentElement.scrollTop
    },
    getRoundedBoundedClientRect (el: Element) {
      const rect = el.getBoundingClientRect()
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        bottom: Math.round(rect.bottom),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    },
    measure (el: HTMLElement) {
      if (!el || !this.hasWindow) return null

      const rect = this.getRoundedBoundedClientRect(el)

      // Account for activator margin
      if (this.isAttached) {
        const style = window.getComputedStyle(el)

        rect.left = parseInt(style.marginLeft!)
        rect.top = parseInt(style.marginTop!)
      }

      return rect
    },
    sneakPeek (cb: () => void) {
      requestAnimationFrame(() => {
        const el = this.$refs.content

        if (!el || this.isShown(el)) {
          cb()
          return
        }

        el.style.display = 'inline-block'
        cb()
        el.style.display = 'none'
      })
    },
    startTransition () {
      return new Promise<void>(resolve => requestAnimationFrame(() => {
        this.isContentActive = this.hasJustFocused = this.isActive
        resolve()
      }))
    },
    isShown (el: HTMLElement) {
      return el.style.display !== 'none'
    },
    updateDimensions () {
      this.checkForWindow()
      this.checkForPageYOffset()
      this.pageWidth = document.documentElement.clientWidth

      const dimensions: any = {}

      // Activator should already be shown
      if (!this.hasActivator || this.absolute) {
        dimensions.activator = this.absolutePosition()
      } else {
        const activator = this.getActivator()
        if (!activator) return

        dimensions.activator = this.measure(activator)
        dimensions.activator.offsetLeft = activator.offsetLeft
        if (this.isAttached) {
          // account for css padding causing things to not line up
          // this is mostly for v-autocomplete, hopefully it won't break anything
          dimensions.activator.offsetTop = activator.offsetTop
        } else {
          dimensions.activator.offsetTop = 0
        }
      }

      // Display and hide to get dimensions
      this.sneakPeek(() => {
        dimensions.content = this.measure(this.$refs.content)

        this.dimensions = dimensions
      })
    }
  }
})
