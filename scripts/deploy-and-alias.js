const shell = require('shelljs')

const alias = process.argv[2]

if (!alias) {
  console.error('Alias not defined')
  process.exit(1)
}

const options = {
  env: process.env
}

const child = shell.exec('now --team=vuetifyjs --token=$NOW_TOKEN --npm', options)
if (child.code !== 0) {
  process.exit(child.code)
}
const instanceUrl = child.stdout

shell.exec(`now alias set ${instanceUrl} ${alias} --team=vuetifyjs --token=$NOW_TOKEN`, options)
