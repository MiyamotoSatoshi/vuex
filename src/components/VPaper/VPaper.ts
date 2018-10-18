// Styles
import '../../stylus/components/_paper.styl'

// Mixins
import Colorable from '../../mixins/colorable'
import Elevatable from '../../mixins/elevatable'
import Measurable from '../../mixins/measurable'
import Themeable from '../../mixins/themeable'

// Helpers
import { convertToUnit } from '../../util/helpers'
import mixins from '../../util/mixins'

// Types
import { VNode } from 'vue'

/* @vue/component */
export default mixins(
  Colorable,
  Elevatable,
  Measurable,
  Themeable
).extend({
  name: 'v-paper',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    tile: Boolean
  },

  computed: {
    classes (): object {
      return {
        'v-paper': true,
        'v-paper--tile': this.tile,
        ...this.themeClasses,
        ...this.elevationClasses
      }
    },
    styles (): object {
      return {
        height: convertToUnit(this.height),
        maxHeight: convertToUnit(this.maxHeight),
        maxWidth: convertToUnit(this.maxWidth),
        width: convertToUnit(this.width)
      }
    }
  },

  render (h): VNode {
    const data = {
      class: this.classes,
      style: this.styles
    }

    return h(
      this.tag,
      this.setBackgroundColor(this.color, data),
      this.$slots.default
    )
  }
})
