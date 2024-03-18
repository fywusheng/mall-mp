// 问卷结果
<template>
  <view>
    <uni-popup type="center" ref="popupM">
      <view class="notice">
        <view class="_center">
          <image
            class="_img"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/rights/icon-result.png"
          />
          <view class="score">
            <text>{{ score }}</text>
            <text class="txt">分</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  export default {
    components: { uniPopup },
    data() {
      return {
        str: '<',
        score: 0,
      };
    },
    methods: {
      close() {
        this.$refs.popupM.close();
        this.$emit('close', 1);
      },
      open(score) {
        this.score = score || 0;
        this.$refs.popupM.open();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .notice {
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
    border-radius: 16rpx;
    ._center {
      width: 100%;
      position: relative;
    }
    ._img {
      width: 750rpx;
      height: 1416rpx;
    }
    .score {
      font-size: 64rpx;
      font-weight: 500;
      color: #ff5000;
      position: absolute;
      top: 357rpx;
      left: 354rpx;
      .txt {
        font-size: 26rpx;
        font-weight: 400;
      }
    }
  }
</style>
