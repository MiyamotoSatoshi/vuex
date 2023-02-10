// Styles
import './VRadioGroup.sass'

// Components
import { filterControlProps } from '@/components/VSelectionControl/VSelectionControl'
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { makeSelectionControlGroupProps, VSelectionControlGroup } from '@/components/VSelectionControlGroup/VSelectionControlGroup'
import { VLabel } from '@/components/VLabel'

// Composables
import { IconValue } from '@/composables/icons'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed } from 'vue'
import { filterInputAttrs, genericComponent, getUid, omit, useRender } from '@/util'

// Types
import type { VInputSlots } from '@/components/VInput/VInput'
import type { VSelectionControlSlots } from '@/components/VSelectionControl/VSelectionControl'

export type VRadioGroupSlots = VInputSlots & VSelectionControlSlots

export const VRadioGroup = genericComponent<VRadioGroupSlots>()({
  name: 'VRadioGroup',

  inheritAttrs: false,

  props: {
    height: {
      type: [Number, String],
      default: 'auto',
    },

    ...makeVInputProps(),
    ...omit(makeSelectionControlGroupProps(), ['multiple']),

    trueIcon: {
      type: IconValue,
      default: '$radioOn',
    },
    falseIcon: {
      type: IconValue,
      default: '$radioOff',
    },
    type: {
      type: String,
      default: 'radio',
    },
  },

  emits: {
    'update:modelValue': (val: any) => true,
  },

  setup (props, { attrs, slots }) {
    const uid = getUid()
    const id = computed(() => props.id || `radio-group-${uid}`)
    const model = useProxiedModel(props, 'modelValue')

    useRender(() => {
      const [inputAttrs, controlAttrs] = filterInputAttrs(attrs)
      const [inputProps, _1] = filterInputProps(props)
      const [controlProps, _2] = filterControlProps({
        ...props,
        multiple: false as const,
      })
      const label = slots.label
        ? slots.label({
          label: props.label,
          props: { for: id.value },
        })
        : props.label

      return (
        <VInput
          class="v-radio-group"
          { ...inputAttrs }
          { ...inputProps }
          v-model={ model.value }
          id={ id.value }
        >
          {{
            ...slots,
            default: ({
              id,
              messagesId,
              isDisabled,
              isReadonly,
            }) => (
              <>
                { label && (
                  <VLabel id={ id.value }>
                    { label }
                  </VLabel>
                ) }

                <VSelectionControlGroup
                  { ...controlProps }
                  id={ id.value }
                  aria-describedby={ messagesId.value }
                  defaultsTarget="VRadio"
                  trueIcon={ props.trueIcon }
                  falseIcon={ props.falseIcon }
                  type={ props.type }
                  disabled={ isDisabled.value }
                  readonly={ isReadonly.value }
                  aria-labelledby={ label ? id.value : undefined }
                  { ...controlAttrs }
                  v-model={ model.value }
                  v-slots={ slots }
                />
              </>
            ),
          }}
        </VInput>
      )
    })

    return {}
  },
})

export type VRadioGroup = InstanceType<typeof VRadioGroup>
