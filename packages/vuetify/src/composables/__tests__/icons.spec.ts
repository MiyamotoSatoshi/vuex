// Composables
import { useIcon } from '../icons'

// Utilities
import { defineComponent } from 'vue'
import { createVuetify } from '@/framework'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from '@jest/globals'

describe('icons.tsx', () => {
  const Component = defineComponent({
    props: {
      icon: String,
    },
    setup (props) {
      const { iconData } = useIcon(props)

      return () => iconData.value.icon
    },
  })

  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      sets: {
        custom: {
          component: () => null,
        },
      },
    },
  })

  it.each([
    // Default icon set.
    ['success', 'success'],
    ['https://example.com/icon.svg', 'https://example.com/icon.svg'],
    // MDI icon set.
    ['mdi:success', 'success'],
    // Custom icon set.
    ['custom:https://example.com/icon.png', 'https://example.com/icon.png'],
  ])('should return the correct icon name', (icon, expected) => {
    const wrapper = mount(Component, {
      props: {
        icon,
      },
      global: {
        plugins: [vuetify],
      },
    })

    expect(wrapper.text()).toEqual(expected)
  })
})
