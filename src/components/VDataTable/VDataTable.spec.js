import { test } from '~util/testing'
import VDataTable from './VDataTable'

test('VDataTable.js', ({ mount }) => {
  it('should be able to filter null and undefined values', async () => {
    const pagination = {
      descending: false,
      sortBy: 'column'
    }
    const wrapper = mount(VDataTable, {
      propsData: {
        pagination,
        headers: [
          { text: 'Other', value: 'other' },
          { text: 'Column', value: 'column' }
        ],
        items: [
          { other: 1, column: 'foo' },
          { other: 2, column: null },
          { other: 3, column: undefined }
        ]
      }
    })

    await wrapper.vm.$nextTick()

    pagination.descending = true

    expect(wrapper.vm.$props.pagination.descending).toBe(true)
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
    // Also expect tests to not crash :)
  })
})
