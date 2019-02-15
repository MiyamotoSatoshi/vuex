// Service
import { Lang } from '../index'

// Utilities
import toHaveBeenWarnedInit from '../../../../test/util/to-have-been-warned'

describe('$vuetify.lang', () => {
  let lang: Lang

  toHaveBeenWarnedInit()

  beforeEach(() => {
    lang = new Lang()
  })

  it('should fall back to en', () => {
    Object.assign(lang.locales.en, { foo: 'bar', bar: 'baz' })
    lang.locales.foreign = { foo: 'foreignBar' }
    lang.current = 'foreign'

    expect(lang.t('$vuetify.foo')).toBe('foreignBar')

    expect(lang.t('$vuetify.bar')).toBe('baz')
    expect('Translation key "bar" not found, falling back to default').toHaveBeenTipped()

    expect(lang.t('$vuetify.baz')).toBe('$vuetify.baz')
    expect('Translation key "baz" not found, falling back to default').toHaveBeenTipped()
    expect('Translation key "baz" not found in fallback').toHaveBeenWarned()
  })

  it('should ignore unprefixed strings', () => {
    expect(lang.t('foo.bar.baz')).toBe('foo.bar.baz')
  })

  it('should use a different default', () => {
    lang = new Lang({
      current: 'foreign',
      locales: {
        foreign: { foo: 'foreignBar' }
      }
    })

    expect(lang.t('$vuetify.foo')).toBe('foreignBar')
  })

  it('should use a custom translator', () => {
    const translator = jest.fn(str => str)

    lang = new Lang({ t: translator })

    lang.t('$vuetify.foobar', 'fizzbuzz')

    expect(translator).toHaveBeenCalledWith('$vuetify.foobar', 'fizzbuzz')
  })
})
