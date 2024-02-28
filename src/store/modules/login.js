/**
 * 登录模块
 */
export default {
  state: {
    token: uni.getStorageSync('token') || '',
    sessionId: uni.getStorageSync('sessionId') || '',
    session_key: '',
    openid: '',
    unionid: ''
  },
  getters: {
    isLogin(state) {
      return !!state.sessionId
    }
  },
  mutations: {
    setWxAuthId(state, payload) {
      payload = payload || {}
      if (payload.openId) {
        state.openid = payload.openId
        uni.setStorageSync('openid', state.openId)
      }

      if (payload.unionId) {
        state.unionid = payload.unionId
        uni.setStorageSync('unionid', state.unionId)
      }

      if (payload.wxSessionKey) {
        state.session_key = payload.wxSessionKey
        uni.setStorageSync('session_key', state.wxSessionKey)
      }
      if (payload.sessionId) {
        state.sessionId = payload.sessionId
        uni.setStorageSync('sessionId', state.sessionId)
      }
    },
    setSessionId(state, payload) {
      state.sessionId = payload
    },
    setToken(state, payload) {
      state.setToken = payload
    },
    logout(state) {
      const map = ['sessionId', 'session_key', 'openid', 'unionid']
      map.forEach(key => {
        state[key] = ''
      })
    }
  },
  actions: {
    setToken(ctx, payload) {
      ctx.commit('setToken', payload)
    },
    logout(ctx) {
      ['token', 'userInfo','sessionId'].forEach((key) => {
        uni.removeStorageSync(key)
      })
      ctx.commit('logout')
    },
    async login(ctx) {
      // const {code} = await wx.login();
      const authData = await Axios.post(`/user/login`, {})
      ctx.commit('setWxAuthId', authData.data)
    }
  }
}
