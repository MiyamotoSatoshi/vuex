import './styles/main.sass'
import * as components from './components'
import * as directives from './directives'
import { createVuetify as _createVuetify } from './framework'
import type { VuetifyOptions } from './framework'

export const createVuetify = (options: VuetifyOptions = {}) => {
  return _createVuetify({ components, directives, ...options })
}

export const version = __VUETIFY_VERSION__
createVuetify.version = version

export {
  components,
  directives,
}
export * from './composables'
