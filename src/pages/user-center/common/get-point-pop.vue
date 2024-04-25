<template>
  <!-- 积分领取 -->
  <div class="get-point">
    <uni-popup ref="popup" background="none">
      <view class="pop-content">
        <view class="content" @click="getPoint">
          <image class="content-header" :src="content.popUpImg" mode="scaleToFill" />
          <view class="cont">
            <view class="cont-title">1. 签到积分</view>
            <view class="cont-text">
              <text class="fw-500">【每日签到】</text>
              用户每天登录商城并签到，即可获得1积分。
            </view>
            <view class="cont-text">
              <text class="fw-500">【连续签到奖励】</text>
              第1天至第5天：1积分/天；第6天至第7天：2积分/天。
            </view>

            <view class="cont-title">2. 商城购物</view>
            <view class="cont-text">
              用户在商城成功支付订单后并最终完成订单，可获得
              <text class="fw-500">【订单实付金额×1%=该笔订单的积分奖励】</text>
              ，所获积分为整数，不保留小数点后位数。
            </view>

            <view class="cont-title">3. 商品分享</view>
            <view class="cont-text">
              用户将商品分享至微信好友或朋友圈，
              <text class="fw-500">每次分享可获得1积分，每天最多获得10积分</text>
              。
            </view>

            <view class="cont-title">4. 生日积分</view>
            <view class="cont-text">
              用户
              <text class="fw-500">生日当天可获得平台赠送10积分</text>
              。
            </view>
          </view>
        </view>

        <image class="icon-close" @click="close" :src="icon.close" mode="scaleToFill" />
      </view>
    </uni-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        icon: {
          // bg: 'http://192.168.1.187:10088/static/images/common/icon-get-point.png',
          close: 'http://192.168.1.187:10088/static/common/icon-close.png',
        },
        content: {
          popUpTitle: '领积分,抵现金',
          popUpDesc: '加入官方本地福利群，领积分领福利',
          popUpImg: 'http://192.168.1.187:10088/static/songhui/common/point-rule.png',
          popUpTargetUrl: '',
          popUpTimes: 0,
        },
      };
    },
    computed: {
      popCont() {
        return this.content.popUpDesc.split('，');
      },
    },
    methods: {
      getPoint() {
        uni.navigateTo({ url: `/pages/common/webpage?url=${this.content.popUpTargetUrl}` });
      },
      open(data) {
        // Object.keys(this.content).map((key) => {
        //   if (data[key]) {
        //     this.content[key] = data[key];
        //   }
        // });
        this.$refs.popup.open();
      },
      close() {
        this.$refs.popup.close();
      },
    },
  };
</script>

<style lang="scss" scope>
  .pop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 706rpx;
    height: 1006rpx;
    background: linear-gradient(180deg, #fdd49b 0%, #fecd94 100%);
    border-radius: 32rpx;
    border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.32)) 2 2;
    .content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 686rpx;
      height: 986rpx;
      background: linear-gradient(179deg, #fffcf3 0%, #fff6e7 100%);
      border-radius: 24rpx;
      padding: 74rpx 48rpx;
      .title {
        font-size: 50rpx;
        font-weight: 500;
        margin-top: 40rpx;
        margin-bottom: 32rpx;
      }
      .cont {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
        font-style: normal;
        .cont-title {
          font-weight: 500;
          color: #8b5c47;
          margin-bottom: 12rpx;
        }
        .cont-text {
          margin-bottom: 12rpx;
        }
      }
      .content-header {
        position: absolute;
        left: 148rpx;
        top: -38rpx;
        width: 386rpx;
        height: 74rpx;
        z-index: 1;
      }
      .get-point-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 560rpx;
        height: 650rpx;
        z-index: -1;
      }
    }
    .icon-close {
      position: absolute;
      bottom: -100rpx;
      left: 310rpx;
      width: 72rpx;
      height: 72rpx;
    }
  }
</style>
