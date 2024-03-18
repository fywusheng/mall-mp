// 老年训练
<template>
  <view class="older-train">
    <image class="icon-1" :src="icon1" mode="scaleToFill" />
    <image class="icon-2" :src="icon2" mode="scaleToFill" />
    <image class="icon-3" :src="icon3" mode="scaleToFill" />
    <image class="icon-4" :src="icon4" mode="scaleToFill" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        icon1: 'http://192.168.1.187:10088/static/rights/icon-train1.png',
        icon2: 'http://192.168.1.187:10088/static/rights/icon-train2.png',
        icon3: 'http://192.168.1.187:10088/static/rights/icon-train3.png',
        icon4: 'http://192.168.1.187:10088/static/rights/icon-train4.png',
      };
    },
  };
</script>

<style lang="scss" scoped>
  .older-train {
    background-color: #f5f5f5;
    .icon-1 {
      width: 100%;
      height: 1978rpx;
    }
    .icon-2 {
      width: 100%;
      height: 1688rpx;
    }
    .icon-3 {
      width: 100%;
      height: 1530rpx;
    }
    .icon-4 {
      width: 100%;
      height: 1780rpx;
    }
  }
</style>
