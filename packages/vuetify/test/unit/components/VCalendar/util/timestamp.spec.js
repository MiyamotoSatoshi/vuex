import { parseTime, validateTimestamp, parseTimestamp, parseDate, getDayIdentifier, getTimeIdentifier, updateRelative, copyTimestamp, getWeekdaySkips, createDayList, getStartOfWeek, getEndOfWeek } from '@/components/VCalendar/util/timestamp'
import { test } from '@/test'

test('VCalendar/util/timestamp.ts', ({ mount }) => {
  it('should parse time number', () => {
    expect(parseTime(0)).toBe(0)
    expect(parseTime(120)).toBe(120)
  })

  it('should parse time string', () => {
    expect(parseTime('00:00')).toBe(0)
    expect(parseTime('00:30')).toBe(30)
    expect(parseTime('08:00')).toBe(8 * 60)
    expect(parseTime('08:30')).toBe(8 * 60 + 30)
    expect(parseTime('15:13')).toBe(15 * 60 + 13)
    expect(parseTime('23:59')).toBe(23 * 60 + 59)
    expect(parseTime('7')).toBe(7 * 60)
    expect(parseTime('04:23:11')).toBe(4 * 60 + 23)
    expect(parseTime('nopes')).toBe(false)
  })

  it('should parse time object', () => {
    expect(parseTime({hour: 0, minute: 0})).toBe(0)
    expect(parseTime({hour: 0, minute: 30})).toBe(30)
    expect(parseTime({hour: 8, minute: 0})).toBe(8 * 60)
    expect(parseTime({hour: 8, minute: 30})).toBe(8 * 60 + 30)
    expect(parseTime({hour: 15, minute: 13})).toBe(15 * 60 + 13)
    expect(parseTime({hour: 23, minute: 59})).toBe(23 * 60 + 59)
    expect(parseTime({hour: 23})).toBe(false)
  })

  it('should not parse time', () => {
    expect(parseTime([23])).toBe(false)
    expect(parseTime(false)).toBe(false)
    expect(parseTime(true)).toBe(false)
  })

  it('should validate timestamp', () => {
    expect(validateTimestamp('2019-01')).toBe(true)
    expect(validateTimestamp('2019-01-03')).toBe(true)
    expect(validateTimestamp('2019-01-03 12')).toBe(true)
    expect(validateTimestamp('2019-01-03 12:30')).toBe(true)
    expect(validateTimestamp('2019-01-03 12:30:45')).toBe(true)
  })

  it('should not validate timestamp', () => {
    expect(validateTimestamp('2019-01-03 x')).toBe(false)
    expect(validateTimestamp('20-01-03 12')).toBe(false)
    expect(validateTimestamp('not a timestamp')).toBe(false)
    expect(validateTimestamp([])).toBe(false)
    expect(validateTimestamp({})).toBe(false)
    expect(validateTimestamp(new Date())).toBe(false)
    expect(validateTimestamp(2345)).toBe(false)
  })

  it('should parse timestamp', () => {
    expect(parseTimestamp('2019-04')).toEqual({
      date: '2019-04',
      time: '',
      year: 2019,
      month: 4,
      day: 1,
      hour: 0,
      minute: 0,
      weekday: 0,
      hasDay: false,
      hasTime: false,
      past: false,
      present: false,
      future: false
    })
    expect(parseTimestamp('2019-01-03')).toEqual({
      date: '2019-01-03',
      time: '',
      year: 2019,
      month: 1,
      day: 3,
      hour: 0,
      minute: 0,
      weekday: 4,
      hasDay: true,
      hasTime: false,
      past: false,
      present: false,
      future: false
    })
    expect(parseTimestamp('2019-01-03 12')).toEqual({
      date: '2019-01-03',
      time: '',
      year: 2019,
      month: 1,
      day: 3,
      hour: 12,
      minute: 0,
      weekday: 4,
      hasDay: true,
      hasTime: false,
      past: false,
      present: false,
      future: false
    })
    expect(parseTimestamp('2019-01-03 12:30')).toEqual({
      date: '2019-01-03',
      time: '12:30',
      year: 2019,
      month: 1,
      day: 3,
      hour: 12,
      minute: 30,
      weekday: 4,
      hasDay: true,
      hasTime: true,
      past: false,
      present: false,
      future: false
    })
    expect(parseTimestamp('2019-01-03 07:00')).toEqual({
      date: '2019-01-03',
      time: '07:00',
      year: 2019,
      month: 1,
      day: 3,
      hour: 7,
      minute: 0,
      weekday: 4,
      hasDay: true,
      hasTime: true,
      past: false,
      present: false,
      future: false
    })
    expect(parseTimestamp('2019-01-03 07:00:45')).toEqual({
      date: '2019-01-03',
      time: '07:00',
      year: 2019,
      month: 1,
      day: 3,
      hour: 7,
      minute: 0,
      weekday: 4,
      hasDay: true,
      hasTime: true,
      past: false,
      present: false,
      future: false
    })
  })

  it('should parse date', () => {
    expect(parseDate(new Date(2019, 2, 18, 20, 30, 40))).toEqual({
      date: '2019-03-18',
      time: '20:30',
      year: 2019,
      month: 3,
      day: 18,
      hour: 20,
      minute: 30,
      weekday: 1,
      hasDay: true,
      hasTime: true,
      past: false,
      present: true,
      future: false
    })
  })

  it('should generate day identifiers', () => {
    expect(getDayIdentifier({
      year: 2019,
      month: 9,
      day: 11
    })).toBe(20190911)

    expect(getDayIdentifier({
      year: 1989,
      month: 1,
      day: 1
    })).toBe(19890101)

    expect(getDayIdentifier({
      year: 2020,
      month: 12,
      day: 31
    })).toBe(20201231)
  })

  it('should generate time identifiers', () => {
    expect(getTimeIdentifier({
      hour: 0,
      minute: 0
    })).toBe(0)

    expect(getTimeIdentifier({
      hour: 0,
      minute: 23
    })).toBe(23)

    expect(getTimeIdentifier({
      hour: 11,
      minute: 6
    })).toBe(1106)
  })

  it('should copy timestamp', () => {
    const a = {
      date: '1989-01-03',
      time: '18:23',
      year: 1989,
      month: 1,
      day: 3,
      hour: 18,
      minute: 23,
      hasTime: true,
      hasDay: true,
      past: false,
      present: false,
      future: true
    }
    const b = copyTimestamp(a)
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })

  it('should update relative flags without time', () => {
    const now = parseTimestamp('2019-02-04 09:30')
    const a = parseTimestamp('2019-02-04')
    const b = parseTimestamp('2019-02-06')
    const c = parseTimestamp('2019-02-01')

    const aa = copyTimestamp(a)
    const bb = copyTimestamp(b)
    const cc = copyTimestamp(c)

    updateRelative(aa, now)
    expect(aa.past).toBe(false)
    expect(aa.present).toBe(true)
    expect(aa.future).toBe(false)

    updateRelative(bb, now)
    expect(bb.past).toBe(false)
    expect(bb.present).toBe(false)
    expect(bb.future).toBe(true)

    updateRelative(cc, now)
    expect(cc.past).toBe(true)
    expect(cc.present).toBe(false)
    expect(cc.future).toBe(false)
  })

  it('should calculate weekday', () => {
    expect(parseTimestamp('2019-01-01').weekday).toBe(2)
    expect(parseTimestamp('2019-01-02').weekday).toBe(3)
    expect(parseTimestamp('2019-01-03').weekday).toBe(4)
    expect(parseTimestamp('2019-01-04').weekday).toBe(5)
    expect(parseTimestamp('2019-01-05').weekday).toBe(6)
    expect(parseTimestamp('2019-01-06').weekday).toBe(0)
    expect(parseTimestamp('2019-01-07').weekday).toBe(1)
    expect(parseTimestamp('2019-01-08').weekday).toBe(2)
    expect(parseTimestamp('2019-01-09').weekday).toBe(3)
    expect(parseTimestamp('2019-01-10').weekday).toBe(4)
    expect(parseTimestamp('2019-01-11').weekday).toBe(5)
    expect(parseTimestamp('2019-01-12').weekday).toBe(6)
    expect(parseTimestamp('2019-01-13').weekday).toBe(0)
    expect(parseTimestamp('2019-01-14').weekday).toBe(1)
    expect(parseTimestamp('2019-01-15').weekday).toBe(2)
    expect(parseTimestamp('2019-01-16').weekday).toBe(3)
    expect(parseTimestamp('2019-01-17').weekday).toBe(4)
    expect(parseTimestamp('2019-01-18').weekday).toBe(5)
    expect(parseTimestamp('2019-01-19').weekday).toBe(6)
    expect(parseTimestamp('2019-01-20').weekday).toBe(0)
    expect(parseTimestamp('2019-01-21').weekday).toBe(1)
    expect(parseTimestamp('2019-01-22').weekday).toBe(2)
    expect(parseTimestamp('2019-01-23').weekday).toBe(3)
    expect(parseTimestamp('2019-01-24').weekday).toBe(4)
    expect(parseTimestamp('2019-01-25').weekday).toBe(5)
    expect(parseTimestamp('2019-01-26').weekday).toBe(6)
    expect(parseTimestamp('2019-01-27').weekday).toBe(0)
    expect(parseTimestamp('2019-01-28').weekday).toBe(1)
    expect(parseTimestamp('2019-01-29').weekday).toBe(2)
    expect(parseTimestamp('2019-01-30').weekday).toBe(3)
    expect(parseTimestamp('2019-01-31').weekday).toBe(4)
    expect(parseTimestamp('2019-02-01').weekday).toBe(5)
    expect(parseTimestamp('2019-02-02').weekday).toBe(6)
    expect(parseTimestamp('2019-02-03').weekday).toBe(0)
    expect(parseTimestamp('2019-02-04').weekday).toBe(1)
    expect(parseTimestamp('2019-02-05').weekday).toBe(2)
    expect(parseTimestamp('2019-02-06').weekday).toBe(3)
    expect(parseTimestamp('2019-02-07').weekday).toBe(4)
    expect(parseTimestamp('2019-02-08').weekday).toBe(5)
    expect(parseTimestamp('2019-02-09').weekday).toBe(6)
    expect(parseTimestamp('2019-02-10').weekday).toBe(0)
    expect(parseTimestamp('2019-02-11').weekday).toBe(1)
    expect(parseTimestamp('2019-02-12').weekday).toBe(2)
    expect(parseTimestamp('2019-02-13').weekday).toBe(3)
    expect(parseTimestamp('2019-02-14').weekday).toBe(4)
    expect(parseTimestamp('2019-02-15').weekday).toBe(5)
    expect(parseTimestamp('2019-02-16').weekday).toBe(6)
    expect(parseTimestamp('2019-02-17').weekday).toBe(0)
    expect(parseTimestamp('2019-02-18').weekday).toBe(1)
    expect(parseTimestamp('2019-02-19').weekday).toBe(2)
    expect(parseTimestamp('2019-02-20').weekday).toBe(3)
    expect(parseTimestamp('2019-02-21').weekday).toBe(4)
    expect(parseTimestamp('2019-02-22').weekday).toBe(5)
    expect(parseTimestamp('2019-02-23').weekday).toBe(6)
    expect(parseTimestamp('2019-02-24').weekday).toBe(0)
    expect(parseTimestamp('2019-02-25').weekday).toBe(1)
    expect(parseTimestamp('2019-02-26').weekday).toBe(2)
    expect(parseTimestamp('2019-02-27').weekday).toBe(3)
    expect(parseTimestamp('2019-02-28').weekday).toBe(4)
    expect(parseTimestamp('2019-03-01').weekday).toBe(5)
  })

  it('should allow first day of week', () => {
    const weekdays = [1, 2, 3, 4, 5, 6, 0]
    const skips = getWeekdaySkips(weekdays)
    const today = parseTimestamp('2019-05-03')
    const date = parseTimestamp('2019-04-30')
    const start = getStartOfWeek(date, weekdays, today)
    const end = getEndOfWeek(date, weekdays, today)

    const days = createDayList(
      start,
      end,
      today,
      skips,
      Number.MAX_SAFE_INTEGER
    )

    expect(days).toEqual([
        {"date": "2019-04-29", "day": 29, "future": false, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 4, "past": true, "present": false, "time": "", "weekday": 1, "year": 2019},
        {"date": "2019-04-30", "day": 30, "future": false, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 4, "past": true, "present": false, "time": "", "weekday": 2, "year": 2019},
        {"date": "2019-05-01", "day": 1, "future": false, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 5, "past": true, "present": false, "time": "", "weekday": 3, "year": 2019},
        {"date": "2019-05-02", "day": 2, "future": false, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 5, "past": true, "present": false, "time": "", "weekday": 4, "year": 2019},
        {"date": "2019-05-03", "day": 3, "future": false, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 5, "past": false, "present": true, "time": "", "weekday": 5, "year": 2019},
        {"date": "2019-05-04", "day": 4, "future": true, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 5, "past": false, "present": false, "time": "", "weekday": 6, "year": 2019},
        {"date": "2019-05-05", "day": 5, "future": true, "hasDay": true, "hasTime": false, "hour": 0, "minute": 0, "month": 5, "past": false, "present": false, "time": "", "weekday": 0, "year": 2019}
    ])
  })
})
