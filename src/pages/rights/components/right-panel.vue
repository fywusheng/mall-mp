<template>
  <view class="right-panel flex-v bg-white p-20 br-16">
    <view class="title fs-36 fw-400 c-black">{{ info.title }}</view>
    <view class="ring flex-v flex-c-c m-16-0">
      <text class="fs-40 fw-bold">{{ info.percent }}%</text>
      <text class="fs-32 c-lightgrey">{{ info.text }}</text>
      <!-- #ifdef MP-ALIPAY -->
       <canvas :canvas-id="canvasId" class="canvas" :id="canvasId"/>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->   
      <view v-if="canvasId == 'leftPanel'">
         <view class="cirle"></view>
      </view>
      <view v-if="canvasId == 'rightPanel'">
         <view class="cirle _right"></view>
      </view>
      <!-- #endif -->
    </view>
    <view class="flex-h flex-c-c">
      <view
        class="gradient-line mr-8 br-6"
        :style="{ background: background }"
      />
      <text class="fs-32 fw-400 c-grey">{{ info.text }}：</text>
      <text class="fs-32 fw-bold c-black">{{ info.count }}项</text>
    </view>
    <button class="button fs-32" hover-class="none" @click="handleButtonClick">
      点击查看 >
    </button>
  </view>
</template>

<script>
export default {
  props: {
    info: Object,
    canvasId: String,
  },
  computed: {
    background() {
      return this.info
        ? `linear-gradient(to right, ${this.info.color2}, ${this.info.color1});`
        : "white";
    },
  },
  watch: {
    info() {
        this.draw();
    },
  },
  methods: {
    /**
     * 按钮点击事件
     */
    handleButtonClick() {
      this.$emit("click");
    },
    /**
     * 绘制环形图
     */
    draw() {
      const context = uni.createCanvasContext(this.canvasId, this);

      // 画灰色底环
      context.beginPath();
      context.arc(
        this.convert(100),
        this.convert(100),
        this.convert(100) - 6,
        0,
        2 * Math.PI
      );
      context.setLineWidth(12);
      context.setStrokeStyle("#f2f2f2");
      context.stroke();

      // 计算角度
      const degree = (Number(this.info.percent) / 100).toFixed(2) * 2 * Math.PI;
      // 设置渐变色
      const gradient = context.createLinearGradient(
        0,
        0,
        this.convert(100),
        this.convert(100)
      );
      gradient.addColorStop(0, this.info.color1);
      gradient.addColorStop(1, this.info.color2);
      // 画进度条
      context.beginPath();
      context.arc(
        this.convert(100),
        this.convert(100),
        this.convert(100) - 6,
        Math.PI / 2,
        degree + Math.PI / 2
      );
      context.setLineWidth(12);
      context.setLineCap("round");
      context.setStrokeStyle(gradient);
      context.stroke();
      context.draw();
    },
    convert(length) {
      return Math.round((uni.getSystemInfoSync().windowWidth * length) / 750);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-panel {
  width: 294rpx;
  .ring {
    position: relative;
    height: 200rpx;
    .canvas {
      @include square(200);
      position: absolute;
    }
    .cirle{
      position: absolute;
      width: 158rpx;
      height: 158rpx;
      border: 25rpx solid #FF8800;
      border-radius: 50%;
      top: 0;
      right: 44rpx;
    }
    ._right{
       border: 25rpx solid #F2F2F2;
    }
  }
  .gradient-line {
    @include size(32, 12);
  }
  .button {
    color: #00b0ff;
    text-align: left;
  }
}
</style>
