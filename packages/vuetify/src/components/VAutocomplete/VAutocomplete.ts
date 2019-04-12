// Styles
import './VAutocomplete.sass'

// Extensions
import VSelect, { defaultMenuProps as VSelectMenuProps } from '../VSelect/VSelect'
import VTextField from '../VTextField/VTextField'

// Components
import VMenu from '../VMenu/VMenu'

// Utilities
import { PropType } from 'vue'
import { keyCodes } from '../../util/helpers'
import mixins, { ExtractVue } from '../../util/mixins'

const defaultMenuProps = {
  ...VSelectMenuProps,
  offsetY: true,
  offsetOverflow: true,
  transition: false
}

// Types
const baseMixins = mixins(VSelect)

interface options extends ExtractVue<typeof baseMixins> {
  $refs: {
    menu: InstanceType<typeof VMenu>
    input: HTMLInputElement
    prefix: HTMLElement
    suffix: HTMLElement
  }
}

/* @vue/component */
export default baseMixins.extend<options>().extend({
  name: 'v-autocomplete',

  props: {
    allowOverflow: {
      type: Boolean,
      default: true
    },
    browserAutocomplete: {
      type: String,
      default: 'off'
    },
    filter: {
      type: Function,
      default: (item: any, queryText: string, itemText: string) => {
        return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      }
    },
    hideNoData: Boolean,
    noFilter: Boolean,
    searchInput: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    menuProps: {
      type: VSelect.options.props.menuProps.type,
      default: () => defaultMenuProps
    },
    autoSelectFirst: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      attrsInput: null,
      lazySearch: this.searchInput
    }
  },

  computed: {
    classes (): object {
      return Object.assign({}, VSelect.options.computed.classes.call(this), {
        'v-autocomplete': true,
        'v-autocomplete--is-selecting-index': this.selectedIndex > -1
      })
    },
    computedItems (): object[] {
      return this.filteredItems
    },
    selectedValues (): object[] {
      return this.selectedItems.map(item => this.getValue(item))
    },
    hasDisplayedItems (): boolean {
      return this.hideSelected
        ? this.filteredItems.some(item => !this.hasItem(item))
        : this.filteredItems.length > 0
    },
    currentRange (): number {
      if (this.selectedItem == null) return 0

      return this.getText(this.selectedItem).toString().length
    },
    filteredItems (): object[] {
      if (!this.isSearching || this.noFilter || this.internalSearch == null) return this.allItems

      return this.allItems.filter(item => this.filter(item, this.internalSearch.toString(), this.getText(item).toString()))
    },
    internalSearch: {
      get (): string | undefined {
        return this.lazySearch
      },
      set (val: any) {
        this.lazySearch = val

        this.$emit('update:searchInput', val)
      }
    },
    isAnyValueAllowed (): boolean {
      return false
    },
    isDirty (): boolean {
      return this.searchIsDirty || this.selectedItems.length > 0
    },
    isSearching (): boolean {
      if (this.multiple) return this.searchIsDirty

      return (
        this.searchIsDirty &&
        this.internalSearch !== this.getText(this.selectedItem)
      )
    },
    menuCanShow (): boolean {
      if (!this.isFocused) return false

      return this.hasDisplayedItems || !this.hideNoData
    },
    $_menuProps (): object {
      const props = VSelect.options.computed.$_menuProps.call(this)
      props.contentClass = `v-autocomplete__content ${props.contentClass || ''}`.trim()
      return {
        ...defaultMenuProps,
        ...props
      }
    },
    searchIsDirty (): boolean {
      return this.internalSearch != null &&
        this.internalSearch !== ''
    },
    selectedItem (): any {
      if (this.multiple) return null

      return this.selectedItems.find(i => {
        return this.valueComparator(this.getValue(i), this.getValue(this.internalValue))
      })
    },
    listData () {
      const data = VSelect.options.computed.listData.call(this) as any

      Object.assign(data.props, {
        items: this.virtualizedItems,
        noFilter: (
          this.noFilter ||
          !this.isSearching ||
          !this.filteredItems.length
        ),
        searchInput: this.internalSearch
      })

      return data
    }
  },

  watch: {
    filteredItems: 'onFilteredItemsChanged',
    internalValue: 'setSearch',
    isFocused (val) {
      if (val) {
        this.$refs.input &&
          this.$refs.input.select()
      } else {
        this.updateSelf()
      }
    },
    isMenuActive (val) {
      if (val || !this.hasSlot) return

      this.lazySearch = undefined
    },
    items (val, oldVal) {
      // If we are focused, the menu
      // is not active, hide no data is enabled,
      // and items change
      // User is probably async loading
      // items, try to activate the menu
      if (
        !(oldVal && oldVal.length) &&
        this.hideNoData &&
        this.isFocused &&
        !this.isMenuActive &&
        val.length
      ) this.activateMenu()
    },
    searchInput (val: string) {
      this.lazySearch = val
    },
    internalSearch: 'onInternalSearchChanged',
    itemText: 'updateSelf'
  },

  created () {
    this.setSearch()
  },

  methods: {
    onFilteredItemsChanged (val: never[]) {
      this.setMenuIndex(-1)

      this.$nextTick(() => {
        this.setMenuIndex(val.length > 0 && (val.length === 1 || this.autoSelectFirst) ? 0 : -1)
      })
    },
    onInternalSearchChanged () {
      this.updateMenuDimensions()
    },
    updateMenuDimensions () {
      if (this.isMenuActive &&
        this.$refs.menu
      ) {
        // Type from menuable is not making it through
        (this.$refs.menu as any).updateDimensions()
      }
    },
    changeSelectedIndex (keyCode: number) {
      // Do not allow changing of selectedIndex
      // when search is dirty
      if (this.searchIsDirty) return

      if (![
        keyCodes.backspace,
        keyCodes.left,
        keyCodes.right,
        keyCodes.delete
      ].includes(keyCode)) return

      const indexes = this.selectedItems.length - 1

      if (keyCode === keyCodes.left) {
        this.selectedIndex = this.selectedIndex === -1
          ? indexes
          : this.selectedIndex - 1
      } else if (keyCode === keyCodes.right) {
        this.selectedIndex = this.selectedIndex >= indexes
          ? -1
          : this.selectedIndex + 1
      } else if (this.selectedIndex === -1) {
        this.selectedIndex = indexes
        return
      }

      const currentItem = this.selectedItems[this.selectedIndex]

      if ([
        keyCodes.backspace,
        keyCodes.delete
      ].includes(keyCode) &&
        !this.getDisabled(currentItem)
      ) {
        const newIndex = this.selectedIndex === indexes
          ? this.selectedIndex - 1
          : this.selectedItems[this.selectedIndex + 1]
            ? this.selectedIndex
            : -1

        if (newIndex === -1) {
          this.setValue(this.multiple ? [] : undefined)
        } else {
          this.selectItem(currentItem)
        }

        this.selectedIndex = newIndex
      }
    },
    clearableCallback () {
      this.internalSearch = undefined

      VSelect.options.methods.clearableCallback.call(this)
    },
    genInput () {
      const input = VTextField.options.methods.genInput.call(this)

      input.data = input.data || {}
      input.data.attrs = input.data.attrs || {}
      input.data.domProps = input.data.domProps || {}

      input.data.attrs.role = 'combobox'
      input.data.domProps.value = this.internalSearch

      return input
    },
    genSelections () {
      return this.hasSlot || this.multiple
        ? VSelect.options.methods.genSelections.call(this)
        : []
    },
    onClick () {
      if (this.isDisabled) return

      this.selectedIndex > -1
        ? (this.selectedIndex = -1)
        : this.onFocus()

      this.activateMenu()
    },
    onEnterDown () {
      // Avoid invoking this method
      // will cause updateSelf to
      // be called emptying search
    },
    onInput (e: Event) {
      if (
        this.selectedIndex > -1 ||
        !e.target
      ) return

      const target = e.target as HTMLInputElement
      const value = target.value

      // If typing and menu is not currently active
      if (target.value) {
        this.activateMenu()
        if (!this.isAnyValueAllowed) this.setMenuIndex(0)
      }

      this.mask && this.resetSelections(target)
      this.internalSearch = value
      this.badInput = target.validity && target.validity.badInput
    },
    onKeyDown (e: KeyboardEvent) {
      const keyCode = e.keyCode

      VSelect.options.methods.onKeyDown.call(this, e)

      // The ordering is important here
      // allows new value to be updated
      // and then moves the index to the
      // proper location
      this.changeSelectedIndex(keyCode)
    },
    onTabDown (e: KeyboardEvent) {
      VSelect.options.methods.onTabDown.call(this, e)
      this.updateSelf()
    },
    setSelectedItems () {
      VSelect.options.methods.setSelectedItems.call(this)

      // #4273 Don't replace if searching
      // #4403 Don't replace if focused
      if (!this.isFocused) this.setSearch()
    },
    setSearch () {
      // Wait for nextTick so selectedItem
      // has had time to update
      this.$nextTick(() => {
        this.internalSearch = (
          this.multiple &&
          this.internalSearch &&
          this.isMenuActive
        )
          ? this.internalSearch
          : (
            !this.selectedItems.length ||
            this.multiple ||
            this.hasSlot
          )
            ? null
            : this.getText(this.selectedItem)
      })
    },
    updateSelf () {
      this.updateAutocomplete()
    },
    updateAutocomplete () {
      if (!this.searchIsDirty &&
        !this.internalValue
      ) return

      if (!this.valueComparator(
        this.internalSearch,
        this.getValue(this.internalValue)
      )) {
        this.setSearch()
      }
    },
    hasItem (item: any) {
      return this.selectedValues.indexOf(this.getValue(item)) > -1
    }
  }
})
