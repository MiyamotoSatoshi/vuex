/* eslint-disable no-multi-spaces */
// Extensions
import { Service } from '../service'

// Utilities
import * as ThemeUtils from './utils'

// Types
import Vue from 'vue'
import {
  VuetifyParsedTheme,
  VuetifyThemeOptions,
  VuetifyThemes,
  VuetifyThemeVariant,
} from 'vuetify/types/services/theme'

export class Theme extends Service {
  static property = 'theme'

  public disabled = false

  public options: VuetifyThemeOptions['options']

  public styleEl?: HTMLStyleElement

  public themes: VuetifyThemes = {
    light: {
      primary: '#1976D2',   // blue.darken2
      secondary: '#424242', // grey.darken3
      accent: '#82B1FF',    // blue.accent1
      error: '#FF5252',     // red.accent2
      info: '#2196F3',      // blue.base
      success: '#4CAF50',   // green.base
      warning: '#FB8C00',    // amber.base
    },
    dark: {
      primary: '#2196F3',   // blue.base
      secondary: '#424242', // grey.darken3
      accent: '#FF4081',    // pink.accent-2
      error: '#FF5252',     // red.accent2
      info: '#2196F3',      // blue.base
      success: '#4CAF50',   // green.base
      warning: '#FB8C00',    // amber.base
    },
  }

  public defaults: VuetifyThemes = this.themes

  private isDark = null as boolean | null

  private vueInstance = null as Vue | null

  constructor (options: Partial<VuetifyThemeOptions> = {}) {
    super()
    if (options.disable) {
      this.disabled = true

      return
    }

    this.options = {
      ...this.options,
      ...options.options,
    }

    this.dark = Boolean(options.dark)
    const themes = options.themes || {}

    this.themes = {
      dark: this.fillVariant(themes.dark, true),
      light: this.fillVariant(themes.light, false),
    }
  }

  // When setting css, check for element
  // and apply new values
  set css (val: string) {
    this.checkOrCreateStyleElement() && (this.styleEl!.innerHTML = val)
  }

  set dark (val: boolean) {
    const oldDark = this.isDark

    this.isDark = val
    // Only apply theme after dark
    // has already been set before
    oldDark != null && this.applyTheme()
  }

  get dark () {
    return Boolean(this.isDark)
  }

  // Apply current theme default
  // only called on client side
  public applyTheme (): void {
    if (this.disabled) return this.clearCss()

    this.css = this.generatedStyles
  }

  public clearCss (): void {
    this.css = ''
  }

  // Initialize theme for SSR and SPA
  // Attach to ssrContext head or
  // apply new theme to document
  public init (root: Vue, ssrContext?: any): void {
    if (this.disabled) return

    /* istanbul ignore else */
    if ((root as any).$meta) {
      this.initVueMeta(root)
    } else if (ssrContext) {
      this.initSSR(ssrContext)
    }

    this.initTheme()
  }

  // Allows for you to set target theme
  public setTheme (theme: 'light' | 'dark', value: object) {
    this.themes[theme] = Object.assign(this.themes[theme], value)
    this.applyTheme()
  }

  // Reset theme defaults
  public resetThemes () {
    this.themes.light = Object.assign({}, this.defaults.light)
    this.themes.dark = Object.assign({}, this.defaults.dark)
    this.applyTheme()
  }

  // Check for existence of style element
  private checkOrCreateStyleElement (): boolean {
    this.styleEl = document.getElementById('vuetify-theme-stylesheet') as HTMLStyleElement

    /* istanbul ignore next */
    if (this.styleEl) return true

    this.genStyleElement() // If doesn't have it, create it

    return Boolean(this.styleEl)
  }

  private fillVariant (
    theme: Partial<VuetifyThemeVariant> = {},
    dark: boolean
  ): VuetifyThemeVariant {
    const defaultTheme = this.themes[dark ? 'dark' : 'light']

    return Object.assign({},
      defaultTheme,
      theme
    )
  }

  // Generate the style element
  // if applicable
  private genStyleElement (): void {
    if (typeof document === 'undefined') return

    /* istanbul ignore next */
    const options = this.options || {}

    this.styleEl = document.createElement('style')
    this.styleEl.type = 'text/css'
    this.styleEl.id = 'vuetify-theme-stylesheet'

    if (options.cspNonce) {
      this.styleEl.setAttribute('nonce', options.cspNonce)
    }

    document.head.appendChild(this.styleEl)
  }

  private initVueMeta (root: Vue) {
    const options = this.options || {}
    root.$children.push(new Vue({
      head: () => {
        return {
          style: [
            {
              cssText: this.generatedStyles,
              type: 'text/css',
              id: 'vuetify-theme-stylesheet',
              nonce: options.cspNonce,
            },
          ],
        }
      },
    } as any))
  }

  private initSSR (ssrContext?: any) {
    const options = this.options || {}
    // SSR
    const nonce = options.cspNonce ? ` nonce="${options.cspNonce}"` : ''
    ssrContext.head = ssrContext.head || ''
    ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet"${nonce}>${this.generatedStyles}</style>`
  }

  private initTheme () {
    // Only watch for reactivity on client side
    if (typeof document === 'undefined') return

    // If we get here somehow, ensure
    // existing instance is removed
    if (this.vueInstance) this.vueInstance.$destroy()

    // Use Vue instance to track reactivity
    // TODO: Update to use RFC if merged
    // https://github.com/vuejs/rfcs/blob/advanced-reactivity-api/active-rfcs/0000-advanced-reactivity-api.md
    this.vueInstance = new Vue({
      data: { themes: this.themes },

      watch: {
        themes: {
          immediate: true,
          deep: true,
          handler: () => this.applyTheme(),
        },
      },
    })
  }

  get currentTheme () {
    const target = this.dark ? 'dark' : 'light'

    return this.themes[target]
  }

  get generatedStyles (): string {
    const theme = this.parsedTheme
    /* istanbul ignore next */
    const options = this.options || {}
    let css

    if (options.themeCache != null) {
      css = options.themeCache.get(theme)
      /* istanbul ignore if */
      if (css != null) return css
    }

    css = ThemeUtils.genStyles(theme, options.customProperties)

    if (options.minifyTheme != null) {
      css = options.minifyTheme(css)
    }

    if (options.themeCache != null) {
      options.themeCache.set(theme, css)
    }

    return css
  }

  get parsedTheme (): VuetifyParsedTheme {
    /* istanbul ignore next */
    const theme = this.currentTheme || {}
    return ThemeUtils.parse(theme)
  }
}
