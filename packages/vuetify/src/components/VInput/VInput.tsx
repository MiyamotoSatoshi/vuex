// Styles
import './VInput.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VMessages } from '@/components/VMessages'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeValidationProps, useValidation } from '@/composables/validation'

// Utilities
import { computed, provide, toRef } from 'vue'
import { genericComponent, getUid, pick, propsFactory, useRender } from '@/util'

// Types
import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'
import type { MakeSlots } from '@/util'

export interface VInputSlot {
  id: ComputedRef<string>
  isDisabled: ComputedRef<boolean>
  isFocused: Ref<boolean>
  isReadonly: ComputedRef<boolean>
  isPristine: Ref<boolean>
  isValid: ComputedRef<boolean | null>
  isValidating: Ref<boolean>
  reset: () => void
  resetValidation: () => void
  validate: () => void
}

export const VInputSymbol = 'VInput' as any as InjectionKey<ComputedRef<VInputSlot>>

export const makeVInputProps = propsFactory({
  id: String,
  appendIcon: String,
  prependIcon: String,
  hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
  hint: String,
  messages: {
    type: [Array, String] as PropType<string | string[]>,
    default: () => ([]),
  },
  persistentHint: Boolean,
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
    validator: (v: any) => ['horizontal', 'vertical'].includes(v),
  },

  ...makeDensityProps(),
  ...makeValidationProps(),
})

export const VInput = genericComponent<new <T>() => {
  $slots: MakeSlots<{
    default: [VInputSlot]
    prepend: [VInputSlot]
    append: [VInputSlot]
    details: [VInputSlot]
  }>
}>()({
  name: 'VInput',

  props: {
    focused: Boolean,

    ...makeVInputProps(),
  },

  emits: {
    'update:modelValue': (val: any) => true,
    'click:prepend': (e: MouseEvent) => true,
    'click:append': (e: MouseEvent) => true,
  },

  setup (props, { slots, emit }) {
    const { densityClasses } = useDensity(props)
    const {
      errorMessages,
      isDisabled,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
      validationClasses,
    } = useValidation(props)

    const uid = getUid()
    const id = computed(() => props.id || `input-${uid}`)
    const isFocused = toRef(props, 'focused')

    const slotProps = computed<VInputSlot>(() => ({
      id,
      isDisabled,
      isFocused,
      isReadonly,
      isPristine,
      isValid,
      isValidating,
      reset,
      resetValidation,
      validate,
    }))

    provide(VInputSymbol, slotProps)

    useRender(() => {
      const hasPrepend = (slots.prepend || props.prependIcon)
      const hasAppend = (slots.append || props.appendIcon)
      const hasHint = !!(slots.hint || props.hint)
      const hasMessages = !!(
        slots.messages ||
        props.messages?.length ||
        errorMessages.value.length
      )
      const hasDetails = !props.hideDetails || (
        props.hideDetails === 'auto' &&
        (hasMessages || hasHint)
      )
      const showMessages = hasMessages || (
        hasHint &&
        (props.persistentHint || props.focused)
      )

      return (
        <div class={[
          'v-input',
          `v-input--${props.direction}`,
          densityClasses.value,
          validationClasses.value,
        ]}
        >
          { hasPrepend && (
            <div
              class="v-input__prepend"
              onClick={ e => emit('click:prepend', e) }
            >
              { slots?.prepend?.(slotProps.value) }

              { props.prependIcon && (
                <VIcon icon={ props.prependIcon } />
              ) }
            </div>
          ) }

          <div class="v-input__control">
            { slots.default?.(slotProps.value) }
          </div>

          { hasAppend && (
            <div
              class="v-input__append"
              onClick={ e => emit('click:append', e) }
            >
              { slots?.append?.(slotProps.value) }

              { props.appendIcon && (
                <VIcon icon={ props.appendIcon } />
              ) }
            </div>
          ) }

          { hasDetails && (
            <div class="v-input__details">
              <VMessages
                active={ showMessages }
                value={ errorMessages.value.length > 0
                  ? errorMessages.value
                  : (hasMessages ? props.messages : props.hint)
                }
                v-slots={{ default: slots.messages }}
              />

              { slots.details?.(slotProps.value) }
            </div>
          ) }
        </div>
      )
    })

    return {
      isValid,
      validate,
      reset,
      resetValidation,
      errorMessages,
    }
  },
})

export type VInput = InstanceType<typeof VInput>

export function filterInputProps (props: ExtractPropTypes<ReturnType<typeof makeVInputProps>>) {
  return pick(props, Object.keys(VInput.props) as any)
}
