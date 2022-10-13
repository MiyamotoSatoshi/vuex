// Styles
import './VLocaleProvider.sass'

// Composables
import { provideLocale } from '@/composables/locale'

// Utilities
import { defineComponent, useRender } from '@/util'

export const VLocaleProvider = defineComponent({
  name: 'VLocaleProvider',

  props: {
    locale: String,
    fallbackLocale: String,
    messages: Object,
    rtl: {
      type: Boolean,
      default: undefined,
    },
  },

  setup (props, { slots }) {
    const { rtlClasses } = provideLocale(props)

    useRender(() => (
      <div
        class={[
          'v-locale-provider',
          rtlClasses.value,
        ]}
      >
        { slots.default?.() }
      </div>
    ))

    return {}
  },
})
