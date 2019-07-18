const { inputEvents, inputSlots } = require('../helpers/variables')

module.exports = {
  'v-input': {
    events: [
      ...inputEvents,
      {
        name: 'click',
        value: 'MouseEvent',
      },
      {
        name: 'mousedown',
        value: 'MouseEvent',
      },
      {
        name: 'mouseup',
        value: 'MouseEvent',
      },
    ],
    slots: [...inputSlots, 'label'],
  },
}
