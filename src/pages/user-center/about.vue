<template>
  <view class="about">
    <view class="logon">
      <image src="http://192.168.1.187:10088/static/songhui/common/logo.jpg" class="logoicon" />
    </view>
    <view class="title">松辉云康</view>
    <view class="v-num">版本号 {{ version }}</view>
    <view class="bottom">
      <view class="xieyi">
        <view class="user" @click="handleUserAgreementClick">《用户协议》</view>
        <view class="user" @click="handlePrivacyPolicyClick">《隐私政策》</view>
      </view>
      <view class="version">松辉云康｜国家老龄服务平台版权所有</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        version: ENV.VERSION,
      };
    },

    methods: {
      /**
       * 用户协议点击事件
       */
      handleUserAgreementClick() {
        const url = `${ENV.H5}/#/agreement?type=0`;
        uni.navigateTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
        });
      },
      /**
       * 隐私协议点击事件
       */
      handlePrivacyPolicyClick() {
        const url = `${ENV.H5}/#/agreement?type=1`;
        uni.navigateTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .about {
    margin: 0 auto;
    overflow: hidden;
    .logon {
      width: 200rpx;
      height: 200rpx;
      margin: 100rpx auto 50rpx auto;
      .logoicon {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      height: 66rpx;
      font-size: 48rpx;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      line-height: 66rpx;
      text-align: center;
    }
    .v-num {
      height: 56rpx;
      font-size: 40rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 56rpx;
      margin-bottom: 545rpx;
      text-align: center;
      margin-top: 44rpx;
    }
    .bottom {
      .xieyi {
        display: flex;
        justify-content: center;
        align-items: center;
        .user {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #45a9f1;
          line-height: 50rpx;
        }
        margin-bottom: 16rpx;
      }
      .version {
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 50rpx;
        text-align: center;
      }
    }
  }
</style>
