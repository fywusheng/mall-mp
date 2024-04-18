<template>
  <view class="min-collapse">
    <view @click.stop="handleClick">
      <text>{{ desc }}</text>
      <image
        src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
        mode="scaleToFill"
      ></image>
    </view>
    <view
      :class="[
        textDirection == 'left'
          ? 'content'
          : textDirection == 'center'
          ? 'content-center'
          : 'content-right',
        isShow ? 'content-heigth' : 'content-none',
      ]"
      @click.stop="click"
    >
      <slot></slot>
      <view class="flex-list">
        <view
          :key="index"
          :class="['list', current == index ? hightLine : '']"
          v-for="(item, index) in list"
          @touchstart="handleTouchstart(index)"
          @touchend="handleTouchend(index)"
          @click="handleItemClick(index, item.serviceOrder)"
        >
          {{ item.serviceName }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    list: {
      type: [Array, String],
      default: () => []
    },
    desc: {
      type: String,
      default: 'item'
    },
    textDirection: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      hightLine: 'hight-line',
      // list当前item下标
      current: 0
    }
  },
  watch: {
    list(n, o) {
      console.log('==n==', n)
      console.log('==o==', o)
    }
  },
  onLoad() {},
  methods: {
    handleClick() {
      this.isShow = !this.isShow
      this.$emit('clickTab')
    },
    closeClick() {
      this.isShow = false
    },
    click() {},
    handleTouchstart(index) {
      this.current = index
    },
    handleTouchend(index) {
      this.current = -1
    },
    handleItemClick(index, serviceOrder) {
      this.current = index
      this.$emit('handleItemClick', serviceOrder)
    }
  }
}
</script>
<style lang="scss" scoped>
  .min-collapse {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90rpx;
    image {
      width: 20rpx;
      height: 15rpx;
      margin-left: 10rpx;
    }
    .content {
      position: absolute;
      top: 90rpx;
      left: 0;
      width: 100vw;
      max-height: 0;
      transition: max-height 0.5s ease;
      overflow: hidden;
      background: #fff;
      padding: 20rpx 0 20rpx 0;
      box-shadow: 0px 0px 4rpx #888888;
      box-sizing: border-box;
    }
    .content-heigth {
      max-height: 1000rpx !important;
    }
    .content-none {
      opacity: 0;
    }
    .content-center {
      position: absolute;
      top: 90rpx;
      left: -100%;
      width: 100vw;
      max-height: 0;
      transition: max-height 0.5s ease;
      overflow: hidden;
      background: #fff;
      padding: 20rpx 0 20rpx 0;
      box-shadow: 0px 0px 4rpx #888888;
      box-sizing: border-box;
    }
    .content-right {
      position: absolute;
      top: 90rpx;
      right: 0;
      width: 100vw;
      max-height: 0;
      transition: max-height 0.5s ease;
      overflow: hidden;
      background: #fff;
      padding: 20rpx 0 0 0;
      box-shadow: 0px 0px 4rpx #888888;
      box-sizing: border-box;
    }

    .flex-list {
      display: flex;
      // justify-content: center;
      padding: 0 24rpx;
      align-items: center;
      flex-wrap: wrap;
      .list {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 176rpx;
        height: 66rpx;
        margin: 0 28rpx;
      }
      .hight-line {
        background: rgba(255, 85, 0, 0.1);
        color: #ff5500;
      }
    }
  }
</style>
