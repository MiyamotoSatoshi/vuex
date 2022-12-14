---
meta:
  title: Accessibility (a11y)
  description: See examples and the advantages of having accessibility (a11y) support in Vuetify components.
  keywords: a11y, accessibility, usability
related:
  - /features/bidirectionality/
  - /components/menus/
---

# Accessibility (a11y)

Web accessibility **(a11y for short)**, is the inclusive practice of ensuring there are no barriers that prevent the interaction with, or access to, websites on the World Wide Web by people with disabilities. Vuetify components are built to provide keyboard interactions for all mouse-based actions and utilize HTML5 semantic elements where applicable.

<promoted slug="vuetify-fundamentals-cheat-sheet" />

## Material Design Accessibility

Google provides a detailed overview on how their components are created with a11y in mind. They also provide examples of how you can ensure that you are using best practices when creating applications (beyond what is supported by default with Vuetify). You can find more information about [implementing accessibility](https://material.io/design/usability/accessibility.html) on the specification site.

## Activator slots

Vuetify uses activator slots for many components such as `v-menu`, `v-dialog` and more. In some instances these activator elements should have specific a11y attributes that associate them with their corresponding content. In order to achieve this, we pass down the necessary a11y options through the slots scope.

```html
<!-- Vue Template HTML Markup -->

<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
      >
        Click me
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="method">
        <v-list-item-title>Option 1</v-list-item-title>
      </v-list-item>

      <v-list-item disabled>
        <v-list-item-title>Option 2</v-list-item-title>
      </v-list-item>

      <v-list-item @click="method">
        <v-list-item-title>Option 3</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
```

When the activator element is rendered, it will now contain the bound a11y attributes:

```html
<!-- Rendered `v-btn` HTML Output -->

<button
  aria-expanded="false"
  aria-haspopup="true"
  role="button"
  type="button"
>
  Click me
</button>
```

## Item slots

There are some instances where you utilize a slot for a component and will need the correct aria attributes to bind to your elements. When using (**v-slot**) this is passed down to you in the slots scope, as the `v-menu` example above demonstrated. However, there are other components that are more complex in which you will need to bind attributes to the correct components to ensure proper support.

### v-select

The `v-select` component will automatically configure all required a11y attributes. Each item will generate a corresponding **id**, **aria-labelledby**, **aria-selected** and **roles** by default:

```html
<!-- Vue Template HTML Markup -->

<template>
  <v-select
    :items="['Foo', 'Bar']"
    label="Items"
  ></v-select>
</template>
```

When rendered, the `v-select` component's content will look similar to this:

```html
<!-- Rendered `v-select-list` content HTML Output -->

<div
  role="listbox"
  tabindex="-1"
>
  <div
    aria-labelledby="foo-list-item-12"
    aria-selected="true"
    class="v-list-item"
    role="option"
    tabindex="0"
  >
    <div
      class="v-list-item__title"
      id="foo-list-item-12"
    >
      Foo
    </div>
  <div
    aria-labelledby="bar-list-item-13"
    aria-selected="false"
    class="v-list-item"
    role="option"
    tabindex="0"
  >
    <div
      id="bar-list-item-13"
      class="v-list-item__title"
    >
      Bar
    </div>
  </div>
</div>
```

However, when using slots there are conditions in which you will need to utilize the passed down properties to get the proper aria setup. This information also applies to `v-autocomplete`, `v-combobox` and `v-overflow-btn` as they all extend the `v-select` component.

<example file="accessibility/select-list-item" />

<promoted slug="vuetify-github-sponsors" />

When providing a `v-list-item` component in a slot, the aria attributes are passed through the **attrs** data property and can be bound with `v-bind`.

```html
<!-- Vue Template HTML Markup -->

<template>
  <v-select
    :items="['Fizz', 'Buzz']"
    label="Items"
  >
    <template v-slot:item="{ item, attrs, on }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
      >
        <v-list-item-content>
          <v-list-item-title
            :id="attrs['aria-labelledby']"
            v-text="item.title"
          ></v-list-item-title>

          <v-list-item-subtitle v-text="item.sub"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-select>
</template>
```

In order to properly associate a label with the correct _option_ you will need to bind `attrs.id` to the `aria-labelled-by` on your `v-list-item-title`. This will ensure that the text is properly associated. Keep in mind, this is done automatically for you if you are not using slots.

## Focus management and keyboard interactions

Beyond attributes, components such as `v-menu` also support interaction by pressing <kbd>↑</kbd> and <kbd>↓</kbd> for navigating between options.

### v-menu

When inside of a `v-menu`, `v-list-item` will be automatically configured to have a role of **menuitem**. Navigate to the [Menu](/components/menus) for more information on the components features.

<example file="accessibility/menu" />

When the `v-menu` component is rendered it will resemble the following:

```html
<!-- Rendered `v-menu` content HTML Output -->

<div
  class="v-menu__content"
  role="menu"
>
  <div class="v-list">
    <div
      class="v-list-item"
      role="menuitem"
      tabindex="0"
    >
      ...
    </div>
    <div
      aria-disabled="true"
      class="v-list-item"
      role="menuitem"
      tabindex="-1"
    >
      ...
    </div>
  </div>
</div>
```

## Additional Resources

While Vuetify attempts to make a11y as easy as possible in your application, there are times where additional information is needed. Below you can find a list of helpful resources.

- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [The A11Y Project](https://a11yproject.com/)"
