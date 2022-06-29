/* eslint-disable complexity */

// Styles
import './VCard.sass'

// Components
import { VCardActions } from './VCardActions'
import { VCardItem } from './VCardItem'
import { VCardText } from './VCardText'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VImg } from '@/components/VImg'

// Directives
import { Ripple } from '@/directives/ripple'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { IconValue } from '@/composables/icons'
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLocationProps, useLocation } from '@/composables/location'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'

// Utilities
import { defineComponent, useRender } from '@/util'

export const VCard = defineComponent({
  name: 'VCard',

  directives: { Ripple },

  props: {
    appendAvatar: String,
    appendIcon: IconValue,
    disabled: Boolean,
    flat: Boolean,
    hover: Boolean,
    image: String,
    link: Boolean,
    prependAvatar: String,
    prependIcon: IconValue,
    ripple: Boolean,
    subtitle: String,
    text: String,
    title: String,

    ...makeThemeProps(),
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeLoaderProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeTagProps(),
    ...makeVariantProps({ variant: 'elevated' } as const),
  },

  setup (props, { attrs, slots }) {
    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { loaderClasses } = useLoader(props)
    const { locationStyles } = useLocation(props)
    const { positionClasses } = usePosition(props)
    const { roundedClasses } = useRounded(props)
    const link = useLink(props, attrs)

    useRender(() => {
      const Tag = (link.isLink.value) ? 'a' : props.tag
      const hasTitle = !!(slots.title || props.title)
      const hasSubtitle = !!(slots.subtitle || props.subtitle)
      const hasHeader = hasTitle || hasSubtitle
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon)
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon)
      const hasImage = !!(slots.image || props.image)
      const hasCardItem = hasHeader || hasPrepend || hasAppend
      const hasText = !!(slots.text || props.text)
      const isClickable = !props.disabled && (link.isClickable.value || props.link)

      return (
        <Tag
          class={[
            'v-card',
            {
              'v-card--disabled': props.disabled,
              'v-card--flat': props.flat,
              'v-card--hover': props.hover && !(props.disabled || props.flat),
              'v-card--link': isClickable,
            },
            themeClasses.value,
            borderClasses.value,
            colorClasses.value,
            densityClasses.value,
            elevationClasses.value,
            loaderClasses.value,
            positionClasses.value,
            roundedClasses.value,
            variantClasses.value,
          ]}
          style={[
            colorStyles.value,
            dimensionStyles.value,
            locationStyles.value,
          ]}
          href={ link.href.value }
          onClick={ isClickable && link.navigate }
          v-ripple={ isClickable }
        >
          { hasImage && (
            <VDefaultsProvider
              key="image"
              defaults={{
                VImg: {
                  cover: true,
                  src: props.image,
                },
              }}
            >
              <div class="v-card__image">
                { slots.image?.() ?? <VImg /> }
              </div>
            </VDefaultsProvider>
          ) }

          <LoaderSlot
            name="v-card"
            active={ !!props.loading }
            color={ typeof props.loading === 'boolean' ? undefined : props.loading }
            v-slots={{ default: slots.loader }}
          />

          { hasCardItem && (
            <VCardItem
              key="item"
              prependAvatar={ props.prependAvatar }
              prependIcon={ props.prependIcon }
              title={ props.title }
              subtitle={ props.subtitle }
              appendAvatar={ props.appendAvatar }
              appendIcon={ props.appendIcon }
            >
              {{
                default: slots.item,
                prepend: slots.prepend,
                title: slots.title,
                subtitle: slots.subtitle,
                append: slots.append,
              }}
            </VCardItem>
          ) }

          { hasText && (
            <VCardText key="text">
              { slots.text?.() ?? props.text }
            </VCardText>
          ) }

          { slots.default?.() }

          { slots.actions && (
            <VCardActions v-slots={{ default: slots.actions }} />
          ) }

          { genOverlays(isClickable, 'v-card') }
        </Tag>
      )
    })

    return {}
  },
})

export type VCard = InstanceType<typeof VCard>
