<template>
  <view class="step">
    <view class="step_box">
      <!-- 左侧进度线 -->
      <view class="step_left"></view>

      <view class="step_right">
        <view class="right_content" v-for="(item, index) in stepData" :key="index">
          <!-- 进度名称 -->
          <block v-if="item.isNow == 0">
            <p class="title"  :style="{ color: item.type == 1 ? '#909399' : '#999' }">{{ item.name }}</p>
          </block>
          <block v-if="item.isNow == 1">
            <p class="title" :style="{ color: item.type == 1 ? colors : '#999' ,fontWeight: 'bold', fontSize: '28rpx' }">{{ item.name }}</p>
          </block>
          <!-- 进度时间 -->
          <p class="times" v-if="item.type == 1" :style="{ color: item.isNow == 1 ? colors : '#909399' }">{{ item.time }}</p>
          <!-- 进度详情备注 -->
          <p class="result" v-if="item.desc && item.desc !== ''">
            <text style="color: #202020">{{ item.desc }}</text>
          </p>
          <!-- 右侧的进度点 -->
          <p class="status" :class="item.isNow == 1 ? 'active' : ''" :style="{ background: item.isNow == 1 ? '#FF5500' : '#ccc', borderColor: item.isNow == 1 ? '#FF5500' : '#ccc' }">
            {{ item.isNow == 1 ? '✓' : '' }}
          </p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      colors: {
        type: String,
      },
      stepData: {
        type: Array,
      },
    },
    methods: {
      jumpNext(item) {
        this.$emit('itemClick', item);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .step {
    padding: 40upx 20upx;
    margin-bottom: 20upx;
  }

  .step_box {
    margin: 0 20upx;
    margin-left: 20upx;
    display: flex;

    .step_left {
      width: 2upx;
      display: block;
      background-color: #dddddd;
      overflow: hidden;
    }

    .step_right {
      margin-left: 20upx;
      margin-top: -10upx;

      .right_content {
        position: relative;
        margin-bottom: 30upx;

        .title {
          font-size: 24upx;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #333333;
        }

        .times {
          font-size: 24upx;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #999999;
          line-height: 28upx;
        }

        .status {
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
          border: 2upx solid #ccc;
          position: absolute;
          top: 10upx;
          background-color: #ccc;
          left: -26rpx;
          color: white;
          line-height: 12px;
          font-size: 10px;
          text-align: center;
          &.active {
            width: 40rpx;
            height: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28rpx;
            left: -37rpx;
          }
        }

        .result {
          padding: 10upx 15upx;
          background-color: #f6f6f6;
          font-size: 22upx;
          margin-top: 10upx;
          border: 1upx dashed #ddd;
        }

        &:last-of-type {
          margin-bottom: 0;

          .status {
            top: 14upx;
          }

          &::before {
            content: '';
            width: 6upx;
            height: 100%;
            background-color: #ffffff;
            position: absolute;
            top: 22upx;
            left: -24upx;
          }
        }
      }
    }
  }
</style>
