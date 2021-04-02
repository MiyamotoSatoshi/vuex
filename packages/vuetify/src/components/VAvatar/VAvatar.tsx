// Styles
import './VAvatar.sass'

// Composables
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'

// Utilities
import { defineComponent, toRef } from 'vue'
import { makeProps } from '@/util'

export default defineComponent({
  name: 'VAvatar',

  props: makeProps({
    color: String,
    left: Boolean,
    right: Boolean,
    ...makeRoundedProps(),
    ...makeSizeProps(),
    ...makeTagProps(),
  }),

  setup (props, { slots }) {
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
    const { roundedClasses } = useRounded(props, 'v-avatar')
    const { sizeClasses, sizeStyles } = useSize(props, 'v-avatar')

    return () => (
      <props.tag
        class={[
          'v-avatar',
          {
            'v-avatar--left': props.left,
            'v-avatar--right': props.right,
          },
          backgroundColorClasses.value,
          roundedClasses.value,
          sizeClasses.value,
        ]}
        style={[
          backgroundColorStyles.value,
          sizeStyles.value,
        ]}
        v-slots={ slots }
      />
    )
  },
})
