function addCodeRules (md) {
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const handler = fence || self.renderToken

    return `<app-code>${handler(tokens, idx, options)}</app-code>`
  }
}

function addImageRules (md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const alt = token.content
    const src = token.attrGet('src')
    const title = token.attrGet('title')

    return `<app-img src="${src}" alt="${alt}" title="${title}" />`
  }
}

function addHrRules (md) {
  md.renderer.rules.hr = function (tokens, idx, options, env, self) {
    return '<app-divider />'
  }
}

function addUnderlineRules (md) {
  function renderEm (tokens, idx, opts, env, self) {
    const token = tokens[idx]
    if (token.markup === '_') {
      token.tag = 'span'
      token.attrSet('style', 'text-decoration: underline;')
    }
    return self.renderToken(tokens, idx, opts)
  }

  md.renderer.rules.em_open = renderEm
  md.renderer.rules.em_close = renderEm
}

function addHeadingRules (md) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const level = tokens[idx].markup.length

    tokens[idx].tag = 'app-heading'
    tokens[idx].attrSet('level', level)

    return self.renderToken(tokens, idx, options)
  }
  md.renderer.rules.heading_close = (tokens, idx, options, env, self) => {
    tokens[idx].tag = 'app-heading'

    return self.renderToken(tokens, idx, options)
  }
}

function addTableRules (md) {
  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    tokens[idx].tag = 'api-table'

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
    tokens[idx].tag = 'api-table'

    return self.renderToken(tokens, idx, options)
  }
}

module.exports = {
  addCodeRules,
  addHeadingRules,
  addHrRules,
  addImageRules,
  addTableRules,
  addUnderlineRules,
}
