<template>
  <view>
    <uni-popup type="center" ref="popupM">
      <view class="notice">
        <view class="title">使用规则</view>
        <view class="cont">{{ desc }}</view>
        <view class="spaceLine"></view>
        <view class="know" @click="close">知道了</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
  // import uniPopup from '@/components/uni-popup/uni-popup.vue'
  export default {
    // components: { uniPopup },
    data() {
      return {
        desc: '',
      };
    },
    methods: {
      close() {
        this.$refs.popupM.close();
      },
      open(desc) {
        this.desc = desc;
        this.$refs.popupM.open();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .notice {
    width: 620rpx;
    // height: 552rpx;
    background: #ffffff;
    border-radius: 16rpx;
    .title {
      text-align: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 44rpx;
      color: #333333;
      line-height: 54rpx;
      text-align: center;
      font-style: normal;
    }
    .cont {
      word-break: break-all;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      color: #333333;
      line-height: 54rpx;
      text-align: justify;
      font-style: normal;
      padding: 20rpx 64rpx;
    }
    ._t {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 36rpx;
      color: #333333;
      line-height: 54rpx;
      text-align: justify;
      font-style: normal;
      padding: 20rpx 64rpx;
    }
    ._subt {
      font-size: 40rpx;
      font-weight: 400;
      color: #333333;
      line-height: 54rpx;
      text-align: center;
      margin-top: 24rpx;
      margin-bottom: 60rpx;
    }
    .spaceLine {
      width: 100%;
      height: 1rpx;
      background-color: #e5e5e5;
    }
    .know {
      font-size: 44rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 111rpx;
      text-align: center;
    }
  }
</style>
