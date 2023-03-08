// Styles
import './VProgressCircular.sass'

// Composables
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useIntersectionObserver } from '@/composables/intersectionObserver'
import { useResizeObserver } from '@/composables/resizeObserver'
import { useTextColor } from '@/composables/color'

// Utilities
import { computed, ref, toRef, watchEffect } from 'vue'
import { convertToUnit, genericComponent, useRender } from '@/util'

// Types
import type { PropType } from 'vue'

export const VProgressCircular = genericComponent()({
  name: 'VProgressCircular',

  props: {
    bgColor: String,
    color: String,
    indeterminate: [Boolean, String] as PropType<boolean | 'disable-shrink'>,
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    rotate: {
      type: [Number, String],
      default: 0,
    },
    width: {
      type: [Number, String],
      default: 4,
    },

    ...makeSizeProps(),
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
  },

  setup (props, { slots }) {
    const MAGIC_RADIUS_CONSTANT = 20
    const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT

    const root = ref<HTMLElement>()

    const { themeClasses } = provideTheme(props)
    const { sizeClasses, sizeStyles } = useSize(props)
    const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))
    const { textColorClasses: underlayColorClasses, textColorStyles: underlayColorStyles } = useTextColor(toRef(props, 'bgColor'))
    const { intersectionRef, isIntersecting } = useIntersectionObserver()
    const { resizeRef, contentRect } = useResizeObserver()

    const normalizedValue = computed(() => Math.max(0, Math.min(100, parseFloat(props.modelValue))))
    const width = computed(() => Number(props.width))
    const size = computed(() => {
      // Get size from element if size prop value is small, large etc
      return sizeStyles.value
        ? Number(props.size)
        : contentRect.value
          ? contentRect.value.width
          : Math.max(width.value, 32)
    })
    const diameter = computed(() => (MAGIC_RADIUS_CONSTANT / (1 - width.value / size.value)) * 2)
    const strokeWidth = computed(() => width.value / size.value * diameter.value)
    const strokeDashOffset = computed(() => convertToUnit(((100 - normalizedValue.value) / 100) * CIRCUMFERENCE))

    watchEffect(() => {
      intersectionRef.value = root.value
      resizeRef.value = root.value
    })

    useRender(() => (
      <props.tag
        ref={ root }
        class={[
          'v-progress-circular',
          {
            'v-progress-circular--indeterminate': !!props.indeterminate,
            'v-progress-circular--visible': isIntersecting.value,
            'v-progress-circular--disable-shrink': props.indeterminate === 'disable-shrink',
          },
          themeClasses.value,
          sizeClasses.value,
          textColorClasses.value,
        ]}
        style={[
          sizeStyles.value,
          textColorStyles.value,
        ]}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={ props.indeterminate ? undefined : normalizedValue.value }
      >
        <svg
          style={{
            transform: `rotate(calc(-90deg + ${Number(props.rotate)}deg))`,
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={ `0 0 ${diameter.value} ${diameter.value}` }
        >
          <circle
            class={[
              'v-progress-circular__underlay',
              underlayColorClasses.value,
            ]}
            style={ underlayColorStyles.value }
            fill="transparent"
            cx="50%"
            cy="50%"
            r={ MAGIC_RADIUS_CONSTANT }
            stroke-width={ strokeWidth.value }
            stroke-dasharray={ CIRCUMFERENCE }
            stroke-dashoffset={ 0 }
          />

          <circle
            class="v-progress-circular__overlay"
            fill="transparent"
            cx="50%"
            cy="50%"
            r={ MAGIC_RADIUS_CONSTANT }
            stroke-width={ strokeWidth.value }
            stroke-dasharray={ CIRCUMFERENCE }
            stroke-dashoffset={ strokeDashOffset.value }
          />
        </svg>

        { slots.default && (
          <div class="v-progress-circular__content">
            { slots.default({ value: normalizedValue.value }) }
          </div>
        )}
      </props.tag>
    ))

    return {}
  },
})

export type VProgressCircular = InstanceType<typeof VProgressCircular>
