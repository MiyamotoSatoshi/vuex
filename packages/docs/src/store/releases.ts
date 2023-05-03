// Plugins
import octokit from '@/plugins/octokit'
import type { components as octokitComponents } from '@octokit/openapi-types'

// Utilities
import { defineStore } from 'pinia'

export type Release = octokitComponents['schemas']['release']

export type State = {
  releases: Release[]
  isLoading: boolean
  page: number
}

export const useReleasesStore = defineStore('releases', {
  state: (): State => ({
    releases: [] as Release[],
    isLoading: false,
    page: 1,
  }),

  actions: {
    format (release: Release) {
      return {
        ...release,
        published_at: new Date(release.published_at as any).toDateString(),
        props: {
          prependIcon: `mdi-numeric-${release.tag_name.slice(1, 2)}-box`,
          title: release.tag_name,
        },
      }
    },
    async fetch () {
      this.isLoading = true

      const res = await octokit.request('GET /repos/vuetifyjs/vuetify/releases', {
        page: this.page,
        order: 'created_at',
      })
      const data = res.data

      for (const release of data) {
        this.releases.push(this.format(release))
      }

      this.isLoading = false
      this.page++
    },
    async find (tag: string) {
      const found = this.releases.find(release => release.tag_name === tag)

      if (found) return found

      const res = await octokit.request(`GET /repos/vuetifyjs/vuetify/releases/tags/${tag}`)

      if (res.data) {
        this.releases.push(this.format(res.data))

        return res.data
      }
    },
  },
})
