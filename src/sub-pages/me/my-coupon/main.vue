<style lang="scss">
  @import '~@/styles/base';

  .page-coupon-list {
    padding-top: rpx(88);
    background-color: $gray;
    min-height: 100vh;

    .tab-list {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: #fff;
      z-index: 1000;

      .tab {
        position: relative;
        flex: 1;
        text-align: center;

        .name {
          display: inline-block;
          height: rpx(88);
          line-height: rpx(88);
          padding-left: rpx(18);
          padding-right: rpx(18);
          font-size: rpx(36);
          color: #999999;
          border-bottom: rpx(6) solid transparent;
        }

        &.active {
          .name {
            font-size: rpx(40);
            color: #ff5500;
            border-bottom-color: #ff5500;
          }
        }
      }
    }

    .title {
      padding: rpx(34) rpx(51) rpx(14);
      font-size: rpx(30);
      line-height: rpx(42);
      color: $extra-black;
    }

    .coupon-list {
      padding-top: rpx(20);
      // padding-left: rpx(40);
      // padding-right: rpx(20);

      .coupon {
        position: relative;
        // width: rpx(680);

        margin: 0 auto;
        margin-bottom: rpx(15);
        width: 710rpx;
        height: 232rpx;
        background: #ffffff;
        box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
        .coupon-body {
          position: relative;
          padding: rpx(16) rpx(0) rpx(0) rpx(216);
          width: rpx(680);
          height: 100%;
          // min-height: rpx(200);
          background: url(https://szyh-ecommerce-oss.oss-cn-zhangjiakou.aliyuncs.com/commerce/product/1624952173708.png) left top no-repeat;
          background-size: cover;

          &.disabled {
            background-image: url(https://szyh-ecommerce-oss.oss-cn-zhangjiakou.aliyuncs.com/commerce/product/1624952118838.png);

            .coupon__name,
            .coupon__rule {
              color: #999;
            }
          }
          .money {
            @include middle-center-y();
            left: 0;
            font-size: rpx(52);
            color: #fff;
            width: rpx(192);
            text-align: center;
            @include ellipsis();

            .unit {
              // margin-right: rpx(-10);
              font-size: rpx(32);
            }

            .desc {
              font-size: rpx(32);
              line-height: rpx(30);
            }
          }
          .coupon__name {
            padding-bottom: rpx(10);
            font-size: rpx(32);
            height: 98rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
            word-break: break-all;
          }
          .coupon__rule {
            padding-top: rpx(10);
            padding-bottom: rpx(10);
            font-size: rpx(32);
            line-height: rpx(37);
            @include ellipsis();
            font-weight: bold;
          }
          .coupon__time {
            // padding-top: rpx(44);
            font-size: rpx(32);
            line-height: rpx(30);
            color: #999;
          }
        }
        .coupon__description {
          margin-top: 24rpx;
          display: flex;
          align-items: center;
          background-color: #fff;
          color: #333333;
          font-size: rpx(32);
          image {
            margin-left: rpx(10);
            width: rpx(30);
            height: rpx(30);
          }
        }
        .coupon__description-content {
          padding: 0 rpx(20) rpx(20);
          background-color: #fff;
          line-height: 1.5;
          color: #999;
          font-size: rpx(25);
        }
      }
    }

    .empty-wrap {
      text-align: center;
      padding-top: rpx(300);
      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 440rpx;
        height: 234rpx;
        // width: rpx(210);
        // height: rpx(130);
      }
      .title {
        padding-top: rpx(30);
        font-size: rpx(32);
        color: #999;
      }
      .desc {
        padding-top: rpx(10);
        color: #999;
        font-size: rpx(32);
      }
    }
  }
</style>

<template>
  <div class="page-coupon-list">
    <ul class="tab-list">
      <li class="tab" @click="changeStatus(0)" :class="status === 0 ? 'active' : ''">
        <div class="name">未使用({{ couponList1.length }})</div>
      </li>
      <li class="tab" @click="changeStatus(1)" :class="status === 1 ? 'active' : ''">
        <div class="name">已使用({{ couponList2.length }})</div>
      </li>
      <li class="tab" @click="changeStatus(2)" :class="status === 2 ? 'active' : ''">
        <div class="name">已过期({{ couponList3.length }})</div>
      </li>
    </ul>
    <template v-if="status === 0">
      <ul class="coupon-list" v-if="couponList1 && couponList1.length">
        <li class="coupon" :key="index" v-for="(coupon, index) in couponList1">
          <div class="coupon-body">
            <div class="money">
              <span class="unit">¥</span>
              <span v-if="coupon.type == 0">{{ coupon.denominationStr }}</span>
              <span v-else-if="coupon.type == 1">{{ coupon.denominationStr }}折</span>
              <div v-if="coupon.checkThreshold == 0" class="desc">无门槛</div>
              <div v-else-if="coupon.checkThreshold == 1" class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">{{ coupon.beginTime }} 至 {{ coupon.endTime }}</div>
            <div class="coupon__description" @click="changeDesc(coupon)">
              使用规则
              <image class="icon-right" mode="scaleToFill" src="http://192.168.1.187:10088/static/images/checkout/right.png" />
            </div>
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 0 && !couponList1.length">
        <img src="http://192.168.1.187:10088/static/common/status-none2x.png" />
        <div class="title">很遗憾</div>
        <div class="desc">您暂时无可用的优惠券</div>
      </div>
    </template>
    <template v-if="status === 1">
      <ul class="coupon-list" v-if="couponList2 && couponList2.length">
        <li class="coupon disabled" :key="index" v-for="(coupon, index) in couponList2">
          <div class="coupon-body">
            <div class="money">
              <span class="unit">¥</span>
              <span v-if="coupon.type == 0">{{ coupon.denominationStr }}</span>
              <span v-else-if="coupon.type == 1">{{ coupon.denominationStr }}折</span>
              <div v-if="coupon.checkThreshold == 0" class="desc">无门槛</div>
              <div v-else-if="coupon.checkThreshold == 1" class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">{{ coupon.beginTime }} 至 {{ coupon.endTime }}</div>
            <div class="coupon__description" @click="changeDesc(coupon)">
              使用规则
              <image class="icon-right" mode="scaleToFill" src="http://192.168.1.187:10088/static/images/checkout/right.png" />
            </div>
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 1 && !couponList2.length">
        <img src="http://192.168.1.187:10088/static/common/status-none2x.png" />
        <div class="desc">暂无已使用的优惠券</div>
      </div>
    </template>
    <template v-if="status === 2">
      <ul class="coupon-list" v-if="couponList3 && couponList3.length">
        <li class="coupon disabled" :key="index" v-for="(coupon, index) in couponList3">
          <div class="coupon-body">
            <div class="money">
              <span class="unit">¥</span>
              <span v-if="coupon.type == 0">{{ coupon.denominationStr }}</span>
              <span v-else-if="coupon.type == 1">{{ coupon.denominationStr }}折</span>
              <div v-if="coupon.checkThreshold == 0" class="desc">无门槛</div>
              <div v-else-if="coupon.checkThreshold == 1" class="desc">满{{ coupon.thresholdValue }}元可用</div>
            </div>
            <div class="coupon__name">{{ coupon.name }}</div>
            <div class="coupon__time">{{ coupon.beginTime }} 至 {{ coupon.endTime }}</div>
            <div class="coupon__description" @click="changeDesc(coupon)">
              使用规则
              <image class="icon-right" mode="scaleToFill" src="http://192.168.1.187:10088/static/images/checkout/right.png" />
            </div>
          </div>
        </li>
      </ul>
      <div class="empty-wrap" v-if="status === 2 && !couponList3.length">
        <img src="http://192.168.1.187:10088/static/common/status-none2x.png" />
        <div class="desc">暂无已过期的优惠券</div>
      </div>
    </template>
    <rule-model ref="ruleModel"></rule-model>
  </div>
</template>

<script>
  import wx from 'utils/wx';
  import RuleModel from './components/rule-model.vue';

  export default {
    name: 'COUPON_LIST',
    components: { RuleModel },
    data() {
      return {
        status: 0,
        couponList1: [],
        couponList2: [],
        couponList3: [],
      };
    },
    // computed: {
    //   couponList1() {
    //     return this.couponCouponList.filter((coupon) => {
    //       return coupon.usedState === 0;
    //     });
    //   },
    //   couponList2() {
    //     return this.couponCouponList.filter((coupon) => {
    //       return coupon.usedState === 1;
    //     });
    //   },
    //   couponList3() {
    //     return this.couponCouponList.filter((coupon) => {
    //       return coupon.usedState === 2;
    //     });
    //   },
    // },
    onLoad(e) {
      this.status = Number(e.status) || 0;
    },
    methods: {
      changeDesc(data) {
        this.$refs.ruleModel.open(data.description);
      },
      changeStatus(index) {
        this.status = index;
      },
      async loadData() {
        wx.showLoading();
        const couponResult = await Axios.post('/coupon/loading', {
          pageNum: 1,
          pageSize: 100,
          queryObject: {
            sessionId: Store.state.user.sessionId,
          },
        });
        wx.hideLoading();
        if (couponResult.code == 200) {
          this.couponList1 = couponResult.data.canUsedList;
          this.couponList2 = couponResult.data.usedList;
          this.couponList3 = couponResult.data.cannotUsedList;
        } else {
          wx.showToast(couponResult.msg);
        }
      },
    },
    async mounted() {
      if (!Store.getters.isLogin) {
        await Store.dispatch('login');
      }
      this.loadData();
    },
  };
</script>
