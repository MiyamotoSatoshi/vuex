import Toggleable from '../../mixins/toggleable'

export default {
  name: 'menu',

  mixins: [Toggleable],

  data () {
    return {
      window: {},
      dimensions: {
        activator: {
          top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, offsetTop: 0
        },
        content: {
          top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, offsetTop: 0
        },
        list: null,
        selected: null
      },
      direction: { vert: 'bottom', horiz: 'right' },
      position: { left: '0px', top: '0px', right: 'auto', bottom: 'auto' },
      isContentActive: false
    }
  },

  props: {
    top: Boolean,
    left: Boolean,
    bottom: Boolean,
    right: Boolean,
    auto: Boolean,
    offsetX: Boolean,
    offsetY: Boolean,
    nudgeXAuto: {
      type: Number,
      default: -16
    },
    nudgeYAuto: {
      type: Number,
      default: -18
    },
    openOnClick: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    origin: {
      type: String,
      default: 'top left'
    }
  },

  computed: {
    offset () {
      const { activator: a, content: c } = this.dimensions
      const { direction, offsetX, offsetY, offsetAuto: auto } = this

      const horiz = direction.horiz === 'left'
          ? offsetX ? a.left - c.right : a.right - c.right + auto.horiz
          : offsetX ? a.right - c.left : a.left - c.left + auto.horiz
      const vert = direction.vert === 'top'
          ? offsetY ? a.top - c.bottom : a.bottom - c.bottom + auto.vert
          : offsetY ? a.bottom - c.top : a.top - c.top + auto.vert

      return { horiz, vert }
    },

    offsetAuto () {
      if (!this.auto) return { horiz: 0, vert: 0 }
      if (!this.dimensions.selected) return { horiz: this.nudgeXAuto, vert: this.nudgeYAuto }

      const { activator: a, content: c, selected: s, list } = this.dimensions
      const offsetBottom = list.height - s.height - s.offsetTop
      const scrollMiddle = (c.height - s.height) / 2
      const horiz = this.nudgeXAuto
      let vert = (a.height - c.height + this.nudgeYAuto) / 2

      vert += s.offsetTop < scrollMiddle ? scrollMiddle - s.offsetTop : 0
      vert += offsetBottom < scrollMiddle ? offsetBottom - scrollMiddle : 0

      return { horiz, vert }
    },

    screenDist () {
      const { activator: a } = this.dimensions
      const { innerHeight: innerH, innerWidth: innerW } = this.window
      const dist = {}

      dist.top = this.offsetY ? a.top : a.bottom
      dist.left = this.offsetX ? a.left : a.right
      dist.bottom = this.offsetY ? innerH - a.bottom : innerH - a.top
      dist.right = this.offsetX ? innerW - a.right : innerW - a.left
      dist.horizMax = dist.left > dist.right ? dist.left : dist.right
      dist.horizMaxDir = dist.left > dist.right ? 'left' : 'right'
      dist.vertMax = dist.top > dist.bottom ? dist.top : dist.bottom
      dist.vertMaxDir = dist.top > dist.bottom ? 'top' : 'bottom'

      return dist
    },

    screenOverflow () {
      const { content: c } = this.dimensions
      const left = c.left + this.offset.horiz
      const top = c.top + this.offset.vert

      const horiz = this.auto && left + c.width > this.window.innerWidth
          ? (left + c.width) - this.window.innerWidth
          : this.auto && left < 0
            ? left
            : 0
      const vert = this.auto && top + c.height > this.window.innerHeight
          ? (top + c.height) - this.window.innerHeight
          : this.auto && top < 0
            ? top
            : 0

      return { horiz, vert }
    },

    styles () {
      return {
        top: this.position.top,
        left: this.position.left,
        right: this.position.right,
        bottom: this.position.bottom
      }
    }
  },

  watch: {
    isActive (val) {
      if (val) this.activate()
      else this.isContentActive = false
    }
  },

  methods: {
    activate () {
      this.window = window
      this.setDirection()
      this.updatePosition()
    },

    setDirection (horiz = '', vert = '') {
      this.direction = {
        horiz: horiz || (this.left && !this.auto ? 'left' : 'right'),
        vert: vert || (this.top && !this.auto ? 'top' : 'bottom')
      }

      this.resetPosition()
    },

    resetPosition () {
      this.position.top = this.direction.vert === 'top' ? 'auto' : '0px'
      this.position.left = this.direction.horiz === 'left' ? 'auto' : '0px'
      this.position.bottom = this.direction.vert === 'bottom' ? 'auto' : '0px'
      this.position.right = this.direction.horiz === 'right' ? 'auto' : '0px'
    },

    updatePosition () {
      this.$nextTick(() => {
        this.updateDimensions()

        const { offset, screenOverflow: screen } = this
        const { horiz, vert } = this.direction
        const noMoreFlipping = this.flip() === false

        this.position.left = horiz === 'left' ? 'auto' : `${offset.horiz - screen.horiz}px`
        this.position.top = vert === 'top' ? 'auto' : `${offset.vert - screen.vert}px`
        this.position.right = horiz === 'right' ? 'auto' : `${-offset.horiz - screen.horiz}px`
        this.position.bottom = vert === 'bottom' ? 'auto' : `${-offset.vert - screen.vert}px`

        if (noMoreFlipping) this.startTransition()
      })
    },

    updateDimensions () {
      const { activator: a, content: c } = this.$refs

      this.sneakPeek(c, () => {
        this.updateMaxMin()

        this.dimensions = {
          'activator': this.measure(a.children ? a.children[0] : a),
          'content': this.measure(c),
          'list': this.measure(c, '.list'),
          'selected': this.measure(c, '.list__tile--active', 'parent')
        }

        this.offscreenFix()
        this.updateScroll()
      })
    },

    updateMaxMin () {
      const { $refs, maxHeight, offsetAuto } = this
      const a = $refs.activator.children ? $refs.activator.children[0] : $refs.activator
      const c = $refs.content

      c.style.minWidth = `${a.getBoundingClientRect().width + offsetAuto.horiz}px`
      c.style.maxHeight = null  // <-- TODO: This is a temporary fix.
      c.style.maxHeight = isNaN(maxHeight) ? maxHeight : `${maxHeight}px`
    },

    offscreenFix () {
      const { $refs, screenDist, auto } = this
      const { vert } = this.direction
      const contentIsOverTheEdge = this.dimensions.content.height > screenDist[vert]

      if (!auto && contentIsOverTheEdge) {
        $refs.content.style.maxHeight = `${screenDist.vertMax}px`
        this.dimensions.content.height = $refs.content.getBoundingClientRect().height
      }
    },

    updateScroll () {
      if (!this.auto || !this.dimensions.selected) return

      const { content: c, selected: s, list: l } = this.dimensions
      const scrollMiddle = (c.height - s.height) / 2
      const scrollMax = l.height - c.height
      let offsetTop = s.offsetTop - scrollMiddle

      offsetTop = this.screenOverflow.vert && offsetTop > scrollMax ? scrollMax : offsetTop
      offsetTop = this.screenOverflow.vert && offsetTop < 0 ? 0 : offsetTop
      offsetTop -= this.screenOverflow.vert

      this.$refs.content.scrollTop = offsetTop
    },

    flip () {
      const { auto, screenDist } = this
      const { content: c } = this.dimensions
      const { horiz, vert } = this.direction
      const flipHoriz = !auto && c.width > screenDist[horiz] ? screenDist.horizMaxDir : horiz
      const flipVert = !auto && c.height > screenDist[vert] ? screenDist.vertMaxDir : vert
      const doFlip = flipHoriz !== horiz || flipVert !== vert

      if (doFlip) {
        this.setDirection(flipHoriz, flipVert)
        this.updatePosition()
      }

      return doFlip
    },

    startTransition () {
      this.$refs.content.offsetHeight // <-- Force DOM to repaint first.
      this.isContentActive = true     // <-- Trigger v-show on content.
    },

    // Render functions
    // ====================

    genActivator (h) {
      const data = {
        ref: 'activator',
        slot: 'activator',
        class: {
          'menu__activator': true
        },
        on: {
          click: () => {
            if (this.openOnClick) this.isActive = !this.isActive
          }
        }
      }

      return h('div', data, [this.$slots.activator || null])
    },

    genTransition (h) {
      const data = {
        props: {
          origin: this.origin
        }
      }

      return h('v-menu-transition', data, [this.genContent(h)])
    },

    genContent (h) {
      const data = {
        ref: 'content',
        style: this.styles,
        directives: [{
          name: 'show',
          value: this.isContentActive
        }],
        'class': { 'menu__content': true },
        on: {
          click: () => { if (this.closeOnClick) this.isActive = false }
        }
      }

      return h('div', data, [this.$slots.default])
    },

    // Utils
    // ====================

    measure (el, selector, getParent = false) {
      el = selector ? el.querySelector(selector) : el
      el = el && getParent ? el.parentElement : el

      if (!el) return null
      const { top, left, bottom, right, width, height } = el.getBoundingClientRect()
      return { top, left, bottom, right, width, height, offsetTop: el.offsetTop }
    },

    sneakPeek (el, cb) {
      const oldOpacity = el.style.opacity
      const oldDisplay = el.style.display

      el.style.opacity = 0
      el.style.display = 'inline-block'
      cb()
      el.style.opacity = oldOpacity
      el.style.display = oldDisplay
    }
  },

  render (h) {
    const data = {
      'class': {
        'menu': true
      },
      directives: [
        {
          name: 'click-outside'
        }
      ],
      on: {
        'keyup': e => { if (e.keyCode === 27) this.isActive = false }
      }
    }

    return h('div', data, [this.genActivator(h), this.genTransition(h)])
  }
}
