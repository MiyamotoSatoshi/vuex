---
meta:
  title: Browser support
  description: Vuetify is a progressive framework that supports all evergreen browsers.
  keywords: vuetify browser support
related:
  - /getting-started/installation/
  - /getting-started/frequently-asked-questions/
  - /features/sass-variables/
---

# Browser support

Vuetify 3 is a next generation framework that takes advantage of the latest web technology features and requires an evergreen browser to function. This is not an exhaustive list of compatible browsers, but the main targeted ones.

<entry />

## Browsers

| Browser                 | Status                     |
|-------------------------|----------------------------|
| Chromium (Chrome, Edge) | ✅ Supported <sup>*</sup>   |
| Firefox                 | ✅ Supported <sup>*</sup>   |
| Safari 15.4+            | ✅ Supported                |
| Safari 13.1             | ❗ Requires polyfill        |
| Edge <79                | ⛔ Not supported            |
| Internet Explorer       | ⛔ Not supported            |
| Other Browsers          | ❓ Not officially supported |

<p class="text-caption">* All browsers on iOS use WebKit so have the same support as Safari</p>

Safari and some older versions of other browsers require polyfills to work correctly. You can use [babel and core-js](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) for this, or you can use [polyfill.io](https://polyfill.io/v3/) like we do on this site:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver,ResizeObserver,WebAnimations,Object.fromEntries,Array.prototype.at"></script>
```

Support for even older browsers may be possible with additional polyfills and [PostCSS plugins](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-logical), but has not been tested and is not guaranteed. If you need to support older browsers we recommend using Vuetify 2.

<backmatter />
