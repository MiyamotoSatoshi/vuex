// Utilities
import { computed, watch } from 'vue'
import { deepEqual, getCurrentInstance } from '@/util'

// Types
import type { Ref } from 'vue'
import type { SortItem } from './sort'

export function useOptions ({
  page,
  itemsPerPage,
  sortBy,
  startIndex,
  stopIndex,
  pageCount,
  groupBy,
}: {
  page: Ref<number>
  itemsPerPage: Ref<number>
  sortBy: Ref<readonly SortItem[]>
  startIndex: Ref<number>
  stopIndex: Ref<number>
  pageCount: Ref<number>
  groupBy: Ref<readonly SortItem[]>
}) {
  const vm = getCurrentInstance('VDataTable')

  const options = computed(() => ({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    startIndex: startIndex.value,
    stopIndex: stopIndex.value,
    pageCount: pageCount.value,
    sortBy: sortBy.value,
    groupBy: groupBy.value,
  }))

  // Reset page when sorting changes
  watch(sortBy, () => {
    page.value = 1
  }, { deep: true })

  // Reset page when items-per-page changes
  watch(itemsPerPage, () => {
    page.value = 1
  })

  let oldOptions: unknown = null
  watch(options, () => {
    if (deepEqual(oldOptions, options.value)) return
    vm.emit('update:options', options.value)
    oldOptions = options.value
  }, { deep: true, immediate: true })
}
