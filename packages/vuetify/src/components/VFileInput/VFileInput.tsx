// Styles
import './VFileInput.sass'

// Components
import { filterFieldProps, makeVFieldProps } from '@/components/VField/VField'
import { makeVInputProps, VInput } from '@/components/VInput/VInput'
import { VChip } from '@/components/VChip'
import { VCounter } from '@/components/VCounter'
import { VField } from '@/components/VField'

// Composables
import { forwardRefs } from '@/composables/forwardRefs'
import { useFocus } from '@/composables/focus'
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, nextTick, ref, watch } from 'vue'
import {
  callEvent,
  filterInputAttrs,
  genericComponent,
  humanReadableFileSize,
  propsFactory,
  useRender,
  wrapInArray,
} from '@/util'

// Types
import type { PropType } from 'vue'
import type { VFieldSlots } from '@/components/VField/VField'
import type { VInputSlots } from '@/components/VInput/VInput'

export type VFileInputSlots = VInputSlots & VFieldSlots & {
  counter: []
  selection: [{
    fileNames: string[]
    totalBytes: number
    totalBytesReadable: string
  }]
}

export const makeVFileInputProps = propsFactory({
  chips: Boolean,
  counter: Boolean,
  counterSizeString: {
    type: String,
    default: '$vuetify.fileInput.counterSize',
  },
  counterString: {
    type: String,
    default: '$vuetify.fileInput.counter',
  },
  multiple: Boolean,
  showSize: {
    type: [Boolean, Number] as PropType<boolean | 1000 | 1024>,
    default: false,
    validator: (v: boolean | number) => {
      return (
        typeof v === 'boolean' ||
        [1000, 1024].includes(v)
      )
    },
  },

  ...makeVInputProps({ prependIcon: '$file' }),

  modelValue: {
    type: Array as PropType<File[]>,
    default: () => ([]),
    validator: (val: any) => {
      return wrapInArray(val).every(v => v != null && typeof v === 'object')
    },
  },

  ...makeVFieldProps({ clearable: true }),
}, 'v-file-input')

export const VFileInput = genericComponent<VFileInputSlots>()({
  name: 'VFileInput',

  inheritAttrs: false,

  props: makeVFileInputProps(),

  emits: {
    'click:control': (e: MouseEvent) => true,
    'mousedown:control': (e: MouseEvent) => true,
    'update:focused': (focused: boolean) => true,
    'update:modelValue': (files: File[]) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const { t } = useLocale()
    const model = useProxiedModel(props, 'modelValue')
    const { isFocused, focus, blur } = useFocus(props)
    const base = computed(() => typeof props.showSize !== 'boolean' ? props.showSize : undefined)
    const totalBytes = computed(() => (model.value ?? []).reduce((bytes, { size = 0 }) => bytes + size, 0))
    const totalBytesReadable = computed(() => humanReadableFileSize(totalBytes.value, base.value))

    const fileNames = computed(() => (model.value ?? []).map(file => {
      const { name = '', size = 0 } = file

      return !props.showSize
        ? name
        : `${name} (${humanReadableFileSize(size, base.value)})`
    }))

    const counterValue = computed(() => {
      const fileCount = model.value?.length ?? 0
      if (props.showSize) return t(props.counterSizeString, fileCount, totalBytesReadable.value)
      else return t(props.counterString, fileCount)
    })
    const vInputRef = ref<VInput>()
    const vFieldRef = ref<VInput>()
    const inputRef = ref<HTMLInputElement>()
    const isActive = computed(() => (
      isFocused.value ||
      props.active
    ))
    const isPlainOrUnderlined = computed(() => ['plain', 'underlined'].includes(props.variant))
    function onFocus () {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus()
      }

      if (!isFocused.value) focus()
    }
    function onClickPrepend (e: MouseEvent) {
      onControlClick(e)
    }
    function onControlMousedown (e: MouseEvent) {
      emit('mousedown:control', e)
    }
    function onControlClick (e: MouseEvent) {
      inputRef.value?.click()

      emit('click:control', e)
    }
    function onClear (e: MouseEvent) {
      e.stopPropagation()

      onFocus()

      nextTick(() => {
        model.value = []

        callEvent(props['onClick:clear'], e)
      })
    }

    watch(model, newValue => {
      const hasModelReset = !Array.isArray(newValue) || !newValue.length

      if (hasModelReset && inputRef.value) {
        inputRef.value.value = ''
      }
    })

    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter)
      const hasDetails = !!(hasCounter || slots.details)
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs)
      const [{ modelValue: _, ...inputProps }] = VInput.filterProps(props)
      const [fieldProps] = filterFieldProps(props)

      return (
        <VInput
          ref={ vInputRef }
          v-model={ model.value }
          class={[
            'v-file-input',
            {
              'v-file-input--chips': !!props.chips,
              'v-file-input--selection-slot': !!slots.selection,
              'v-text-field--plain-underlined': isPlainOrUnderlined.value,
            },
            props.class,
          ]}
          style={ props.style }
          onClick:prepend={ onClickPrepend }
          { ...rootAttrs }
          { ...inputProps }
          centerAffix={ !isPlainOrUnderlined.value }
          focused={ isFocused.value }
        >
          {{
            ...slots,
            default: ({
              id,
              isDisabled,
              isDirty,
              isReadonly,
              isValid,
            }) => (
              <VField
                ref={ vFieldRef }
                prepend-icon={ props.prependIcon }
                onMousedown={ onControlMousedown }
                onClick={ onControlClick }
                onClick:clear={ onClear }
                onClick:prependInner={ props['onClick:prependInner'] }
                onClick:appendInner={ props['onClick:appendInner'] }
                { ...fieldProps }
                id={ id.value }
                active={ isActive.value || isDirty.value }
                dirty={ isDirty.value }
                disabled={ isDisabled.value }
                focused={ isFocused.value }
                error={ isValid.value === false }
              >
                {{
                  ...slots,
                  default: ({
                    props: { class: fieldClass, ...slotProps },
                  }) => (
                    <>
                      <input
                        ref={ inputRef }
                        type="file"
                        readonly={ isReadonly.value }
                        disabled={ isDisabled.value }
                        multiple={ props.multiple }
                        name={ props.name }
                        onClick={ e => {
                          e.stopPropagation()

                          onFocus()
                        }}
                        onChange={ e => {
                          if (!e.target) return

                          const target = e.target as HTMLInputElement
                          model.value = [...target.files ?? []]
                        }}
                        onFocus={ onFocus }
                        onBlur={ blur }
                        { ...slotProps }
                        { ...inputAttrs }
                      />

                      <div class={ fieldClass }>
                        { !!model.value?.length && (
                          slots.selection ? slots.selection({
                            fileNames: fileNames.value,
                            totalBytes: totalBytes.value,
                            totalBytesReadable: totalBytesReadable.value,
                          })
                          : props.chips ? fileNames.value.map(text => (
                            <VChip
                              key={ text }
                              size="small"
                              color={ props.color }
                            >{ text }</VChip>
                          ))
                          : fileNames.value.join(', ')
                        )}
                      </div>
                    </>
                  ),
                }}
              </VField>
            ),
            details: hasDetails ? slotProps => (
              <>
                { slots.details?.(slotProps) }

                { hasCounter && (
                  <>
                    <span />

                    <VCounter
                      active={ !!model.value?.length }
                      value={ counterValue.value }
                      v-slots:default={ slots.counter }
                    />
                  </>
                )}
              </>
            ) : undefined,
          }}
        </VInput>
      )
    })

    return forwardRefs({}, vInputRef, vFieldRef, inputRef)
  },
})

export type VFileInput = InstanceType<typeof VFileInput>
