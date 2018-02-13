import { provide as RegistrableProvide } from './registrable'

export default {
  name: 'button-group',

  mixins: [RegistrableProvide('buttonGroup')],

  data () {
    return {
      buttons: [],
      listeners: []
    }
  },

  methods: {
    getValue (i) {
      if (this.buttons[i].value != null) {
        return this.buttons[i].value
      }

      // Fix for testing, this should always be false in the browser
      if (this.buttons[i].$el.value != null && this.buttons[i].$el.value !== '') {
        return this.buttons[i].$el.value
      }

      return i
    },
    update () {
      const selected = []

      for (let i = 0; i < this.buttons.length; i++) {
        const elm = this.buttons[i].$el
        const button = this.buttons[i]

        elm.removeAttribute('data-only-child')

        if (this.isSelected(i)) {
          !button.to && (button.isActive = true)
          selected.push(i)
        } else {
          !button.to && (button.isActive = false)
        }
      }

      if (selected.length === 1) {
        this.buttons[selected[0]].$el.setAttribute('data-only-child', true)
      }
    },
    register (button) {
      const index = this.buttons.length
      this.buttons.push(button)
      this.listeners.push(this.updateValue.bind(this, index))
      button.$on('click', this.listeners[index])
    },
    unregister (button) {
      const index = this.buttons.indexOf(button)
      if (index === -1) {
        return
      }

      const wasSelected = this.isSelected(index)

      button.$off('click', this.listeners[index])
      this.buttons.splice(index, 1)
      this.listeners.splice(index, 1)

      // Preserve the mandatory invariant
      if (wasSelected &&
          this.mandatory &&
          this.buttons.every((_, i) => !this.isSelected(i)) &&
          this.listeners.length > 0) {
        this.listeners[0]()
      }
    }
  },

  mounted () {
    this.update()
  }
}
