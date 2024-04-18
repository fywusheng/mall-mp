//医保服务
<template>
  <view class="service">
    <view class="top">
      <image
        class="_img"
        src="http://192.168.1.187:10088/static/home/ybbg_h.png"
        mode="scaleToFill"
      />
      <view class="space_line"></view>
      <bCase :colName="colName" ref="base"></bCase>
    </view>
    <image
      class="fix_btn"
      mode="widthFix"
      @click="startQuest"
      src="http://192.168.1.187:10088/static/home/yb_btn.png"
    />
  </view>
</template>
<script>
import bCase from './component/bCase.vue'
export default {
  components: { bCase },
  data() {
    return {
      tabIndex: 0,
      colName: '医保服务'
    }
  },
  onLoad(e) {
    if (e.index) {
      this.tabIndex = e.index
    }
  },
  onReachBottom() {
    console.log('=---22立卡')
    this.$refs.base.selectArtiListByColId()
  },
  onShow() {
    if (this.$refs.base) {
      this.$refs.base.initRadio()
    }
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
    startQuest() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      const url =
          'https://znkf.ylzinfo.com/ylzbigdata_znkf_fe/#/web_im_plugin?appId=c3ceba1d1345401ab85db3ca891ab265'
      uni.navigateTo({
        url: '/pages/common/webpage?url=' + encodeURIComponent(url)
      })
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
      .space_line {
        // position: absolute;
        left: 0;
        width: 100%;
        height: 17rpx;
        background-color: #f5f5f5;
      }
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
