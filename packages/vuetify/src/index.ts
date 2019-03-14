// Core Features
import * as components from './components'
import * as directives from './directives'

// Services
import * as services from './services'

// Styles
import './stylus/app.styl'
import './styles/main.sass'

// Utilties
import { install } from './install'

// Types
import { VuetifyUseOptions } from 'vuetify/types'
import {
  VuetifyService,
  VuetifyServiceContract
} from 'vuetify/types/services'
import { VuetifyPreset } from 'vuetify/types/presets'
import { VueConstructor } from 'vue'

export default class Vuetify {
  static install: (Vue: VueConstructor) => void
  static version: string

  framework: Record<string, VuetifyServiceContract> = {}
  installed: string[] = []
  preset: Partial<VuetifyPreset> = {}

  constructor (preset: Partial<VuetifyPreset> = {}) {
    this.preset = preset

    this.use(services.Application)
    this.use(services.Breakpoint)
    this.use(services.Goto)
    this.use(services.Icons)
    this.use(services.Lang)
    this.use(services.Theme)
  }

  // Called on the new vuetify instance
  // bootstrap in install beforeCreate
  // Exposes ssrContext if available
  init (ssrContext?: object) {
    this.installed.forEach(property => {
      const service = this.framework[property]
      service.framework = this.framework

      service.init(ssrContext)
    })

    // rtl is not installed and
    // will never be called by
    // the init process
    this.framework.rtl = Boolean(this.preset.rtl) as any
  }

  // Instantiate a VuetifyService
  use (Service: VuetifyService) {
    const property = Service.property

    if (this.installed.includes(property)) return

    this.framework[property] = new Service(this.preset[property])
    this.installed.push(property)
  }
}

Vuetify.install = (Vue, args?: VuetifyUseOptions) => {
  Vue.use(install, {
    components,
    directives,
    ...args
  })
}
Vuetify.version = __VUETIFY_VERSION__

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vuetify)
}
