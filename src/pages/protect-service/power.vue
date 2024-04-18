//维权服务
<template>
  <view class="service">
    <view class="top">
      <image
        class="_img"
        src="http://192.168.1.187:10088/static/home/saft.png"
        mode="scaleToFill"
        @click="handleSuperMarket"
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
      <bCase ref="base" v-if="tabIndex == 1"></bCase>
      <bCase ref="base" :colName="colName" v-if="tabIndex == 2"></bCase>
    </view>
    <image
      class="fix_btn"
      mode="widthFix"
      @click="startQuest"
      src="http://192.168.1.187:10088/static/home/zixun.png"
    />
  </view>
</template>
<script>
import pLaw from './component/pLaw.vue'
import bCase from './component/bCase.vue'
export default {
  components: { pLaw, bCase },
  data() {
    return {
      colName: '维权指南',
      tabIndex: 0,
      titleLables: [
        {
          index: 0,
          name: '普法卫我'
        },
        {
          index: 1,
          name: '以案说法'
        },
        {
          index: 2,
          name: '维权指南'
        }
      ]
    }
  },
  onLoad(e) {
    if (e.index) {
      this.tabIndex = e.index
    }
  },
  onReachBottom() {
    if (this.tabIndex == 0) {
      this.$refs.plaw.selectArtiListByColId()
    } else if (this.tabIndex == 1) {
      this.$refs.base.selectArtiListByColId()
    }
  },
  onShow() {
    if (this.$refs.base) {
      this.$refs.base.initRadio()
    }
  },
  watch: {
    tabIndex(newV, old) {
      this.destory()
      // if (newV == 0 || newV == 2) {
      //   this.destory()
      // }
    }
  },
  onUnload() {
    this.destory()
  },
  onHide() {
    this.destory()
  },
  methods: {
    goSmallVideo(item) {
      console.log('===视频列表---', item)
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType != 'none') {
            uni.navigateTo({
              url:
                  '/pages/find/video-swiper?transInfor=' +
                  `${encodeURIComponent(JSON.stringify(item))}`
            })
          } else {
            this.$uni.showToast('没有网络')
          }
        }
      })
    },

    destory() {
      if (this.$refs.base) {
        this.$refs.base.destoryInstance()
        this.$refs.base.showAudio = false
      }
      if (this.$refs.plaw) {
        this.$refs.plaw.destoryInstance()
        this.$refs.plaw.showAudio = false
      }
    },
    startQuest() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      uni.navigateTo({ url: '/pages/services/activist' })
    },
    handleSuperMarket() {
      uni.navigateTo({ url: '/pages/protect-service/wqPoint' })
    },
    activeClick(index) {
      this.tabIndex = index
    }
  }
}
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
