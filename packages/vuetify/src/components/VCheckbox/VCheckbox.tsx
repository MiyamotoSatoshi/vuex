// Styles
import './VCheckbox.sass'

// Components
import { makeVCheckboxBtnProps, VCheckboxBtn } from './VCheckboxBtn'
import { makeVInputProps, VInput } from '@/components/VInput/VInput'

// Composables
import { useFocus } from '@/composables/focus'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed } from 'vue'
import { filterInputAttrs, genericComponent, getUid, omit, propsFactory, useRender } from '@/util'

// Types
import type { VSelectionControlSlots } from '../VSelectionControl/VSelectionControl'
import type { VInputSlots } from '@/components/VInput/VInput'

export type VCheckboxSlots = VInputSlots & VSelectionControlSlots

export const makeVCheckboxProps = propsFactory({
  ...makeVInputProps(),
  ...omit(makeVCheckboxBtnProps(), ['inline']),
}, 'VCheckbox')

export const VCheckbox = genericComponent<VCheckboxSlots>()({
  name: 'VCheckbox',

  inheritAttrs: false,

  props: makeVCheckboxProps(),

  emits: {
    'update:modelValue': (value: boolean) => true,
    'update:focused': (focused: boolean) => true,
  },

  setup (props, { attrs, slots }) {
    const model = useProxiedModel(props, 'modelValue')
    const { isFocused, focus, blur } = useFocus(props)

    const uid = getUid()
    const id = computed(() => props.id || `checkbox-${uid}`)

    useRender(() => {
      const [inputAttrs, controlAttrs] = filterInputAttrs(attrs)
      const [inputProps, _1] = VInput.filterProps(props)
      const [checkboxProps, _2] = VCheckboxBtn.filterProps(props)

      return (
        <VInput
          class={[
            'v-checkbox',
            props.class,
          ]}
          { ...inputAttrs }
          { ...inputProps }
          v-model={ model.value }
          id={ id.value }
          focused={ isFocused.value }
          style={ props.style }
        >
          {{
            ...slots,
            default: ({
              id,
              messagesId,
              isDisabled,
              isReadonly,
            }) => (
              <VCheckboxBtn
                { ...checkboxProps }
                id={ id.value }
                aria-describedby={ messagesId.value }
                disabled={ isDisabled.value }
                readonly={ isReadonly.value }
                { ...controlAttrs }
                v-model={ model.value }
                onFocus={ focus }
                onBlur={ blur }
                v-slots={ slots }
              />
            ),
          }}
        </VInput>
      )
    })

    return {}
  },
})

export type VCheckbox = InstanceType<typeof VCheckbox>
