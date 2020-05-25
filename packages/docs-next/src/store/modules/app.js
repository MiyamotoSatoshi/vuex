// Pathify
import { make } from 'vuex-pathify'
import pages from '@docs/pages'

const state = {
  pages,
}

const mutations = make.mutations(state)

const actions = {
  init: ({ dispatch }) => {
    dispatch('ads/fetch', null, { root: true })
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
