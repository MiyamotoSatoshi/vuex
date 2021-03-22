// Composables
import { makeLayoutItemProps, useLayoutItem } from '@/composables/layout'

// Utilities
import { toRef, defineComponent, computed } from 'vue'
import makeProps from '@/util/makeProps'

// Types
import type { Prop } from 'vue'

export default defineComponent({
  name: 'VLayoutItem',

  props: makeProps({
    position: {
      type: String,
      required: true,
    } as Prop<'top' | 'right' | 'bottom' | 'left'>,
    ...makeLayoutItemProps(),
  }),

  setup (props, { slots }) {
    const styles = useLayoutItem(
      props.name,
      toRef(props, 'priority'),
      computed(() => props.position ?? 'left'),
      toRef(props, 'size')
    )

    return () => (
      <div style={ styles.value } v-slots={ slots } />
    )
  },
})
