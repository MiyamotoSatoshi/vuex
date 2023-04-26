// Composables
import { useLocale } from '@/composables/locale'

// Utilities
import { inject, watch } from 'vue'
import { propsFactory } from '@/util'

// Adapters
import { VuetifyDateAdapter } from './adapters/vuetify'

// Types
import type { DateAdapter } from './DateAdapter'
import type { InjectionKey, PropType } from 'vue'

export interface DateInstance extends DateAdapter<Date> {
  locale: string
}

export type DateOptions = {
  adapter: { new(locale: string): DateInstance }
}

export const DateAdapterSymbol: InjectionKey<DateOptions> = Symbol.for('vuetify:date-adapter')

export interface DateProps {
  displayDate: Date
  hideAdjacentMonths: boolean
  modelValue: any[]
}

export function createDate (options?: DateOptions) {
  return options ?? { adapter: VuetifyDateAdapter }
}

// TODO: revisit this after it starts being implemented
export const makeDateProps = propsFactory({
  displayDate: {
    type: Object as PropType<Date>,
    default: new Date(),
  },
  hideAdjacentMonths: Boolean,
  modelValue: {
    type: null as unknown as PropType<any[]>,
    default: () => [],
  },
}, 'date')

export function useDate (props: DateProps) {
  const date = inject(DateAdapterSymbol)
  const locale = useLocale()

  if (!date) throw new Error('[Vuetify] Could not find injected date')

  // eslint-disable-next-line new-cap
  const instance = new date.adapter(locale.current.value)

  watch(locale.current, val => {
    instance.locale = val
  }, { immediate: true })

  return instance
}
