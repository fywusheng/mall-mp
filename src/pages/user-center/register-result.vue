<template>
  <view class="register-result flex-v flex-c-s">
    <image class="result-icon mt-80" mode="scaleToFill" src="http://192.168.1.187:10088/static/common/icon-common-success.png" />
    <text class="fs-50 lh-72 fw-bold c-primary mt-60">恭喜您，注册成功</text>
    <!-- <text class="fs-40 lh-60 fw-bold c-grey mt-24">立即开通商城会员</text>
    <text class="fs-40 lh-60 fw-bold c-grey">享有会员优惠折扣、积分兑换</text> -->
    <button class="button button-1 fs-44 fw-bold c-white mt-128" hover-class="none" @click="handleBackToHomeClick">下一步</button>
    <!-- <button class="button button-1 fs-44 fw-bold c-white mt-128" hover-class="none" @click="handleApplyClick">立即开通</button>
    <button class="button button-2 fs-44 c-primary mt-32 bg-white" hover-class="none" @click="handleBackToHomeClick">暂不开通</button> -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 录入方式是否有图片
        // showImg: false,
      };
    },
    methods: {
      /**
       * 立即开通
       */
      handleApplyClick() {
        uni.navigateTo({
          url: '/pages/user-center/activate-member',
        });
      },
      /**
       * 暂不开通
       */
      handleBackToHomeClick() {
        uni.navigateTo({
          url: '/pages/user-center/applicant-info',
        });
      },
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
