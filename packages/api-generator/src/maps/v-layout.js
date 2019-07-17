const { sharedGridProps } = require('../variables')

module.exports = {
  'v-layout': {
    slots: ['default'],
    props: [
      {
        'name': 'row',
        'type': 'boolean',
        'default': 'true',
        'source': null,
      },
      {
        'name': 'column',
        'type': 'boolean',
        'default': 'false',
        'source': null,
      },
      {
        'name': 'reverse',
        'type': 'boolean',
        'default': 'false',
        'source': null,
      },
      {
        'name': 'wrap',
        'type': 'boolean',
        'default': 'false',
        'source': null,
      },
    ].concat(sharedGridProps),
  },
}
