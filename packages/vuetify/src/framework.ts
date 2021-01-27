import { inject } from 'vue'
import { createTheme, VuetifyThemeSymbol } from './composables/theme'

// Types
import type { InjectionKey, App } from 'vue'
import type { ThemeOptions } from '@/composables/theme'

export interface VuetifyComponentDefaults {
  [key: string]: Record<string, unknown>
  global: Record<string, unknown>
}

export interface VuetifyInstance {
  defaults: VuetifyComponentDefaults
}

export interface VuetifyOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
  defaults?: Partial<VuetifyComponentDefaults>
  theme?: ThemeOptions
}

export const VuetifySymbol: InjectionKey<VuetifyInstance> = Symbol.for('vuetify')

export const useVuetify = () => {
  const vuetify = inject(VuetifySymbol)

  if (!vuetify) {
    throw new Error('Vuetify has not been installed on this app')
  }

  return vuetify
}

export const createVuetify = (options: VuetifyOptions = {}) => {
  const install = (app: App) => {
    const {
      components = {},
      directives = {},
      defaults = {},
    } = options

    for (const key in directives) {
      const directive = directives[key]

      app.directive(key, directive)
    }

    for (const key in components) {
      const component = components[key]

      app.component(key, component)
    }

    const vuetify: VuetifyInstance = {
      defaults: {
        global: {},
        ...defaults,
      },
    }

    app.provide(VuetifySymbol, vuetify)
    app.provide(VuetifyThemeSymbol, createTheme(options.theme))
    app.config.globalProperties.$vuetify = vuetify
  }

  return { install }
}
