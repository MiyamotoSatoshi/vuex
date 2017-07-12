export default {
  data () {
    return {
      overlay: null,
      overlayOffset: 0,
      overlayTransitionDuration: 500
    }
  },

  props: {
    hideOverlay: Boolean
  },

  beforeDestroy () {
    this.removeOverlay()
  },

  methods: {
    genOverlay () {
      if ((!this.isActive || this.hideOverlay) ||
        (this.isActive && this.overlay)
      ) return

      this.overlay = document.createElement('div')
      this.overlay.className = 'overlay'
      this.overlay.onclick = () => {
        if (this.permanent) return
        else if (!this.persistent) this.isActive = false
        else if (this.isMobile) this.isActive = false
      }

      if (this.absolute) this.overlay.className += ' overlay--absolute'

      this.hideScroll()

      if (this.absolute) {
        // Required for IE11
        this.$el.parentNode.insertBefore(this.overlay, this.$el.parentNode.firstChild)
      } else {
        document.querySelector('[data-app]').appendChild(this.overlay)
      }

      this.overlay.clientHeight // Force repaint
      requestAnimationFrame(() => {
        this.overlay.className += ' overlay--active'
      })

      return true
    },
    removeOverlay () {
      if (!this.overlay) {
        return this.showScroll()
      }

      this.overlay.className = this.overlay.className.replace('overlay--active', '')

      setTimeout(() => {
        // IE11 Fix
        try {
          this.overlay.parentNode.removeChild(this.overlay)
          this.overlay = null
          this.showScroll()
        } catch (e) {}
      }, this.overlayTransitionDuration)
    },
    hideScroll () {
      // Check documentElement first for IE11
      // this.overlayOffset = document.documentElement &&
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop

      // document.body.style.top = `-${this.overlayOffset}px`
      // document.body.style.position = 'fixed'
      document.documentElement.style.overflow = 'hidden'
    },
    showScroll () {
      document.documentElement.removeAttribute('style')

      // if (!this.overlayOffset) return
      // document.body.scrollTop = this.overlayOffset
      // document.documentElement.scrollTop = this.overlayOffset
    }
  }
}
