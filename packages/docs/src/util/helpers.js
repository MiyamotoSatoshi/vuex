// Must be called in Vue context
export function goTo (id) {
  this.$vuetify.goTo(id).then(() => {
    if (!id) return (document.location.hash = '')

    if (history.replaceState) {
      history.replaceState(null, null, id)
    } else {
      document.location.hash = id
    }
  })
}

export function getComponent (type) {
  switch (type) {
    case 'alert': return 'doc-alert'
    case 'accessibility': return 'doc-accessibility'
    case 'api': return 'doc-api'
    case 'checklist': return 'doc-checklist'
    case 'example': return 'doc-example'
    case 'examples': return 'doc-examples'
    case 'heading': return 'base-heading'
    case 'img': return 'doc-img'
    case 'text': return 'doc-text'
    case 'markup': return 'doc-markup'
    case 'markdown': return 'base-markdown'
    case 'parameters': return 'doc-parameters'
    case 'playground': return 'doc-playground'
    case 'section': return 'doc-section'
    case 'supplemental': return 'doc-supplemental'
    case 'tree': return 'doc-tree'
    case 'up-next': return 'doc-up-next'
    case 'usage': return 'doc-usage'
    case 'usage-new': return 'doc-usage-new'
    case 'locales': return 'doc-locales'
    case 'variable-api': return 'doc-variable-api'
    default: return type
  }
}

export function parseLink (match, text, link) {
  let attrs = ''
  let icon = ''
  let linkClass = 'v-markdown--link'

  // External link
  if (
    link.indexOf('http') > -1 ||
    link.indexOf('mailto') > -1
  ) {
    attrs = `target="_blank" rel="noopener"`
    icon = 'open-in-new'
    linkClass += ' v-markdown--external'
  // Same page internal link
  } else if (link.charAt(0) === '#') {
    icon = 'pound'
    linkClass += ' v-markdown--same-internal'
  // Different page internal link
  } else {
    icon = 'page-next'
    linkClass += ' v-markdown--internal'
  }

  return `<a href="${link}" ${attrs} class="${linkClass}">${text}<i class="v-icon mdi mdi-${icon}"></i></a>`
}

export async function waitForReadystate () {
  if (
    typeof document !== 'undefined' &&
    typeof window !== 'undefined' &&
    document.readyState !== 'complete'
  ) {
    await new Promise(resolve => {
      const cb = () => {
        window.requestAnimationFrame(resolve)
        window.removeEventListener('load', cb)
      }

      window.addEventListener('load', cb)
    })
  }
}

export function genChip (item) {
  if (item.new) return 'new'
  if (item.updated) return 'updated'
  if (item.deprecated) return 'deprecated'
  if (item.help) return 'help'
}

export function getBranch () {
  const branch = window
    ? window.location.hostname.split('.')[0]
    : 'master'

  return ['master', 'dev', 'next'].includes(branch) ? branch : 'master'
}
