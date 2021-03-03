---
meta:
  title: Get started with Vuetify
  description: Get started with Vue and Vuetify in no time. Support for Vue CLI, Webpack, Nuxt and more.
  keywords: quick start, vuetify templates, installing vuetify, install vuetify
related:
  - /introduction/why-vuetify/
  - /getting-started/frequently-asked-questions/
  - /getting-started/browser-support/
---

# Installation

Get started with Vuetify, the world’s most popular Vue.js framework for building feature rich, blazing fast applications.

<entry-ad />

## Vue CLI Install

<alert type="error">

  The current stable version of Vuetify does not support Vue 3. Support for Vue 3 will come with the release of [Vuetify v3](/introduction/roadmap/#v30-titan). When creating a new project meant for production, please ensure you selected Vue 2 from the Vue CLI prompts, or that you are installing to an existing Vue 2 project. If you would like to create or use Vuetify v3 for testing purposes, you can read more information at [Vuetify v3 Alpha install](#vuetify-v3-alpha-install)

</alert>

<alert type="warning">

  For information on how to use Vue CLI, visit the [official documentation](https://cli.vuejs.org/).

</alert>

If you have not already created a new Vue.js project using **Vue CLI**, you can do so by typing:

```bash
vue create my-app
# navigate to new project directory
cd my-app
```

Now that you have an instantiated project, you can add the Vuetify [Vue CLI package](https://github.com/vuetifyjs/vue-cli-plugins/tree/master/packages/vue-cli-plugin-vuetify-cli) using the cli.

```bash
vue add vuetify
```

<alert type="warning">

  This command will make changes to your project template files, components folder, vue.config.js, etc. If you are installing Vuetify via Vue-CLI, make sure you commit your code to avoid any potential data loss. Template changes can be skipped by selecting the advanced install option during install.

</alert>

### Vue UI install

Vuetify can also be installed using **Vue UI**, the new visual application for Vue CLI. Ensure that you have the latest version of Vue CLI installed, then from your terminal type:

```bash
# ensure Vue CLI is >= 3.0
vue --version

# Then start the UI
vue ui
```

This will start the Vue User Interface and open a new window in your browser. On the left side of your screen, click on **Plugins**. Once there, search for Vuetify in the input field and install the plugin.

![Install Vuetify Plugin](https://cdn.vuetifyjs.com/images/quick-start/vue_ui.png "Vue UI Vuetify Plugin")

## Vuetify v3 Alpha install

<alert type="error">

Before proceeding, it is important to note that this installation is intended primarily for testing purposes, and should not be considered for production applications.

</alert>

In order for the installation to proceed correctly, **vue-cli 4.0** is required. Further instructions are available at [vue-cli](https://github.com/vuejs/vue-cli).

Once installed, generate a project with the following command using the **vue-cli 4.0**:

```bash
vue create my-app
```

When prompted, choose `Vue 3 Preview`:

```bash
? Please pick a preset: 
    Default ([Vue 2] babel, eslint) 
  > Default (Vue 3 Preview) ([Vue 3] babel, eslint)
    Manually select features 
```

It is recommended to commit or stash your changes at this point, in case you need to rollback the changes.

Next, navigate to your project directory and add Vuetify to your project:

```bash
cd my-app
vue add vuetify
```

Once prompted, choose V3 (alpha):

```bash
? Choose a preset: (Use arrow keys)
  Default (recommended) 
  Prototype (rapid development) 
  Configure (advanced) 
> V3 (alpha)
```

If you have any questions or run into issues, please reach out to our [Discord community](https://community.vuetifyjs.com/).

## Nuxt install

Vuetify can be added by installing the Nuxt Vuetify module.

```bash
yarn add @nuxtjs/vuetify -D
# OR
npm install @nuxtjs/vuetify -D
```

Once installed, update your nuxt.config.js file to include the Vuetify module in the build.

```js
// nuxt.config.js
{
  buildModules: [
    // Simple usage
    '@nuxtjs/vuetify',

    // With options
    ['@nuxtjs/vuetify', { /* module options */ }]
  ]
}
```

<alert type="info">

  [Find more information for the Nuxt Community module on GitHub](https://github.com/nuxt-community/vuetify-module)

</alert>

## Webpack install

To install Vuetify into a Webpack project you need to add a few dependencies:

```bash
yarn add vuetify
// yarn add vuetify@npm:@vuetify/nightly
// yarn add vuetify@npm:@vuetify/nightly@dev
// yarn add vuetify@npm:@vuetify/nightly@next
# OR
npm install vuetify
// npm install vuetify@npm:@vuetify/nightly
// npm install vuetify@npm:@vuetify/nightly@dev
// npm install vuetify@npm:@vuetify/nightly@next
```

```bash
yarn add sass sass-loader deepmerge -D
# OR
npm install sass sass-loader deepmerge -D
```

Once installed, locate your `webpack.config.js` file and copy the snippet below into the rules array. If you have an existing sass rule configured, you may need to apply some or all of the changes below. If you are you looking to utilize the vuetify-loader for treeshaking, ensure that you are on version >=4 of Webpack. You can find more information on setting it up with webpack on the [Treeshaking](/features/treeshaking/) page.

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
              indentedSyntax: true // optional
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentedSyntax: true // optional
              },
            },
          },
        ],
      },
    ],
  }
}
```

Create a plugin file for Vuetify, `src/plugins/vuetify.js` with the below content:

```js
// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)
```

If using vuetify-loader use the content below:

```js
// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)
```

Navigate to your main entry point where you instantiate your Vue instance and pass the Vuetify object in as an option.

```js
// src/main.js

import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export

new Vue({
  vuetify,
}).$mount('#app')
```

### Font installation

Vuetify uses Google's Roboto font and Material Design Icons. The simplest way to install these are to include their CDN's in your main `index.html` file.

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
```

## Usage with CDN

To test using Vuetify without installing a template from Vue CLI, copy the code below into your `index.html` file. This will pull the latest version of Vue and Vuetify, allowing you to start playing with components. You can also use the [Vuetify starter](https://template.vuetifyjs.com) on Codepen. While not recommended, if you need to utilize the CDN packages in a production environment, it is recommended that you scope the versions of your assets. For more information on how to do this, navigate to the jsdelivr website.

<alert type="warning">

  In order for your application to work properly, you must wrap it in a `v-app` component. See the Application component page for more information.

</alert>

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>
  <div id="app">
    <v-app>
      <v-main>
        <v-container>Hello world</v-container>
      </v-main>
    </v-app>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
  <script>
    new Vue({
      el: '#app',
      vuetify: new Vuetify(),
    })
  </script>
</body>
</html>
```

## Usage with Electron

To use Vuetify with Electron, add the electron-builder plugin via Vue CLI.

```bash
# Install
vue add electron-builder

# Usage
yarn electron:build
yarn electron:serve
```

## Usage with PWA

If you are creating a new app with Vue CLI, you have the option to select Progressive Web App (PWA) Support in the first prompt after initiating vue create my-app. This package can also be installed into existing Vue CLI projects by entering the following command:

```bash
vue add pwa
```

## Usage with Cordova

To use Vuetify with Cordova, add the Cordova plugin via Vue CLI:

```bash
# If cordova is not already installed
yarn global add cordova

# Install
vue add cordova

# Usage
yarn cordova-serve-android # Development Android
yarn cordova-build-android # Build Android
yarn cordova-serve-ios # Development IOS
yarn cordova-build-ios # Build IOS
yarn cordova-serve-browser # Development Browser
yarn cordova-build-browser # Build Browser
```

## Usage with Capacitor

To use Vuetify with **Capacitor**, add the [Capacitor](https://github.com/capacitor-community/vue-cli-plugin-capacitor) plugin via Vue CLI:

```bash
# Install
$ vue add @nklayman/capacitor

# Usage
$ yarn capacitor:serve
```

## Usage with Vuepress

There are 2 ways we can use Vuetify with default **vuepress** theme. Either by  registering vuetify as a plugin in [vuepress](https://vuepress.vuejs.org/) `.vuepress/enhanceApp.js` file (code sample below), or by using vuetify directly from CDN:

```js
// register vuetify as a global plugin with vuepress
// .vuepress/enhanceApp.js
import Vuetify from 'vuetify'

export default ({
  Vue,      // the version of Vue being used in the VuePress app
  options,  // the options for the root Vue instance
  router,   // the router instance for the app
  siteData,  // site metadata
}) => {
  Vue.use(Vuetify)
}

// Alternatively, use vuetify directly from CDN.
// Update head section in .vuepress/config.js as follows
module.exports = {
  head: [
    ['link', {
      rel: 'stylesheet',
      href: `https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css`
    }],
    ['script', { src: `https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js` }],
    ['script', { src: `https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js` }],
  ]
}
```

<backmatter />
