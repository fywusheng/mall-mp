<template>
  <view class="submit-result">
    <!-- #ifdef MP-ALIPAY -->
    <!-- <navigation-bar /> -->
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <!-- <navigation-bar title="申请结果" :shows-back-button="true" /> -->
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="flex-v flex-c-s">
      <image
        class="result-icon mt-80"
        mode="scaleToFill"
        src="http://192.168.1.187:10088/static/certificate/icon-certificate-submit-success.png"
      />
      <text class="fs-50 c-primary mt-54">恭喜你实名认证成功</text>

      <button class="button fs-44 c-white" hover-class="none" @click="handleBackToHomeClick">
        返回
      </button>
    </view>
  </view>
</template>

<script>
import api from '@/apis/index.js'
// import NavigationBar from '@/components/common/navigation-bar.vue'
export default {
  components: {},
  data() {
    return {
      backUrl: '',
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 是否为自己申领
      isForSelf: false,
      // 是否显示积分弹窗
      showsCreditsPopup: false
    }
  },
  onLoad() {
    this.backUrl = uni.getStorageSync('mili_back_url')
  },
  methods: {
    goback() {
      api.getUserAndAddress({
        data: {},
        success: (data) => {
          const { appid, sign, timestamp } = data
          const token = encodeURIComponent(JSON.parse(data.data).token)
          const env = 'wechat_miniapp'
          const url = `${ENV.MILI_URL}/#/pages/encrypted-entry/index?data=${token}&appid=${appid}&timestamp=${timestamp}&sign=${sign}&env=${env}&redirectUrl=${this.backUrl}`
          console.log(url, '返回url:')
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
          })
        },
        fail: (error) => {
          console.log(error)
        }
      })
    },
    /**
       * 导航栏返回键的点击事件
       */
    handleNavigationBack() {
      console.log('处理导航栏返回键点击事件')
      this.goback()
    },
    /**
       * 返回首页点击事件
       */
    handleBackToHomeClick() {
      console.log('===fanh')
      this.goback()
    }
  }
}
</script>

<style lang="scss" scoped>
  .submit-result {
    .result-icon {
      @include size(220, 176);
    }
    .button {
      @include size(686, 108);
      margin-top: 200rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
    .credits-popup {
      position: fixed;
      top: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      .credits-image {
        @include size(750, 812);
      }
      .close-icon {
        @include square(72);
      }
    }
  }
</style>
