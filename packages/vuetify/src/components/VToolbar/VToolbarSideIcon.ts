// Components
import VAppBarNavIcon from '../VAppBar/VAppBarNavIcon'

// Utilities
import { deprecate } from '../../util/console'

// Types
import { VNode } from 'vue'

/* @vue/component */
export default VAppBarNavIcon.extend({
  name: 'v-app-bar-nav-icon',

  render (h, context): VNode {
    deprecate('<v-app-bar-nav-icon>', '<v-app-bar-nav-icon>', this)

    return VAppBarNavIcon.options.render.call(this, h, context)
  }
})
