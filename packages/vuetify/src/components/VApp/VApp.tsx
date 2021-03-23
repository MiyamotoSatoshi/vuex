// Styles
import './VApp.sass'

// Composables
import { useTheme } from '@/composables/theme'
import { createLayout, makeLayoutProps } from '@/composables/layout'

// Utilities
import { defineComponent } from 'vue'
import makeProps from '@/util/makeProps'

export default defineComponent({
  name: 'VApp',

  props: makeProps({
    theme: String,
    ...makeLayoutProps(),
  }),

  setup (props, { slots }) {
    const { themeClasses } = useTheme()
    const { layoutClasses } = createLayout(props)

    return () => (
      <div
        class={[
          'v-application',
          themeClasses.value,
          layoutClasses.value,
        ]}
        data-app="true"
      >
        <div class="v-application__wrap">
          { slots.default?.() }
        </div>
      </div>
    )
  },
})
