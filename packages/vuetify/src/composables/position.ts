// Utilities
import type { PropType } from 'vue'
import { computed } from 'vue'
import { convertToUnit } from '@/util/helpers'
import propsFactory from '@/util/propsFactory'

// Types
const positionValues = ['static', 'relative', 'fixed', 'absolute', 'sticky'] as const

type Position = typeof positionValues[number]

export interface PositionProps {
  bottom?: boolean | number | string
  left?: boolean | number | string
  position?: Position
  right?: boolean | number | string
  top?: boolean | number | string
}

// Composables
export const makePositionProps = propsFactory({
  bottom: [Boolean, Number, String],
  left: [Boolean, Number, String],
  position: {
    type: String as PropType<Position>,
    validator: /* istanbul ignore next */ (v: any) => positionValues.includes(v),
  },
  right: [Boolean, Number, String],
  top: [Boolean, Number, String],
})

export function usePosition (props: PositionProps) {
  const targets = ['top', 'right', 'bottom', 'left'] as const

  const positionClasses = computed(() => {
    return props.position ? `position-${props.position}` : undefined
  })

  const positionStyles = computed(() => {
    const styles: Partial<Record<typeof targets[number], string>> = {}

    for (const target of targets) {
      const prop = props[target]

      if (prop == null || prop === false) continue

      styles[target] = convertToUnit(prop === true ? '0' : String(prop))
    }

    return styles
  })

  return { positionClasses, positionStyles }
}
