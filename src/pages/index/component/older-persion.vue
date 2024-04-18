// 养老金文章
<template>
  <view class="content">
    <view v-if="loading == 2">
      <swiper
        class="swiper"
        :indicator-dots="false"
        :autoplay="false"
        :interval="4000"
        :duration="500"
        indicator-color="#E0E0E0"
        indicator-active-color="#FF5500"
        @change="hanldeBannerChange"
      >
        <swiper-item class="item" v-for="(artItem, artIndex) in list" :key="artIndex">
          <!-- 听文章没图片模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg', playIndex == artItem.contId ? 'play' : '']"
            v-if="artItem.imgs.length === 0 && artItem.artiType === '0'"
          >
            <view class="noimg-title text-2">{{ artItem.ttl }}</view>
            <view class="noimg-content text-2">{{ artItem.cutCont }}</view>
            <view class="noimg-bottom">
              <view class="left">
                <!-- <text class="left-time">{{artItem.releasedTime}}</text> -->
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view class="right" @click.native.stop="handleNoimg(artItem, artIndex)">
                <image
                  v-if="playIndex != artItem.contId"
                  src="http://192.168.1.187:10088/static/find/horn2x.png"
                  mode="scaleToFill"
                ></image>
                <template v-else>
                  <image
                    v-if="mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-stop2x.png"
                    mode="scaleToFill"
                  ></image>
                  <image
                    v-if="!mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-play2x.png"
                    mode="scaleToFill"
                  ></image>
                </template>
                <text v-if="playIndex != artItem.contId">听文章</text>
                <view v-else>
                  <text v-if="!mapState[artItem.contId]">暂停</text>
                  <text v-if="mapState[artItem.contId]">播放</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 听文章一张图片模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-oneimg', playIndex == artItem.contId ? 'play' : '']"
            v-else-if="artItem.imgs.length === 1 && artItem.artiType === '0'"
          >
            <view class="oneimg-title">
              <text class="text-3">{{ artItem.ttl }}</text>
              <image
                :src="imgItem"
                mode="scaleToFill"
                @error="handleArticleImageLoadFail(index, artIndex, imgIndex, 1)"
                v-for="(imgItem, imgIndex) in artItem.imgs"
                :key="imgIndex"
              ></image>
            </view>
            <view class="oneimg-bottom">
              <view class="left">
                <!-- <text class="left-time">{{artItem.releasedTime}}</text> -->
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view class="right" @click.native.stop="handleNoimg(artItem, artIndex)">
                <image
                  v-if="playIndex != artItem.contId"
                  src="http://192.168.1.187:10088/static/find/horn2x.png"
                  mode="scaleToFill"
                ></image>
                <template v-else>
                  <image
                    v-if="mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-stop2x.png"
                    mode="scaleToFill"
                  ></image>
                  <image
                    v-if="!mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-play2x.png"
                    mode="scaleToFill"
                  ></image>
                </template>
                <text v-if="playIndex != artItem.contId">听文章</text>
                <view v-else>
                  <text v-if="!mapState[artItem.contId]">暂停</text>
                  <text v-if="mapState[artItem.contId]">播放</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 听文章多张图片显示模块 -->
          <view
            @click="goDetail($event, index, artIndex)"
            :data-id="artItem.contId"
            :class="['content-noimg', artItem.play ? 'play' : '']"
            v-else-if="artItem.imgs.length > 1 && artItem.artiType === '0'"
          >
            <view class="noimg-title text-2">{{ artItem.ttl }}</view>
            <view class="img-center">
              <template v-for="(imgItem, imgIndex) in artItem.imgs">
                <image
                  v-if="imgIndex > 2 ? false : true"
                  :src="imgItem"
                  mode="scaleToFill"
                  @error="handleArticleImageLoadFail(index, artIndex, imgIndex, 2)"
                  :key="imgIndex"
                ></image>
              </template>
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <!-- <text class="left-time">{{artItem.releasedTime}}</text> -->
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
              <view class="right" @click.native.stop="handleNoimg(artItem, artIndex)">
                <image
                  v-if="playIndex != artItem.contId"
                  src="http://192.168.1.187:10088/static/find/horn2x.png"
                  mode="scaleToFill"
                ></image>
                <template v-else>
                  <image
                    v-if="mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-stop2x.png"
                    mode="scaleToFill"
                  ></image>
                  <image
                    v-if="!mapState[artItem.contId]"
                    class="playimg"
                    src="http://192.168.1.187:10088/static/find/list-play2x.png"
                    mode="scaleToFill"
                  ></image>
                </template>

                <text v-if="playIndex != artItem.contId">听文章</text>
                <view v-else>
                  <text v-if="!mapState[artItem.contId]">暂停</text>
                  <text v-if="mapState[artItem.contId]">播放</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 视频模块-->
          <view
            @click="goVedio()"
            :data-id="artItem.contId"
            class="content-noimg"
            v-else-if="artItem.artiType === '1'"
          >
            <view class="audio-title text-2">{{ artItem.ttl }}</view>
            <view class="audio-center">
              <image
                class="bg"
                :src="artItem.imgs[0]"
                @error="handleArticleImageLoadFail(index, artIndex, imgIndex, 1)"
                v-for="(imgItem, imgIndex) in artItem.imgs"
                :key="imgIndex"
                mode="scaleToFill"
              />
              <image
                class="play"
                mode="scaleToFill"
                src="http://192.168.1.187:10088/static/find/audio2x.png"
              ></image>
            </view>
            <view class="noimg-bottom">
              <view class="left">
                <!-- <text class="left-time">{{artItem.releasedTime}}</text> -->
                <text class="left-number">{{ artItem.clikCnt }}人在看</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <uni-swiper-dot
        :info="list"
        :current="index"
        field="content"
        mode="round"
        :dotsStyles="dotsStyles"
      >
        <view class="uni-dot"></view>
      </uni-swiper-dot>
    </view>
    <view v-else>
      <!-- <view class="flex-v flex-c-c status-box2" v-if="loading == 1">
        <image src="http://192.168.1.187:10088/static/common/business_loading.gif"
          mode="scaleToFill" />
      </view> -->
      <!--  暂无图片 -->
      <!-- <view class="flex-v flex-c-c status-box" v-else>
        <image src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill" />
        <view class="flex-c-c status-text">暂无内容</view>
      </view> -->
    </view>
    <view class="audio" v-if="showAudio">
      <Yaudio
        @handleClose="handleClose"
        ref="yaudio"
        @prePlay="prePlay"
        @handleSwitchPlay="handleSwitchPlay"
        @nextPlay="nextPlay"
        :title="title"
        :stopPlay="stopPlay"
        :videoBg="videoBg"
        :closeAudio="closeAudio"
        @triggleBg="triggleBg"
      ></Yaudio>
    </view>
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
import { uniSwiperDot } from '@dcloudio/uni-ui'
import Yaudio from './audio.vue'
export default {
  components: { uniPopup, Yaudio, uniSwiperDot },
  props: {
    // list: {
    //   type: Array,
    //   default: () => []
    // },
    colName: {
      type: String,
      default: '养老金'
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      index: 0,
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
      closeAudio: true,
      showAudio: false,
      dotsStyles: {
        width: 6,
        height: 6,
        bottom: 0,
        backgroundColor: '#E0E0E0',
        border: 'none',
        selectedBackgroundColor: '#FF5500',
        selectedBorder: 'none'
      }
    }
  },
  created() {
    this.selectArtiListByColId()
  },
  mounted() {
    this.innerAudioContext = uni.createInnerAudioContext()
  },
  methods: {
    hanldeBannerChange(e) {
      this.index = e.detail.current
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
      this.destoryInstance()
      this.playIndex = false
      this.showAudio = false
      // this.innerAudioContext.pause()
      // this.$set(this.mapState, this.playIndex, false)
    },
    goVedio() {
      this.$refs.confirmpop.open()
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
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
      }
      this.initRadio()
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
      this.$emit('play', 'bCase')
    },
    goDetail(e, tab, index) {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      this.innerAudioContext.pause()
      uni.navigateTo({
        url: `/pages/find/article-detail?contId=` + e.currentTarget.dataset.id
      })
    },
    // colId 后端要求任意值  维权服务推荐: 12,13
    selectArtiListByColId() {
      const wq_Param = {
        colId: '12,13',
        recomFlag: '1',
        pageNum: this.pageNum,
        pageSize: 3
      }
      const data = {
        colId: '1',
        recomFlag: '1',
        colName: this.colName,
        pageNum: this.pageNum,
        pageSize: 3
      }

      api.selectArtiListByColId({
        data: this.type == 2 ? wq_Param : data,
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
    padding-top: 0;
    padding-bottom: 0;
    width: 100%;
    .uni-dot {
      height: 20px;
      width: 100%;
    }
    .swiper {
      height: 292rpx !important;
      width: 100%;
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
      margin-top: 30rpx;
      padding-bottom: 12rpx;
      // border-bottom: 2rpx solid #f5f5f5;
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
        height: 199rpx;
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
            font-size: 36rpx;
          }
        }
      }

      .audio-title {
        width: 100%;
        color: #333333;
        font-size: 40rpx;
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
        margin-top: 12rpx;
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
      padding: 30rpx 0 30rpx;
      border-bottom: 2rpx solid #f5f5f5;
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
    .item {
      padding: 0 32rpx;
      background: #ffffff;
      border-radius: 12rpx;
      padding-bottom: 24rpx;
      box-sizing: border-box;
      &:last-child {
        padding-bottom: 0;
      }
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
</style>
