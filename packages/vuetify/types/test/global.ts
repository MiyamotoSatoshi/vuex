import Vue from 'vue'
import Vuetify from 'vuetify'

Vuetify.config.silent = true

Vue.component('breakpoint', {
  created () {
    const name = this.$vuetify.breakpoint.name
    const numbers: number[] = [
      this.$vuetify.breakpoint.height,
      this.$vuetify.breakpoint.width,
      this.$vuetify.breakpoint.scrollBarWidth,
    ]
    const objects: Object[] = [
      this.$vuetify.breakpoint.thresholds,
    ]
    const booleans: boolean[] = [
      this.$vuetify.breakpoint.lg,
      this.$vuetify.breakpoint.lgAndDown,
      this.$vuetify.breakpoint.lgAndUp,
      this.$vuetify.breakpoint.lgOnly,
      this.$vuetify.breakpoint.md,
      this.$vuetify.breakpoint.mdAndDown,
      this.$vuetify.breakpoint.mdAndUp,
      this.$vuetify.breakpoint.mdOnly,
      this.$vuetify.breakpoint.sm,
      this.$vuetify.breakpoint.smAndDown,
      this.$vuetify.breakpoint.smAndUp,
      this.$vuetify.breakpoint.smOnly,
      this.$vuetify.breakpoint.xl,
      this.$vuetify.breakpoint.xlOnly,
      this.$vuetify.breakpoint.xs,
      this.$vuetify.breakpoint.xsOnly,
    ]
  },
})

Vue.component('theme', {
  created () {
    // Can't do this, some components rely on the pre-defined values
    // this.$vuetify.theme = { primary: 123 }

    Object.assign(this.$vuetify.theme.themes.light, {
      primary: 123,
    })

    this.$vuetify.theme.themes.light.primary = 132
  },
})
