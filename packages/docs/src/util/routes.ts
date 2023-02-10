// Imports
import locales from '@/i18n/locales.json'
import generatedPages from 'virtual:generated-pages'

// Globals
import { IN_BROWSER } from '@/util/globals'

// Regexp
// const genericLocaleRegexp = /[a-z]{2,3}|[a-z]{2,3}-[a-zA-Z]{4}|[a-z]{2,3}-[A-Z]{2,3}/
export const languagePattern = locales.filter(l => l.enabled).map(lang => lang.alternate || lang.locale).join('|')
export const disabledLanguagePattern = locales.filter(l => !l.enabled).map(lang => lang.alternate || lang.locale).join('|')

export function preferredLocale (locale = 'en') {
  if (!IN_BROWSER) return locale

  const languages = ([] as string[]).concat(window.localStorage.getItem('currentLocale') || [], navigator.languages || [])

  return languages.find(l => locales.some(locale => locale.enabled && l === (locale.alternate || locale.locale))) || locale
}

export function rpath (path = '') {
  const locale = preferredLocale()
  const [url, hash] = path.split('#')

  return leadingSlash(trailingSlash([
    '',
    locale,
    ...url.split('/').filter(p => !!p && p !== locale),
    hash ? `#${hash}` : null,
  ].filter(v => v != null).join('/')))
}

export function leadingSlash (str: string) {
  return str.startsWith('/') ? str : '/' + str
}

export function trailingSlash (str: string) {
  return str.endsWith('/') ? str : str + '/'
}

export const generatedRoutes = generatedPages.map(route => ({
  ...route,
  path: trailingSlash(route.path),
}))
