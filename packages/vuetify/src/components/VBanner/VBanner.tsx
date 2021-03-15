// Styles
import './VBanner.sass'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeBorderRadiusProps, useBorderRadius } from '@/composables/border-radius'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeTagProps } from '@/composables/tag'
import { useTheme } from '@/composables/theme'

// Utilities
import { defineComponent } from 'vue'
import makeProps from '@/util/makeProps'

export default defineComponent({
  name: 'VBanner',

  props: makeProps({
    ...makeBorderProps(),
    ...makeBorderRadiusProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makePositionProps(),
    ...makeTagProps(),
    avatar: String,
    icon: String,
    mobile: Boolean,
    singleLine: Boolean,
    sticky: Boolean,
  }),

  setup (props, { slots }) {
    const { borderClasses } = useBorder(props, 'v-banner')
    const { borderRadiusClasses } = useBorderRadius(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { positionClasses, positionStyles } = usePosition(props, 'v-banner')
    const { themeClasses } = useTheme()

    return () => {
      const hasThumbnail = (!!props.avatar || !!props.icon || !!slots.thumbnail)

      return (
        <props.tag
          class={[
            'v-banner',
            {
              'v-banner--has-thumbnail': hasThumbnail,
              'v-banner--is-mobile': props.mobile,
              'v-banner--single-line': props.singleLine,
              'v-banner--sticky': props.sticky,
            },
            themeClasses.value,
            borderClasses.value,
            borderRadiusClasses.value,
            elevationClasses.value,
            positionClasses.value,
          ]}
          style={[
            dimensionStyles.value,
            positionStyles.value,
          ]}
          role="banner"
        >
          <div class="v-banner__sizer">
            <div class="v-banner__content">
              { hasThumbnail && (
                <div class="v-banner__thumbnail">
                  { slots.thumbnail?.() }
                  { props.avatar && (
                    <img class="v-banner__avatar" src={ props.avatar } alt=""></img>
                  )}
                  { props.icon && <i class="v-banner__icon">{ props.icon }</i> }
                </div>
              )}
              <div class="v-banner__text">{ slots.default?.() }</div>
            </div>
            { slots.actions && (
              <div class="v-banner__actions">{ slots.actions?.() }</div>
            )}
          </div>
        </props.tag>
      )
    }
  },
})
