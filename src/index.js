import Vuetify from './util/vuetify'
import Directives from './directives/_index'
import Components from './components/_index'

function plugin(Vue) {
  if (Vue.prototype.hasOwnProperty('$vuetify')) {
    return
  }

  Object.keys(Directives).forEach(key => {
    Vue.directive(key, Directives[key])
  })
  
  Object.keys(Components).forEach(key => {
    Vue.component(key, Components[key])
  })

  Vue.vuetify = Vuetify

  Object.defineProperty(Vue.prototype, '$vuetify', {
    get: () => Vue.vuetify
  })
}

module.exports = plugin