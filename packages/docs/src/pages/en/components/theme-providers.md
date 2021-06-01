---
meta:
  title: Theme provider component
  description: The theme provider allows you to style a section of your application in a different theme from the default
  keywords: theme provider, vuetify theme provider component, vue theme provider component
related:
  - /features/theme/
---

# Theme providers

The theme provider allows you to style a section of your application in a different theme from the default

## API

- [v-theme-provider](/api/v-theme-provider)

## Examples

### Background

By default, `v-theme-provider` is a renderless component that allows you to change the applied theme for all of its children. When using the **with-background** prop, the `v-theme-provider` wraps its children in an element and applies the selected theme's background color to it.

<example file="v-theme-provider/prop-with-background">
