// Styles
import 'prism-theme-vars/base.css'

// App
import App from './App.vue'

// Virtual
// import 'virtual:api'
import { setupLayouts } from 'virtual:generated-layouts'

// Plugins
import { pinia, usePinia } from '@/plugins/pinia'
import { useGlobalComponents } from '@/plugins/global-components'
import { useGtag } from '@/plugins/gtag'
import { useI18n } from '@/plugins/i18n'
import { useLocaleStore } from '@/store/locale'
import { usePwa } from '@/plugins/pwa'
import { useUserStore } from '@/store/user'
import { useVuetify } from '@/plugins/vuetify'
import { ViteSSG } from '@vuetify/vite-ssg'

// Utilities
import { generatedRoutes, languagePattern, rpath, trailingSlash } from '@/util/routes'

// Globals
import { IN_BROWSER } from '@/util/globals'

const routes = setupLayouts(generatedRoutes)

const localeStore = useLocaleStore(pinia)
const userStore = useUserStore(pinia)

localeStore.$subscribe((_, state) => {
  window.localStorage.setItem('currentLocale', state.locale)
})

userStore.$subscribe(() => {
  userStore.save()
})

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: [
      {
        path: '/',
        redirect: () => {
          return { path: `/${localeStore.locale}/` }
        },
      },
      ...routes,
      {
        path: `/:locale(${languagePattern})/:pathMatch(.*)*`,
        component: () => import('@/layouts/404.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: to => {
          return rpath(to.fullPath)
        },
      },
    ],
    async scrollBehavior (to, from, savedPosition) {
      let main = IN_BROWSER && document.querySelector('main')

      if (!main) {
        await (new Promise(resolve => setTimeout(resolve, 1000)))
        main = document.querySelector('main')
      }

      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
          top: main ? parseInt(getComputedStyle(main).getPropertyValue('--v-layout-top')) : 0,
        }
      } else if (savedPosition) return savedPosition
      else return { top: 0 }
    },
  },
  ctx => {
    ctx.app.config.errorHandler = (err, vm, info) => {
      console.error(err, vm, info)
    }
    ctx.app.config.warnHandler = (err, vm, info) => {
      console.warn(err, vm, info)
    }

    ctx.router.beforeEach(({ path, hash }, from, next) => {
      return path.endsWith('/') ? next() : next(`${trailingSlash(path)}` + hash)
    })
    ctx.router.onError(err => {
      console.error(err)
    })

    useGlobalComponents(ctx)
    useGtag(ctx)
    useI18n(ctx)
    usePwa(ctx)
    usePinia(ctx)
    useVuetify(ctx)
  },
)
