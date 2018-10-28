import Vue from 'vue'
import Vuex from 'vuex'

const api = require('@/api/api.js')

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      api,
      appDrawer: null,
      appFooter: true,
      currentVersion: null,
      stateless: false,
      previous: {
        name: 'Components',
        color: 'primary',
        route: '/components'
      },
      next: {
        name: 'Breadcrumbs',
        color: 'green',
        route: '/components/breadcrumbs'
      },
      supporters: {
        diamond: [
          { 
            title: 'LMAX Exchange',
            size: 80,
            href: 'https://careers.lmax.com/?utm_source=vuetify&utm_medium=logo-link&utm_campaign=lmax-careers',
            src: 'backers/lmax-exchange.png'
          },
          {
            title: 'Intygrate',
            size: 80,
            href: 'http://intygrate.com/',
            src: 'backers/intygrate.png'
          }
        ],
        palladium: [
          { title: 'Eikos Partners', size: 50, href: 'http://www.eikospartners.com/', src: 'backers/eikos-partners.webp' },
          { title: 'rateGenius', size: 50, href: 'https://application.rategenius.com/', src: 'backers/rate-genius.png' }
        ],
        gold: [
          { title: 'Deister Software', href: 'http://www.deister.es/', src: 'backers/deister-logo-light.png' },
          { title: 'Cocoatech', href: 'https://cocoatech.com/', src: 'backers/cocoatechlogo.png' },
          { title: 'Cycloid', href: 'https://www.cycloid.io/', src: 'backers/cycloid.png' },
          { title: 'Live Casino', href: 'https://livecasino.com/', src: 'backers/casino.webp', dark: true },
          { title: 'Nate Controls', href: 'http://www.natecontrols.com/', src: 'backers/n8controls.png' },
          { title: 'Trek10', href: 'https://www.trek10.com/', src: 'backers/trek10.svg' }
        ],
        affiliates: [
          {
            title: 'VueJobs',
            href: 'https://vuejobs.com/?utm_source=vuejobs&utm_medium=affiliates&utm_campaign=linking',
            noref: true,
            src: 'affiliates/vuejobs-logo.svg'
          },
          { title: 'Made with Vue.js', href: 'https://madewithvuejs.com', src: 'affiliates/madewithvuejs.png' },
          { title: 'Vue.js Radar', href: 'https://vuejsradar.com', src: 'affiliates/vueradar2.png' }
        ],
        sponsors: [
          { title: 'BrowserStack', size: 35, href: 'https://www.browserstack.com/', src: 'browser-stack.png' },
          { title: 'Cloudflare', size: 35, href: 'https://www.cloudflare.com/', src: 'cloudflare.svg' }
        ]
      }
    },

    actions: {},

    mutations: {
      ['app/STATELESS'] (state, payload) {
        state.stateless = payload
      },
      ['app/DRAWER'] (state, payload) {
        state.appDrawer = payload
      },
      ['app/DRAWER_TOGGLE'] (state) {
        state.appDrawer = !state.appDrawer
      },
      ['app/FOOTER'] (state, payload) {
        state.appFooter = payload
      },
      ['app/PREVIOUS'] (state, payload) {
        state.previous = payload
      },
      ['app/NEXT'] (state, payload) {
        state.next = payload
      }
    },

    getters: {}
  })
}