// Utilities
import { merge } from 'lodash-es'

// Globals
import { IN_BROWSER } from '@/util/globals'

import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export type RootState = {
  v: 2
  api: 'link-only' | 'inline'
  dev: boolean
  composition: ('options' | 'composition')
  pwaRefresh: boolean
  theme: string
  mixedTheme: boolean
  direction: 'rtl' | 'ltr'
  quickbar: boolean
  notifications: {
    show: boolean
    read: string[]
    last: {
      banner: string[]
      v2banner: null | number
      install: null | number
      notification: null | number
      promotion: null | number
      jobs: null | number
    }
  }
}

type SavedState = {
  api: boolean
  drawer: { alphabetical: boolean, mini: boolean }
  last: {
    install: null | number
    notification: null | number
    promotion: null | number
    jobs: null | number
  }
  pwaRefresh: boolean
  rtl: boolean
  theme: {
    dark: boolean
    system: boolean
    mixed: boolean
  }
} | {
  api: 'link-only' | 'inline'
  pwaRefresh: boolean
  theme: string
  mixedTheme: boolean
  direction: 'rtl' | 'ltr'
  notifications: {
    read: string[]
    last: {
      install: null | number
      notification: null | number
      promotion: null | number
      jobs: null | number
    }
  }
} | {
  v: 1
  api: 'link-only' | 'inline'
  dev?: boolean
  composition?: ('options' | 'composition') | ('options' | 'composition')[]
  pwaRefresh: boolean
  theme: string
  mixedTheme: boolean
  direction: 'rtl' | 'ltr'
  quickbar?: boolean
  notifications: {
    show?: boolean
    read: string[]
    last: {
      banner?: null | number | string[]
      v2banner?: null | number
      install: null | number
      notification: null | number
      promotion: null | number
      jobs: null | number
    }
  }
} | RootState

export const useUserStore = defineStore('user', () => {
  const state = reactive<RootState>({
    v: 2,
    api: 'link-only',
    dev: false,
    composition: 'options',
    pwaRefresh: true,
    theme: 'system',
    mixedTheme: true,
    direction: 'ltr',
    quickbar: true,
    notifications: {
      show: true,
      read: [],
      last: {
        banner: [],
        v2banner: null,
        install: null,
        notification: null,
        promotion: null,
        jobs: null,
      },
    },
  })

  function load () {
    if (!IN_BROWSER) return

    const stored = localStorage.getItem('vuetify@user')
    const data = stored ? JSON.parse(stored) : {}
    const needsRefresh = data.v === state.v

    if (!data.v) {
      data.pwaRefresh = true
      if (typeof data.api === 'boolean') {
        data.api = data.api ? 'inline' : 'link-only'
      }
      if (typeof data.rtl === 'boolean') {
        data.direction = data.rtl ? 'rtl' : 'ltr'
        delete data.rtl
      }
      if (typeof data.theme === 'object') {
        data.mixedTheme = data.theme.mixed
        data.theme = data.theme.system ? 'system'
          : data.theme.dark ? 'dark'
          : 'light'
      }
      if (Array.isArray(data.notifications)) {
        data.notifications = { read: data.notifications }
      }
      if (typeof data.last === 'object') {
        data.notifications.last = data.last
        delete data.last
      }
    }

    if (data.v === 1) {
      if (Array.isArray(data.composition)) {
        data.composition = 'composition'
      }
      if (!Array.isArray(data.notifications.last.banner)) {
        data.notifications.last.banner = []
      }
    }

    data.v = state.v
    Object.assign(state, merge(state, data))
    if (needsRefresh) {
      save()
    }
  }

  function save () {
    if (!IN_BROWSER) return

    localStorage.setItem('vuetify@user', JSON.stringify(state, null, 2))
  }

  load()

  return { ...toRefs(state), load, save }
})
