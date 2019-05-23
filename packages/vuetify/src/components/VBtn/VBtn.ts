// Styles
import './VBtn.sass'

// Extensions
import VSheet from '../VSheet'

// Components
import VProgressCircular from '../VProgressCircular'

// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable'
import { factory as ToggleableFactory } from '../../mixins/toggleable'
import Positionable from '../../mixins/positionable'
import Routable from '../../mixins/routable'
import Sizeable from '../../mixins/sizeable'

// Utilities
import { deprecate } from '../../util/console'

// Types
import { VNode } from 'vue'
import { PropValidator } from 'vue/types/options'
import mixins, { ExtractVue } from '../../util/mixins'
import { RippleOptions } from '../../directives/ripple'

const baseMixins = mixins(
  VSheet,
  Routable,
  Positionable,
  Sizeable,
  GroupableFactory('btnToggle'),
  ToggleableFactory('inputValue')
  /* @vue/component */
)
interface options extends ExtractVue<typeof baseMixins> {
  $el: HTMLElement
}

export default baseMixins.extend<options>().extend({
  name: 'v-btn',

  props: {
    activeClass: {
      type: String,
      default (): string | undefined {
        if (!this.btnToggle) return ''

        return this.btnToggle.activeClass
      }
    } as any as PropValidator<string>,
    block: Boolean,
    depressed: Boolean,
    fab: Boolean,
    /* @deprecate */
    flat: Boolean,
    icon: Boolean,
    loading: Boolean,
    outline: Boolean,
    outlined: Boolean,
    round: Boolean,
    rounded: Boolean,
    tag: {
      type: String,
      default: 'button'
    },
    text: Boolean,
    type: {
      type: String,
      default: 'button'
    },
    value: null as any as PropValidator<any>
  },

  data: () => ({
    proxyClass: 'v-btn--active'
  }),

  computed: {
    classes (): any {
      return {
        'v-btn': true,
        ...Routable.options.computed.classes.call(this),
        'v-btn--absolute': this.absolute,
        'v-btn--block': this.block,
        'v-btn--bottom': this.bottom,
        'v-btn--contained': this.contained,
        'v-btn--depressed': (this.depressed && !this.flat) || this.hasOutline,
        'v-btn--disabled': this.disabled,
        'v-btn--fab': this.fab || this.icon,
        'v-btn--fixed': this.fixed,
        'v-btn--flat': this.isFlat,
        'v-btn--icon': this.icon,
        'v-btn--left': this.left,
        'v-btn--loading': this.loading,
        'v-btn--outlined': this.hasOutline,
        'v-btn--right': this.right,
        'v-btn--round': this.isRound,
        'v-btn--rounded': this.round || this.rounded,
        'v-btn--router': this.to,
        'v-btn--text': this.text,
        'v-btn--top': this.top,
        ...this.themeClasses,
        ...this.groupClasses,
        ...this.elevationClasses,
        ...this.sizeableClasses
      }
    },
    contained (): boolean {
      return Boolean(
        !this.isFlat &&
        !this.depressed &&
        // Contained class only adds elevation
        // is not needed if user provides value
        !this.elevation
      )
    },
    computedRipple (): RippleOptions | boolean {
      const defaultRipple = this.icon || this.fab ? { circle: true } : true
      if (this.disabled) return false
      else return this.ripple != null ? this.ripple : defaultRipple
    },
    // TODO: remove deprecated
    hasOutline (): boolean {
      return this.outline || this.outlined
    },
    isFlat (): boolean {
      return Boolean(
        this.icon ||
        this.text ||
        this.flat ||
        this.hasOutline
      )
    },
    isRound (): boolean {
      return Boolean(
        this.icon ||
        this.fab
      )
    },
    styles (): object {
      return {
        ...this.measurableStyles
      }
    }
  },

  created () {
    /* istanbul ignore next */
    if (this.flat) deprecate('flat', 'text', this)
    /* istanbul ignore next */
    if (this.round) deprecate('round', 'rounded', this)
    /* istanbul ignore next */
    if (this.outline) deprecate('outline', 'outlined', this)
  },

  methods: {
    // Prevent focus to match md spec
    click (e: MouseEvent): void {
      !this.fab &&
      e.detail &&
      this.$el.blur()

      this.$emit('click', e)

      this.btnToggle && this.toggle()
    },
    genContent (): VNode {
      return this.$createElement('span', {
        staticClass: 'v-btn__content'
      }, this.$slots.default)
    },
    genLoader (): VNode {
      return this.$createElement('span', {
        class: 'v-btn__loader'
      }, this.$slots.loader || [this.$createElement(VProgressCircular, {
        props: {
          indeterminate: true,
          size: 23,
          width: 2
        }
      })])
    }
  },

  render (h): VNode {
    const children = [
      this.genContent(),
      this.loading && this.genLoader()
    ]
    const setColor = !this.isFlat ? this.setBackgroundColor : this.setTextColor
    const { tag, data } = this.generateRouteLink()

    if (tag === 'button') data.attrs!.type = this.type

    data.attrs!.value = ['string', 'number'].includes(typeof this.value)
      ? this.value
      : JSON.stringify(this.value)

    return h(tag, setColor(this.color, data), children)
  }
})
