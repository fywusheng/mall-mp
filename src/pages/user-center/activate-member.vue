<template>
  <view class="activate-member">
    <view class="card">
      <view class="row">
        <view class="title">卡种选择</view>
        <view class="right" @click="handleAddClick">
          <text class="label">{{ invoice ? invoice.showContent : '发票信息' }}</text>
          <image
            class="icon-right"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
      </view>
      <view class="mem">
        <view class="wrapper" @click="setCardType(0)">
          <image
            class="unable"
            mode="scaleToFill"
            :src="
              cardType === 0
                ? 'http://192.168.1.187:10088/static/songhui/user-center/able.png'
                : 'http://192.168.1.187:10088/static/songhui/user-center/unable.png'
            "
          />

          <view class="t">年卡-商城会员</view>
          <view class="price">
            <text>¥</text>
            <text>144</text>
          </view>
          <view class="cost-price">¥144</view>
        </view>
        <view class="wrapper" @click="setCardType(1)">
          <image
            class="unable"
            mode="scaleToFill"
            :src="
              cardType === 0
                ? 'http://192.168.1.187:10088/static/songhui/user-center/unable.png'
                : 'http://192.168.1.187:10088/static/songhui/user-center/able.png'
            "
          />
          <view class="t">半年卡-商城会员</view>
          <view class="price">
            <text>¥</text>
            <text>72</text>
          </view>
          <view class="cost-price">¥72</view>
        </view>
      </view>
    </view>
    <view class="row-line"></view>

    <view class="card">
      <view class="row benefit">
        <text class="title">卡内权益</text>
        <view class="line"></view>
        <text class="desc">年卡/半年卡均享有如下特权</text>
      </view>
      <image
        src="http://192.168.1.187:10088/static/songhui/user-center/banner@2x.png"
        mode="scaleToFill"
        class="banner"
      />
      <view class="bene-fit">
        <image
          src="http://192.168.1.187:10088/static/songhui/user-center/baoyou.png"
          mode="scaleToFill"
          class="banner1"
        />
        <image
          src="http://192.168.1.187:10088/static/songhui/user-center/huiyuanjifen.png"
          mode="scaleToFill"
          class="banner1"
        />
        <image
          src="http://192.168.1.187:10088/static/songhui/user-center/zhuanshuyouhui.png"
          mode="scaleToFill"
          class="banner1"
        />
        <image
          src="http://192.168.1.187:10088/static/songhui/user-center/zhuanshuguwen.png"
          mode="scaleToFill"
          class="banner1"
        />
      </view>
      <view class="btn" @click="handleApplyClick">
        立即支付¥
        <text class="bold">{{ paymentAmount }}</text>
        /年
      </view>
      <view class="xiyi">
        <view class="radio">
          <image
            @click="handleCheckXieyi"
            :class="checked ? 'icon-check' : 'icon-noCheck'"
            :src="checked ? icon.checked : icon.noChecked"
          />
        </view>

        <view class="fs-36">
          开通前请确认
          <text class="c-code" @click="handleUserAgreementClick">《商城会员用户协议》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import ScanOrInputPopup from './common/scan-or-input-popup.vue';
  import { putHotelOrder } from '@/api/life.js';
  import { mapState } from 'vuex';
  export default {
    components: { ScanOrInputPopup },
    data() {
      return {
        cardType: 0, // 卡类型 0 年卡，1 半年卡
        invoice: null, // 发票信息
        checked: false,
        icon: {
          checked: 'http://192.168.1.187:10088/static/pay/icon-radio-checked.png',
          noChecked: 'http://192.168.1.187:10088/static/pay/icon-radio-default.png',
        },
      };
    },
    onLoad() {
      uni.$on('didSelectHeader', this.handleSelectInvoce);
    },
    onUnload() {
      uni.$off('didSelectHeader', this.handleSelectInvoce);
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
      paymentAmount() {
        return this.cardType === 0 ? 0.01 : 0.02;
      },
      remark() {
        return this.cardType === 0 ? '年卡' : '半年卡';
      },
    },
    methods: {
      // 选中发票
      handleSelectInvoce(data) {
        this.invoice = data;
      },
      // 添加发票
      handleAddClick() {
        uni.navigateTo({ url: '/pages/supermarket/company-list' });
        // uni.navigateTo({
        //   url: '/pages/supermarket/company-update-or-add',
        // });
      },
      handleCheckXieyi() {
        this.checked = !this.checked;
      },
      /**
       * 用户协议点击事件
       */
      handleUserAgreementClick() {
        const url = `${ENV.H5}/#/agreement?type=0`;
        uni.navigateTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
        });
      },
      /**
       * 立即开通
       */
      async handleApplyClick() {
        const price = this.paymentAmount * 100;
        const result = await putHotelOrder({
          productId: this.cardType === 0 ? 'VIP001' : 'VIP002',
          supermarketName: '商城会员卡', // 标题
          orderAmount: price, // 原总金额
          discountAmount: 0, //优惠金额
          paymentAmount: price, //应付金额
          orderSource: 6, //订单类型
          productPrice: price, //单价
          payNumber: 1, //数量
          uactId: this.userInfo.memberId, // 用户memberId
          usageTime: '', // 出发日期
          expirationTime: '', //返程日期
          crterName: this.userInfo.name, //联系人
          updterName: this.userInfo.phone, //联系电话
          scopeOfApplication: this.remark, //备注
        });
        const url = `${ENV.H5}/#/checkstand?cashId=${result}`;
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
        // uni.navigateTo({
        //   url: '/pages/user-center/activate-member',
        // });
      },
      // 设置卡类型
      setCardType(cardType) {
        this.cardType = cardType;
      },
      /**
       * 暂不领取点击事件
       */
      handleBackToHomeClick() {
        uni.navigateBack({ delta: 9 });
      },
    },
    mounted() {
      //  this.$refs.popup.open()
    },
  };
</script>

<style lang="scss" scoped>
  .activate-member {
    .card {
      padding: 40rpx 32rpx;
      background: #ffffff;
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.benefit {
          justify-content: unset;
          .line {
            width: 2rpx;
            height: 36rpx;
            margin: 20rpx;
            background: #ebedf0;
          }
          .desc {
            font-size: 32rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 44rpx;
          }
        }
        .title {
          font-size: 40rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
        .right {
          display: flex;
          align-items: center;
          font-size: 36rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #666666;
          .icon-right {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }
      .mem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30rpx;
        .wrapper {
          width: 334rpx;
          height: 282rpx;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          .unable,
          .able {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
          }
          .t {
            position: relative;
            font-size: 36rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 50rpx;
          }
          .price {
            position: relative;
            font-size: 72rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 100rpx;
          }
          .cost-price {
            position: relative;
            font-size: 40rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 56rpx;
            text-decoration: line-through;
          }
        }
      }
      .banner {
        width: 686rpx;
        height: 144rpx;
      }
      .bene-fit {
        margin-top: 20rpx;
        display: grid;
        grid-template-columns: 334rpx 334rpx;
        grid-template-rows: 112rpx 112rpx;
        column-gap: 18rpx;
        row-gap: 20rpx;
      }
      .btn {
        color: #ffffff;
        margin-top: 80rpx;
        width: 686rpx;
        height: 108rpx;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
        border-radius: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .bold {
          font-size: 64rpx;
        }
      }
      .xiyi {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40rpx;
        .icon-check,
        .icon-noCheck {
          width: 35rpx;
          height: 35rpx;
          margin-right: 8rpx;
        }
        .c-code {
          color: #ff5500;
        }
      }
    }
    .row-line {
      width: 750rpx;
      height: 20rpx;
      background: #f2f2f2;
    }
  }
</style>
