// Styles
import './VFileInput.sass'

// Extensions
import VTextField from '../VTextField'

// Components
import { VChip } from '../VChip'

// Types
import { PropValidator } from 'vue/types/options'

// Utilities
import { humanReadableFileSize, wrapInArray } from '../../util/helpers'
import { consoleError } from '../../util/console'

export default VTextField.extend({
  name: 'v-file-input',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    chips: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    counterSizeString: {
      type: String,
      default: '$vuetify.fileInput.counterSize',
    },
    counterString: {
      type: String,
      default: '$vuetify.fileInput.counter',
    },
    placeholder: String,
    prependIcon: {
      type: String,
      default: '$file',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    showSize: {
      type: [Boolean, Number],
      default: false,
      validator: (v: boolean | number) => {
        return (
          typeof v === 'boolean' ||
          [1000, 1024].includes(v)
        )
      },
    } as PropValidator<boolean | 1000 | 1024>,
    smallChips: Boolean,
    truncateLength: {
      type: [Number, String],
      default: 22,
    },
    type: {
      type: String,
      default: 'file',
    },
    value: {
      default: () => [],
      validator: val => {
        return typeof val === 'object' || Array.isArray(val)
      },
    } as PropValidator<File | File[]>,
  },

  computed: {
    classes (): object {
      return {
        ...VTextField.options.computed.classes.call(this),
        'v-file-input': true,
      }
    },
    counterValue (): string {
      const fileCount = (this.isMultiple && this.lazyValue)
        ? this.lazyValue.length
        : (this.lazyValue instanceof File) ? 1 : 0

      if (!this.showSize) return this.$vuetify.lang.t(this.counterString, fileCount)

      const bytes = this.internalArrayValue.reduce((size: number, file: File) => size + file.size, 0)

      return this.$vuetify.lang.t(
        this.counterSizeString,
        fileCount,
        humanReadableFileSize(bytes, this.base === 1024)
      )
    },
    internalArrayValue (): File[] {
      return Array.isArray(this.internalValue)
        ? this.internalValue
        : wrapInArray(this.internalValue)
    },
    internalValue: {
      get (): File[] {
        return this.lazyValue
      },
      set (val: File | File[]) {
        this.lazyValue = val
        this.$emit('change', this.lazyValue)
      },
    },
    isDirty (): boolean {
      return this.internalArrayValue.length > 0
    },
    isLabelActive (): boolean {
      return this.isDirty
    },
    isMultiple (): boolean {
      return this.$attrs.hasOwnProperty('multiple')
    },
    text (): string[] {
      if (!this.isDirty) return [this.placeholder]

      return this.internalArrayValue.map((file: File) => {
        const name = this.truncateText(file.name)

        return !this.showSize ? name : `${name} (${humanReadableFileSize(file.size, this.base === 1024)})`
      })
    },
    base (): 1000 | 1024 | undefined {
      return typeof this.showSize !== 'boolean' ? this.showSize : undefined
    },
    hasChips (): boolean {
      return this.chips || this.smallChips
    },
  },

  watch: {
    readonly: {
      handler (v) {
        if (v === true) consoleError('readonly is not supported on <v-file-input>', this)
      },
      immediate: true,
    },
  },

  methods: {
    clearableCallback () {
      this.internalValue = this.isMultiple ? [] : null
      this.$refs.input.value = ''
    },
    genChips () {
      if (!this.isDirty) return []

      return this.text.map((text, index) => this.$createElement(VChip, {
        props: { small: this.smallChips },
        on: {
          'click:close': () => {
            const internalValue = this.internalValue
            internalValue.splice(index, 1)
            this.internalValue = internalValue // Trigger the watcher
          },
        },
      }, [text]))
    },
    genInput () {
      const input = VTextField.options.methods.genInput.call(this)

      // We should not be setting value
      // programmatically on the input
      // when it is using type="file"
      delete input.data!.domProps!.value

      // This solves an issue in Safari where
      // nothing happens when adding a file
      // do to the input event not firing
      // https://github.com/vuetifyjs/vuetify/issues/7941
      delete input.data!.on!.input
      input.data!.on!.change = this.onInput

      return [this.genSelections(), input]
    },
    genPrependSlot () {
      if (!this.prependIcon) return null

      const icon = this.genIcon('prepend', () => {
        this.$refs.input.click()
      })

      return this.genSlot('prepend', 'outer', [icon])
    },
    genSelectionText (): string[] {
      const length = this.text.length

      if (length < 2) return this.text
      if (this.showSize && !this.counter) return [this.counterValue]
      return [this.$vuetify.lang.t(this.counterString, length)]
    },
    genSelections () {
      const children = []

      if (this.isDirty && this.$scopedSlots.selection) {
        this.internalArrayValue.forEach((file: File, index: number) => {
          if (!this.$scopedSlots.selection) return

          children.push(
            this.$scopedSlots.selection({
              text: this.text[index],
              file,
              index,
            })
          )
        })
      } else {
        children.push(this.hasChips && this.isDirty ? this.genChips() : this.genSelectionText())
      }

      return this.$createElement('div', {
        staticClass: 'v-file-input__text',
        class: {
          'v-file-input__text--placeholder': this.placeholder && !this.isDirty,
          'v-file-input__text--chips': this.hasChips && !this.$scopedSlots.selection,
        },
        on: {
          click: () => this.$refs.input.click(),
        },
      }, children)
    },
    onInput (e: Event) {
      const files = [...(e.target as HTMLInputElement).files || []]

      this.internalValue = this.isMultiple ? files : files[0]

      // Set initialValue here otherwise isFocused
      // watcher in VTextField will emit a change
      // event whenever the component is blurred
      this.initialValue = this.internalValue
    },
    onKeyDown (e: KeyboardEvent) {
      this.$emit('keydown', e)
    },
    truncateText (str: string) {
      if (str.length < Number(this.truncateLength)) return str
      const charsKeepOneSide = Math.floor((Number(this.truncateLength) - 1) / 2)
      return `${str.slice(0, charsKeepOneSide)}…${str.slice(str.length - charsKeepOneSide)}`
    },
  },
})
