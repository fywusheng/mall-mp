// 以案说法
<template>
  <view class="content">
    <view v-if="loading == 2" class="cont">
      <view class="cont-item" v-for="(artItem, artIndex) in list" :key="artIndex">
        <!-- 视频模块-->
        <view :data-id="artItem.contId" class="content-noimg">
          <view class="audio-title">
            <view class="title">{{ artItem.ttl }}</view>
          </view>
          <view class="audio-center" @click="goVedio()">
            <video
              class="bg"
              :src="artItem.mediaUrl"
              :poster="artItem.imgs[0]"
              :id="'video' + artIndex"
              object-fit="cover"
              @play="saveplay('video' + artIndex)"
              @error="onPlayError"
            ></video>
          </view>
          <view class="noimg-bottom">
            <view class="left">
              <!-- <text class="left-time">{{artItem.releasedTime}}</text> -->
              <text class="left-number">{{ artItem.clikCnt }}人在看</text>
            </view>
            <view class="right">
              <view class="share-item" @click="handleCollect(artItem, artIndex)">
                <image
                  class="cole"
                  mode="scaleToFill"
                  v-if="artItem.colFlag === '1'"
                  src="http://192.168.1.187:10088/static/map/icon-map-collected.png"
                />
                <image
                  class="cole"
                  mode="scaleToFill"
                  v-else
                  src="http://192.168.1.187:10088/static/map/icon-map-uncollect.png"
                />
                <text>收藏</text>
              </view>
              <view class="share-item" @click="handleShareClick(artItem)">
                <image
                  class="share"
                  mode="scaleToFill"
                  src="http://192.168.1.187:10088/static/common/icon-share2x.png"
                />
                <text>分享</text>
              </view>
              <view class="share-item" @click="handleGiveLike(artItem, artIndex)">
                <image
                  class="share"
                  mode="scaleToFill"
                  v-if="artItem.giveAlikeFlag === '0'"
                  src="http://192.168.1.187:10088/static/services/icon-give-like.png"
                />
                <image
                  class="cole"
                  mode="scaleToFill"
                  v-else
                  src="http://192.168.1.187:10088/static/services/icon-no-like.png"
                />
                <text>点赞</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="flex-v flex-c-c status-box2" v-if="loading == 1">
        <image
          src="http://192.168.1.187:10088/static/common/business_loading.gif"
          mode="scaleToFill"
        />
      </view>
      <!--  暂无图片 -->
      <view class="flex-v flex-c-c status-box" v-else>
        <image
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
    </view>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-wechat.png"
              mode="scaleToFill"
            />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-qq.png" mode="scaleToFill" />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-alipay.png"
              mode="scaleToFill"
            />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-message.png"
              mode="scaleToFill"
            />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <button class="item flex-v flex-c-c" @click="handleCopyClick">
            <image
              src="http://192.168.1.187:10088/static/common/icon-link.png"
              mode="scaleToFill"
            />
            <text>复制链接</text>
          </button>
        </view>
        <view class="btn">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="confirmpop" type="center">
      <view class="modal-container showValue" @touchmove.stop @click.stop="close()">
        <image src="http://192.168.1.187:10088/static/common/videoTip.png" mode="widthFix" />
      </view>
    </uni-popup>
  </view>
</template>
<script>
import api from '@/apis/index.js'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
export default {
  components: { uniPopup },
  props: {
    colName: {
      type: String,
      default: '以案说法'
    }
  },
  data() {
    return {
      list: [],
      stopPlay: false,
      playIndex: '',
      isPlay: false,
      innerAudioContext: null,
      mapState: {},
      pageNum: 1,
      loading: 1,
      title: '',
      arrayIndex: 0,
      player: '',
      videoBg: '',
      current: '',
      closeAudio: true,
      showAudio: false
    }
  },

  created() {
    // this.selectArtiListByColId()
  },
  mounted() {
    this.innerAudioContext = uni.createInnerAudioContext()
  },
  methods: {
    // 点赞or取消
    handleGiveLike(item, index) {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      const userInfo = uni.getStorageSync('userInfo')
      if (this.list[index].giveAlikeFlag === '0') {
        api.giveAlike({
          data: {
            contId: item.contId,
            giveAlike: '1',
            userId: userInfo.memberId
          },
          success: (data) => {
            this.list[index].giveAlikeFlag = '1'
            // this.$uni.showToast('点赞成功')
          }
        })
      } else {
        api.giveAlike({
          data: {
            contId: item.contId,
            giveAlike: '0',
            userId: userInfo.memberId
          },
          success: (data) => {
            this.list[index].giveAlikeFlag = '0'
            // this.$uni.showToast('取消成功')
          }
        })
      }
    },
    /**
       * 点击收藏按钮事件
       */
    handleCollect(item, index) {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      if (this.list[index].colFlag === '0') {
        api.saveCollect({
          data: {
            colId: item.contId,
            colType: '5'
          },
          success: (data) => {
            this.list[index].colFlag = '1'
            this.$uni.showToast('收藏成功')
          }
        })
      } else {
        api.updateCollect({
          data: {
            requestColSingleDTOList: [
              {
                delFlag: '1',
                colId: item.contId
              }
            ]
          },
          success: (data) => {
            this.list[index].colFlag = '0'
            this.$uni.showToast('取消收藏')
          }
        })
      }
    },
    // 点击复制链接
    handleCopyClick() {
      uni.setClipboardData({
        data: this.shareItem.mediaUrl,
        success: (res) => {
          console.log(res)
          uni.getClipboardData({
            success: (resp) => {
              this.$refs.popup.close()
              console.log('resp:', resp)
              uni.showToast({
                title: '已复制到剪贴板'
              })
            }
          })
        }
      })
    },
    // 点击分享
    handleShareClick(item) {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      this.shareItem = item
      this.$refs.popup.open()
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close()
    },
    triggleBg(data) {
      this.closeAudio = data
    },
    handleSwitchPlay() {
      this.mapState[this.playIndex] = !this.mapState[this.playIndex]
      if (this.mapState[this.playIndex]) {
        this.stopPlay = true
        this.innerAudioContext.play()
      } else {
        this.stopPlay = false
        this.innerAudioContext.pause()
      }
    },
    nextPlay() {
      const index = this.arrayIndex + 1
      const item = this.list[index]
      if (!item) {
        this.arrayIndex = this.list.length - 1
        return
      }
      this.handleNoimg(this.list[index], index)
      this.title = item.ttl
      this.videoBg = item.imgs[0] ? item.imgs[0] : ''
    },
    prePlay() {
      const index = this.arrayIndex - 1
      const item = this.list[index]
      if (!item) {
        this.arrayIndex = 0
        return
      }
      this.handleNoimg(this.list[index], index)
      this.title = item.ttl
      this.videoBg = item.imgs[0] ? item.imgs[0] : ''
    },
    handleClose() {
      this.showAudio = false
      this.innerAudioContext.pause()
      this.$set(this.mapState, this.playIndex, false)
    },
    // 点击播放
    saveplay(name) {
      if (this.current && name != this.current) {
        console.log('this.current: ', this.current)
        console.log('name: ', name)

        this.videoContext = uni.createVideoContext(this.current, this)

        this.videoContext.pause()
      }
      this.current = name
    },
    onPlayError(e) {
      console.log('播放错误+++', e)
    },
    goVedio() {
      // this.$refs.confirmpop.open()
    },
    close() {
      this.$refs.confirmpop.close()
    },
    destoryInstance() {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
        this.$set(this.mapState, this.playIndex, false)
      }
    },
    initRadio() {
      this.innerAudioContext = uni.createInnerAudioContext()
    },
    handleNoimg(item, index) {
      this.showAudio = true
      this.playIndex = item.contId
      this.arrayIndex = index
      this.title = item.ttl
      this.videoBg = item.imgs[0] ? item.imgs[0] : ''
      if (this.mapState[item.contId]) {
        const state = !this.mapState[item.contId]
        this.$set(this.mapState, item.contId, state)
      } else {
        this.mapState = {}
        this.$set(this.mapState, item.contId, true)
      }
      // #ifdef MP-WEIXIN
      this.innerAudioContext.src = item.mediaUrl
      // #endif
      // #ifdef MP-ALIPAY
      this.innerAudioContext.src = item.youkuUrl || item.mediaUrl
      // #endif
      if (this.mapState[item.contId]) {
        if (this.player) {
          this.player = null
        }
        this.player = setTimeout(() => {
          this.innerAudioContext.play()
          this.stopPlay = true
        }, 500)
      } else {
        this.innerAudioContext.pause()
        this.stopPlay = false
      }
      this.innerAudioContext.onTimeUpdate(() => {
        this.$refs.yaudio.process =
            (this.innerAudioContext.currentTime / this.innerAudioContext.duration) * 100
      })
      // 监听自然播放结束事件
      this.innerAudioContext.onEnded((res) => {
        console.log('监听自然播放结束事件')
        this.nextPlay()
      })
    },
    goDetail(e, tab, index) {
      uni.navigateTo({
        url: `/pages/find/article-detail?contId=` + e.currentTarget.dataset.id
      })
    },
    // colId 后端要求任意值
    selectArtiListByColId() {
      const data = {
        colId: '1',
        colName: this.colName,
        pageNum: this.pageNum,
        pageSize: 20,
        userId: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').uactId : ''
      }
      api.selectArtiListByColId({
        data,
        success: (res) => {
          if (res.list && res.list.length == 0) {
            this.loading = 3
          } else if (res.list && res.list.length > 0) {
            this.loading = 2
            this.list = this.list.concat(res.list)
            res.list.map((element) => {
              element.play = false
            })
            this.pageNum = this.pageNum + 1
          }
        },
        fail: () => {
          this.loading = 3
        }
      })
    },
    getColData() {
      this.pageNum = 1
      this.list = []
      this.selectArtiListByColId()
    }
  }
}
</script>
<style lang="scss" scoped>
  .audio {
    position: fixed;
    bottom: 200rpx;
    left: 32rpx;
    z-index: 2;
  }
  .text-2 {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .text-3 {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .nav-item {
    display: inline-block;
    margin: 0 16upx;
    text-align: center;
    transition: color 0.3s ease;
    font-size: 40rpx;
    color: #999999;
  }

  .nav {
    white-space: nowrap;
    position: relative;
    height: 50upx;
    padding: 20upx 16rpx;
    background-color: #fff;
    width: 100%;
  }

  /* #ifndef APP-NVUE */
  ::-webkit-scrollbar {
    display: none;
  }
  /* #endif */

  /* #ifdef H5 */
  // 通过样式穿透，隐藏H5下，scroll-view下的滚动条
  scroll-view ::v-deep ::-webkit-scrollbar {
    display: none;
  }
  /* #endif */

  .nav-item-act {
    color: #000;
    font-weight: bolder;
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      bottom: -14rpx;
      transform: translateX(-50%);
      width: 64rpx;
      height: 8rpx;
      background: #ff711a;
      border-radius: 5rpx;
    }
  }
  .content {
    // padding: 32rpx;
    // padding-top: 0;
    padding-bottom: 0;
    .cont {
      background: #f5f5f5;
    }
    .content-top {
      display: flex;
      width: 100%;
      border-bottom: 2rpx solid #f5f5f5;
      padding: 20rpx 0;
      .top-left {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100rpx;
        height: 60rpx;
        background: #ff9a00;
        border-radius: 8rpx;
        font-size: 36rpx;
        color: #fff;
      }
      .top-right {
        width: 100%;
        color: #323233;
        margin-left: 10rpx;
        font-size: 40rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .content-noimg {
      width: 100%;
      // margin-top: 24rpx;
      padding-bottom: 12rpx;
      border-bottom: 2rpx solid #f5f5f5;
      &.play {
        .noimg-title {
          color: #ff5500;
        }
        .noimg-bottom {
          .right {
            border: 2rpx solid #ff5500;
            color: #ff5500;
          }
        }
      }
      .noimg-title {
        width: 100%;
        color: #333333;
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .noimg-content {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .img-center {
        display: flex;
        width: 100%;
        height: 170rpx;
        image {
          flex: 1;
          height: 170rpx;
          margin: 20rpx 0rpx 0 10rpx;
          border-radius: 10rpx;
        }
      }
      .noimg-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100rpx;
        // border-bottom: 2rpx solid #f5f5f5;
        margin-top: 20rpx;
        .left {
          display: flex;
          align-items: center;
          width: 100%;
          color: #999999;
          font-size: 36rpx;
          .left-number {
            margin-left: 20rpx;
          }
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0 20rpx;
          height: 72rpx;
          border-radius: 36rpx;
          // border: 2rpx solid #999999;
          box-sizing: border-box;
          font-size: 36rpx;
          color: #333333;
          .share-item {
            display: flex;
            align-items: center;
            margin-left: 32rpx;
          }
          image {
            flex-shrink: 0;
            width: 36rpx;
            height: 36rpx;
            margin-right: 8rpx;
            &.playimg {
              width: 32rpx;
              height: 32rpx;
            }
          }
          text {
            font-size: 36rpx;
          }
        }
      }

      .audio-title {
        color: #333333;
        position: relative;
        // width: 718rpx;
        // height: 70rpx;
        // background: url('http://192.168.1.187:10088/static/services/icon-title-shadow.png')
        //   no-repeat;
        background-size: 100% 100%;
        background-position: center;
        .title {
          // position: absolute;
          top: 0;
          // left: 40rpx;
          // width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 40rpx;
        }
        // white-space: nowrap;
        // text-overflow: ellipsis;
        // overflow: hidden;
      }
      .audio-center {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 380rpx;
        border-radius: 10rpx;
        // background: url("http://192.168.1.187:10088/static/logo.png") no-repeat;
        background-size: 100% 100%;
        margin-top: 22rpx;
        overflow: hidden;
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
        }
        .play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120rpx;
          height: 120rpx;
        }
      }
    }
    .content-oneimg {
      padding: 30rpx 0 12rpx;
      // border-bottom: 2rpx solid #f5f5f5;
      &.play {
        .oneimg-title {
          color: #ff5500;
        }
        .oneimg-bottom {
          .right {
            border: 2rpx solid #ff5500;
            color: #ff5500;
          }
        }
      }
      .oneimg-title {
        display: flex;
        width: 100%;
        color: #333333;
        font-size: 40rpx;
        text {
          width: 100%;
          display: block; /* Fallback for non-webkit */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        image {
          flex-shrink: 0;
          width: 260rpx;
          height: 160rpx;
          border-radius: 10rpx;
        }
      }
      .oneimg-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100rpx;
        border-bottom: 2rpx solid #f5f5f5;
        // border-bottom: 2rpx solid #f5f5f5;
        .left {
          display: flex;
          align-items: center;
          width: 100%;
          color: #999999;
          font-size: 36rpx;
          .left-number {
            margin-left: 20rpx;
          }
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0 20rpx;
          height: 72rpx;
          border-radius: 36rpx;
          border: 2rpx solid #999999;
          box-sizing: border-box;
          font-size: 36rpx;
          color: #333333;
          image {
            flex-shrink: 0;
            width: 48rpx;
            height: 40rpx;
            margin-right: 16rpx;
            &.playimg {
              width: 32rpx;
              height: 32rpx;
            }
          }
          text {
            margin-left: 4rpx;
          }
        }
      }
    }
    .cont-item {
      margin-bottom: 24rpx;
      padding: 32rpx 32rpx 0;
      background: #ffffff;
    }
    .swiper-bottom {
      width: 100%;
      height: 150rpx;
    }
    .status-box {
      padding-top: 200rpx;
      image {
        width: 440rpx;
        height: 234rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
    .status-box2 {
      padding-top: 200rpx;
      image {
        width: 150rpx;
        height: 150rpx;
      }
    }
  }
  .share-pop {
    background-color: #f2f2f2;
    border-radius: 16px 16px 0px 0px;
    color: #333333;
    .title {
      text-align: center;
      line-height: 50rpx;
    }
    .list {
      // #ifdef MP-ALIPAY
      justify-content: flex-start;
      // #endif

      // #ifdef MP-WEIXIN
      justify-content: center;
      // #endif

      align-items: center;

      padding: 24rpx 74rpx;
      flex-wrap: wrap;
      .item {
        height: 192rpx;
        flex-shrink: 0;
        width: 33.3%;
        margin-bottom: 28rpx;
        image {
          flex-shrink: 0;
          width: 134rpx;
          height: 134rpx;
          margin-bottom: 8rpx;
        }
        text {
          line-height: 50rpx;
        }
      }
    }
    .btn {
      padding: 24rpx 74rpx;
      box-sizing: border-box;
      .cancle {
        height: 108rpx;
        border-radius: 54rpx;
        color: #666;
        font-weight: 500;
      }
    }
  }
</style>
