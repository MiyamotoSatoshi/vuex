const Vue = require('vue')
const Vuetify = require('vuetify')
const fs = require('fs')
const map = require('./helpers/map')
const deepmerge = require('./helpers/merge')
const pkg = require('../package.json')

const camelizeRE = /-(\w)/g
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const hyphenateRE = /\B([A-Z])/g

function hyphenate (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

Vue.use(Vuetify)

function parseFunctionParams (func) {
  const groups = /function\s_.*\((.*)\)\s\{.*/i.exec(func)
  if (groups && groups.length > 1) return `(${groups[1]}) => {}`
  else return 'null'
}

function getPropType (type) {
  if (Array.isArray(type)) {
    return type.map(t => getPropType(t))
  }

  if (!type) return 'any'

  return type.name.toLowerCase()
}

function getPropDefault (def, type) {
  if (def === '' ||
    (def == null && type !== 'boolean' && type !== 'function')
  ) {
    return 'undefined'
  } else if (typeof (def) === 'function' && type !== 'function') {
    def = def.call({})
  }

  if (type === 'boolean') {
    return def ? 'true' : 'false'
  }

  if (type === 'string') {
    return def ? `'${def}'` : def
  }

  if (type === 'function') {
    return parseFunctionParams(def)
  }

  return def
}

function getPropSource (name, mixins) {
  const source = null
  for (let i = 0; i < mixins.length; i++) {
    let mixin = mixins[i]
    if (mixin.name !== 'VueComponent') mixin = Vue.extend(mixin)

    if (mixin.options.name) {
      const source = Object.keys(mixin.options.props || {}).find(p => p === name) && mixin.options.name
      const found = getPropSource(name, [mixin.super].concat(mixin.options.extends).concat(mixin.options.mixins).filter(m => !!m)) || source
      if (found) return hyphenate(found)
    }
  }

  return source
}

function genProp (name, prop, mixins, cmp) {
  const type = getPropType(prop.type)
  const source = getPropSource(name, mixins) || cmp

  return {
    name,
    type,
    default: getPropDefault(prop.default, type),
    source,
  }
}

function parseComponent (component) {
  return {
    props: parseProps(component),
    mixins: parseMixins(component),
  }
}

function parseProps (component, array = [], mixin = false) {
  const options = component.options
  const mixins = [component.super].concat(options.extends).concat(options.mixins).filter(m => !!m)
  const props = options.props || {}

  Object.keys(props).forEach(key => {
    const generated = genProp(key, props[key], mixins, component.options.name)
    array.push(generated)
  })

  return array.sort((a, b) => a.name > b.name)
}

function parseMixins (component) {
  if (!component.options.mixins) return []

  let mixins = []
  for (let i = 0; i < component.options.mixins.length; i++) {
    let mixin = component.options.mixins[i]

    if (mixin.name !== 'VueComponent') mixin = Vue.extend(mixin)

    if (mixin.options.name) {
      mixins.push(mixin.options.name)

      if (mixin.options.mixins) {
        mixins = mixins.concat(parseMixins(mixin))
      }
    }
  }

  return mixins.sort((a, b) => a > b)
}

function processVariableFile (path) {
  if (fs.existsSync(path)) {
    const varFile = fs.readFileSync(path, 'utf8')
    const vars = varFile.split(/;[\n]*/g)
    const varValues = []
    for (const [ind, varString] of vars.entries()) {
      const varArr = varString.split(':')
      if (varArr.length >= 2 && varArr[0].charAt(0) === '$') {
        const varName = varArr.shift().trim()
        let varDefault = (vars[ind + 1].charAt(0) === '@')
          ? vars[ind + 1]
          : varArr.join(':')
        varDefault = `${varDefault.trim()};`
        const lastIndex = varValues.findIndex(item => item.name === varName)
        if (lastIndex > -1) {
          varValues[lastIndex].default = varDefault
        } else {
          varValues.push({
            name: varName,
            default: varDefault,
          })
        }
      }
    }
    return varValues
  }
}

function parseVariables () {
  const variables = {}
  const varPaths = [
    { path: './../vuetify/src/styles/settings/_variables.scss', tag: 'globals' },
    { path: './../vuetify/src/styles/settings/_light.scss', tag: 'light' },
    { path: './../vuetify/src/styles/settings/_dark.scss', tag: 'dark' },
  ]
  // component dir
  const rootDir = './../vuetify/src/components'
  const comps = fs.readFileSync(`${rootDir}/index.ts`, 'utf8')
  const folders = comps
    .trim()
    .replace(/export\s\*\sfrom\s'.\//g, '')
    .split(`'\n`)
  for (const folder of folders) {
    varPaths.push({ path: `${rootDir}/${folder}/_variables.scss`, tag: hyphenate(folder) })
  }
  // process all variable paths
  for (const varPath of varPaths) {
    variables[varPath.tag] = processVariableFile(varPath.path)
  }

  return variables
}

const components = {}
const directives = {}

const installedComponents = Vue.options._base.options.components
const installedDirectives = Vue.options._base.options.directives

const componentNameRegex = /^(?:V[A-Z]|v-[a-z])/
for (const name in installedComponents) {
  if (!componentNameRegex.test(name)) continue

  let component = installedComponents[name]

  if (component.options.$_wrapperFor) {
    component = component.options.$_wrapperFor
  }

  const kebabName = hyphenate(name)
  let options = parseComponent(component)

  if (map[kebabName]) {
    options = deepmerge(options, map[kebabName])
  }

  components[kebabName] = options
}

for (const key of ['Mutate', 'Intersect', 'Ripple', 'Resize', 'Scroll', 'Touch']) {
  if (!installedDirectives[key]) continue

  const lowerCaseVersion = key.toLowerCase()
  const vKey = `v-${lowerCaseVersion}`
  const directive = map[vKey]
  directive.type = getPropDefault(directive.default, directive.type)
  directives[vKey] = directive
}

function writeApiFile (obj, file) {
  const stream = fs.createWriteStream(file)

  const comment = `/*
  * THIS FILE HAS BEEN AUTOMATICALLY GENERATED USING THE API-GENERATOR TOOL.
  *
  * CHANGES MADE TO THIS FILE WILL BE LOST!
  */

`

  stream.once('open', () => {
    stream.write(comment)
    stream.write('module.exports = ')
    stream.write(JSON.stringify(obj, null, 2))
    stream.write('\n')
    stream.end()
  })
}

function writeJsonFile (obj, file) {
  const stream = fs.createWriteStream(file)

  stream.once('open', () => {
    stream.write(JSON.stringify(obj, null, 2))
    stream.end()
  })
}

function writePlainFile (content, file) {
  const stream = fs.createWriteStream(file)

  stream.once('open', () => {
    stream.write(content)
    stream.end()
  })
}

const tags = Object.keys(components).reduce((t, k) => {
  t[k] = {
    attributes: components[k].props.map(p => p.name.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)).sort(),
    description: '',
  }

  return t
}, {})

const attributes = Object.keys(components).reduce((attrs, k) => {
  const tmp = components[k].props.reduce((a, prop) => {
    let type = prop.type

    if (!type) type = ''
    else if (Array.isArray(type)) type = type.map(t => t.toLowerCase()).join('|')
    else type = type.toLowerCase()

    const name = prop.name.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)

    a[`${k}/${name}`] = {
      type,
      description: '',
    }

    return a
  }, {})

  return Object.assign(attrs, tmp)
}, {})

const fakeComponents = ts => {
  const imports = [
    `import Vue from 'vue'`,
  ]
  if (ts) imports.push(`import { PropValidator } from 'vue/types/options'`)
  const inspection = ts ? '' : `// noinspection JSUnresolvedFunction\n`

  return `${imports.join('\n')}\n\n` + Object.keys(components).map(component => {
    const propType = type => {
      if (type === 'any' || typeof type === 'undefined') return ts ? 'null as any as PropValidator<any>' : 'null'
      if (Array.isArray(type)) return `[${type.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(',')}]`
      return type.charAt(0).toUpperCase() + type.slice(1)
    }
    const quoteProp = name => name.match(/-/) ? `'${name}'` : name
    const componentProps = components[component].props
    componentProps.sort((a, b) => {
      if (a.name < b.name) return -1
      return a.name === b.name ? 0 : 1
    })
    let props = componentProps.map(prop => `    ${quoteProp(prop.name)}: ${propType(prop.type)}`).join(',\n')
    if (props) props = `\n  props: {\n${props}\n  }\n`
    return `${inspection}Vue.component('${component}', {${props}})`
  }).join('\n')
}

const variables = parseVariables()

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', 0o755)
}

writeJsonFile(tags, 'dist/tags.json')
writeJsonFile(attributes, 'dist/attributes.json')
writeJsonFile(variables, 'dist/variables.json')
writePlainFile(fakeComponents(false), 'dist/fakeComponents.js')
writePlainFile(fakeComponents(true), 'dist/fakeComponents.ts')

// Create web-types.json to provide autocomplete in JetBrains IDEs
const webTypes = {
  $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
  framework: 'vue',
  name: 'vuetify',
  version: pkg.version,
  contributions: {
    html: {
      'types-syntax': 'typescript',
      tags: [],
      attributes: [],
    },
  },
}

components['$vuetify'] = map['$vuetify']
components['internationalization'] = map['internationalization']

writeApiFile({ ...components, ...directives }, 'dist/api.js')

delete components['$vuetify']
delete components['internationalization']

Object.keys(components).forEach(function (key) {
  const name = capitalize(camelize(key))
  const attributes = mapArray(components[key].props, transformAttribute)
  const events = mapArray(components[key].events, transformEvent)
  const slots = mapArray(components[key].slots, transformSlot)
  const tag = {
    name,
    source: { module: './src/components/index.ts', symbol: name },
    attributes,
    events,
    slots,
  }
  webTypes.contributions.html.tags.push(tag)

  function mapArray (arr, mapper) {
    return arr !== undefined ? arr.map(mapper) : undefined
  }

  function transformAttribute (attr) {
    attr = copyObject(attr)
    delete attr['source']
    if (attr['type']) {
      attr['value'] = {
        kind: 'expression',
        type: attr['type'],
      }
      if (attr['type'] !== 'boolean') {
        delete attr['type']
      }
    }
    if (attr['default'] !== undefined) {
      attr['default'] = JSON.stringify(attr['default'])
    }
    delete attr['example']
    return attr
  }

  function transformEvent (event) {
    event = copyObject(event)
    if (event['value'] !== undefined) {
      const type = event['value']
      event.arguments = [{
        name: 'argument',
        type: typeof type === 'string' ? type : JSON.stringify(type),
      }]
    }
    delete event['value']
    delete event['source']
    return event
  }

  function transformSlot (slot) {
    slot = copyObject(slot)
    if (slot['props'] !== undefined) {
      const props = []
      Object.keys(slot['props']).forEach(function (name) {
        const type = slot['props'][name]
        props.push({
          name,
          type: typeof type === 'string' ? type : JSON.stringify(type),
        })
      })
      slot['vue-properties'] = props
    }
    delete slot['props']
    delete slot['source']
    return slot
  }

  function copyObject (obj) {
    const result = {}
    if (typeof obj === 'string') {
      result['name'] = obj
    } else {
      Object.keys(obj).forEach(function (name) {
        result[name] = obj[name]
      })
    }
    return result
  }
})

Object.keys(directives).forEach(function (key) {
  const name = key
  const directive = directives[key]
  const modifiers = []
  let valueType
  let defaultValue
  for (const option of directive.options || []) {
    if (option.name.indexOf('modifiers.') === 0) {
      modifiers.push({
        name: option.name.substr('modifiers.'.length),
      })
    } else if (option.name === 'value') {
      valueType = option.type
      defaultValue = option.default
    }
  }
  webTypes.contributions.html.attributes.push({
    name,
    source: { module: './src/directives/index.ts', symbol: capitalize(name.substr(2)) },
    default: defaultValue,
    value: valueType ? { kind: 'expression', type: valueType } : undefined,
    'vue-modifiers': modifiers.length > 0 ? modifiers : undefined,
  })
})

writeJsonFile(webTypes, 'dist/web-types.json')
