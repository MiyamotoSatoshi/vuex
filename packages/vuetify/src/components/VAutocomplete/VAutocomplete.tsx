// Styles
import './VAutocomplete.sass'

// Components
import { makeSelectProps } from '@/components/VSelect/VSelect'
import { VCheckboxBtn } from '@/components/VCheckbox'
import { VChip } from '@/components/VChip'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VIcon } from '@/components/VIcon'
import { VList, VListItem } from '@/components/VList'
import { VMenu } from '@/components/VMenu'
import { VTextField } from '@/components/VTextField'

// Composables
import { forwardRefs } from '@/composables/forwardRefs'
import { makeFilterProps, useFilter } from '@/composables/filter'
import { makeTransitionProps } from '@/composables/transition'
import { useForm } from '@/composables/form'
import { useItems } from '@/composables/list-items'
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useTextColor } from '@/composables/color'

// Utility
import { computed, mergeProps, nextTick, ref, shallowRef, watch } from 'vue'
import { genericComponent, noop, omit, propsFactory, useRender, wrapInArray } from '@/util'
import { makeVTextFieldProps } from '@/components/VTextField/VTextField'

// Types
import type { PropType } from 'vue'
import type { GenericProps } from '@/util'
import type { FilterMatch } from '@/composables/filter'
import type { ListItem } from '@/composables/list-items'
import type { VFieldSlots } from '@/components/VField/VField'
import type { VInputSlots } from '@/components/VInput/VInput'

function highlightResult (text: string, matches: FilterMatch | undefined, length: number) {
  if (matches == null) return text

  if (Array.isArray(matches)) throw new Error('Multiple matches is not implemented')

  return typeof matches === 'number' && ~matches
    ? (
      <>
        <span class="v-autocomplete__unmask">{ text.substr(0, matches) }</span>
        <span class="v-autocomplete__mask">{ text.substr(matches, length) }</span>
        <span class="v-autocomplete__unmask">{ text.substr(matches + length) }</span>
      </>
    )
    : text
}

type Primitive = string | number | boolean | symbol

type Val <T, ReturnObject extends boolean> = [T] extends [Primitive]
  ? T
  : (ReturnObject extends true ? T : any)

type Value <T, ReturnObject extends boolean, Multiple extends boolean> =
  Multiple extends true
    ? readonly Val<T, ReturnObject>[]
    : Val<T, ReturnObject> | null

export const makeVAutocompleteProps = propsFactory({
  autoSelectFirst: {
    type: [Boolean, String] as PropType<boolean | 'exact'>,
  },
  search: String,

  ...makeFilterProps({ filterKeys: ['title'] }),
  ...makeSelectProps(),
  ...omit(makeVTextFieldProps({
    modelValue: null,
  }), ['validationValue', 'dirty', 'appendInnerIcon']),
  ...makeTransitionProps({ transition: false }),
}, 'v-autocomplete')

export const VAutocomplete = genericComponent<new <
  T extends readonly any[],
  Item = T extends readonly (infer U)[] ? U : never,
  ReturnObject extends boolean = false,
  Multiple extends boolean = false,
  V extends Value<Item, ReturnObject, Multiple> = Value<Item, ReturnObject, Multiple>
>(
  props: {
    items?: T
    returnObject?: ReturnObject
    multiple?: Multiple
    modelValue?: V | null
    'onUpdate:modelValue'?: (val: V) => void
  },
  slots: Omit<VInputSlots & VFieldSlots, 'default'> & {
    item: { item: ListItem<Item>, index: number, props: Record<string, unknown> }
    chip: { item: ListItem<Item>, index: number, props: Record<string, unknown> }
    selection: { item: ListItem<Item>, index: number }
    'prepend-item': never
    'append-item': never
    'no-data': never
  }
) => GenericProps<typeof props, typeof slots>>()({
  name: 'VAutocomplete',

  props: makeVAutocompleteProps(),

  emits: {
    'update:focused': (focused: boolean) => true,
    'update:search': (val: any) => true,
    'update:modelValue': (val: any) => true,
    'update:menu': (val: boolean) => true,
  },

  setup (props, { slots }) {
    const { t } = useLocale()
    const vTextFieldRef = ref()
    const isFocused = shallowRef(false)
    const isPristine = shallowRef(true)
    const listHasFocus = ref(false)
    const vMenuRef = ref<VMenu>()
    const _menu = useProxiedModel(props, 'menu')
    const menu = computed({
      get: () => _menu.value,
      set: v => {
        if (_menu.value && !v && vMenuRef.value?.ΨopenChildren) return
        _menu.value = v
      },
    })
    const selectionIndex = shallowRef(-1)
    const color = computed(() => vTextFieldRef.value?.color)
    const { items, transformIn, transformOut } = useItems(props)
    const { textColorClasses, textColorStyles } = useTextColor(color)
    const search = useProxiedModel(props, 'search', '')
    const model = useProxiedModel(
      props,
      'modelValue',
      [],
      v => transformIn(wrapInArray(v)),
      v => {
        const transformed = transformOut(v)
        return props.multiple ? transformed : (transformed[0] ?? null)
      }
    )
    const form = useForm()
    const { filteredItems, getMatches } = useFilter(props, items, computed(() => isPristine.value ? undefined : search.value))
    const selections = computed(() => {
      return model.value.map(v => {
        return items.value.find(item => props.valueComparator(item.value, v.value)) || v
      })
    })

    const displayItems = computed(() => {
      if (props.hideSelected) {
        return filteredItems.value.filter(filteredItem => !selections.value.some(s => s.value === filteredItem.value))
      }
      return filteredItems.value
    })

    const selected = computed(() => selections.value.map(selection => selection.props.value))
    const selection = computed(() => selections.value[selectionIndex.value])
    const highlightFirst = computed(() => {
      const selectFirst = props.autoSelectFirst === true ||
        (props.autoSelectFirst === 'exact' && search.value === displayItems.value[0]?.title)
      return selectFirst &&
        displayItems.value.length > 0 &&
        !isPristine.value &&
        !listHasFocus.value
    })
    const listRef = ref<VList>()

    function onClear (e: MouseEvent) {
      if (props.openOnClear) {
        menu.value = true
      }

      search.value = ''
    }
    function onMousedownControl () {
      if (
        (props.hideNoData && !items.value.length) ||
        props.readonly || form?.isReadonly.value
      ) return

      menu.value = true
    }
    function onMousedownMenuIcon (e: MouseEvent) {
      if (isFocused.value) {
        e.preventDefault()
        e.stopPropagation()
      }
      menu.value = !menu.value
    }
    function onKeydown (e: KeyboardEvent) {
      if (props.readonly || form?.isReadonly.value) return

      const selectionStart = vTextFieldRef.value.selectionStart
      const length = selected.value.length

      if (
        selectionIndex.value > -1 ||
        ['Enter', 'ArrowDown', 'ArrowUp'].includes(e.key)
      ) {
        e.preventDefault()
      }

      if (['Enter', 'ArrowDown'].includes(e.key)) {
        menu.value = true
      }

      if (['Escape'].includes(e.key)) {
        menu.value = false
      }

      if (['Enter', 'Escape', 'Tab'].includes(e.key)) {
        if (highlightFirst.value && ['Enter', 'Tab'].includes(e.key)) {
          select(filteredItems.value[0])
        }

        isPristine.value = true
      }

      if (e.key === 'ArrowDown') {
        listRef.value?.focus('next')
        if (highlightFirst.value) {
          listRef.value?.focus('next')
        }
      } else if (e.key === 'ArrowUp') {
        listRef.value?.focus('prev')
      }

      if (!props.multiple) return

      if (['Backspace', 'Delete'].includes(e.key)) {
        if (selectionIndex.value < 0) {
          if (e.key === 'Backspace' && !search.value) {
            selectionIndex.value = length - 1
          }

          return
        }

        const originalSelectionIndex = selectionIndex.value

        if (selection.value) select(selection.value)

        selectionIndex.value = originalSelectionIndex >= length - 1 ? (length - 2) : originalSelectionIndex
      }

      if (e.key === 'ArrowLeft') {
        if (selectionIndex.value < 0 && selectionStart > 0) return

        const prev = selectionIndex.value > -1
          ? selectionIndex.value - 1
          : length - 1

        if (selections.value[prev]) {
          selectionIndex.value = prev
        } else {
          selectionIndex.value = -1
          vTextFieldRef.value.setSelectionRange(search.value?.length, search.value?.length)
        }
      }

      if (e.key === 'ArrowRight') {
        if (selectionIndex.value < 0) return

        const next = selectionIndex.value + 1

        if (selections.value[next]) {
          selectionIndex.value = next
        } else {
          selectionIndex.value = -1
          vTextFieldRef.value.setSelectionRange(0, 0)
        }
      }
    }

    function onInput (e: InputEvent) {
      search.value = (e.target as HTMLInputElement).value
    }

    function onAfterLeave () {
      if (isFocused.value) {
        isPristine.value = true
        vTextFieldRef.value?.focus()
      }
    }

    function onFocusin (e: FocusEvent) {
      isFocused.value = true
      setTimeout(() => {
        listHasFocus.value = true
      })
    }
    function onFocusout (e: FocusEvent) {
      listHasFocus.value = false
    }

    const isSelecting = shallowRef(false)

    function select (item: ListItem) {
      if (props.multiple) {
        const index = selected.value.findIndex(selection => props.valueComparator(selection, item.value))

        if (index === -1) {
          model.value = [...model.value, item]
        } else {
          const value = [...model.value]
          value.splice(index, 1)
          model.value = value
        }
      } else {
        model.value = [item]

        isSelecting.value = true

        search.value = item.title

        menu.value = false
        isPristine.value = true

        nextTick(() => (isSelecting.value = false))
      }
    }

    watch(isFocused, (val, oldVal) => {
      if (val === oldVal) return

      if (val) {
        isSelecting.value = true
        search.value = props.multiple ? '' : String(selections.value.at(-1)?.props.title ?? '')
        isPristine.value = true

        nextTick(() => isSelecting.value = false)
      } else {
        if (!props.multiple && !search.value) model.value = []
        else if (
          highlightFirst.value &&
          !listHasFocus.value &&
          !selections.value.some(({ value }) => value === displayItems.value[0].value)
        ) {
          select(displayItems.value[0])
        }
        menu.value = false
        search.value = ''
        selectionIndex.value = -1
      }
    })

    watch(search, val => {
      if (!isFocused.value || isSelecting.value) return

      if (val) menu.value = true

      isPristine.value = !val
    })

    useRender(() => {
      const hasChips = !!(props.chips || slots.chip)
      const hasList = !!((!props.hideNoData || displayItems.value.length) || slots.prepend || slots.append || slots['no-data'])
      const isDirty = model.value.length > 0
      const [textFieldProps] = VTextField.filterProps(props)

      return (
        <VTextField
          ref={ vTextFieldRef }
          { ...textFieldProps }
          modelValue={ search.value }
          onUpdate:modelValue={ v => { if (v == null) model.value = [] } }
          v-model:focused={ isFocused.value }
          validationValue={ model.externalValue }
          dirty={ isDirty }
          onInput={ onInput }
          class={[
            'v-autocomplete',
            `v-autocomplete--${props.multiple ? 'multiple' : 'single'}`,
            {
              'v-autocomplete--active-menu': menu.value,
              'v-autocomplete--chips': !!props.chips,
              'v-autocomplete--selection-slot': !!slots.selection,
              'v-autocomplete--selecting-index': selectionIndex.value > -1,
            },
            props.class,
          ]}
          style={ props.style }
          readonly={ props.readonly }
          placeholder={ isDirty ? undefined : props.placeholder }
          onClick:clear={ onClear }
          onMousedown:control={ onMousedownControl }
          onKeydown={ onKeydown }
        >
          {{
            ...slots,
            default: () => (
              <>
                <VMenu
                  ref={ vMenuRef }
                  v-model={ menu.value }
                  activator="parent"
                  contentClass="v-autocomplete__content"
                  eager={ props.eager }
                  maxHeight={ 310 }
                  openOnClick={ false }
                  closeOnContentClick={ false }
                  transition={ props.transition }
                  onAfterLeave={ onAfterLeave }
                  { ...props.menuProps }
                >
                  { hasList && (
                    <VList
                      ref={ listRef }
                      selected={ selected.value }
                      selectStrategy={ props.multiple ? 'independent' : 'single-independent' }
                      onMousedown={ (e: MouseEvent) => e.preventDefault() }
                      onFocusin={ onFocusin }
                      onFocusout={ onFocusout }
                    >
                      { !displayItems.value.length && !props.hideNoData && (slots['no-data']?.() ?? (
                        <VListItem title={ t(props.noDataText) } />
                      ))}

                      { slots['prepend-item']?.() }

                      { displayItems.value.map((item, index) => {
                        const itemProps = mergeProps(item.props, {
                          key: index,
                          active: (highlightFirst.value && index === 0) ? true : undefined,
                          onClick: () => select(item),
                        })

                        return slots.item?.({
                          item,
                          index,
                          props: itemProps,
                        }) ?? (
                          <VListItem { ...itemProps }>
                            {{
                              prepend: ({ isSelected }) => (
                                <>
                                  { props.multiple && !props.hideSelected ? (
                                    <VCheckboxBtn
                                      key={ item.value }
                                      modelValue={ isSelected }
                                      ripple={ false }
                                      tabindex="-1"
                                    />
                                  ) : undefined }

                                  { item.props.prependIcon && (
                                    <VIcon icon={ item.props.prependIcon } />
                                  )}
                                </>
                              ),
                              title: () => {
                                return isPristine.value
                                  ? item.title
                                  : highlightResult(item.title, getMatches(item)?.title, search.value?.length ?? 0)
                              },
                            }}
                          </VListItem>
                        )
                      })}

                      { slots['append-item']?.() }
                    </VList>
                  )}
                </VMenu>

                { selections.value.map((item, index) => {
                  function onChipClose (e: Event) {
                    e.stopPropagation()
                    e.preventDefault()

                    select(item)
                  }

                  const slotProps = {
                    'onClick:close': onChipClose,
                    onMousedown (e: MouseEvent) {
                      e.preventDefault()
                      e.stopPropagation()
                    },
                    modelValue: true,
                    'onUpdate:modelValue': undefined,
                  }

                  return (
                    <div
                      key={ item.value }
                      class={[
                        'v-autocomplete__selection',
                        index === selectionIndex.value && [
                          'v-autocomplete__selection--selected',
                          textColorClasses.value,
                        ],
                      ]}
                      style={ index === selectionIndex.value ? textColorStyles.value : {} }
                    >
                      { hasChips ? (
                        !slots.chip ? (
                          <VChip
                            key="chip"
                            closable={ props.closableChips }
                            size="small"
                            text={ item.title }
                            { ...slotProps }
                          />
                        ) : (
                          <VDefaultsProvider
                            key="chip-defaults"
                            defaults={{
                              VChip: {
                                closable: props.closableChips,
                                size: 'small',
                                text: item.title,
                              },
                            }}
                          >
                            { slots.chip?.({ item, index, props: slotProps }) }
                          </VDefaultsProvider>
                        )
                      ) : (
                        slots.selection?.({ item, index }) ?? (
                          <span class="v-autocomplete__selection-text">
                            { item.title }
                            { props.multiple && (index < selections.value.length - 1) && (
                              <span class="v-autocomplete__selection-comma">,</span>
                            )}
                          </span>
                        )
                      )}
                    </div>
                  )
                })}
              </>
            ),
            'append-inner': (...args) => (
              <>
                { slots['append-inner']?.(...args) }
                { props.menuIcon ? (
                  <VIcon
                    class="v-autocomplete__menu-icon"
                    icon={ props.menuIcon }
                    onMousedown={ onMousedownMenuIcon }
                    onClick={ noop }
                  />
                ) : undefined }
              </>
            ),
          }}
        </VTextField>
      )
    })

    return forwardRefs({
      isFocused,
      isPristine,
      menu,
      search,
      filteredItems,
      select,
    }, vTextFieldRef)
  },
})

export type VAutocomplete = InstanceType<typeof VAutocomplete>
