import stringifyObject from 'stringify-object'
import prettier from 'prettier'
import typescriptParser from 'prettier/esm/parser-typescript.mjs'
import type { Definition } from './types'

function parseFunctionParams (func: string) {
  const [, regular] = /function\s\((.*)\)\s\{.*/i.exec(func) || []
  const [, arrow] = /\((.*)\)\s=>\s\{.*/i.exec(func) || []
  const args = regular || arrow

  return args ? `(${args}) => {}` : undefined
}

function getPropType (type: any | any[]): string | string[] {
  if (Array.isArray(type)) {
    return type.flatMap(t => getPropType(t))
  }

  if (!type) return 'any'

  return type.name.toLowerCase()
}

function getPropDefault (def: any, type: string | string[]) {
  if (typeof def === 'function' && type !== 'function') {
    return def.call({}, {})
  }

  if (typeof def === 'string') {
    return def ? `'${def}'` : def
  }

  if (type === 'function') {
    return parseFunctionParams(def)
  }

  if (def == null && (
    type === 'boolean' ||
    (Array.isArray(type) && type.includes('boolean'))
  )) {
    return false
  }

  return def
}

type ComponentData = {
  props?: Record<string, Definition>
  slots?: Record<string, Definition>
  events?: Record<string, Definition>
  exposed?: Record<string, Definition>
}

export function addPropData (
  name: string,
  componentData: ComponentData,
  componentProps: any
) {
  const sources = new Set<string>()
  for (const [propName, propObj] of Object.entries(componentData.props ?? {})) {
    const instancePropObj = componentProps[propName]

    ;(propObj as any).default = instancePropObj?.default
    ;(propObj as any).source = instancePropObj?.source

    sources.add(instancePropObj?.source ?? name)
  }

  return [...sources.values()]
}

export function stringifyProps (props: any) {
  return Object.fromEntries(
    Object.entries<any>(props).map(([key, prop]) => {
      let def = typeof prop === 'object'
        ? getPropDefault(prop?.default, getPropType(prop?.type))
        : getPropDefault(undefined, getPropType(prop))

      if (typeof def === 'object') {
        def = stringifyObject(def, {
          indent: '  ',
          inlineCharacterLimit: 60,
          filter (obj, property) {
            if (typeof obj === 'object' && !Array.isArray(obj) && obj != null && 'name' in obj && 'props' in obj && 'setup' in obj) {
              return property === 'name'
            }
            return true
          },
        })
      }

      return [key, {
        source: prop?.source,
        default: def,
      }]
    })
  )
}

const localeCache = new Map<string, object>()
async function loadLocale (componentName: string, locale: string): Promise<Record<string, string | Record<string, string>>> {
  const cacheKey = `${locale}/${componentName}`
  if (localeCache.has(cacheKey)) {
    return localeCache.get(cacheKey) as any
  }
  try {
    const data = await import(`../src/locale/${cacheKey}.json`, {
      assert: { type: 'json' },
    })
    localeCache.set(cacheKey, data.default)
    return data.default
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      console.error(`Missing locale for ${cacheKey}`)
      localeCache.set(cacheKey, {})
    } else {
      console.error(err.message)
    }
    return {}
  }
}

async function getSources (name: string, locale: string, sources: string[]) {
  const arr = await Promise.all([
    loadLocale(name, locale),
    ...sources.map(source => loadLocale(source, locale)),
    loadLocale('generic', locale),
  ])

  return {
    find: (section: string, key?: string) => {
      return arr.reduce((str, source) => {
        if (str) return str
        return key ? source?.[section]?.[key] : source?.[section]
      }, null) ?? 'MISSING DESCRIPTION'
    },
  }
}

export async function addDescriptions (name: string, componentData: ComponentData, locales: string[], sources: string[] = []) {
  for (const locale of locales) {
    const descriptions = await getSources(name, locale, sources)

    for (const section of ['props', 'slots', 'events', 'exposed'] as const) {
      for (const [propName, propObj] of Object.entries(componentData[section] ?? {})) {
        (propObj as any).description = (propObj as any).description ?? {}

        ;(propObj as any).description[locale] = descriptions.find(section, propName)
      }
    }
  }
}

export async function addDirectiveDescriptions (
  name: string,
  componentData: { argument: { value: Definition }, modifiers: Record<string, Definition> },
  locales: string[],
  sources: string[] = [],
) {
  for (const locale of locales) {
    const descriptions = await getSources(name, locale, sources)

    if (componentData.argument) {
      for (const [name, arg] of Object.entries(componentData.argument)) {
        arg.description = arg.description ?? {}

        arg.description[locale] = descriptions.find('argument', name)
      }
    }

    if (componentData.modifiers) {
      for (const [name, modifier] of Object.entries(componentData.modifiers)) {
        modifier.description = modifier.description ?? {}

        modifier.description[locale] = descriptions.find('modifiers', name)
      }
    }
  }
}

export function stripLinks (str: string): [string, Record<string, string>] {
  let out = str.slice()
  const obj: Record<string, string> = {}
  const regexp = /<a.*?>(.*?)<\/a>/g

  let matches = regexp.exec(str)

  while (matches !== null) {
    obj[matches[1]] = matches[0]
    out = out.replace(matches[0], matches[1])

    matches = regexp.exec(str)
  }

  return [out, obj]
}

export function insertLinks (str: string, stripped: Record<string, string>) {
  for (const [key, value] of Object.entries(stripped)) {
    str = str.replaceAll(new RegExp(`(^|\\W)(${key})(\\W|$)`, 'g'), `$1${value}$3`)
  }
  return str
}

export function prettifyType (name: string, item: Definition) {
  const prefix = 'type Type = '
  const [str, stripped] = stripLinks(item.formatted)
  let formatted
  try {
    formatted = prettier.format(prefix + str, {
      parser: 'typescript',
      plugins: [typescriptParser],
      bracketSpacing: true,
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    })
  } catch (err) {
    console.error(`${name}:`, err.message)
    return item
  }

  return {
    ...item,
    formatted: insertLinks(formatted, stripped).replace(/type\sType\s=\s+?/m, ''),
  }
}
