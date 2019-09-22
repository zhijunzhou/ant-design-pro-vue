// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import Viewer from 'v-viewer'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import 'viewerjs/dist/viewer.css'

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
// import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'

Vue.config.productionTip = false

Vue.use(Viewer)
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
