---
meta:
  title: Search Engine
  description: Add Vuetify as a search engine to your Chrome browser for quick access to the documentation
  keywords: search engine, vuetify search engine, vuetify chrome search engine, vuetify chrome extension
related:
  - /getting-started/quick-start/
  - /getting-started/why-vuetify/
---

# Search engine

Add Vuetify as a browser search engine for quick access to the documentation.

<entry />

## Setup

The Vuetify documentation supports being a search engine for your browser. This allows you to query directly from the url bar without having to navigate to the site first. To add Vuetify as a search engine, follow the steps below:

### For Chrome

1. Open Chrome settings
  ![image](https://github.com/vuetifyjs/vuetify/assets/9064066/3b83a0a1-a51d-4c88-bf1b-0200a1f6b532) { class="mb-n4" }
2. Search for "Manage search engines and site search"
  ![search](https://github.com/vuetifyjs/vuetify/assets/9064066/8fd8f1e4-ebed-4c8a-9444-16163c580a60) { class="mb-n4" }
3. Scroll down to "Site search" and click the <v-kbd>Add</v-kbd> button to add a new search engine
  ![image](https://github.com/vuetifyjs/vuetify/assets/9064066/87d7775f-0f92-4f12-b9dd-01195f80df31) { class="mb-n4" }
4. Enter the following information into the "Add search engine" dialog:

* Search engine: `Vuetify` { .ms-4 }
* Shortcut: `vt` (or whatever you prefer) { .ms-4 }
* URL with %s in place of query: `https://vuetifyjs.com/?search=%s` { .ms-4 }

5. Hit the <v-kbd>Add</v-kbd> button to save the search engine
6. Open your browster and type `vt` into the url bar followed by a space or tab:
  ![image](https://github.com/vuetifyjs/vuetify/assets/9064066/07869a65-bcc4-44c2-a900-3f69eea1be4b) { class="mb-n4" }
7. Type your search query and hit enter to search the Vuetify documentation
  ![image](https://github.com/vuetifyjs/vuetify/assets/9064066/e91092f4-f308-4ed4-9b4a-33ac189aec19)
