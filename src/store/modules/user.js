
export default {
  state: {
    token: uni.getStorageSync('token') || '',
    sessionId: uni.getStorageSync('sessionId') || '',
    session_key: '',
    openid: '',
    unionid: '',
    userInfo: null, //  平台用户数据
    wxUserInfo: null // 微信用户信息
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
      state.token = payload
    },
    logout(state) {
      const map = ['sessionId', 'session_key', 'openid', 'unionid','userInfo', 'token']
      map.forEach(key => {
        state[key] = ''
      })
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setWxUserInfo(state, payload) {
      state.wxUserInfo = payload
    }
  },
  actions: {
    // 设置token
    setToken(ctx, payload) {
      ctx.commit('setToken', payload)
    },
    // 退出登录
    logout(ctx) {
      ['token', 'userInfo','sessionId'].forEach((key) => {
        uni.removeStorageSync(key)
      })
      ctx.commit('logout')
    },
    // 登录
    async login({commit, dispatch}) {
      // const {code} = await wx.login();
      const authData = await Axios.post(`/user/login`, {})
      commit('setWxAuthId', authData.data)

      await dispatch('getUserInfo')
    },
    // 获取用户信息
    async getUserInfo({ commit, state }) {
      const params = {token: state.token}
      const result = await Axios.post('/member/sh/memberInformation/getMemberInfoById', params);
      if (result.code == 200) {
        if(result.data.iconUrl===''){
          result.data.iconUrl = 'http://192.168.1.187:10088/static/user-center/icon-user-center-default-avatar.png'
        }
        // 已实名用户
        if(result.data.idCard === '' ||result.data.idCard === ' '){
          result.data.crtfStas = false
        }else{
          result.data.crtfStas  = true
        }
        
        commit('setUserInfo', result.data)
        uni.setStorageSync('userInfo', result.data)
      } else {
        uni.showToast({icon:'none',title: result.msg || result.data});
      }
    },
  }
}
