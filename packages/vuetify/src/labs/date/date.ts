// Composables
import { useLocale } from '@/composables/locale'

// Utilities
import { inject, watch } from 'vue'
import { mergeDeep, propsFactory } from '@/util'

// Adapters
import { VuetifyDateAdapter } from './adapters/vuetify'

// Types
import type { InjectionKey, PropType } from 'vue'
import type { DateAdapter } from './DateAdapter'

export interface DateInstance<T> extends DateAdapter<T> {
  locale?: any
}

export type InternalDateOptions<T = any> = {
  adapter: (new (options: { locale: any }) => DateInstance<T>) | DateInstance<T>
  formats?: Record<string, string>
  locale: Record<string, any>
}

export type DateOptions<T = any> = Partial<InternalDateOptions<T>>

export const DateAdapterSymbol: InjectionKey<InternalDateOptions> = Symbol.for('vuetify:date-adapter')

export interface DateProps {
  displayDate: any
  hideAdjacentMonths: boolean
  modelValue: readonly any[]
}

export function createDate (options?: DateOptions) {
  return mergeDeep({
    adapter: VuetifyDateAdapter,
    locale: {
      af: 'af-ZA',
      // ar: '', # not the same value for all variants
      bg: 'bg-BG',
      ca: 'ca-ES',
      ckb: '',
      cs: '',
      de: 'de-DE',
      el: 'el-GR',
      en: 'en-US',
      // es: '', # not the same value for all variants
      et: 'et-EE',
      fa: 'fa-IR',
      fi: 'fi-FI',
      // fr: '', #not the same value for all variants
      hr: 'hr-HR',
      hu: 'hu-HU',
      he: 'he-IL',
      id: 'id-ID',
      it: 'it-IT',
      ja: 'ja-JP',
      ko: 'ko-KR',
      lv: 'lv-LV',
      lt: 'lt-LT',
      nl: 'nl-NL',
      no: 'nn-NO',
      pl: 'pl-PL',
      pt: 'pt-PT',
      ro: 'ro-RO',
      ru: 'ru-RU',
      sk: 'sk-SK',
      sl: 'sl-SI',
      srCyrl: 'sr-SP',
      srLatn: 'sr-SP',
      sv: 'sv-SE',
      th: 'th-TH',
      tr: 'tr-TR',
      az: 'az-AZ',
      uk: 'uk-UA',
      vi: 'vi-VN',
      zhHans: 'zh-CN',
      zhHant: 'zh-TW',
    },
  }, options)
}

// TODO: revisit this after it starts being implemented
export const makeDateProps = propsFactory({
  displayDate: {
    type: Object as PropType<Date>,
    default: new Date(),
  },
  hideAdjacentMonths: Boolean,
  modelValue: {
    type: null as unknown as PropType<readonly any[]>,
    default: () => [],
  },
}, 'date')

export function useDate () {
  const date = inject(DateAdapterSymbol)
  const locale = useLocale()

  if (!date) throw new Error('[Vuetify] Could not find injected date')

  const instance = typeof date.adapter === 'function'
    // eslint-disable-next-line new-cap
    ? new date.adapter({ locale: date.locale?.[locale.current.value] ?? locale.current.value })
    : date.adapter

  watch(locale.current, value => {
    const newLocale = date.locale ? date.locale[value] : value
    instance.locale = newLocale ?? instance.locale
  })

  return instance
}

export function toIso (adapter: DateAdapter<any>, value: any) {
  const date = adapter.toJsDate(value)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}


function getMondayOfFirstWeekOfYear (year: number) {
  return new Date(year, 0, 1)
}

// https://stackoverflow.com/questions/274861/how-do-i-calculate-the-week-number-given-a-date/275024#275024
export function getWeek (adapter: DateAdapter<any>, value: any) {
  const date = adapter.toJsDate(value)
  let year = date.getFullYear()
  let d1w1 = getMondayOfFirstWeekOfYear(year)

  if (date < d1w1) {
    year = year - 1
    d1w1 = getMondayOfFirstWeekOfYear(year)
  } else {
    const tv = getMondayOfFirstWeekOfYear(year + 1)
    if (date >= tv) {
      year = year + 1
      d1w1 = tv
    }
  }

  const diffTime = Math.abs(date.getTime() - d1w1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.floor(diffDays / 7) + 1
}
