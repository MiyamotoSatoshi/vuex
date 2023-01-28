import path, { join } from 'path'
import fs from 'fs'

import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteFonts from 'vite-plugin-fonts'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
// import Components from 'unplugin-vue-components/vite'
import Markdown from 'vite-plugin-md'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import Vuetify from 'vite-plugin-vuetify'
import basicSsl from '@vitejs/plugin-basic-ssl'

import { configureMarkdown, parseMeta } from './build/markdown-it'
import Api from './build/api-plugin'
import { Examples } from './build/examples-plugin'

const resolve = (file: string) => path.resolve(__dirname, file)

const ssrTransformCustomDirective = () => {
  return {
    props: [],
    needRuntime: true,
  }
}

export default defineConfig(({ command, mode, ssrBuild }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    logLevel: 'info',
    resolve: {
      alias: [
        { find: '@', replacement: `${resolve('src')}/` },
        { find: 'node-fetch', replacement: 'isomorphic-fetch' },
        { find: 'vue-i18n', replacement: 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.mjs' },
        { find: /^vue$/, replacement: ssrBuild ? 'vue' : 'vue/dist/vue.esm-bundler.js' },
      ],
    },
    define: {
      'process.env': {}, // This is so that 3rd party packages don't crap out
    },
    build: {
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    plugins: [
      // https://github.com/stafyniaksacha/vite-plugin-fonts
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),

      Api(),

      // https://github.com/antfu/unplugin-vue-components
      // Components({
      //   deep: true,
      //   dirs: ['src/components-v3'],
      //   directoryAsNamespace: true,
      //   globalNamespaces: ['icons'],
      //   dts: true,
      //   extensions: ['vue', 'md'],
      //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      // }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        layoutsDirs: 'src/layouts',
      }),

      // https://github.com/antfu/vite-plugin-md
      Markdown({
        wrapperComponent: 'unwrap-markdown',
        wrapperClasses: '',
        headEnabled: true,
        markdownItSetup: configureMarkdown,
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
        dirs: [
          { dir: 'src/pages', baseRoute: 'pages' },
          { dir: 'src/api', baseRoute: 'api' },
        ],
        extendRoute (route) {
          const [base, locale, ...folders] = route.component.split('/').slice(2)
          const paths = [locale]

          if (base !== 'pages') paths.push(base)

          for (const folder of folders) {
            if (folder.match('index')) continue

            // remove file extensions if present
            paths.push(folder.replace(/\.[a-z]*/, ''))
          }

          const [category, ...rest] = paths.slice(1)
          const meta = {
            layout: 'default',
            ...parseMeta(route.component),
          }

          if (meta.disabled) {
            return null
          }

          return {
            ...route,
            path: `/${paths.join('/')}/`,
            name: `${category ?? meta.layout}${rest.length ? '-' + rest.join('-') : ''}`,
            meta: {
              ...meta,
              category,
              page: rest?.join('-'),
              locale,
            },
          }
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        srcDir: 'src',
        filename: 'service-worker.js',
        strategies: 'injectManifest',
        includeAssets: ['favicon.ico'],
        injectManifest: {
          globIgnores: ['**/*.html'],
          additionalManifestEntries: [
            { url: '/_crowdin.html', revision: Date.now().toString(16) },
            { url: '/_fallback.html', revision: Date.now().toString(16) },
          ],
          dontCacheBustURLsMatching: /assets\/.+[A-Za-z0-9]{8}\.(js|css)$/,
          maximumFileSizeToCacheInBytes: 24 * 1024 ** 2,
        },
        manifest: {
          name: 'Vuetify',
          description: 'Vuetify UI Library Documentation',
          short_name: 'Vuetify',
          theme_color: '#1867C0',
          icons: [
            {
              src: 'img/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'img/icons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),

      Vue({
        include: [/\.vue$/, /\.md$/],
        // https://github.com/vuejs/vue-next/issues/3298
        template: {
          compilerOptions: {
            directiveTransforms: {
              ripple: ssrTransformCustomDirective,
            },
          },
        },
      }),

      Vuetify({
        autoImport: false,
        styles: command === 'serve' || mode === 'development' ? 'sass' : true,
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
      VueI18n({
        compositionOnly: true,
        include: [resolve('src/i18n/messages/**')],
      }),

      Examples(),

      {
        name: 'vuetify:codepen-blocks',
        transform (code, id) {
          const type = id.includes('vue&type=codepen-additional') ? 'codepenAdditional'
            : id.includes('vue&type=codepen-resources') ? 'codepenResources'
            : null
          if (!type) return

          return {
            code: `export default Comp => Comp['${type}'] = \`${code.replace(/`/g, '\\`')}\``,
            map: null,
          }
        },
      },

      {
        name: 'vuetify:fallback',
        enforce: 'post',
        transformIndexHtml (html) {
          fs.writeFileSync(join('dist/_fallback.html'), html)
          fs.writeFileSync(join('dist/_crowdin.html').replace(/<\/head>/, `
<script type="text/javascript">let _jipt = [['project', 'vuetify']];</script>
<script type="text/javascript" src="//cdn.crowdin.com/jipt/jipt.js"></script>
$&`), html)
        },
      },

      Inspect(),

      process.env.HTTPS === 'true' ? basicSsl() : undefined,
    ],

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'sync',
      formatting: 'minify',
      crittersOptions: false,
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
      ],
      exclude: [
        'vue-demi',
      ],
    },

    ssr: {
      noExternal: ['vue-i18n', '@vuelidate/core'],
    },

    server: {
      port: +(process.env.PORT ?? 8080),
    },

    preview: {
      https: process.env.HTTPS === 'true',
    },
  }
})
