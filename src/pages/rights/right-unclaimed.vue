<template>
  <div class="unclaimed">
    <view class="flex-v flex-c-c status-box">
      <image src="http://192.168.1.187:10088/static/common/status-none2x.png" mode="scaleToFill" />
      <view class="flex-c-c status-text">暂无未领取的权益</view>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
  .unclaimed {
    min-height: 100vh;
    background-color: #fff;
    .status-box {
      padding-top: 300rpx;
      image {
        width: 440rpx;
        height: 234rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
  }
</style>
