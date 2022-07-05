/* eslint-disable jest/no-commented-out-tests */

import { createTheme } from '../theme'
import { createApp } from 'vue'
import type { App } from 'vue'

describe('createTheme', () => {
  let app: App

  beforeEach(() => {
    const child = document.querySelector('#vuetify-theme-stylesheet')
    child && document.head.removeChild(child)
    app = createApp({})
  })

  it('should create style element', async () => {
    createTheme(app)

    expect(document.head).toMatchSnapshot()
  })

  it('should not generate style element if disabled', async () => {
    createTheme(app, false)

    expect(document.head).toMatchSnapshot()
  })

  it('should generate on-* colors', async () => {
    const theme = createTheme(app)

    const colors = [
      'on-background',
      'on-surface',
      'on-primary',
      'on-secondary',
      'on-success',
      'on-warning',
      'on-error',
      'on-info',
    ]

    for (const color of colors) {
      expect(theme.computedThemes.value.light.colors).toHaveProperty(color)
    }
  })

  it('should generate color variants', async () => {
    const theme = createTheme(app, {
      variations: {
        colors: ['primary', 'secondary'],
        lighten: 2,
        darken: 2,
      },
    })

    for (const color of ['primary', 'secondary']) {
      for (const variant of ['lighten', 'darken']) {
        for (const amount of [1, 2]) {
          expect(theme.computedThemes.value.light.colors).toHaveProperty(`${color}-${variant}-${amount}`)
          expect(theme.computedThemes.value.light.colors).toHaveProperty(`on-${color}-${variant}-${amount}`)
        }
      }
    }
  })

  it('should update existing theme', async () => {
    const theme = createTheme(app, {
      variations: false,
    })

    expect(theme.computedThemes.value.light.colors.background).not.toBe('#FF0000')

    theme.themes.value.light = {
      ...theme.themes.value.light,
      colors: {
        ...theme.themes.value.light.colors,
        background: '#FF0000',
      },
    }

    expect(theme.computedThemes.value.light.colors.background).toBe('#FF0000')
  })

  it('should set a CSP nonce if configured', async () => {
    createTheme(app, { cspNonce: 'my-csp-nonce' })

    const styleElement = document.getElementById('vuetify-theme-stylesheet')
    expect(styleElement?.getAttribute('nonce')).toBe('my-csp-nonce')
  })

  it('should not set a CSP nonce if option was left blank', async () => {
    createTheme(app, {})

    const styleElement = document.getElementById('vuetify-theme-stylesheet')
    expect(styleElement?.getAttribute('nonce')).toBeNull()
  })

  // it('should use vue-meta@2.3 functionality', () => {
  //   const theme = createTheme()
  //   const set = jest.fn()
  //   const $meta = () => ({
  //     addApp: () => ({ set }),
  //   })
  //   ;(instance as any).$meta = $meta as any
  //   theme.init(instance)
  //   expect(set).toHaveBeenCalled()
  // })

  // it('should set theme with vue-meta@2', () => {
  //   const theme = mockTheme()
  //   const anyInstance = instance as any
  //   anyInstance.$meta = () => ({
  //     getOptions: () => ({ keyName: 'metaInfo' }),
  //   })
  //   theme.init(anyInstance)
  //   const metaKeyName = anyInstance.$meta().getOptions().keyName
  //   expect(typeof anyInstance.$options[metaKeyName]).toBe('function')
  //   const metaInfo = anyInstance.$options[metaKeyName]()
  //   expect(metaInfo).toBeTruthy()
  //   expect(metaInfo.style).toHaveLength(1)
  //   expect(metaInfo.style[0].cssText).toMatchSnapshot()
  // })

  // it('should set theme with vue-meta@1', () => {
  //   const theme = mockTheme()
  //   const anyInstance = instance as any
  //   anyInstance.$meta = () => ({})
  //   theme.init(anyInstance)
  //   expect(typeof anyInstance.$options.metaInfo).toBe('function')
  //   const metaInfo = anyInstance.$options.metaInfo()
  //   expect(metaInfo).toBeTruthy()
  //   expect(metaInfo.style).toHaveLength(1)
  //   expect(metaInfo.style[0].cssText).toMatchSnapshot()
  // })
})
