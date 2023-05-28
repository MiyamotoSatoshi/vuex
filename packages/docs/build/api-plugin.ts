// Imports
import fs from 'fs'
import path, { resolve } from 'path'
import { createRequire } from 'module'
import { startCase } from 'lodash-es'
import locales from '../src/i18n/locales.json'
import pageToApi from '../src/data/page-to-api.json'
import type { Plugin } from 'vite'
import rimraf from 'rimraf'

const API_ROOT = resolve('../api-generator/dist/api')
const API_PAGES_ROOT = resolve('./node_modules/.cache/api-pages')

const require = createRequire(import.meta.url)

const localeList = locales
  .filter(item => item.enabled)
  .map(item => item.alternate || item.locale)

function genApiLinks (componentName: string, header: string) {
  const links = (Object.keys(pageToApi) as (keyof typeof pageToApi)[])
    .filter(page => pageToApi[page].includes(componentName))
    .reduce<string[]>((acc, href) => {
      const name = href.split('/')[1]
      acc.push(`- [${startCase(name)}](/${href})`)
      return acc
    }, [])

  if (!links.length || !header) return ''

  const section = [
    `## ${header} {#links}`,
    links.join('\n'),
    '<entry />',
  ]

  return `${section.join('\n\n')}\n\n`
}

function genFrontMatter (component: string) {
  const fm = [
    `title: ${component} API`,
    `description: API for the ${component} component.`,
    `keywords: ${component}, api, vuetify`,
  ]

  return `---\nmeta:\n${fm.map(s => '  ' + s).join('\n')}\n---`
}

function genHeader (componentName: string) {
  const header = [
    genFrontMatter(componentName),
    `# ${componentName} API`,
  ]

  return `${header.join('\n\n')}\n\n`
}

const sanitize = (str: string) => str.replace(/\$/g, '')

async function loadMessages (locale: string) {
  const prefix = path.resolve('./src/i18n/messages/')
  const fallback = require(path.join(prefix, 'en.json'))

  try {
    const messages = require(path.join(prefix, `${locale}.json`))

    return {
      ...fallback['api-headers'],
      ...(messages['api-headers'] || {}),
    }
  } catch (err) {
    return fallback['api-headers']
  }
}

async function createMdFile (component: Record<string, any>, locale: string) {
  const messages = await loadMessages(locale)
  let str = ''

  str += genHeader(component.displayName)
  str += genApiLinks(component.fileName, messages.links)

  for (const section of ['props', 'events', 'slots', 'exposed', 'sass', 'options', 'argument', 'modifiers']) {
    if (Object.keys(component[section] ?? {}).length) {
      str += `## ${messages[section]} {#${section}}\n\n`
      str += `<api-section name="${component.displayName}" section="${section}" />\n\n`
    }
  }

  return str
}

async function writeFile (componentApi: Record<string, any>, locale: string) {
  if (!componentApi?.fileName) return

  const folder = resolve(API_PAGES_ROOT, locale, 'api')

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }

  fs.writeFileSync(resolve(folder, `${sanitize(componentApi.fileName)}.md`), await createMdFile(componentApi, locale))
}

function getApiData () {
  const files = fs.readdirSync(API_ROOT)
  const data: Record<string, any>[] = []

  for (const file of files) {
    const name = path.basename(file.slice(file.lastIndexOf('/') + 1), '.json')
    const obj = JSON.parse(fs.readFileSync(resolve(API_ROOT, file), 'utf-8'))

    data.push({
      name,
      displayName: name,
      ...obj,
    })
  }

  return data
}

async function generateFiles () {
  // const api: Record<string, any>[] = getCompleteApi(localeList)
  const api = getApiData()

  for (const locale of localeList) {
    // const pages = {} as Record<string, any>

    for (const item of api) {
      await writeFile(item, locale)

      // pages[`/${locale}/api/${sanitize(kebabCase(item.name))}/`] = item.name
    }

    // fs.writeFileSync(resolve(API_PAGES_ROOT, `${locale}/pages.json`), JSON.stringify(pages, null, 2))
    fs.writeFileSync(resolve(API_PAGES_ROOT, `${locale}.js`), `export default require.context('./${locale}/api', true, /\\.md$/)`)
  }

  // for (const item of api) {
  //   writeData(item.name, item)
  // }

  // fs.writeFileSync(resolve(API_PAGES_ROOT, 'sass.json'), JSON.stringify([
  //   ...api.filter(item => item && item.sass && item.sass.length > 0).map(item => item.name),
  // ]))
}

export default function Api (): Plugin {
  return {
    name: 'vuetify:api',
    async configResolved () {
      rimraf.sync(API_PAGES_ROOT)

      await generateFiles()
    },
  }
}
