import Vue from 'vue'
import store from './store'
import App from './App'
import '@/config/axios'

import share from '@/utils/share'
Vue.mixin(share)

// global.Store = Store
// global.State = Store.state
Vue.prototype.$store = store

Vue.config.productionTip = false

const app = new Vue({
  ...App,
  store
})
app.$mount()
