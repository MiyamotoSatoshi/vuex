// Styles
import './VField.sass'

// Components
import { VExpandXTransition } from '@/components/transitions'
import { useInputIcon } from '@/components/VInput/InputIcon'
import { VFieldLabel } from './VFieldLabel'

// Composables
import { IconValue } from '@/composables/icons'
import { LoaderSlot, makeLoaderProps, useLoader } from '@/composables/loader'
import { makeFocusProps, useFocus } from '@/composables/focus'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useBackgroundColor, useTextColor } from '@/composables/color'

// Utilities
import { computed, ref, toRef, watch } from 'vue'
import {
  animate,
  convertToUnit,
  EventProp,
  genericComponent,
  getUid,
  isOn,
  nullifyTransforms,
  pick,
  propsFactory,
  standardEasing,
  useRender,
} from '@/util'

// Types
import type { LoaderSlotProps } from '@/composables/loader'
import type { MakeSlots } from '@/util'
import type { PropType, Ref } from 'vue'
import type { VInputSlot } from '@/components/VInput/VInput'

const allowedVariants = ['underlined', 'outlined', 'filled', 'solo', 'plain'] as const
type Variant = typeof allowedVariants[number]

export interface DefaultInputSlot {
  isActive: Ref<boolean>
  isFocused: Ref<boolean>
  controlRef: Ref<HTMLElement | undefined>
  focus: () => void
  blur: () => void
}

export interface VFieldSlot extends DefaultInputSlot {
  props: Record<string, unknown>
}

export const makeVFieldProps = propsFactory({
  appendInnerIcon: IconValue,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: IconValue,
    default: '$clear',
  },
  active: Boolean,
  color: String,
  dirty: Boolean,
  disabled: Boolean,
  error: Boolean,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: IconValue,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String as PropType<Variant>,
    default: 'filled',
    validator: (v: any) => allowedVariants.includes(v),
  },

  'onClick:clear': EventProp,
  'onClick:appendInner': EventProp,
  'onClick:prependInner': EventProp,

  ...makeThemeProps(),
  ...makeLoaderProps(),
}, 'v-field')

export type VFieldSlots = MakeSlots<{
  clear: []
  'prepend-inner': [DefaultInputSlot & VInputSlot]
  'append-inner': [DefaultInputSlot & VInputSlot]
  label: [DefaultInputSlot & VInputSlot]
  loader: [LoaderSlotProps]
  default: [VFieldSlot]
}>

export const VField = genericComponent<new <T>() => {
  $props: {
    modelValue?: T
    'onUpdate:modelValue'?: (val: T) => any
  }
  $slots: VFieldSlots
}>()({
  name: 'VField',

  inheritAttrs: false,

  props: {
    id: String,

    ...makeFocusProps(),
    ...makeVFieldProps(),
  },

  emits: {
    'click:control': (e: MouseEvent) => true,
    'update:focused': (focused: boolean) => true,
    'update:modelValue': (val: any) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const { themeClasses } = provideTheme(props)
    const { loaderClasses } = useLoader(props)
    const { focusClasses, isFocused, focus, blur } = useFocus(props)
    const { InputIcon } = useInputIcon(props)

    const isActive = computed(() => props.dirty || props.active)
    const hasLabel = computed(() => !props.singleLine && !!(props.label || slots.label))

    const uid = getUid()
    const id = computed(() => props.id || `input-${uid}`)

    const labelRef = ref<VFieldLabel>()
    const floatingLabelRef = ref<VFieldLabel>()
    const controlRef = ref<HTMLElement>()

    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
    const { textColorClasses, textColorStyles } = useTextColor(computed(() => {
      return (
        isActive.value &&
        isFocused.value &&
        !props.error &&
        !props.disabled
      ) ? props.color : undefined
    }))

    watch(isActive, val => {
      if (hasLabel.value) {
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

        const style = getComputedStyle(el)
        const targetStyle = getComputedStyle(targetEl)
        const duration = parseFloat(style.transitionDuration) * 1000 || 150
        const scale = parseFloat(targetStyle.getPropertyValue('--v-field-label-scale'))
        const color = targetStyle.getPropertyValue('color')

        el.style.visibility = 'visible'
        targetEl.style.visibility = 'hidden'

        animate(el, {
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          color,
          ...width,
        }, {
          duration,
          easing: standardEasing,
          direction: val ? 'normal' : 'reverse',
        }).finished.then(() => {
          el.style.removeProperty('visibility')
          targetEl.style.removeProperty('visibility')
        })
      }
    }, { flush: 'post' })

    const slotProps = computed<DefaultInputSlot>(() => ({
      isActive,
      isFocused,
      controlRef,
      blur,
      focus,
    }))

    function onClick (e: MouseEvent) {
      if (e.target !== document.activeElement) {
        e.preventDefault()
      }

      emit('click:control', e)
    }

    useRender(() => {
      const isOutlined = props.variant === 'outlined'
      const hasPrepend = (slots['prepend-inner'] || props.prependInnerIcon)
      const hasClear = !!(props.clearable || slots.clear)
      const hasAppend = !!(slots['append-inner'] || props.appendInnerIcon || hasClear)
      const label = slots.label
        ? slots.label({
          label: props.label,
          props: { for: id.value },
        })
        : props.label

      return (
        <div
          class={[
            'v-field',
            {
              'v-field--active': isActive.value,
              'v-field--appended': hasAppend,
              'v-field--disabled': props.disabled,
              'v-field--dirty': props.dirty,
              'v-field--error': props.error,
              'v-field--has-background': !!props.bgColor,
              'v-field--persistent-clear': props.persistentClear,
              'v-field--prepended': hasPrepend,
              'v-field--reverse': props.reverse,
              'v-field--single-line': props.singleLine,
              'v-field--no-label': !label,
              [`v-field--variant-${props.variant}`]: true,
            },
            themeClasses.value,
            backgroundColorClasses.value,
            focusClasses.value,
            loaderClasses.value,
          ]}
          style={[
            backgroundColorStyles.value,
            textColorStyles.value,
          ]}
          onClick={ onClick }
          { ...attrs }
        >
          <div class="v-field__overlay" />

          <LoaderSlot
            name="v-field"
            active={ props.loading }
            color={ props.error ? 'error' : props.color }
            v-slots={{ default: slots.loader }}
          />

          { hasPrepend && (
            <div key="prepend" class="v-field__prepend-inner">
              { props.prependInnerIcon && (
                <InputIcon key="prepend-icon" name="prependInner" />
              ) }

              { slots['prepend-inner']?.(slotProps.value) }
            </div>
          ) }

          <div class="v-field__field" data-no-activator="">
            { ['solo', 'filled'].includes(props.variant) && hasLabel.value && (
              <VFieldLabel
                key="floating-label"
                ref={ floatingLabelRef }
                class={[textColorClasses.value]}
                floating
                for={ id.value }
              >
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
              },
              focus,
              blur,
            } as VFieldSlot) }
          </div>

          { hasClear && (
            <VExpandXTransition key="clear">
              <div
                class="v-field__clearable"
                v-show={ props.dirty }
              >
                { slots.clear
                  ? slots.clear()
                  : <InputIcon name="clear" />
                }
              </div>
            </VExpandXTransition>
          ) }

          { hasAppend && (
            <div key="append" class="v-field__append-inner">
              { slots['append-inner']?.(slotProps.value) }

              { props.appendInnerIcon && (
                <InputIcon key="append-icon" name="appendInner" />
              ) }
            </div>
          ) }

          <div
            class={[
              'v-field__outline',
              textColorClasses.value,
            ]}
          >
            { isOutlined && (
              <>
                <div class="v-field__outline__start" />

                { hasLabel.value && (
                  <div class="v-field__outline__notch">
                    <VFieldLabel ref={ floatingLabelRef } floating for={ id.value }>
                      { label }
                    </VFieldLabel>
                  </div>
                ) }

                <div class="v-field__outline__end" />
              </>
            ) }

            { ['plain', 'underlined'].includes(props.variant) && hasLabel.value && (
              <VFieldLabel ref={ floatingLabelRef } floating for={ id.value }>
                { label }
              </VFieldLabel>
            ) }
          </div>
        </div>
      )
    })

    return {
      controlRef,
    }
  },
})

export type VField = InstanceType<typeof VField>

// TODO: this is kinda slow, might be better to implicitly inherit props instead
export function filterFieldProps (attrs: Record<string, unknown>) {
  const keys = Object.keys(VField.props).filter(k => !isOn(k))
  return pick(attrs, keys)
}
