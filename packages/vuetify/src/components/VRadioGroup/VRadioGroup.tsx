// Styles
import './VRadioGroup.sass'

// Components
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { VLabel } from '@/components/VLabel'
import { VSelectionControlGroup } from '@/components/VSelectionControlGroup'
import { filterControlProps, makeSelectionControlProps } from '@/components/VSelectionControl/VSelectionControl'

// Utility
import { computed, defineComponent } from 'vue'
import { filterInputAttrs, getUid, useRender } from '@/util'

export const VRadioGroup = defineComponent({
  name: 'VRadioGroup',

  inheritAttrs: false,

  props: {
    height: {
      type: [Number, String],
      default: 'auto',
    },

    ...makeVInputProps(),
    ...makeSelectionControlProps(),

    trueIcon: {
      type: String,
      default: '$radioOn',
    },
    falseIcon: {
      type: String,
      default: '$radioOff',
    },
    type: {
      type: String,
      default: 'radio',
    },
  },

  setup (props, { attrs, slots }) {
    const uid = getUid()
    const id = computed(() => props.id || `radio-group-${uid}`)

    useRender(() => {
      const [inputAttrs, controlAttrs] = filterInputAttrs(attrs)
      const [inputProps, _1] = filterInputProps(props)
      const [controlProps, _2] = filterControlProps(props)
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
          v-slots={{
            ...slots,
            default: ({
              isDisabled,
              isReadonly,
              isValid,
            }) => (
              <>
                { label && (
                  <VLabel
                    disabled={ isDisabled.value }
                    error={ isValid.value === false }
                    for={ id.value }
                  >
                    { label }
                  </VLabel>
                ) }

                <VSelectionControlGroup
                  { ...controlProps }
                  id={ id.value }
                  trueIcon={ props.trueIcon }
                  falseIcon={ props.falseIcon }
                  type={ props.type }
                  disabled={ isDisabled.value }
                  readonly={ isReadonly.value }
                  { ...controlAttrs }
                  v-slots={ slots }
                />
              </>
            ),
          }}
        />
      )
    })

    return {}
  },
})
