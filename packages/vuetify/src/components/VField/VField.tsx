// Styles
import './VField.sass'

// Components
import { VExpandXTransition } from '@/components/transitions'
import { VIcon } from '@/components/VIcon'
import { filterInputProps, makeVInputProps, VInput } from '@/components/VInput/VInput'
import { VFieldLabel } from './VFieldLabel'

// Composables
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { makeValidationProps, useValidation } from '@/composables/validation'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref, toRef, watch, watchEffect } from 'vue'
import {
  convertToUnit,
  genericComponent,
  getUid,
  nullifyTransforms,
  pick,
  propsFactory,
  standardEasing,
  useRender,
} from '@/util'

// Types
import type { PropType, Ref } from 'vue'
import type { MakeSlots } from '@/util'

const allowedVariants = ['underlined', 'outlined', 'filled', 'contained', 'plain'] as const
type Variant = typeof allowedVariants[number]

export interface DefaultInputSlot {
  isActive: boolean
  isDirty: boolean
  isDisabled: boolean
  isFocused: boolean
  isReadonly: boolean
  controlRef: Ref<HTMLElement | undefined>
  inputRef: Ref<HTMLInputElement | undefined>
  focus: () => void
  blur: () => void
}

export interface VFieldSlot extends DefaultInputSlot {
  props: Record<string, unknown>
}

export const makeVFieldProps = propsFactory({
  appendInnerIcon: String,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: String,
    default: '$clear',
  },
  color: String,
  id: String,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: String,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String as PropType<Variant>,
    default: 'filled',
    validator: (v: any) => allowedVariants.includes(v),
  },

  ...makeThemeProps(),
  ...makeLoaderProps(),
  ...makeValidationProps(),
  ...makeVInputProps(),
}, 'v-field')

export const VField = genericComponent<new <T>() => {
  $props: {
    modelValue?: T
    'onUpdate:modelValue'?: (val: T) => any
  }
  $slots: MakeSlots<{
    prependInner: [DefaultInputSlot]
    clear: []
    appendInner: [DefaultInputSlot]
    label: [DefaultInputSlot]
    prepend: [DefaultInputSlot]
    append: [DefaultInputSlot]
    details: [DefaultInputSlot]
    loader: [{
      color: string | undefined
      isActive: boolean
    }]
    default: [VFieldSlot]
  }>
}>()({
  name: 'VField',

  inheritAttrs: false,

  props: {
    active: Boolean,
    dirty: Boolean,

    ...makeVFieldProps(),
  },

  emits: {
    'click:clear': (e: Event) => true,
    'click:prepend-inner': (e: MouseEvent) => true,
    'click:append-inner': (e: MouseEvent) => true,
    'click:control': (props: DefaultInputSlot) => true,
    'update:active': (active: boolean) => true,
    'update:modelValue': (val: any) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const { themeClasses } = useTheme(props)
    const { loaderClasses } = useLoader(props, 'v-field')
    const isActive = useProxiedModel(props, 'active')
    const uid = getUid()

    const labelRef = ref<VFieldLabel>()
    const floatingLabelRef = ref<VFieldLabel>()
    const controlRef = ref<HTMLElement>()
    const inputRef = ref<HTMLInputElement>()
    const isFocused = ref(false)
    const id = computed(() => props.id || `input-${uid}`)

    watchEffect(() => isActive.value = isFocused.value || props.dirty)

    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
    const { errorMessages, isDisabled, isReadonly, isValid, validationClasses } = useValidation(props, 'v-field')
    const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
      return (
        isValid.value !== false &&
        isFocused.value
      ) ? props.color : undefined
    }))

    watch(isActive, val => {
      if (!props.singleLine) {
        const el: HTMLElement = labelRef.value!.$el
        const targetEl: HTMLElement = floatingLabelRef.value!.$el
        const rect = nullifyTransforms(el)
        const targetRect = targetEl.getBoundingClientRect()

        const x = targetRect.x - rect.x
        const y = targetRect.y - rect.y - (rect.height / 2 - targetRect.height / 2)

        const targetWidth = targetRect.width / 0.75
        const width = Math.abs(targetWidth - rect.width) > 1
          ? { maxWidth: convertToUnit(targetWidth) }
          : undefined

        const duration = parseFloat(getComputedStyle(el).transitionDuration) * 1000
        const scale = parseFloat(getComputedStyle(targetEl).getPropertyValue('--v-field-label-scale'))

        el.style.visibility = 'visible'
        targetEl.style.visibility = 'hidden'

        el.animate([
          { transform: 'translate(0)' },
          { transform: `translate(${x}px, ${y}px) scale(${scale})`, ...width },
        ], {
          duration,
          easing: standardEasing,
          direction: val ? 'normal' : 'reverse',
        }).finished.then(() => {
          el.style.removeProperty('visibility')
          targetEl.style.removeProperty('visibility')
        })
      }
    }, { flush: 'post' })

    function focus () {
      isFocused.value = true
    }

    function blur () {
      isFocused.value = false
    }

    const slotProps = computed<DefaultInputSlot>(() => ({
      isActive: isActive.value,
      isDirty: props.dirty,
      isReadonly: isReadonly.value,
      isDisabled: isDisabled.value,
      isFocused: isFocused.value,
      inputRef,
      controlRef,
      focus,
      blur,
    }))

    function onClick (e: MouseEvent) {
      if (e.target !== document.activeElement) {
        e.preventDefault()
      }

      emit('click:control', slotProps.value)
    }

    useRender(() => {
      const isOutlined = props.variant === 'outlined'
      const hasPrepend = (slots.prependInner || props.prependInnerIcon)
      const hasClear = !!(props.clearable || slots.clear)
      const hasAppend = !!(slots.appendInner || props.appendInnerIcon || hasClear)
      const label = slots.label
        ? slots.label({
          label: props.label,
          props: { for: id.value },
        })
        : props.label
      const [inputProps, _] = filterInputProps(props)

      return (
        <VInput
          class={[
            'v-field',
            {
              'v-field--active': isActive.value,
              'v-field--appended': hasAppend,
              'v-field--dirty': props.dirty,
              'v-field--focused': isFocused.value,
              'v-field--has-background': !!props.bgColor,
              'v-field--persistent-clear': props.persistentClear,
              'v-field--prepended': hasPrepend,
              'v-field--reverse': props.reverse,
              'v-field--single-line': props.singleLine,
              [`v-field--variant-${props.variant}`]: true,
            },
            themeClasses.value,
            loaderClasses.value,
            validationClasses.value,
            textColorClasses.value,
          ]}
          style={[
            textColorStyles.value,
          ]}
          focused={ isFocused.value }
          messages={ props.errorMessages?.length ? props.errorMessages : errorMessages.value }
          { ...inputProps }
          { ...attrs }
          v-slots={{
            prepend: slots.prepend ? () => slots.prepend?.(slotProps.value) : undefined,
            append: slots.append ? () => slots.append?.(slotProps.value) : undefined,
            details: slots.details ? () => slots.details?.(slotProps.value) : undefined,
          }}
        >
          <div
            class={[
              'v-field__control',
              backgroundColorClasses.value,
            ]}
            style={ backgroundColorStyles.value }
            onClick={ onClick }
          >
            <div class="v-field__overlay" />

            <LoaderSlot
              name="v-field"
              active={ props.loading }
              color={ isValid.value === false ? undefined : props.color }
              v-slots={{ default: slots.loader }}
            />

            { hasPrepend && (
              <div
                class="v-field__prepend-inner"
                onClick={ e => emit('click:prepend-inner', e) }
              >
                { props.prependInnerIcon && (
                  <VIcon icon={ props.prependInnerIcon } />
                ) }

                { slots?.prependInner?.(slotProps.value) }
              </div>
            ) }

            <div class="v-field__field">
              { ['contained', 'filled'].includes(props.variant) && !props.singleLine && (
                <VFieldLabel ref={ floatingLabelRef } floating>
                  { label }
                </VFieldLabel>
              ) }

              <VFieldLabel ref={ labelRef } for={ id.value }>
                { label }
              </VFieldLabel>

              { slots.default?.({
                ...slotProps.value,
                props: {
                  id: id.value,
                  class: 'v-field__input',
                  onFocus: () => (isFocused.value = true),
                  onBlur: () => (isFocused.value = false),
                },
              } as VFieldSlot) }
            </div>

            { hasClear && (
              <VExpandXTransition>
                <div
                  class="v-field__clearable"
                  onClick={ (e: Event) => emit('click:clear', e) }
                  v-show={ props.dirty }
                >
                  { slots.clear
                    ? slots.clear()
                    : <VIcon icon={ props.clearIcon } />
                  }
                </div>
              </VExpandXTransition>
            ) }

            { hasAppend && (
              <div
                class="v-field__append-inner"
                onClick={ e => emit('click:append-inner', e) }
              >
                { slots?.appendInner?.(slotProps.value) }

                { props.appendInnerIcon && (
                  <VIcon icon={ props.appendInnerIcon } />
                ) }
              </div>
            ) }

            <div class="v-field__outline">
              { isOutlined && (
                <>
                  <div class="v-field__outline__start" />

                  <div class="v-field__outline__notch">
                    { !props.singleLine && (
                      <VFieldLabel ref={ floatingLabelRef } floating>
                        { label }
                      </VFieldLabel>
                    ) }
                  </div>

                  <div class="v-field__outline__end" />
                </>
              ) }

              { ['plain', 'underlined'].includes(props.variant) && !props.singleLine && (
                <VFieldLabel ref={ floatingLabelRef } floating>
                  { label }
                </VFieldLabel>
              ) }
            </div>
          </div>
        </VInput>
      )
    })

    return {
      inputRef,
      controlRef,
    }
  },
})

export type VField = InstanceType<typeof VField>

// TODO: this is kinda slow, might be better to implicitly inherit props instead
export function filterFieldProps (attrs: Record<string, unknown>) {
  return pick(attrs, Object.keys(VField.props))
}
