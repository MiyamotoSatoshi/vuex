import api from '@vuetify/api-generator'
import deprecatedIn from '@/data/deprecatedIn'
import newIn from '@/data/newIn'
import removed from '@/data/removed'

export default {
  namespaced: true,

  state: {
    api: {
      ...api,
      internationalization: {
        api: [
          {
            name: 'locales',
            default: '{ en: VuetifyLocale }',
            type: 'Record<string, VuetifyLocale>'
          },
          {
            name: 'current',
            default: 'en',
            type: 'string'
          },
          {
            name: 't',
            default: '(key: string, ...params: Array<string | number>): string',
            type: 'Function'
          }
        ]
      }
    },
    deprecatedIn,
    newIn,
    removed
  }
}
