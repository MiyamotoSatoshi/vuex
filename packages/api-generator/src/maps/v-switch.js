const { inputSlots } = require('../helpers/variables')

module.exports = {
  'v-switch': {
    slots: inputSlots.concat(['label']),
  },
}
