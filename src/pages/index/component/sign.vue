<template>
  <uni-popup ref="popup" type="bottom">
    <view class="sign-pop">
      <view class="header">
        <image
          class="sign-time"
          src="http://192.168.1.187:10088/static/songhui/mine/sign-time.png"
          mode="scaleToFill"
        />
        <text class="bold">每日签到</text>
        <view class="normal">
          <text>已连续签到</text>
          <text class="day">{{ signDay }}</text>
          <text>天</text>
        </view>
      </view>
      <view class="sign-wrapper">
        <view v-for="(item, index) in signTotalDay" :key="index" class="sign-item">
          <view :class="{ 'no-sign': index + 1 > signDay }" class="sign-img">
            <image
              class="icon"
              src="http://192.168.1.187:10088/static/songhui/mine/sign-gold.png"
              mode="scaleToFill"
            />
            <view class="point">{{ index > 4 ? '+2' : '+1' }}</view>
            <view v-if="item < signDay" class="has-sign">
              <image
                class="right-icon"
                src="http://192.168.1.187:10088/static/songhui/mine/sign-right.png"
                alt=""
              />
            </view>
          </view>

          <view v-if="item + 1 < signDay" class="label has">已签</view>
          <view v-if="item + 1 === signDay" class="label today">今天</view>
          <view v-if="item + 1 > signDay && item + 1 < 7" class="label normal">
            第{{ index + 1 }}天
          </view>
          <view v-if="item + 1 === 7" class="label last">第7天</view>
        </view>
      </view>
      <view class="btn" @click="close">确定</view>
    </view>
  </uni-popup>
</template>

<script>
  import { UniPopup } from '@dcloudio/uni-ui';
  export default {
    name: 'sign',
    components: { UniPopup },
    props: {
      signDay: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        signTotalDay: 7,
      };
    },
    methods: {
      open() {
        this.$refs.popup.open('center');
      },
      close() {
        this.$refs.popup.close();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sign-pop {
    position: relative;
    width: 682rpx;
    height: 720rpx;
    padding: 100rpx 24rpx 0;
    background-size: 100% 100%;
    background-image: url('http://192.168.1.187:10088/static/songhui/mine/sign-bg.png');
    .header {
      // margin: 100rpx 0 0 24rpx;
      display: flex;
      align-items: center;
      .sign-time {
        width: 52rpx;
        height: 52rpx;
      }
      .bold {
        height: 56rpx;
        font-size: 40rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 56rpx;
        margin: 0 20rpx 0 12rpx;
      }
      .normal {
        font-size: 36rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #ffeeca;
        display: flex;
        align-items: center;
        .day {
          font-weight: 500;
          font-size: 44rpx;
          margin: 0 10rpx;
        }
      }
    }
    .sign-wrapper {
      margin-top: 76rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sign-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .sign-img {
          position: relative;
          width: 82rpx;
          height: 174rpx;
          background: #fff1da;
          border-radius: 16rpx;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          align-items: center;
          &.no-sign {
            background: #f2f2f2;
          }
          .icon {
            width: 52rpx;
            height: 52rpx;
            margin-top: 20rpx;
            margin-bottom: 12rpx;
          }
          .point {
            font-size: 36rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #a26b34;
          }
          .has-sign {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 82rpx;
            height: 30rpx;
            background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
            border-radius: 0rpx 0rpx 16rpx 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .right-icon {
              width: 28rpx;
              height: 18rpx;
            }
          }
        }
        .label {
          height: 40rpx;
          width: 84rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 40rpx;
          margin-top: 44rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          &.has {
            color: #999999;
          }
          &.today {
            color: #ff5500;
            background: #fff1da;
            border-radius: 23rpx 0 0 23rpx;
          }
          &.normal {
            color: #ff5500;
            background: #fff1da;
          }
          &.last {
            color: #ff5500;
            background: #fff1da;
            border-radius: 0 23rpx 23rpx 0;
          }
        }
      }
    }
    .btn {
      position: absolute;
      bottom: 48rpx;
      left: 42rpx;
      width: 600rpx;
      height: 108rpx;
      line-height: 108rpx;
      background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
      border-radius: 54rpx;
      font-size: 44rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }
  }
</style>
