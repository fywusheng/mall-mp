//老有所为
<template>
  <view class="service">
    <view class="top">
      <view class="image">
        <image
          class="_img"
          src="http://192.168.1.187:10088/static/services/icon-older-wei.png"
          mode="scaleToFill"
        />
      </view>
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
      <view class="space_line"></view>
      <video-list :colName="colName" ref="base"></video-list>
    </view>
  </view>
</template>
<script>
import VideoList from './component/video-list.vue'
export default {
  components: { VideoList },
  data() {
    return {
      tabIndex: 0,
      colName: '',
      titleLables: [
        {
          index: 0,
          name: '玩转手机'
        },
        {
          index: 1,
          name: '花卉养护'
        },
        {
          index: 2,
          name: '华尔兹'
        }
      ]
    }
  },
  onLoad(e) {
    if (e.index) {
      this.tabIndex = parseInt(e.index) || 0
      this.colName = this.titleLables[e.index].name
      this.$nextTick(() => {
        this.$refs.base.getColData()
      })
    }
    uni.$on('didLogin', () => {
      this.$refs.base.getColData()
    })
  },
  onReachBottom() {
    this.$refs.base.selectArtiListByColId()
  },
  watch: {
    tabIndex(newV, old) {
      if (newV == 0 || newV == 2) {
        if (this.$refs.base) {
          this.$refs.base.destoryInstance()
        }
      }
    }
  },
  onUnload() {
    if (this.$refs.base) {
      this.$refs.base.destoryInstance()
      this.$refs.base.showAudio = false
    }
  },
  onHide() {
    if (this.$refs.base) {
      this.$refs.base.destoryInstance()
      this.$refs.base.showAudio = false
    }
  },
  methods: {
    activeClick(index) {
      this.tabIndex = index
      this.colName = this.titleLables[index].name
      this.$nextTick(() => {
        this.$refs.base.getColData()
      })
    }
  },
  // 分享好友
  onShareAppMessage(res) {
    return {
      title: '老有所为',
      path: '/pages/protect-service/oldAgeWei',
      success(res) {
        this.$uni.showToast({
          title: '分享成功'
        })
      },
      fail(res) {
        this.$uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
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
      margin: 0 auto;
      // padding-bottom: 160rpx;
      .space_line {
        // position: absolute;
        left: 0;
        width: 100%;
        height: 17rpx;
        background-color: #f5f5f5;
      }
      .image {
        padding: 0 32rpx;
        ._img {
          display: block;
          width: 100%;
          height: 224rpx;
          margin: 16rpx auto 24rpx auto;
        }
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
        z-index: 10;
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
