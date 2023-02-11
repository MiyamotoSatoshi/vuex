// Composables
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, inject, provide } from 'vue'
import { propsFactory } from '@/util'

// Types
import type { InjectionKey, Ref } from 'vue'

export const makeDataTablePaginateProps = propsFactory({
  page: {
    type: [Number, String],
    default: 1,
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10,
  },
}, 'v-data-table-paginate')

const VDataTablePaginationSymbol: InjectionKey<{
  page: Ref<number>
  itemsPerPage: Ref<number>
  startIndex: Ref<number>
  stopIndex: Ref<number>
  pageCount: Ref<number>
  itemsLength: Ref<number>
}> = Symbol.for('vuetify:data-table-pagination')

type PaginationProps = {
  page: number | string
  'onUpdate:page': ((val: any) => void) | undefined
  itemsPerPage: number | string
  'onUpdate:itemsPerPage': ((val: any) => void) | undefined
  itemsLength?: number | string
}

export function createPagination (props: PaginationProps, items: Ref<any[]>) {
  const page = useProxiedModel(props, 'page', undefined, value => +(value ?? 1))
  const itemsPerPage = useProxiedModel(props, 'itemsPerPage', undefined, value => +(value ?? 10))
  const itemsLength = computed(() => +(props.itemsLength ?? items.value.length))

  const startIndex = computed(() => {
    if (itemsPerPage.value === -1) return 0

    return itemsPerPage.value * (page.value - 1)
  })
  const stopIndex = computed(() => {
    if (itemsPerPage.value === -1) return itemsLength.value

    return Math.min(itemsLength.value, startIndex.value + itemsPerPage.value)
  })

  const pageCount = computed(() => {
    if (itemsPerPage.value === -1 || itemsLength.value === 0) return 1

    return Math.ceil(itemsLength.value / itemsPerPage.value)
  })

  const data = { page, itemsPerPage, startIndex, stopIndex, pageCount, itemsLength }

  provide(VDataTablePaginationSymbol, data)

  return data
}

export function usePagination () {
  const data = inject(VDataTablePaginationSymbol)

  if (!data) throw new Error('Missing pagination!')

  return data
}

export function usePaginatedItems (
  items: Ref<any[]>,
  startIndex: Ref<number>,
  stopIndex: Ref<number>,
  itemsPerPage: Ref<number>
) {
  const paginatedItems = computed(() => {
    if (itemsPerPage.value <= 0) return items.value

    return items.value.slice(startIndex.value, stopIndex.value)
  })

  return { paginatedItems }
}
