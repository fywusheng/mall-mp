<style lang="scss" scope>
  @import '~@/styles/base';

  .page-order-info {
    padding-bottom: rpx(176);
    position: relative;
    z-index: 1;
    background: #f5f5f5;
    .order-header-bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
      height: 338rpx;
      background: linear-gradient(180deg, #ffd1bb 0%, rgba(255, 229, 216, 0.93) 51%, rgba(255, 255, 255, 0) 100%);
    }
    .order-header-status {
      height: 192rpx;
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      .status {
        font-size: 32rpx;
        color: #333333;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        padding-left: 32rpx;
        .txt {
          font-size: 44rpx;
          font-weight: 500;
        }
      }
      .img-status {
        width: 274rpx;
        height: 192rpx;
      }
    }

    .order-header {
      padding: rpx(30);
      background-color: $main-color;

      .status {
        position: relative;
        padding-top: rpx(10);
        padding-bottom: rpx(20);
        font-size: rpx(32);
        font-weight: 500;
        color: #fff;

        .total-price {
          @include middle-center-y();
          font-size: rpx(24);
          right: 0;

          span {
            padding-left: rpx(10);
            padding-right: rpx(5);
            font-size: rpx(34);
          }
        }
      }

      .pay-count-down {
        padding-top: rpx(25);
        font-size: rpx(26);
        color: #fff;
      }
    }

    .receive-info {
      padding: rpx(30);
      margin: 0 32rpx;
      background: #ffffff;
      border-radius: 16rpx;
      position: relative;
      z-index: 2;

      .info-item {
        display: flex;
        align-items: center;
        .address-icon {
          width: 80rpx;
          height: 80rpx;
          margin-right: 20rpx;
          flex-shrink: 0;
        }
        .name {
          position: relative;
          font-size: rpx(40);
          color: #333333;
          font-weight: 500;
        }
        .phone {
          font-size: 36rpx;
          color: #666666;
          margin-left: 32rpx;
        }
        .address {
          padding-top: rpx(10);
          font-size: rpx(36);
          color: #666666;
          word-break: break-all;
        }
      }
    }

    .store-list {
      background: #ffffff;
      margin: 0 32rpx;
      border-radius: 16rpx;
      padding: 20rpx 24rpx;

      .store-name {
        font-size: rpx(36);
        font-weight: 500;
        display: flex;
        align-items: center;
        .icon-right {
          width: 15rpx;
          height: 27rpx;
          margin-left: 10rpx;
        }
      }

      .item-list {
        .item {
          position: relative;
          padding: rpx(30) rpx(30) rpx(20) rpx(180);
          min-height: rpx(220);
          .item-logo {
            position: absolute;
            top: rpx(30);
            left: 0;
            width: rpx(169);
            height: rpx(179);
            border: rpx(1) solid $border;
          }

          .item-name {
            padding-left: rpx(20);
            font-size: rpx(36);
            font-weight: 500;
            @include ellipsis;
          }

          .sku-name {
            padding-left: rpx(20);
            padding-right: rpx(120);
            margin-top: rpx(17);
            font-size: rpx(36);
            height: 47rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: $light-black;
            .item-state {
              @include middle-center-y();
              right: rpx(30);
              font-size: rpx(38);
              color: $extra-black;
            }
            .item-state-label {
              color: $extra-light-black;
              font-size: rpx(24);
            }
          }

          .item-price {
            padding-left: rpx(20);
            position: relative;
            margin-top: rpx(17);
            font-size: rpx(36);
            color: #ff5500;
            font-weight: 500;

            .item-qty {
              @include middle-center-y();
              right: rpx(30);
              color: $extra-black;
              font-weight: 400;
            }
          }
          .btn-link {
            margin-top: rpx(10);
            width: rpx(120);
            height: rpx(50);
            line-height: rpx(45);
            text-align: center;
            border: 1px solid #666;
            border-radius: 5px;
            color: #666;
            font-size: rpx(24);
          }
        }
      }

      .remark-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-top: rpx(30);
        padding-bottom: rpx(30);
        border-top: rpx(1) dashed $border;
        line-height: 1.4;

        .title {
          font-size: rpx(28);
          font-weight: 500;
        }

        .value {
          margin-left: rpx(10);
          font-size: rpx(28);
          color: $extra-light-black;
        }
      }
    }

    .cost-list {
      margin: 0 32rpx;
      padding: 24rpx;
      color: #333333;
      background: #ffffff;
      border-radius: 16rpx;

      .cost {
        font-size: rpx(32);
        font-weight: normal;
        margin-bottom: 24rpx;
        &:last-child {
          margin-bottom: 0;
        }
        .right {
          text-align: right;
        }

        .value {
          float: right;
          color: $extra-light-black;
          &.red {
            color: #ff5500;
          }

          span {
            color: #333333;
          }
        }
      }
    }

    .info-list {
      margin: 0 32rpx;
      padding: 24rpx;
      background: #ffffff;
      border-radius: 16rpx;
      font-size: 32rpx;

      .info-list-title {
        line-height: rpx(70);
        // font-weight: 500;
      }

      .info {
        // line-height: rpx(70);
        margin-bottom: 24rpx;
        color: $extra-light-black;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .footer-btn-list {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      @include middle-center-x(fixed);
      bottom: 0;
      width: 100%;
      height: 176rpx;
      padding: 0 38rpx;
      background: #ffffff;
      box-shadow: 0px -2px 0px 0px #f5f5f5;
      z-index: 1000;

      &.isIphoneHair {
        padding-bottom: rpx(68);
      }

      .btn {
        @include btn();
        width: 204rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: #ffffff;
        border-radius: 47rpx;
        border: 2rpx solid #dcdee0;
        font-size: 40rpx;
        color: #333333;
        font-weight: 500;
        margin-left: 24rpx;

        &:first-child {
          background: #fff;
          border-top: rpx(2) solid $border;
          color: $black;
        }
      }
    }

    .red {
      color: #ff5500;
    }
  }
</style>
<template>
  <div class="page-order-info" v-if="!loading">
    <div class="order-header-bg"></div>
    <div class="order-header-status">
      <div class="status">
        <div class="txt">{{ order.orderStatusLabel }}</div>
        <div v-if="order.orderStatus == 10">
          订单将于
          <span style="color: #ff5500">{{ minutes }}分{{ seconds }}秒</span>
          后被取消，请尽快支付！
        </div>
        <div v-if="order.orderStatus == 20">我们会尽快安排发货，请您耐心等待哦！</div>
        <div v-if="order.orderStatus == 30">
          还剩
          <span style="color: #ff5500">&nbsp;{{ day }}天{{ hours }}小时{{ minutes }}分</span>
          自动确认
        </div>
        <!-- <div v-if="order.orderStatus == 40"></div>
        <div v-if="order.orderStatus == 50"></div> -->
        <div v-if="order.orderStatus == 90">用户取消订单，订单结束</div>
      </div>
      <image class="img-status" :src="statusUrl" mode="scaleToFill" />
    </div>
    <div class="receive-info">
      <div class="info-item">
        <image class="address-icon" :src="icon.address" mode="scaleToFill" />
        <div class="info">
          <div class="name">
            {{ order.receiveName }}
            <span class="phone">{{ order.receivePhone }}</span>
          </div>
          <div class="address">
            {{ order.receiveProvinceName + order.receiveCityName + order.receiveAreaName + order.receiveAddress }}
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="store-list" v-for="(orderItemModel, index) in order.storeOrderItems" :key="index">
      <div class="store-name" @click="goStoreDetail(orderItemModel)">
        {{ orderItemModel.storeName }}
        <!-- <image class="icon-right" :src="icon.right" mode="scaleToFill" /> -->
      </div>
      <ul class="item-list">
        <li class="item" @click="toItem(item)" :key="itemIndex" v-for="(item, itemIndex) in orderItemModel.items">
          <img class="item-logo" mode="aspectFit" :lazy-load="true" :src="item.imgUrl" />
          <div class="item-name">{{ item.productName }}</div>
          <div class="sku-name">
            {{ item.skuName }}
            <div class="item-state" v-if="[30, 40, 50, 110, 120].includes(order.orderStatus)">
              <button v-if="item.itemStatus == 1 && !order.hzhH5" type="button" class="btn-link" @click.stop="toService(order, item)">
                申请售后
              </button>
              <div v-else @click.stop="toService(order, item)" class="item-state-label">
                {{ item.itemStateStr }}
              </div>
            </div>
          </div>
          <div class="item-price">
            ¥{{ item.sellingPrice | formatNum }}
            <div class="item-qty">x{{ item.skuQuantity }}</div>
          </div>
        </li>
      </ul>
      <div class="remark-wrap" v-if="isMulti">
        <div class="title">备注留言:</div>
        <div class="value">{{ orderItemModel.receiveRemark || '无' }}&nbsp;</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="info-list">
      <div class="info">
        订单编号：
        <span class="value">{{ order.orderId }}</span>
      </div>
      <div class="info">
        下单时间：
        <span class="value">{{ order.createdTime }}</span>
      </div>
      <div class="info" v-if="order.completionTime">
        完成时间:
        <span class="value">{{ order.completionTime }}</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="cost-list">
      <div class="cost">
        订单总额:
        <span class="value">¥{{ order.orderAmount | formatNum }}</span>
      </div>
      <div class="cost">
        运费:
        <span class="value red">+¥{{ order.freightAmount | formatNum }}</span>
      </div>
      <div class="cost">
        会员优惠:
        <span class="value red">-¥{{ order.memberSaveMoney | formatNum }}</span>
      </div>
      <div class="cost">
        优惠券:
        <span class="value red">-¥{{ order.couponAmount | formatNum }}</span>
      </div>
      <div class="cost">
        <text class="right">实付款:</text>
        <span class="value red">¥{{ order.payableAmount | formatNum }}</span>
      </div>
      <!-- <div class="cost">积分:
        <div class="value">预计获得<span>{{order.points}}</span>积分</div>
      </div> -->
    </div>
    <template v-if="!isMulti">
      <div class="line"></div>
      <div class="info-list">
        <div class="info-list-title">备注</div>
        <div class="info">
          {{ (order.storeOrderItems && order.storeOrderItems[0].receiveRemark) || '无' }}
        </div>
      </div>
    </template>
    <div class="line"></div>
    <div class="info-list" v-if="order.invoiceTitle">
      <div class="info-list-title">发票</div>
      <li class="info">
        发票类型:
        <span>{{ order.invoiceType == 0 ? '电子普通发票' : '增值税专用发票' }}</span>
      </li>
      <li class="info">
        发票抬头:
        <span>{{ order.invoiceTitle }}</span>
      </li>
      <template v-if="order.applicantType === 1">
        <li class="info">
          纳税识别号:
          <span>{{ order.identifyingCode }}</span>
        </li>
      </template>
      <template v-if="order.invoiceType === 1">
        <li class="info">
          开户银行名称:
          <span>{{ order.bankName }}</span>
        </li>
        <li class="info">
          单位开户账号:
          <span>{{ order.bankAccount }}</span>
        </li>
        <li class="info">
          单位注册地址:
          <span>{{ order.registrationAddress }}</span>
        </li>
        <li class="info">
          单位电话号码:
          <span>{{ order.registrationPhone }}</span>
        </li>
      </template>
      <template v-if="order.invoiceType === 0">
        <li class="info">
          收票人手机号码:
          <span>{{ order.recipientPhone }}</span>
        </li>
        <li class="info">
          收票人电子邮箱:
          <span>{{ order.recipientEmail }}</span>
        </li>
      </template>
      <template>
        <li class="info">
          发票内容:
          <span>{{ order.invoiceContent }}</span>
        </li>
      </template>
    </div>

    <div class="line"></div>
    <ul v-if="[10, 20, 30].includes(order.orderStatus)" class="footer-btn-list" :class="{ isIphoneHair: isIphoneHair }">
      <li class="btn" @click="remove" v-if="order.orderStatus === 10 || order.orderStatus === 20">取消订单</li>
      <li class="btn" @click="toLogistics" v-if="order.orderStatus === 30">查看物流</li>
      <li class="btn" @click="confirm" v-if="order.orderStatus === 30">确认收货</li>
      <li class="btn" v-if="order.orderStatus === 10" @click="toPay">付款</li>
    </ul>
    <point-pop ref="pointPop" />
  </div>
</template>

<script>
  // import dayjs from 'dayjs'
  import wx from 'utils/wx';
  import PointPop from './get-point-pop.vue';

  export default {
    data() {
      return {
        loading: true,
        order: {},
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        countDown: 0,
        isIphoneHair: App.isIphoneHair,
        icon: {
          address: 'http://192.168.1.187:10088/static/images/common/icon-address.png',
          right: 'http://192.168.1.187:10088/static/images/common/icon-right.png',
        },
      };
    },
    computed: {
      isMulti() {
        return this.order && this.order.orderItemModels && this.order.orderItemModels.length > 1;
      },
      statusUrl() {
        // 10：创建、待付款 20：已支付、待发货 30：已发货、待收货 40：已收货、交易完成、待评价
        // 50:已评价 90：订单取消、手动取消、系统自动取消 100：交易取消
        const statusMap = {
          10: 'http://192.168.1.187:10088/static/images/order/wait-fukuan.png',
          20: 'http://192.168.1.187:10088/static/images/order/wait-fahuo.png',
          30: 'http://192.168.1.187:10088/static/images/order/wait-shouhuo.png',
          40: 'http://192.168.1.187:10088/static/images/order/completed.png',
          50: 'http://192.168.1.187:10088/static/images/order/completed.png',
          90: 'http://192.168.1.187:10088/static/images/order/canceled.png',
          100: 'http://192.168.1.187:10088/static/images/order/canceled.png',
        };
        return statusMap[this.order.orderStatus];
      },
    },
    components: { PointPop },
    filters: {
      formatNum(price) {
        return Number(price).toFixed(2);
      },
    },
    methods: {
      goStoreDetail(store) {
        return;
        uni.navigateTo({
          url: '/sub-pages/index/store/main?supplierId=' + store.storeId,
        });
      },
      toService(order, item) {
        if (order.orderStatus == 20 || item.itemStatus > 1) {
          wx.navigateTo({
            url: `../refund-detail/main?type=1&productId=${item.productId}&skuId=${item.skuId}&orderId=${order.id}`,
          });
        } else {
          wx.navigateTo({
            url: `../service-type/main?itemId=${item.id}&num=${item.skuQuantity}&orderId=${order.id}&skuId=${item.skuId}&productId=${item.productId}`,
          });
        }
      },
      async toPay() {
        wx.showLoading({ title: '正在获取...', mask: true });
        const result = await Axios.post('/payment/sign', {
          orderId: this.order.orderId,
          paymentMethodCode: 'nepsp_pay',
          code: new Date().getTime(),
        });
        wx.hideLoading();
        if (result.code == 200) {
          // 去收银台支付
          uni.reLaunch({
            url: '/pages/common/webpage?url=' + encodeURIComponent(result.data.payUrl),
          });
        } else {
          wx.showToast({
            title: result.msg || '获取失败',
            icon: 'none',
          });
        }
      },
      toLogistics() {
        uni.navigateTo({
          url: '/sub-pages/me/logistics/main?id=' + this.order.orderId,
        });
      },
      async cancelOrder() {
        const delResult = await Axios.post('/order/cancel', {
          orderId: this.order.orderId,
        });
        if (delResult.code == 200) {
          console.log(delResult);
          this.loadData();
          // 触发订单刷新事件
          uni.$emit('reloadOrderList');
        } else {
          wx.showToast(delResult.msg || '取消失败');
        }
      },
      async remove() {
        const result = await wx.showModal({
          title: '',
          content: '确定要取消?',
        });
        if (result.confirm) {
          wx.showLoading('正在提交...');
          const delResult = await Axios.post('/order/cancel', {
            orderId: this.order.orderId,
          });
          wx.hideLoading();
          if (delResult.code == 200) {
            wx.showToast(delResult.msg || '取消成功');
            this.loadData();
            // 触发订单刷新事件
            uni.$emit('reloadOrderList');
          } else {
            wx.showToast(delResult.msg || '取消失败');
          }
        }
      },
      async confirm() {
        const result = await wx.showModal({
          title: '',
          content: '确定已收货?',
        });
        if (result.confirm) {
          wx.showLoading('正在提交...');
          const delResult = await Axios.post('/order/confirm', {
            orderId: this.order.orderId,
          });
          wx.hideLoading();
          if (delResult.code == 200) {
            wx.showToast(delResult.msg || '确认成功');
            this.loadData();
            // 触发订单刷新事件
            uni.$emit('reloadOrderList');
          } else {
            wx.showToast(delResult.msg || '确认失败');
          }
        }
      },
      invoiceContent(type) {
        switch (parseInt(type || 0)) {
          case 1:
            return '服装、鞋帽';
          case 2:
            return '箱包';
          case 3:
            return '礼品、办公用品';
          case 4:
            return '订单商品明细';
          default:
            return '';
        }
      },
      async loadData() {
        this.loading = true;
        uni.showLoading();
        const result = await Axios.post('/order/get', { orderId: this.id });
        uni.hideLoading();
        this.loading = false;
        if (result.code == 200) {
          // result.data.createTime = dayjs(result.data.createTime).format('{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}')
          // if (result.data.completionTime) {
          //   result.data.completionTime = dayjs(result.data.completionTime).format('{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}')
          // }
          result.data.invoiceContent = this.invoiceContent(result.data.invoiceContent);
          this.order = result.data;
          if (this.order.orderStatus === 10) {
            this.countDown = this.order.payCountDown;
            this.initCountDown();
          }
          if (this.order.orderStatus === 30) {
            this.countDown = this.order.completionCountDown;
            this.initCountDown();
          }
        } else {
          wx.showToast(result.result.message);
        }
      },
      initCountDown() {
        this.countDownTask = setInterval(() => {
          if (this.countDown <= 0) {
            clearInterval(this.countDownTask);
            this.cancelOrder();
            return;
          }

          this.seconds = Math.floor((this.countDown / 1000) % 60);
          this.minutes = Math.floor((this.countDown / (1000 * 60)) % 60);
          this.hours = Math.floor((this.countDown / (1000 * 60 * 60)) % 24);
          this.day = Math.floor(this.countDown / (1000 * 60 * 60 * 24));

          this.countDown -= 1000;
        }, 1000);
      },
      toItem(data) {
        uni.navigateTo({
          url: `/sub-pages/index/item/main?id=${data.productId}&sceneType=${this.order.sceneType}`,
        });
      },
      async checkNeedPopUp(popUpType) {
        const params = {
          orderId: this.order.orderId,
          popUpType,
        };
        const { code, data } = await Axios.post('/order/checkNeedPopUp', params);
        if (code === '200') {
          if (data.needPopUp === 1) {
            this.$refs.pointPop.open(data);
          }
        } else {
          console.log('失败');
        }
      },
    },
    async onShow() {
      // if (this.id) this.loadData()
      this.id = this.$mp.query.id;
      // this.popUpType = this.$mp.query.popUpType;
      if (!Store.getters.isLogin) {
        await Store.dispatch('login');
      }
      await this.loadData();
      // await this.checkNeedPopUp(this.popUpType);
    },
    async onLoad(e) {
      // this.id = e.id
      // this.popUpType = e.popUpType
      // if (!Store.getters.isLogin) {
      //   await Store.dispatch('login')
      // }
      // await this.loadData()
      // await this.checkNeedPopUp(this.popUpType)
    },
    onUnload() {
      clearInterval(this.countDownTask);
      this.order = {};
    },
  };
</script>
