//遗嘱服务
<template>
  <view class="service">
    <view class="top">
      <image
        class="_img"
        src="http://192.168.1.187:10088/static/services/icon-will-top.png"
        mode="scaleToFill"
      />
      <view class="line_lable">
        <view
          class="item"
          @click="activeClick(i)"
          :class="tabIndex == i ? 'active' : ''"
          v-for="(v, i) in titleLables"
          :key="i"
        >
          <view>{{ v.name }}</view>
          <view v-if="tabIndex == i" class="bottom_line"></view>
        </view>
      </view>
      <pLaw v-if="tabIndex == 0" ref="plaw" @video_list="goSmallVideo"></pLaw>
      <template v-if="tabIndex == 1">
        <image
          class="tab-img"
          v-for="(item, index) in imgList2"
          :src="item"
          mode="widthFix"
          :key="index"
        />
      </template>
      <template v-if="tabIndex == 2">
        <image
          class="tab-img"
          v-for="(item, index) in imgList3"
          :src="item"
          mode="widthFix"
          :key="index"
        />
      </template>
    </view>
    <image
      class="fix_btn"
      mode="widthFix"
      @click="startQuest"
      src="http://192.168.1.187:10088/static/services/icon-will-bottom.png"
    />
  </view>
</template>
<script>
  import pLaw from './components/pLaw.vue';
  export default {
    components: { pLaw },
    data() {
      return {
        tabIndex: 0,
        titleLables: [
          {
            index: 0,
            name: '传承知识',
          },
          {
            index: 1,
            name: '案例解析',
          },
          {
            index: 2,
            name: '答疑解惑',
          },
        ],
        // 案例解析
        imgList2: [
          'http://192.168.1.187:10088/static/services/icon-will-tab2-1.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab2-2.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab2-3.png',
        ],
        // 答疑解惑
        imgList3: [
          'http://192.168.1.187:10088/static/services/icon-will-tab3-1.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab3-2.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab3-3.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab3-4.png',
          'http://192.168.1.187:10088/static/services/icon-will-tab3-5.png',
        ],
      };
    },
    onLoad(e) {
      if (e.index) {
        this.tabIndex = e.index;
      }
    },
    onReachBottom() {
      if (this.tabIndex == 0) {
        this.$refs.plaw.selectArtiListByColId();
      }
    },
    onShow() {
      if (this.$refs.plaw) {
        this.$refs.plaw.initRadio();
      }
    },
    watch: {
      tabIndex(newV, old) {
        if (this.$refs.plaw) {
          this.$refs.plaw.destoryInstance();
        }
      },
    },
    onUnload() {
      this.$refs.plaw.destoryInstance();
    },
    onHide() {
      this.$refs.plaw.destoryInstance();
    },
    methods: {
      goSmallVideo(item) {
        console.log('===视频列表---', item);
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType != 'none') {
              uni.navigateTo({
                url:
                  '/pages/find/video-swiper?transInfor=' +
                  `${encodeURIComponent(JSON.stringify(item))}`,
              });
            } else {
              this.$uni.showToast('没有网络');
            }
          },
        });
      },
      // 拨打电话
      startQuest() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.makePhoneCall({
          phoneNumber: '4008734514',
        });
      },
      activeClick(index) {
        this.tabIndex = index;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .service {
    .fix_btn {
      height: 80px;
      width: 100%;
      position: fixed;
      bottom: 0;
    }
    .top {
      background-color: #fff;
      width: 93%;
      margin: 0 auto;
      padding-bottom: 160rpx;
      ._img {
        width: 100%;
        height: 224rpx;
        margin: 16rpx auto 24rpx auto;
      }
      .tab-img {
        width: 100%;
      }
      .line_lable {
        height: 66rpx;
        line-height: 66rpx;
        width: 100%;
        display: flex;
        justify-content: space-between;
        text-align: center;
        position: sticky;
        top: 0;
        left: 0;
        background: #fff;
        .item {
          font-size: 40rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          width: 33%;
          .bottom_line {
            width: 31%;
            height: 8rpx;
            background: #ff711a;
            border-radius: 5rpx;
            margin: 0 auto;
          }
        }
        .active {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }
</style>
