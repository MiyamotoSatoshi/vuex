import { intToHex } from '../../../util/colorUtils'
import * as Theme from '../../../util/theme'

export default {
  data: () => ({
    style: null
  }),

  computed: {
    parsedTheme () {
      return Theme.parse(this.$vuetify.theme)
    },
    /** @return string */
    generatedStyles () {
      const theme = this.parsedTheme
      let css

      if (this.$vuetify.options.themeCache != null) {
        css = this.$vuetify.options.themeCache.get(theme)
        if (css != null) return css
      }

      const colors = Object.keys(theme)
      css = `a { color: ${intToHex(theme.primary)}; }`

      for (let i = 0; i < colors.length; ++i) {
        const name = colors[i]
        const value = theme[name]
        if (this.$vuetify.options.themeVariations.includes(name)) {
          css += Theme.genVariations(name, value).join('')
        } else {
          css += Theme.genBaseColor(name, value)
        }
      }

      if (this.$vuetify.options.minifyTheme != null) {
        css = this.$vuetify.options.minifyTheme(css)
      }

      if (this.$vuetify.options.themeCache != null) {
        this.$vuetify.options.themeCache.set(theme, css)
      }

      return css
    },
    vueMeta () {
      return {
        style: [{
          cssText: this.generatedStyles,
          type: 'text/css',
          id: 'vuetify-theme-stylesheet'
        }]
      }
    }
  },

  // Regular vue-meta
  metaInfo () {
    return this.vueMeta
  },

  // Nuxt
  head () {
    return this.vueMeta
  },

  watch: {
    generatedStyles () {
      !this.meta && this.applyTheme()
    }
  },

  created () {
    if (this.$meta) {
      // Vue-meta
      // Handled by metaInfo()/nuxt()
    } else if (typeof document === 'undefined' && this.$ssrContext) {
      // SSR
      this.$ssrContext.head = this.$ssrContext.head || ''
      this.$ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet">${this.generatedStyles}</style>`
    } else if (typeof document !== 'undefined') {
      // Client-side
      this.genStyle()
      this.applyTheme()
    }
  },

  methods: {
    applyTheme () {
      if (this.style) this.style.innerHTML = this.generatedStyles
    },
    genStyle () {
      let style = document.getElementById('vuetify-theme-stylesheet')

      if (!style) {
        style = document.createElement('style')
        style.type = 'text/css'
        style.id = 'vuetify-theme-stylesheet'
        document.head.appendChild(style)
      }

      this.style = style
    }
  }
}
