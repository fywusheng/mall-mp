//我的积分
<template>
  <view class="my-points">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bars title="我的积分" title-color="#ffffff" background-color="linear-gradient(to right, #ff8800, #ff5000)" />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bars
      title="我的积分"
      title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
      back-button-style="white"
      :shows-back-button="true"
    />
    <!-- #endif -->
    <view class="blank" style="height: 242rpx" />
    <view class="background" />
    <view class="card br-16 bg-white m-0-32 p-24 flex-v">
      <text class="fs-36 c-black">当前可用积分</text>
      <view class="flex-h flex-c-s">
        <text class="fs-60 c-primary">{{ score }}</text>
        <text class="fs-36 c-secondary ml-12" @click="handleScoreList">查看</text>
      </view>
      <!-- <view class="flex-h flex-c-e">
        <text class="fs-36 c-lightgrey">历史累计积分：</text>
        <text class="fs-36 c-black">{{fixScore}}</text>
      </view> -->
      <view class="progress-bar mt-16">
        <view class="total br-6" />
        <view class="current br-6 animated" :style="{ width: progressBarWidth + 'rpx' }" />
      </view>
      <view class="flex-h flex-c-b mt-16">
        <text class="fs-36 c-lightgrey">0</text>
        <text class="fs-36 c-lightgrey">200</text>
        <text class="fs-36 c-lightgrey">400</text>
        <text class="fs-36 c-lightgrey">600</text>
        <text class="fs-36 c-lightgrey">800</text>
        <text class="fs-36 c-lightgrey">1000</text>
      </view>
      <image class="watermark" mode="scaleToFill" src="http://192.168.1.187:10088/static/common/icon-common-logo-watermark.png" />
    </view>
    <view class="points-detail bg-white">
      <view class="tab-bar flex-h flex-c-s">
        <view class="left">
          <view class="text" style="font-size: 44rpx; color: #ff5500; font-weight: bold">赚积分</view>
          <image @click="openRulePop" class="icon-tip" src="http://192.168.1.187:10088/static/songhui/common/tip.png" mode="scaleToFill" />
        </view>

        <view class="right" @click="goShop">
          <text>积分兑换</text>
          <image class="icon-right" src="http://192.168.1.187:10088/static/images/cart/icon-right.png" mode="scaleToFill" />
        </view>
      </view>
      <view class="list" v-if="selectedIndex === 0">
        <view
          @click="selectUrl(item)"
          class="item br-16 mt-32 p-24 flex-h flex-c-b"
          v-for="(item, index) in list"
          :key="index"
          :class="{ 'item--finished': item.hasComplete === '1' }"
        >
          <image class="icon" :src="item.hasComplete === '1' ? item.doneIcon : item.taskIcon" mode="scaleToFill" />
          <view class="info flex-v m-0-24 flex-1">
            <text class="fs-40 fw-500 c-black">{{ item.taskDscr }}</text>
            <!-- <text class="fs-36 c-primary mt-12">+{{ item.taskScore }} 积分</text> -->
          </view>
          <button class="button fs-40 c-primary br-32" hover-class="none">
            {{ item.hasComplete === '1' ? '已完成' : '去完成' }}
          </button>
        </view>
      </view>
      <view class="flex-h flex-c-c" v-else>
        <text class="fs-44 c-grey mt-64">项目建设中，敬请期待！</text>
      </view>
    </view>
    <point-rule ref="pointPop" />
    <!-- <real-name-pop ref="realpop" @succFlag="succFlag" :headImg="headImg"></real-name-pop> -->
  </view>
</template>

<script>
  import NavigationBars from '../../components/common/navigation-bar.vue';
  import api from '@/apis/index.js';
  import PointRule from './common/get-point-pop';
  import { mapState } from 'vuex';
  export default {
    components: { NavigationBars, PointRule },
    data() {
      return {
        headImg: '',
        clickId: '',
        // 导航栏高度
        // #ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        // #endif
        // #ifdef MP-ALIPAY
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        // #endif
        // // 当前可用积分进度条宽度
        progressBarWidth: 0,
        // 选中的下标
        selectedIndex: 0,
        // 赚积分任务列表
        list: [],
        // 可用积分
        score: '0',
        // 最高积分
        fixScore: '0',
      };
    },
    computed: {
      indicatorClass() {
        return ['indicator--left', 'indicator--right'][this.selectedIndex];
      },
    },
    onLoad() {},
    onShow() {
      if (this.userInfo.phone) {
        this.handleScoreInfo();
      }
      this.getUserTaskInfoByPage();
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
    },
    methods: {
      openRulePop() {
        this.$refs.pointPop.open();
      },
      goShop() {
        uni.navigateTo({ url: '/sub-pages/point/index' });
      },
      handleNavigationBack() {
        // 导航返回处理
        uni.reLaunch({
          url: `/pages/index/index?index=4`,
        });
      },

      selectUrl(item) {
        if (item.hasComplete) {
          return false;
        }
        switch (item.taskDscr) {
          case '签到积分':
            uni.switchTab({ url: '/pages/index/mine' });
            break;
          case '商城购物':
            uni.switchTab({ url: '/pages/index/index' });
            break;
          case '商品分享':
            uni.switchTab({ url: '/pages/index/index' });
            break;
          case '生日祝福':
            if (this.isTodayBirthday(this.extractBirthday(this.userInfo.idCard))) {
              this.addPoint();
            }
            break;
          default:
            break;
        }
      },
      // 根据身份证号提取生日
      extractBirthday(idCard) {
        var birthday = '';
        if (idCard != null && idCard != '') {
          if (idCard.length == 15) {
            birthday = '19' + idCard.substr(6, 6);
          } else if (idCard.length == 18) {
            birthday = idCard.substr(6, 8);
          }
          birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
        }
        return birthday;
      },
      isTodayBirthday(birthday) {
        var today = new Date();
        var birthDate = new Date(birthday.replace(/-/g, '/'));
        return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
      },
      // 分享增加积分
      addPoint() {
        api.addPointByShare({
          data: {
            userId: this.userInfo.memberId,
            chgScore: 10,
            chgType: 1,
            taskType: 11,
            taskInfoId: 11,
          },
          success: () => {
            this.$uni.showToast('您已获得生日积分');
          },
        });
      },
      // 获取用户积分
      handleScoreInfo() {
        api.scoreInfo({
          data: {
            userId: this.userInfo.memberId,
          },
          success: (res) => {
            console.log('用户积分：', res);
            this.score = res.score;
            this.fixScore = res.fixScore;
            // 当前可用积分进度条宽度
            if (this.score > 1000) {
              this.progressBarWidth = 636;
            }
            this.progressBarWidth = Math.ceil((this.score / 1000) * 636);
          },
        });
      },
      // 获取用户积分任务列表
      getUserTaskInfoByPage() {
        api.getUserTaskInfoByPage({
          data: {
            userId: this.userInfo.memberId,
            pageNum: 1,
            pageSize: 100,
          },
          success: (res) => {
            console.log('用户积分任务列表：', res.list);
            this.list = res.list;
          },
        });
      },

      // 点击查看
      handleScoreList() {
        uni.navigateTo({
          url: '/pages/user-center/points-list',
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-points {
    .background {
      @include size(750, 488);
      position: fixed;
      top: 0;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
    .card {
      @include size(684, 276);
      position: relative;
      box-shadow: 0 4rpx 24rpx 0 rgba(6, 6, 6, 0.12);
      z-index: 9;
      .progress-bar {
        position: relative;
        .total {
          @include size(636, 12);
          position: absolute;
          background: #e5e7e6;
        }
        .current {
          position: absolute;
          height: 12rpx;
          background: #ff2600;
        }
      }
      .watermark {
        @include size(282, 276);
        position: absolute;
        right: 0;
        bottom: 0;
        opacity: 0.75;
        z-index: -1;
      }
    }
    .points-detail {
      position: relative;
      margin-top: -112rpx;
      padding: 160rpx 32rpx 32rpx;
      border-radius: 20rpx 20rpx 0 0;
      .tab-bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .text {
            position: relative;
            height: 88rpx;
            line-height: 88rpx;
            &::after {
              content: '';
              display: block;
              width: 70rpx;
              height: 10rpx;
              background: #ff711a;
              border-radius: 5rpx;
              position: absolute;
              bottom: 0;
              left: 30rpx;
            }
          }
          .icon-tip {
            width: 36rpx;
            height: 36rpx;
            margin-left: 18rpx;
          }
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 40rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
          .icon-right {
            width: 36rpx;
            height: 36rpx;
          }
        }
        .tab {
          @include size(200, 88rpx);
          line-height: 88rpx;
          font-size: 40rpx;
          color: $color-black;
          &--selected {
            font-size: 44rpx;
            color: $color-primary;
          }
        }
        .indicator {
          @include size(80, 12);
          position: absolute;
          bottom: 0;
          &--left {
            left: 60rpx;
          }
          &--right {
            left: 260rpx;
          }
        }
      }
      .list {
        .item {
          @include size(686, 216);
          box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.12);
          padding: 0 40rpx;
          .icon {
            @include square(168);
          }
          .info {
            height: 100%;
            // align-items: center;
            justify-content: center;
            margin: 0 48rpx;
          }
          .button {
            @include size(158, 64);
            line-height: 64rpx;
            border: 2rpx solid $color-primary;
            box-sizing: border-box;
            color: #ffffff;
            background: linear-gradient(135deg, #ff8800 0%, #ff5000 100%);
          }
          &--finished {
            text {
              color: $color-lightgrey;
            }
            .button {
              opacity: 0.5;
              // color: $color-lightgrey;
              // border: 2rpx solid $color-lightgrey;
            }
          }
        }
      }
    }
  }
</style>
