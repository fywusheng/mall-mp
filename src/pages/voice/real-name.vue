// 米粒实名认证
<template>
  <view class="real-name">
    <real-name-pop ref="realpop" @succFlag="succFlag" />
  </view>
</template>

<script>
import api from '@/apis/index.js'
import RealNamePop from './real-name-pop/real-name-pop.vue'
export default {
  components: { RealNamePop },
  data() {
    return {
      backUrl: ''
    }
  },
  onLoad(options) {
    this.backUrl = options.backUrl
    uni.setStorageSync('mili_back_url', this.backUrl)
  },
  mounted() {
    this.$refs.realpop.open()
  },
  methods: {
    async succFlag(flag) {
      if (flag == 1) {
        const userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', userinfor)
        this.userInfo = userinfor
        uni.navigateTo({ url: `/pages/voice/real-name-result` })
      }
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      api.getUserInfo({
        data: {
          accessToken: uni.getStorageSync('token')
        },
        success: (data) => {
          uni.$emit('didLogin', data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.real-name {
  height: 100vh;
  background: #ffffff;
}
</style>
