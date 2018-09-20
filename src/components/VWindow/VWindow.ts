// Styles
import '../../stylus/components/_windows.styl'

// Utilities
import {
  addOnceEventListener,
  convertToUnit
} from '../../util/helpers'

// Types
import Vue from 'vue'
import { VNode } from 'vue/types/vnode'

/* @vue/component */
export default Vue.extend({
  name: 'v-window',

  props: {
    mode: String,
    reverse: Boolean,
    vertical: Boolean,
    transition: String
  },

  data: () => ({
    height: undefined as undefined | string,
    isActive: false
  }),

  computed: {
    computedTransition (): string {
      if (this.transition) return this.transition

      const axis = this.vertical ? 'y' : 'x'
      const direction = this.reverse ? '-reverse' : ''

      return `v-window-${axis}${direction}-transition`
    }
  },

  methods: {
    onAfterEnter () {
      this.height = undefined
      this.isActive = false
    },
    onBeforeEnter () {
      this.isActive = true
    },
    onBeforeLeave (el: HTMLElement) {
      this.height = convertToUnit(el.clientHeight)
    },
    onEnter (el: HTMLElement, done: () => void) {
      addOnceEventListener(el, 'transitionend', done)

      requestAnimationFrame(() => {
        this.height = convertToUnit(el.clientHeight)
      })
    },
    genContainer (): VNode {
      return this.$createElement('div', {
        staticClass: 'v-window__container',
        class: {
          'v-window__container--is-active': this.isActive
        },
        style: {
          height: this.height
        }
      }, [this.genTransition()])
    },
    genTransition (): VNode {
      return this.$createElement('transition', {
        props: {
          name: this.computedTransition,
          mode: this.mode
        },
        on: {
          beforeEnter: this.onBeforeEnter,
          enter: this.onEnter,
          afterEnter: this.onAfterEnter,
          beforeLeave: this.onBeforeLeave
        }
      }, this.$slots.default)
    }
  },

  render (h): VNode {
    return h('div', {
      staticClass: 'v-window'
    }, [this.genContainer()])
  }
})
