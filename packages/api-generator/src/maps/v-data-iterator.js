const { DataEvents, DataProps, DataDefaultScopedSlotProps } = require('./v-data')
const { DataFooterPageTextScopedProps } = require('./v-data-footer')

const DataIteratorProps = [
  { name: 'value', source: 'v-data-iterator' },
  { name: 'singleSelect', source: 'v-data-iterator' },
  { name: 'expanded', source: 'v-data-iterator' },
  { name: 'singleExpand', source: 'v-data-iterator' },
  { name: 'loading', source: 'v-data-iterator' },
  { name: 'loadingText', source: 'v-data-iterator' },
  { name: 'noResultsText', source: 'v-data-iterator' },
  { name: 'noDataText', source: 'v-data-iterator' },
  { name: 'hideDefaultFooter', source: 'v-data-iterator' },
  { name: 'footerProps', source: 'v-data-iterator' }
].concat(DataProps)

const DataIteratorEvents = [
  { name: 'input', source: 'v-data', value: 'any[]' },
  { name: 'update:expanded', source: 'v-data', value: 'any[]' },
  { name: 'item-selected', source: 'v-data', value: '{ item: any, value: boolean }' },
  { name: 'item-expanded', source: 'v-data', value: '{ item: any, value: boolean }' }
].concat(DataEvents)

const DataIteratorSlots = [
  { name: 'loading', source: 'data-iterator' },
  { name: 'no-data', source: 'data-iterator' },
  { name: 'no-results', source: 'data-iterator' }
]

const DataIteratorItemScopedProps = {
  item: 'any',
  select: {
    props: {
      value: 'boolean'
    },
    on: {
      input: '(v: boolean) => void'
    }
  },
  expand: {
    props: {
      value: 'boolean'
    },
    on: {
      input: '(v: boolean) => void'
    }
  }
}

const DataIteratorScopedSlots = [
  {
    name: 'default',
    props: {
      ...DataDefaultScopedSlotProps,
      isSelected: 'boolean',
      select: '(item: any, value: boolean): void',
      isExpanded: 'boolean',
      expand: '(item: any, value: boolean): void'
    },
    source: 'data-iterator'
  },
  {
    name: 'footer',
    props: DataDefaultScopedSlotProps,
    source: 'data-iterator'
  },
  {
    name: 'footer.page-text',
    props: DataFooterPageTextScopedProps,
    source: 'data-iterator'
  },
  {
    name: 'header',
    props: DataDefaultScopedSlotProps,
    source: 'data-iterator'
  },
  {
    name: 'item',
    props: DataIteratorItemScopedProps,
    source: 'data-iterator'
  }
]

module.exports = {
  'v-data-iterator': {
    props: DataIteratorProps,
    slots: DataIteratorSlots,
    scopedSlots: DataIteratorScopedSlots,
    events: DataIteratorEvents
  },
  DataIteratorProps,
  DataIteratorEvents,
  DataIteratorSlots,
  DataIteratorScopedSlots
}
