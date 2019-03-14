// Styles
import './VListGroup.sass'

// Components
import VIcon from '../VIcon'
import VList from './VList'
import VListItem from './VListItem'
import VListItemIcon from './VListItemIcon'

// Mixins
import Bootable from '../../mixins/bootable'
import Toggleable from '../../mixins/toggleable'
import { inject as RegistrableInject } from '../../mixins/registrable'

// Directives
import Ripple from '../../directives/ripple'

// Transitions
import { VExpandTransition } from '../transitions'

// Utils
import mixins, { ExtractVue } from '../../util/mixins'
import { keyCodes } from '../../util/helpers'

// Types
import { VNode } from 'vue'
import { Route } from 'vue-router'

const baseMixins = mixins(
  Bootable,
  RegistrableInject('list'),
  Toggleable
)

type VListInstance = InstanceType<typeof VList>

interface options extends ExtractVue<typeof baseMixins> {
  list: VListInstance
  $refs: {
    group: HTMLElement
  }
  $route: Route
}

export default baseMixins.extend<options>().extend({
  name: 'v-list-group',

  directives: { Ripple },

  props: {
    activeClass: {
      type: String,
      default: 'primary--text'
    },
    appendIcon: {
      type: String,
      default: '$vuetify.icons.expand'
    },
    disabled: Boolean,
    group: String,
    noAction: Boolean,
    prependIcon: String,
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    subGroup: Boolean
  },

  computed: {
    classes (): object {
      return {
        'v-list-group--active': this.isActive,
        'v-list-group--disabled': this.disabled,
        'v-list-group--no-action': this.noAction,
        'v-list-group--sub-group': this.subGroup
      }
    }
  },

  watch: {
    isActive (val: boolean) {
      /* istanbul ignore else */
      if (!this.subGroup && val) {
        this.list && this.list.listClick(this._uid)
      }
    },
    $route: 'onRouteChange'
  },

  mounted () {
    this.list && this.list.register(this)

    if (this.group &&
      this.$route &&
      this.value == null
    ) {
      this.isActive = this.matchRoute(this.$route.path)
    }
  },

  beforeDestroy () {
    this.list && this.list.unregister(this)
  },

  methods: {
    click () {
      if (this.disabled) return

      this.isActive = !this.isActive
    },
    genIcon (icon: string | false): VNode {
      return this.$createElement(VIcon, icon)
    },
    genAppendIcon (): VNode | null {
      const icon = !this.subGroup ? this.appendIcon : false

      if (!icon && !this.$slots.appendIcon) return null

      return this.$createElement(VListItemIcon, {
        staticClass: 'v-list-group__header__append-icon'
      }, [
        this.$slots.appendIcon || this.genIcon(icon)
      ])
    },
    genHeader (): VNode {
      return this.$createElement(VListItem, {
        staticClass: 'v-list-group__header',
        class: {
          [this.activeClass]: this.isActive
        },
        directives: [{
          name: 'ripple',
          value: this.ripple
        }],
        on: {
          ...this.$listeners,
          click: this.click,
          keydown: (e: KeyboardEvent) => {
            /* istanbul ignore else */
            if (e.keyCode === keyCodes.enter) this.click()
          }
        }
      }, [
        this.genPrependIcon(),
        this.$slots.activator,
        this.genAppendIcon()
      ])
    },
    genItems (): VNode {
      return this.$createElement('div', {
        staticClass: 'v-list-group__items',
        directives: [{
          name: 'show',
          value: this.isActive
        }]
      }, [
        this.$createElement('div', this.showLazyContent(this.$slots.default))
      ])
    },
    genPrependIcon (): VNode | null {
      const icon = this.prependIcon
        ? this.prependIcon
        : this.subGroup
          ? '$vuetify.icons.subgroup'
          : false

      if (!icon && !this.$slots.prependIcon) return null

      return this.$createElement(VListItemIcon, {
        staticClass: 'v-list-group__header__prepend-icon'
      }, [
        this.$slots.prependIcon || this.genIcon(icon)
      ])
    },
    onRouteChange (to: Route) {
      /* istanbul ignore if */
      if (!this.group) return

      const isActive = this.matchRoute(to.path)

      /* istanbul ignore else */
      if (isActive && this.isActive !== isActive) {
        this.list && this.list.listClick(this._uid)
      }

      this.isActive = isActive
    },
    toggle (uid: number) {
      this.isActive = this._uid === uid
    },
    matchRoute (to: string) {
      return to.match(this.group) !== null
    }
  },

  render (h): VNode {
    return h('div', {
      staticClass: 'v-list-group',
      class: this.classes
    }, [
      this.genHeader(),
      h(VExpandTransition, [this.genItems()])
    ])
  }
})
