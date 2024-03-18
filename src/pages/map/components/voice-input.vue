<template>
  <view class="voice-input">
    <template v-if="shouldDisplay">
      <view
        class="mask animated"
        :style="{ background: 'rgba(0, 0, 0, ' + alpha + ')' }"
        @click="close"
      />
      <view class="panel animated bg-white flex-v" :style="{ height: height + 'rpx' }">
        <image
          class="close-icon"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/common/icon-common-close.png"
          @click="close"
        />
        <view v-if="isSpeaking" class="animation flex-h flex-c-c">
          <view v-for="index in 21" class="item mr-12 br-4" :key="index" />
        </view>
        <view v-else class="examples flex-v">
          <text class="fs-28 c-black">你可以试试这样说:</text>
          <text class="fs-28 c-lightgrey">按摩椅/保温杯/养生产品</text>
        </view>
        <text class="tip fs-28 c-grey mt-48">按住说话</text>
        <image
          class="icon mt-20"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/common/icon-common-voice-input.png"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        />
      </view>
    </template>
  </view>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // 是否显示
        shouldDisplay: false,
        // 蒙版透明度
        alpha: 0,
        // 语音输入面板高度
        height: 0,
        // 是否正在说话
        isSpeaking: false,
      };
    },
    watch: {
      show(newValue) {
        newValue ? this.open() : this.close();
      },
    },
    onReady() {
      // #ifdef MP-WEIXIN
      this.initRecordRecognitionManager();
      // #endif
    },
    methods: {
      /**
       * 语音输入图标点击开始
       */
      handleTouchStart() {
        console.log('start');
        this.$emit('start');
        this.manager.start();
      },
      /**
       * 语音输入图标点击结束
       */
      handleTouchEnd() {
        console.log('end');
        this.$emit('end');
        this.manager.stop();
      },
      /**
       * 打开语音输入面板
       */
      open() {
        this.shouldDisplay = true;
        setTimeout(() => {
          this.alpha = 0.1;
          this.height = 540;
        }, 100);
      },
      /**
       * 关闭语音输入面板
       */
      close() {
        this.alpha = 0;
        this.height = 0;
        setTimeout(() => {
          this.shouldDisplay = false;
        }, 300);
      },
      /**
       * 初始化微信语音转文字插件
       */
      initRecordRecognitionManager() {
        // eslint-disable-next-line no-undef
        const plugin = requirePlugin('WechatSI');
        const manager = plugin.getRecordRecognitionManager();
        const self = this;
        manager.onStart = function () {
          console.log('语音输入开始');
          self.isSpeaking = true;
        };
        manager.onRecognize = function (res) {
          self.$emit('change', res.result);
        };
        manager.onStop = function (res) {
          console.log('语音输入结束');
          self.isSpeaking = false;
          self.$emit('change', res.result);
          self.close();
        };
        manager.onError = function (res) {
          console.error('语音输入报错: ', res.msg);
        };
        this.manager = manager;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .voice-input {
    .mask {
      position: fixed;
      top: 0;
      width: 100vw;
      height: 100vh;
    }
    .panel {
      position: fixed;
      bottom: 0;
      width: 100vw;
      border-radius: 16rpx 16rpx 0 0;
      align-items: center;
      .close-icon {
        @include square(32);
        position: absolute;
        top: 40rpx;
        right: 40rpx;
      }
      .examples {
        margin-top: 110rpx;
        align-items: center;
      }
      .animation {
        margin-top: 110rpx;
        height: 80rpx;
        .item {
          width: 8rpx;
          height: 25%;
          background: $color-primary;
          &:nth-child(1) {
            animation: load 1.25s 1s infinite linear;
          }
          &:nth-child(2) {
            animation: load 1s 0.9s infinite linear;
          }
          &:nth-child(3) {
            animation: load 1.25s 0.8s infinite linear;
          }
          &:nth-child(4) {
            animation: load 1.5s 0.7s infinite linear;
          }
          &:nth-child(5) {
            animation: load 1.25s 0.6s infinite linear;
          }
          &:nth-child(6) {
            animation: load 1s 0.5s infinite linear;
          }
          &:nth-child(7) {
            animation: load 1.25s 0.4s infinite linear;
          }
          &:nth-child(8) {
            animation: load 1.5s 0.3s infinite linear;
          }
          &:nth-child(9) {
            animation: load 1.25s 0.2s infinite linear;
          }
          &:nth-child(10) {
            animation: load 1s 0.1s infinite linear;
          }
          &:nth-child(11) {
            animation: load 1.25s 0s infinite linear;
          }
          &:nth-child(12) {
            animation: load 1.5s 0.1s infinite linear;
          }
          &:nth-child(13) {
            animation: load 1.25s 0.2s infinite linear;
          }
          &:nth-child(14) {
            animation: load 1s 0.3s infinite linear;
          }
          &:nth-child(15) {
            animation: load 1.25s 0.4s infinite linear;
          }
          &:nth-child(16) {
            animation: load 1.5s 0.5s infinite linear;
          }
          &:nth-child(17) {
            animation: load 1.25s 0.6s infinite linear;
          }
          &:nth-child(18) {
            animation: load 1s 0.7s infinite linear;
          }
          &:nth-child(19) {
            animation: load 1.25s 0.8s infinite linear;
          }
          &:nth-child(20) {
            animation: load 1.5s 0.9s infinite linear;
          }
          &:nth-child(21) {
            animation: load 1.25s 1s infinite linear;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .icon {
        @include square(200);
      }
    }
  }
  @keyframes load {
    0% {
      background: $color-primary;
      height: 25%;
    }
    50% {
      background: $color-secondary;
      height: 100%;
    }
    100% {
      background: $color-primary;
      height: 25%;
    }
  }
</style>
