// Styles
import './VTimeline.sass'

// Components
import { VTimelineItem } from './VTimelineItem'

// Composables
import { makeTagProps } from '@/composables/tag'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeThemeProps, useTheme } from '@/composables/theme'

// Helpers
import { computed, provide, toRef } from 'vue'
import { convertToUnit, defineComponent } from '@/util'
import { VTimelineSymbol } from './shared'

// Types
import type { Prop } from 'vue'

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineSide = 'before' | 'after' | undefined

export const VTimeline = defineComponent({
  name: 'VTimeline',

  props: {
    direction: {
      type: String,
      default: 'vertical',
      validator: (v: any) => ['vertical', 'horizontal'].includes(v),
    } as Prop<TimelineDirection>,
    side: {
      type: String,
      validator: (v: any) => v == null || ['start', 'end'].includes(v),
    } as Prop<TimelineSide>,
    lineInset: {
      type: [String, Number],
      default: 0,
    },
    lineThickness: {
      type: [String, Number],
      default: 2,
    },
    lineColor: String,
    truncateLine: {
      type: String,
      default: 'start',
      validator: (v: any) => ['none', 'start', 'end', 'both'].includes(v),
    },

    ...makeDensityProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
  },

  setup (props, { slots }) {
    const { themeClasses } = useTheme(props)
    const { densityClasses } = useDensity(props)

    provide(VTimelineSymbol, {
      density: toRef(props, 'density'),
      lineColor: toRef(props, 'lineColor'),
    })

    const sideClass = computed(() => {
      const side = props.side ? props.side : props.density !== 'default' ? 'end' : null

      return side && `v-timeline--side-${side}`
    })

    return () => (
      <props.tag
        class={[
          'v-timeline',
          `v-timeline--${props.direction}`,
          {
            'v-timeline--inset-line': !!props.lineInset,
            'v-timeline--truncate-line-end': props.truncateLine === 'end' || props.truncateLine === 'both',
          },
          themeClasses.value,
          densityClasses.value,
          sideClass.value,
        ]}
        style={{
          '--v-timeline-line-thickness': convertToUnit(props.lineThickness),
          '--v-timeline-line-inset': convertToUnit(props.lineInset || undefined),
        }}
      >
        { (props.truncateLine === 'none' || props.truncateLine === 'end') && (
          <VTimelineItem hideDot />
        ) }

        { slots.default?.() }
      </props.tag>
    )
  },
})
