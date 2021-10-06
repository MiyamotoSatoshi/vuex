// Components
import { VTimelineSymbol } from './shared'
import { VTimelineDivider } from './VTimelineDivider'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeSizeProps } from '@/composables/size'
import { makeElevationProps } from '@/composables/elevation'
import { makeRoundedProps } from '@/composables/rounded'

// Utilities
import { inject, ref, watch } from 'vue'
import { convertToUnit, defineComponent } from '@/util'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'

export const VTimelineItem = defineComponent({
  name: 'VTimelineItem',

  props: {
    dotColor: String,
    fillDot: Boolean,
    hideDot: Boolean,
    hideOpposite: {
      type: Boolean,
      default: undefined,
    },
    icon: String,
    iconColor: String,

    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeSizeProps(),
    ...makeTagProps(),
    ...makeDimensionProps(),
  },

  setup (props, { slots }) {
    const timeline = inject(VTimelineSymbol)

    if (!timeline) throw new Error('[Vuetify] Could not find v-timeline provider')

    const { dimensionStyles } = useDimension(props)

    const dotSize = ref(0)
    const dotRef = ref<VTimelineDivider>()
    watch(dotRef, newValue => {
      if (!newValue) return
      dotSize.value = newValue.$el.querySelector('.v-timeline-divider__dot')?.getBoundingClientRect().width ?? 0
    }, {
      flush: 'post',
    })

    return () => (
      <div
        class={[
          'v-timeline-item',
          {
            'v-timeline-item--fill-dot': props.fillDot,
          },
        ]}
        style={{
          // @ts-expect-error: broken vue types
          '--v-timeline-dot-size': convertToUnit(dotSize.value),
        }}
      >
        <div
          class="v-timeline-item__body"
          style={ dimensionStyles.value }
        >
          { slots.default?.() }
        </div>

        <VTimelineDivider
          ref={ dotRef }
          hideDot={ props.hideDot }
          icon={ props.icon }
          iconColor={ props.iconColor }
          size={ props.size }
          elevation={ props.elevation }
          dotColor={ props.dotColor }
          fillDot={ props.fillDot }
          rounded={ props.rounded }
          v-slots={{ default: slots.icon }}
        />

        { timeline.density.value !== 'compact' && (
          <div class="v-timeline-item__opposite">
            { !props.hideOpposite && slots.opposite?.() }
          </div>
        ) }
      </div>
    )
  },
})
