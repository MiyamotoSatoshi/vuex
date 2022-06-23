---
meta:
  title: Table
  description: The table component is a lightweight wrapper around the table element that provides a Material Design feel without all the baggage.
  keywords: table, simple table, vuetify table component, vue simple table component, table component
nav: 'Tables'
related:
  - /components/data-iterators/
  - /components/data-tables/
  - /components/lists/
---

# Tables

The `v-table` component is a simple wrapper component around the `<table>` element. Inside the component you can use all the regular table elements such as `<thead>`, `<tbody>`, `<tr>`, etc.

![Table Entry](https://cdn.vuetifyjs.com/docs/images/components-temp/v-table/v-table-entry.png)

---

## Usage

<example file="v-table/usage" />

<entry />

## API

<api-inline />

## Examples

### Props

#### Theme

Use **theme** prop to switch table to another theme.

<example file="v-table/prop-dark" />

#### Density

You can show a dense version of the table by using the **density** prop.

<example file="v-table/prop-dense" />

#### Height

Use the **height** prop to set the height of the table.

<example file="v-table/prop-height" />

#### Fixed header

Use the **fixed-header** prop together with the **height** prop to fix the header to the top of the table.

<example file="v-table/prop-fixed-header" />

<backmatter />
