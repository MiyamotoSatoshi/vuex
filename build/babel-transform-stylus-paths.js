var types = require('babel-types');
var pathLib = require('path');
var wrapListener = require('babel-plugin-detective/wrap-listener');

module.exports = wrapListener(listener, 'transform-stylus-paths');

function listener(path, file, opts) {
  const regex = /((?:\.\.\/)+)/gi
  if (path.isLiteral() && path.node.value.endsWith('.styl')) {
    const matches = regex.exec(path.node.value)
    if (!matches) return

    path.node.value = path.node.value.replace(matches[0], `${matches[0]}../src/`)
  }
}
