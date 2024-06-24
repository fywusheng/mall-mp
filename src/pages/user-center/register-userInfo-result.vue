<template>
  <view class="register-result flex-v flex-c-s">
    <image class="result-icon mt-80" mode="scaleToFill" src="http://192.168.1.187:10088/static/common/icon-common-success.png" />
    <text class="fs-50 lh-72 fw-bold c-primary mt-60">提交成功</text>
    <!-- <text class="fs-40 lh-60 fw-bold c-grey mt-24">立即开通商城会员</text>
    <text class="fs-40 lh-60 fw-bold c-grey">享有会员优惠折扣、积分</text> -->
    <button v-if="source === 'login'" class="button button-1 fs-44 fw-bold c-white mt-128" hover-class="none" @click="handleApplyClick">
      下一步
    </button>
    <button v-else class="button button-1 fs-44 fw-bold c-white mt-128" hover-class="none" @click="backHome">返回首页</button>
    <!-- <button
      class="button button-1 fs-44 fw-bold c-white mt-128"
      hover-class="none"
      @click="handleApplyClick"
    >
      立即开通商城会员
    </button> -->
    <!-- <button class="button button-2 fs-44 c-primary mt-32 bg-white" hover-class="none" @click="handleBackToHomeClick">返回首页</button> -->
    <!-- <pop-entry-method  ref="popup" :showImg="showImg" /> -->
    <!-- <scan-or-input-popup ref="popup" /> -->
  </view>
</template>

<script>
  // import ScanOrInputPopup from './common/scan-or-input-popup.vue';
  import api from '@/apis/index.js';
  export default {
    // components: { ScanOrInputPopup },
    data() {
      return {
        // 录入方式是否有图片
        showImg: false,
        source: '',
      };
    },
    onLoad(e) {
      if (e.source) {
        this.source = e.source;
      }
    },
    methods: {
      /**
       * 立即开通
       */
      handleApplyClick() {
        uni.navigateTo({
          url: '/pages/user-center/applicant-info',
        });
      },
      backHome() {
        uni.reLaunch({
          url: '/pages/index/index',
        });
      },
      /**
       * 返回首页
       */
      handleBackToHomeClick() {
        uni.navigateTo({
          url: '/pages/user-center/applicant-info',
        });

        // uni.reLaunch({
        //   url: '/pages/index/index',
        // });
      },
    },
    mounted() {
      //  this.$refs.popup.open()
    },
  };
</script>

<style lang="scss" scoped>
  .register-result {
    .result-icon {
      @include size(220, 176);
    }
    .button {
      @include size(600, 108);
      line-height: 108rpx;
      border-radius: 54rpx;
      &-1 {
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        margin-top: 128rpx;
      }
      &-2 {
        border: 2rpx solid #cecece;
        box-sizing: border-box;
        color: #999999;
      }
    }
  }
</style>
