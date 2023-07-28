// Utilities
import { describe, expect, it } from '@jest/globals'
import timezoneMock, { TimeZone } from 'timezone-mock'
import { VuetifyDateAdapter } from '../vuetify'

describe('vuetify date adapter', () => {
  it('should return weekdays based on locale', () => {
    let instance = new VuetifyDateAdapter({ locale: 'en-us' })

    expect(instance.getWeekdays()).toStrictEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

    instance = new VuetifyDateAdapter({ locale: 'sv-se' })

    expect(instance.getWeekdays()).toStrictEqual(['mån', 'tis', 'ons', 'tors', 'fre', 'lör', 'sön'])
  })

  it('should format dates', () => {
    let instance = new VuetifyDateAdapter({ locale: 'en-us' })

    expect(instance.format(new Date(2000, 0, 1), 'fullDateWithWeekday')).toBe('Saturday, January 1, 2000')

    instance = new VuetifyDateAdapter({ locale: 'sv-SE' })

    expect(instance.format(new Date(2000, 0, 1), 'fullDateWithWeekday')).toBe('lördag 1 januari 2000')
  })

  it.each([
    'UTC',
    'US/Pacific',
    'Europe/London',
    'Brazil/East',
    'Australia/Adelaide',
    'Etc/GMT-2',
    'Etc/GMT-4',
    'Etc/GMT+4',
  ])('should handle timezone %s when parsing date without time', (timezone) => {
    // locale option here has no impact on timezone
    let instance = new VuetifyDateAdapter({ locale: 'en-us' })

    const str = "2001-01-01"

    timezoneMock.register(timezone as TimeZone)

    const date = instance.date(str)

    expect(date?.getFullYear()).toBe(2001)
    expect(date?.getDate()).toBe(1)
    expect(date?.getMonth()).toBe(0)

    timezoneMock.unregister()
  })
})
