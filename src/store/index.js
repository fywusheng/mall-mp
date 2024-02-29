import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'
import checkout from './modules/checkout'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '12321'
  },
  mutations: {},
  actions: {},
  modules: {
    user,
    checkout
  },
  plugins: [
		createPersistedState({
			paths: ['user'],
			storage: { // 存储方式定义  
				getItem: (key) => uni.getStorageSync(key), // 获取  
				setItem: (key, value) => uni.setStorageSync(key, value), // 存储  
				removeItem: (key) => uni.removeStorageSync(key) // 删除  
			}
		})
	],
  strict: false
})
