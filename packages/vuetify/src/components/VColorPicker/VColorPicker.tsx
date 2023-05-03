// Styles
import './VColorPicker.sass'

// Components
import { makeVSheetProps, VSheet } from '@/components/VSheet/VSheet'
import { VColorPickerCanvas } from './VColorPickerCanvas'
import { VColorPickerEdit } from './VColorPickerEdit'
import { VColorPickerPreview } from './VColorPickerPreview'
import { VColorPickerSwatches } from './VColorPickerSwatches'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { provideDefaults } from '@/composables/defaults'
import { useRtl } from '@/composables/locale'

// Utilities
import { defineComponent, HSVtoCSS, omit, useRender } from '@/util'
import { extractColor, modes, nullColor, parseColor } from './util'
import { onMounted, ref } from 'vue'

// Types
import type { PropType } from 'vue'
import type { HSV } from '@/util'

export const VColorPicker = defineComponent({
  name: 'VColorPicker',

  props: {
    canvasHeight: {
      type: [String, Number],
      default: 150,
    },
    disabled: Boolean,
    dotSize: {
      type: [Number, String],
      default: 10,
    },
    hideCanvas: Boolean,
    hideSliders: Boolean,
    hideInputs: Boolean,
    mode: {
      type: String,
      default: 'rgba',
      validator: (v: string) => Object.keys(modes).includes(v),
    },
    modes: {
      type: Array as PropType<string[]>,
      default: () => Object.keys(modes),
      validator: (v: any) => Array.isArray(v) && v.every(m => Object.keys(modes).includes(m)),
    },
    showSwatches: Boolean,
    swatches: Array as PropType<string[][]>,
    swatchesMaxHeight: {
      type: [Number, String],
      default: 150,
    },
    modelValue: {
      type: [Object, String] as PropType<Record<string, unknown> | string | undefined | null>,
    },

    ...omit(makeVSheetProps({ width: 300 }), [
      'height',
      'location',
      'minHeight',
      'maxHeight',
      'minWidth',
      'maxWidth',
    ]),
  },

  emits: {
    'update:modelValue': (color: any) => true,
    'update:mode': (mode: string) => true,
  },

  setup (props) {
    const mode = useProxiedModel(props, 'mode')
    const lastPickedColor = ref<HSV | null>(null)
    const currentColor = useProxiedModel(
      props,
      'modelValue',
      undefined,
      v => {
        let c = parseColor(v)

        if (!c) return null

        if (lastPickedColor.value) {
          c = { ...c, h: lastPickedColor.value.h }
          lastPickedColor.value = null
        }

        return c
      },
      v => {
        if (!v) return null

        return extractColor(v, props.modelValue)
      }
    )
    const { rtlClasses } = useRtl()

    const updateColor = (hsva: HSV) => {
      currentColor.value = hsva
      lastPickedColor.value = hsva
    }

    onMounted(() => {
      if (!props.modes.includes(mode.value)) mode.value = props.modes[0]
    })

    provideDefaults({
      VSlider: {
        color: undefined,
        trackColor: undefined,
        trackFillColor: undefined,
      },
    })

    useRender(() => {
      const [sheetProps] = VSheet.filterProps(props)

      return (
        <VSheet
          rounded={ props.rounded }
          elevation={ props.elevation }
          theme={ props.theme }
          class={[
            'v-color-picker',
            rtlClasses.value,
            props.class,
          ]}
          style={[
            {
              '--v-color-picker-color-hsv': HSVtoCSS({ ...(currentColor.value ?? nullColor), a: 1 }),
            },
            props.style,
          ]}
          { ...sheetProps }
          maxWidth={ props.width }
        >
          { !props.hideCanvas && (
            <VColorPickerCanvas
              key="canvas"
              color={ currentColor.value }
              onUpdate:color={ updateColor }
              disabled={ props.disabled }
              dotSize={ props.dotSize }
              width={ props.width }
              height={ props.canvasHeight }
            />
          )}

          { (!props.hideSliders || !props.hideInputs) && (
            <div key="controls" class="v-color-picker__controls">
              { !props.hideSliders && (
                <VColorPickerPreview
                  key="preview"
                  color={ currentColor.value }
                  onUpdate:color={ updateColor }
                  hideAlpha={ !mode.value.endsWith('a') }
                  disabled={ props.disabled }
                />
              )}

              { !props.hideInputs && (
                <VColorPickerEdit
                  key="edit"
                  modes={ props.modes }
                  mode={ mode.value }
                  onUpdate:mode={ m => mode.value = m }
                  color={ currentColor.value }
                  onUpdate:color={ updateColor }
                  disabled={ props.disabled }
                />
              )}
            </div>
          )}

          { props.showSwatches && (
            <VColorPickerSwatches
              key="swatches"
              color={ currentColor.value }
              onUpdate:color={ updateColor }
              maxHeight={ props.swatchesMaxHeight }
              swatches={ props.swatches }
              disabled={ props.disabled }
            />
          )}
        </VSheet>
      )
    })

    return {}
  },
})

export type VColorPicker = InstanceType<typeof VColorPicker>
