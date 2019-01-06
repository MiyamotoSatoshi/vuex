var types = require('babel-types');
var pathLib = require('path');
var wrapListener = require('babel-plugin-detective/wrap-listener');

module.exports = wrapListener(listener, 'transform-sass-paths');

function listener(path, file, opts) {
  const regex = /((?:\.\.?\/)+)/gi
  if (path.isLiteral() && path.node.value.endsWith('.sass')) {
    const matches = regex.exec(path.node.value)
    if (!matches) return
    const m = matches[0].startsWith('./') ? matches[0].substr(2) : matches[0]
    const folder = path.node.value.slice(2).replace('.sass', '')
    path.node.value = path.node.value.replace(matches[0], `${m}../../../src/components/${folder}/`)
  }
}
