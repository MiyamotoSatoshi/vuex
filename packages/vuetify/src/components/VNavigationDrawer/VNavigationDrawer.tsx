// Styles
import './VNavigationDrawer.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { provideDefaults } from '@/composables/defaults'
import { useBackgroundColor } from '@/composables/color'
import { useDisplay } from '@/composables/display'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useRouter } from '@/composables/router'
import { useRtl } from '@/composables'
import { useSsrBoot } from '@/composables/ssrBoot'
import { useSticky } from './sticky'
import { useTouch } from './touch'

// Utilities
import { computed, onBeforeMount, ref, toRef, Transition, watch } from 'vue'
import { convertToUnit, defineComponent, toPhysical, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

const locations = ['start', 'end', 'left', 'right', 'bottom'] as const

export const VNavigationDrawer = defineComponent({
  name: 'VNavigationDrawer',

  props: {
    color: String,
    disableResizeWatcher: Boolean,
    disableRouteWatcher: Boolean,
    expandOnHover: Boolean,
    floating: Boolean,
    modelValue: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    permanent: Boolean,
    rail: Boolean,
    railWidth: {
      type: [Number, String],
      default: 56,
    },
    scrim: {
      type: [String, Boolean],
      default: true,
    },
    image: String,
    temporary: Boolean,
    touchless: Boolean,
    width: {
      type: [Number, String],
      default: 256,
    },
    location: {
      type: String as PropType<typeof locations[number]>,
      default: 'start',
      validator: (value: any) => locations.includes(value),
    },
    sticky: Boolean,

    ...makeBorderProps(),
    ...makeElevationProps(),
    ...makeLayoutItemProps(),
    ...makeRoundedProps(),
    ...makeTagProps({ tag: 'nav' }),
    ...makeThemeProps(),
  },

  emits: {
    'update:modelValue': (val: boolean) => true,
  },

  setup (props, { attrs, slots }) {
    const { isRtl } = useRtl()
    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
    const { elevationClasses } = useElevation(props)
    const { mobile } = useDisplay()
    const { roundedClasses } = useRounded(props)
    const router = useRouter()
    const isActive = useProxiedModel(props, 'modelValue', null, v => !!v)
    const { ssrBootStyles } = useSsrBoot()

    const rootEl = ref<HTMLElement>()
    const isHovering = ref(false)

    const width = computed(() => {
      return (props.rail && props.expandOnHover && isHovering.value)
        ? Number(props.width)
        : Number(props.rail ? props.railWidth : props.width)
    })
    const location = computed(() => {
      return toPhysical(props.location, isRtl.value) as 'left' | 'right' | 'bottom'
    })
    const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary))
    const isSticky = computed(() =>
      props.sticky &&
      !isTemporary.value &&
      location.value !== 'bottom'
    )

    if (!props.disableResizeWatcher) {
      watch(isTemporary, val => !props.permanent && (isActive.value = !val))
    }

    if (!props.disableRouteWatcher && router) {
      watch(router.currentRoute, () => isTemporary.value && (isActive.value = false))
    }

    watch(() => props.permanent, val => {
      if (val) isActive.value = true
    })

    onBeforeMount(() => {
      if (props.modelValue != null || isTemporary.value) return

      isActive.value = props.permanent || !mobile.value
    })

    const { isDragging, dragProgress, dragStyles } = useTouch({
      isActive,
      isTemporary,
      width,
      touchless: toRef(props, 'touchless'),
      position: location,
    })

    const layoutSize = computed(() => {
      const size = isTemporary.value ? 0
        : props.rail && props.expandOnHover ? Number(props.railWidth)
        : width.value

      return isDragging.value ? size * dragProgress.value : size
    })

    const { layoutItemStyles, layoutRect, layoutItemScrimStyles } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: location,
      layoutSize,
      elementSize: width,
      active: computed(() => isActive.value || isDragging.value),
      disableTransitions: computed(() => isDragging.value),
      absolute: computed(() =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        props.absolute || (isSticky.value && typeof isStuck.value !== 'string')
      ),
    })

    const { isStuck, stickyStyles } = useSticky({ rootEl, isSticky, layoutItemStyles })

    const scrimColor = useBackgroundColor(computed(() => {
      return typeof props.scrim === 'string' ? props.scrim : null
    }))
    const scrimStyles = computed(() => ({
      ...isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: 'none',
      } : undefined,
      ...layoutRect.value ? {
        left: convertToUnit(layoutRect.value.left),
        right: convertToUnit(layoutRect.value.right),
        top: convertToUnit(layoutRect.value.top),
        bottom: convertToUnit(layoutRect.value.bottom),
      } : undefined,
      ...layoutItemScrimStyles.value,
    }))

    provideDefaults({
      VList: {
        bgColor: 'transparent',
      },
    })

    useRender(() => {
      const hasImage = (slots.image || props.image)

      return (
        <>
          <props.tag
            ref={ rootEl }
            onMouseenter={ () => (isHovering.value = true) }
            onMouseleave={ () => (isHovering.value = false) }
            class={[
              'v-navigation-drawer',
              `v-navigation-drawer--${location.value}`,
              {
                'v-navigation-drawer--expand-on-hover': props.expandOnHover,
                'v-navigation-drawer--floating': props.floating,
                'v-navigation-drawer--is-hovering': isHovering.value,
                'v-navigation-drawer--rail': props.rail,
                'v-navigation-drawer--temporary': isTemporary.value,
                'v-navigation-drawer--active': isActive.value,
                'v-navigation-drawer--sticky': isSticky.value,
              },
              themeClasses.value,
              backgroundColorClasses.value,
              borderClasses.value,
              elevationClasses.value,
              roundedClasses.value,
            ]}
            style={[
              backgroundColorStyles.value,
              layoutItemStyles.value,
              dragStyles.value,
              ssrBootStyles.value,
              stickyStyles.value,
            ]}
            { ...attrs }
          >
            { hasImage && (
              <div key="image" class="v-navigation-drawer__img">
                { slots.image
                  ? slots.image?.({ image: props.image })
                  : (<img src={ props.image } alt="" />)
                }
              </div>
            )}

            { slots.prepend && (
              <div class="v-navigation-drawer__prepend">
                { slots.prepend?.() }
              </div>
            )}

            <div class="v-navigation-drawer__content">
              { slots.default?.() }
            </div>

            { slots.append && (
              <div class="v-navigation-drawer__append">
                { slots.append?.() }
              </div>
            )}
          </props.tag>

          <Transition name="fade-transition">
            { isTemporary.value && (isDragging.value || isActive.value) && !!props.scrim && (
              <div
                class={['v-navigation-drawer__scrim', scrimColor.backgroundColorClasses.value]}
                style={[scrimStyles.value, scrimColor.backgroundColorStyles.value]}
                onClick={ () => isActive.value = false }
              />
            )}
          </Transition>
        </>
      )
    })

    return {
      isStuck,
    }
  },
})

export type VNavigationDrawer = InstanceType<typeof VNavigationDrawer>
