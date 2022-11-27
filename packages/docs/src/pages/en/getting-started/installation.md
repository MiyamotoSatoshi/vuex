---
nav: Installation
meta:
  title: Get started with Vuetify 3
  description: Details for v3 release - faq, changes, and upgrading.
  keywords: migration, releases, upgrading vuetify, beta, v3
related:
  - /getting-started/contributing/
  - /introduction/roadmap/
  - /getting-started/release-notes/
---

<script setup>
  import { version } from 'vuetify'
</script>

# Get started with Vuetify 3

Get started with Vuetify, the world’s most popular Vue.js framework for building feature rich, blazing fast applications.

![Installation Entry](https://cdn.vuetifyjs.com/docs/images/entry/installation-entry.png)

----

## Installation

To get started with Vuetify 3, simply paste the following code into your terminal:

```bash
yarn create vuetify
```

This command prompts you with a few options before generating your scaffolded Vue / Vuetify 3 project.

```bash
success Installed "create-vuetify@x.x.x" with binaries:
    - create-vuetify

? Project name: ❯ vuetify-project // the folder to generate your application
? Use TypeScript?: ❯ No / Yes
? Would you like to install dependencies with yarn, npm, or pnpm?:
  ❯ yarn
    npm
    pnpm
    none
```

After making your selections, [vuetify-create](https://github.com/vuetifyjs/create-vuetify) will generate the structure for your new application.

Once the scaffold is complete, start the vite development server by running the following commands:

```bash
cd vuetify-project
yarn dev
```

For more information regarding supported package managers, please visit their official websites:

* [yarn](https://yarnpkg.com/)
* [npm](https://npmjs.org/)
* [pnpm](https://pnpm.io/)

### SSR

Vue 3 has no way to automatically detect if SSR is used &mdash; so nuxt, gridsome, and other SSR frameworks must manually set the `ssr` option to `true` in order to properly render the application.

```js { data-resource="src/plugins/vuetify.js" }
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  ssr: true,
})
```

## Vue CLI

Vue CLI is currently in maintenance mode and no longer the default tooling used to build Vue applications. Vuetify projects are now generated using [vite](https://vitejs.dev/). We plan on enabling the Vue CLI installation path in an official guide in the future.

## Manual steps

Follow these steps if for example you are adding Vuetify to an existing project, or simply do not want to use a scaffolding tool.

`yarn add vuetify@^{{ version }}`

In the file where you create the Vue application, add the following code

```js
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
```

This will include all components and directives regardless of whether or not you are using them. If you instead only want to include used components, have a look at the [Vite](https://npmjs.com/package/vite-plugin-vuetify) or [Webpack](https://npmjs.com/package/webpack-plugin-vuetify) plugins, depending on your setup. The plugins also makes it possible to customize SCSS variables.

Lastly, do not forget to install [icons](/features/icon-fonts/).

## CDN

We recommend using the latest version of Vuetify 3 from [jsdelivr](https://www.jsdelivr.com/). All components and styles are included.

`https://cdn.jsdelivr.net/npm/vuetify@{{ version }}/dist/vuetify.min.css`

`https://cdn.jsdelivr.net/npm/vuetify@{{ version }}/dist/vuetify.min.js`

```js
const { createApp } = Vue
const { createVuetify } = Vuetify

const vuetify = createVuetify()

const app = createApp()
app.use(vuetify).mount('#app')
```

## Questions

Have a question that belongs here? Tell us in our [Discord Community](https://community.vuetifyjs.com/) or create a request on our [Issue Generator](https://issues.vuetifyjs.com/).

<promoted slug="vuetify-discord" />

<backmatter />
