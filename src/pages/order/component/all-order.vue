<template>
  <view class="pages">
    <view class="nearby-list" v-if="list.length > 0">
      <template v-for="(item, index) in list">
        <!-- 附近优惠 -->
        <!-- <view
          v-if="![4, 9, 13].includes(item.orderSource)"
          class="item"
          @click="handleOrderInfo(item)"
          :key="index"
        >
          <view class="header_line">
            <view class="left">
              <image class="t_icon" :src="item.logoPath" />
              <view class="type">{{ item.orderSourceName }}</view>
            </view>
            <view class="right">已完成</view>
          </view>
          <view class="_topLine">
            <view class="left_part">
              <image class="logo-img" :src="item.supermarketThumbnail" mode="scaleToFill" />
              <view class="name">{{ item.supermarketName }}</view>
            </view>
            <view class="r_pay">
              <view class="pay">实付</view>
              <view class="money">￥{{ item.paymentAmount | formaterMoney }}</view>
            </view>
          </view>
          <view class="address">{{ item.orderTime | dateFilter }}</view>
        </view> -->

        <!-- 酒店 -->
        <!-- <view
          v-if="item.orderSource === 4"
          class="hotel-item"
          :key="index"
          @click="handleOrderInfo(item)"
        >
          <view class="header_line">
            <view class="left">
              <image class="t_icon" :src="item.logoPath" />
              <view class="type">{{ item.supermarketName }}</view>
            </view>
            <view class="right" v-if="['3', '4', '8', '6'].includes(item.orderStatus)">
              {{ item.orderStatus | formateOrderStatus }}
            </view>
            <view class="process" v-else>{{ item.orderStatus | formateOrderStatus }}</view>
          </view>
          <view class="_topLine">
            <view class="left_part">
              <image class="logo-img" :src="item.supermarketThumbnail" mode="scaleToFill" />
              <view class="cont">
                <view class="name">{{ item.productName }}</view>
                <view class="label">数量：{{ item.payNumber }}</view>
                <view class="label" v-if="!['1', '4'].includes(item.orderStatus)">
                  有效期至{{ item.expirationTime | dateFilter }}
                </view>
                <view class="label2" v-if="['1', '4'].includes(item.orderStatus)"></view>
              </view>
            </view>
            <view class="r_pay" v-if="['1', '4'].includes(item.orderStatus)">
              <view class="pay">应付</view>
              <view class="money">￥{{ item.payAmount | formaterMoney }}</view>
            </view>
            <view class="r_pay" v-else>
              <view class="pay">实付</view>
              <view class="money">￥{{ item.paymentAmount | formaterMoney }}</view>
            </view>
          </view>
          <view class="opr">
            <button
              class="btn enable"
              @click.stop="handlePay(item)"
              v-if="item.orderStatus === '1' && checkExpirationTime(item.expirationTime)"
            >
              立即支付
            </button>
            <template v-if="item.orderStatus == 2 && item.productStatus == 1">
              <button class="btn enable" @click.stop="handlePre(true, item)">立即预定</button>
              <button class="btn" @click.stop="handleReturn(item)">申请退款</button>
            </template>
            <button
              class="btn cancel"
              v-if="item.productStatus == 2"
              @click.stop="handlePre(false, item)"
            >
              取消预定
            </button>
          </view>
        </view> -->

        <!-- 保险 -->
        <!-- <view class="insurance-item" v-if="item.orderSource === 13" :key="index">
          <insurance-order-item :item="item" :key="item.id"></insurance-order-item>
        </view> -->

        <!-- 商城 -->
        <shop-order-item v-if="item.orderSource === 8 || item.orderSource === 9" :item="item" :key="item.orderId"></shop-order-item>
      </template>
    </view>
    <view class="status-box flex-v flex-c-s" v-if="list.length === 0">
      <image class="icon-img" src="http://192.168.1.187:10088/static/supermarket/no-order.png" mode="scaleToFill" />
      <view>您还没有相关订单</view>
    </view>

    <modal ref="callPhonePop" title=" " cancelText="取消" confirmText="拨打电话" @cancel="marketPopCancel" @confirm="marketPopConfirm">
      <view slot="text">
        <view class="confirm-main">
          <view class="content">
            {{ dialogContent }}
          </view>
        </view>
      </view>
    </modal>
  </view>
</template>

<script>
  import dayjs from 'dayjs';
  import Modal from '@/components/common/modal.vue';
  import ShopOrderItem from './shop-order-item.vue';
  // import InsuranceOrderItem from './insurance-order-item-all.vue';
  export default {
    components: { Modal, ShopOrderItem },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dialogContent: '',
      };
    },
    created() {},
    onLoad(data) {},
    // 下拉刷新
    onPullDownRefresh() {},
    // 上拉加载
    onReachBottom() {},
    methods: {
      // 立即支付
      handlePay(item) {
        const url = `https://api.hpgjzlinfo.com/#/checkstand?cashId=${item.orderId}`;
        // #ifdef MP-ALIPAY
        uni.reLaunch({
          url: `/pages/common/webpage?url=${url}`,
        });
        // #endif

        // #ifdef MP-WEIXIN
        uni.reLaunch({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
        });
        // #endif
      },
      checkExpirationTime(expTime) {
        return new Date(expTime).getTime() - new Date().getTime() > 0;
      },
      // 申请退款
      handleReturn(item) {
        uni.navigateTo({
          url: `/pages/life/applyRefund?orderId=${item.orderId}`,
        });
      },
      // 预定
      handlePre(isPre, item) {
        if (isPre) {
          this.dialogContent = '您需要拨打电话预定酒店服务，是否立即拨打';
        } else {
          this.dialogContent = '您已预定酒店服务，是否拨打电话取消预定';
        }
        this.customerService = item.customerService;
        this.$refs.callPhonePop.open();
      },
      // 拨打电话
      marketPopConfirm() {
        this.$refs.callPhonePop.close();
        uni.makePhoneCall({
          phoneNumber: this.customerService,
        });
      },
      // 取消
      marketPopCancel() {
        this.$refs.callPhonePop.close();
      },
      handleItemClick(index, i) {
        this.activeIndex = index;
        this.$emit('resetOptions', i.id);
      },
      // 点击订单
      handleOrderInfo({ orderId, orderSource }) {
        if (orderSource == 4) {
          uni.navigateTo({
            url: `/pages/life/orderInfo?orderId=${orderId}`,
          });
        } else {
          uni.navigateTo({
            url: '/pages/supermarket/order-info?orderId=' + orderId,
          });
        }
      },
    },
    filters: {
      formateOrderStatus(v) {
        // 1-未支付、2-已支付、3-已完成、5-部分退款、6-已退款、7-退款中
        // 订单状态 （1-未支付、2-已支付、3-已完成、5-部分退款、6-已退款、7-退款中）
        const mapObj = {
          1: '待付款',
          2: '待使用',
          3: '已完成',
          4: '已关闭',
          5: '部分退款',
          6: '已退款',
          7: '退款中',
          8: '已过期',
        };
        return mapObj[v] || '';
      },
      setDistance(item) {
        const s = Number(item) / 1000;
        if (s.toFixed(3) < 1) {
          return parseInt(s * 1000) + 'm';
        } else {
          return s.toFixed(1) + 'km';
        }
      },
      formaterMoney(v) {
        return (v / 100).toFixed(2);
      },
      // 日期过滤器, 用于格式化日期
      dateFilter(value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm');
      },
    },
  };
</script>

<style lang="scss" scoped>
  //modal弹框
  .confirm-main {
    width: 552rpx;
    margin: 0 auto;
    height: 180rpx;
    text-align: center;
    font-size: 40rpx;
    line-height: 54rpx;
    .wen {
      color: #ff5500;
    }
  }
  .pages {
    background-color: #f2f2f2;
    .nearby-list {
      overflow: hidden;
      .item {
        width: 686rpx;
        background-color: #fff;
        margin: 24rpx 32rpx;
        padding: 0rpx 24rpx 24rpx;
        box-sizing: border-box;
        color: #333;
        border-radius: 16rpx;
        .header_line {
          height: 50rpx;
          display: flex;
          justify-content: space-between;
          padding-top: 24rpx;
          margin-bottom: 30rpx;
          .left {
            display: flex;
            height: 50rpx;
            line-height: 50rpx;
            .t_icon {
              width: 40rpx;
              height: 40rpx;
              margin-top: 6rpx;
              margin-right: 10rpx;
            }
            .type {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 50rpx;
            }
          }
          .right {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 50rpx;
          }
        }
        ._topLine {
          display: flex;
          justify-content: space-between;
          .left_part {
            display: flex;
            justify-content: center;
            .logo-img {
              width: 160rpx;
              height: 160rpx;
            }
            .name {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
          .r_pay {
            display: flex;
            justify-content: center;
            .pay {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
            }
            .money {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
        }
        .address {
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 40rpx;
          padding-bottom: 0.24rem;
          text-align: right;
        }
      }
      .hotel-item {
        width: 686rpx;
        background-color: #fff;
        margin: 24rpx 32rpx;
        padding: 0rpx 24rpx 24rpx;
        box-sizing: border-box;
        color: #333;
        border-radius: 16rpx;
        .header_line {
          height: 50rpx;
          display: flex;
          justify-content: space-between;
          padding-top: 24rpx;
          margin-bottom: 30rpx;
          .left {
            display: flex;
            height: 50rpx;
            line-height: 50rpx;
            .t_icon {
              width: 40rpx;
              height: 40rpx;
              margin-top: 6rpx;
              margin-right: 10rpx;
            }
            .type {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 50rpx;
            }
          }
          .process {
            color: #ff5500;
          }
          .right {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 50rpx;
          }
        }
        ._topLine {
          display: flex;
          flex-direction: column;
          // justify-content:space-between;
          .left_part {
            display: flex;
            // justify-content: center;
            .logo-img {
              width: 160rpx;
              height: 160rpx;
            }
            .cont {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 16rpx;
              .label {
                font-size: 32rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
              }
              .label2 {
                margin-top: 30rpx;
              }
            }
            .name {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
          .r_pay {
            display: flex;
            // justify-content: right;
            // margin: 20rpx 0  24rpx;
            margin-top: 20rpx;
            .pay {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              margin-left: auto;
            }
            .money {
              font-size: 36rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
        }
        .opr {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          overflow: hidden;

          .btn {
            float: right;
            margin-top: 20rpx;
            // margin: 12rpx 0;
            width: 176rpx;
            height: 64rpx;
            background: #ffffff;
            border-radius: 128rpx;
            border: 2rpx solid #dcdee0;
            display: flex;
            justify-content: center;
            align-items: center;
            &.enable {
              right: 0;
              color: #ff711a;
              border: 2rpx solid #ff711a;
              margin-left: 24rpx;
            }
            &.cancel {
              right: 0;
            }
          }
        }
      }
      .insurance-item {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 16rpx 0;
      }
    }
    .status-box {
      padding-top: 300rpx;
      .icon-img {
        width: 440rpx;
        height: 270rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
  }
</style>
