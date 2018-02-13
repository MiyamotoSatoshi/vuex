import Vue from 'vue'
import Vuetify from '@components/Vuetify'
import { test } from '@util/testing'

test('Vuetify.install.js', () => {
  it('should install transitions, directives and components', async () => {
    const { component, directive, use } = Vue

    Vue.component = jest.fn()
    Vue.directive = jest.fn()
    Vue.use = jest.fn()

    Vuetify.installed = false
    Vuetify.install(Vue, {
      components: {
        component: 'foobarbaz'
      },
      directives: {
        directive: {
          name: 'foobarbaz'
        }
      },
      transitions: {
        transition: {
          name: 'transition'
        },
        'v-foobarbaz': {
          name: 'v-foobarbaz'
        },
        'undefined': {}
      }
    })

    expect(Vue.use.mock.calls).toEqual([['foobarbaz']])
    expect(Vue.directive.mock.calls).toEqual([["foobarbaz", {"name": "foobarbaz"}]])
    expect(Vue.component.mock.calls).toEqual([["v-foobarbaz", {"name": "v-foobarbaz"}]])

    Vue.use = jest.fn()
    Vuetify.install(Vue, {
      components: {
        component: 'component'
      }
    })
    expect(Vue.use).not.toBeCalled()

    Vue.component = component
    Vue.directive = directive
    Vue.use = use
  })
})
