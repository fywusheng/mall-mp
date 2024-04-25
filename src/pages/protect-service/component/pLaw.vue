<template>
  <view>
    <view v-if="loading == 2" class="small-video">
      <view class="item" v-for="(item, index) in datalist" @click="handleNoimg(item, index)" :key="index">
        <image mode="aspectFill" :src="item.imgs[0]" class="top_img" />
        <view class="text" :class="playIndex == item.contId ? 'play' : ''">{{ item.ttl }}</view>
        <view class="bottom">
          <image mode="aspectFill" class="left_icon" :src="item.logoUrl" />
          <view class="des">{{ item.categoryName }}</view>
        </view>
      </view>
    </view>
    <view v-else class="_space">
      <view class="flex-v flex-c-c status-box2" v-if="loading == 1">
        <image src="http://192.168.1.187:10088/static/common/business_loading.gif" mode="scaleToFill" />
      </view>
      <!--  暂无图片 -->
      <view class="flex-v flex-c-c status-box" v-else>
        <image src="http://192.168.1.187:10088/static/common/status-none2x.png" mode="scaleToFill" />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
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
  import api from '@/apis/index.js';
  // import uniPopup from '@/components/uni-popup/uni-popup.vue'
  import Yaudio from './audio.vue';
  export default {
    components: { Yaudio },
    data() {
      return {
        datalist: [],
        pageNum: 1,
        loading: 1,
        list: [],
        stopPlay: false,
        playIndex: '',
        isPlay: false,
        innerAudioContext: null,
        mapState: {},
        title: '',
        arrayIndex: 0,
        player: '',
        videoBg: '',
        closeAudio: true,
        showAudio: false,
      };
    },
    onLoad() {},
    created() {
      this.selectArtiListByColId();
    },
    mounted() {
      this.innerAudioContext = uni.createInnerAudioContext();
    },
    methods: {
      destoryInstance() {
        if (this.innerAudioContext) {
          this.innerAudioContext.destroy();
          this.$set(this.mapState, this.playIndex, false);
        }
      },
      triggleBg(data) {
        this.closeAudio = data;
      },
      nextPlay() {
        const index = this.arrayIndex + 1;
        const item = this.datalist[index];
        if (!item) {
          this.arrayIndex = this.datalist.length - 1;
          return;
        }
        this.handleNoimg(this.datalist[index], index);
        this.title = item.ttl;
        this.videoBg = item.imgs[0] ? item.imgs[0] : '';
      },
      handleSwitchPlay() {
        this.mapState[this.playIndex] = !this.mapState[this.playIndex];
        if (this.mapState[this.playIndex]) {
          this.stopPlay = true;
          this.innerAudioContext.play();
        } else {
          this.stopPlay = false;
          this.innerAudioContext.pause();
        }
      },
      /*
       * 点击听文章事件
       */
      handleNoimg(item, index) {
        this.$emit('video_list', item);
        return;

        this.showAudio = true;
        this.playIndex = item.contId;
        this.arrayIndex = index;
        this.title = item.ttl;
        this.videoBg = item.imgs[0] ? item.imgs[0] : '';
        if (this.mapState[item.contId]) {
          const state = !this.mapState[item.contId];
          this.$set(this.mapState, item.contId, state);
        } else {
          this.mapState = {};
          this.$set(this.mapState, item.contId, true);
        }
        // #ifdef MP-WEIXIN
        this.innerAudioContext.src = item.mediaUrl;
        // #endif
        // #ifdef MP-ALIPAY
        this.innerAudioContext.src = item.youkuUrl || item.mediaUrl;
        // #endif
        if (this.mapState[item.contId]) {
          if (this.player) {
            this.player = null;
          }
          this.player = setTimeout(() => {
            this.innerAudioContext.play();
            this.stopPlay = true;
          }, 500);
        } else {
          this.innerAudioContext.pause();
          this.stopPlay = false;
        }
        this.innerAudioContext.onTimeUpdate(() => {
          this.$refs.yaudio.process = (this.innerAudioContext.currentTime / this.innerAudioContext.duration) * 100;
        });
        // 监听自然播放结束事件
        this.innerAudioContext.onEnded((res) => {
          console.log('监听自然播放结束事件');
          // this.$refs.yaudio.process = 0
          this.nextPlay();
        });
      },
      prePlay() {
        const index = this.arrayIndex - 1;
        const item = this.datalist[index];
        if (!item) {
          this.arrayIndex = 0;
          return;
        }
        this.handleNoimg(this.datalist[index], index);
        this.title = item.ttl;
        this.videoBg = item.imgs[0] ? item.imgs[0] : '';
      },
      handleClose() {
        this.showAudio = false;
        this.innerAudioContext.pause();
        this.$set(this.mapState, this.playIndex, false);
      },
      close() {
        this.$refs.confirmpop.close();
      },
      selectArtiListByColId() {
        // TODO 栏目id 后端-可以任意值以name为准
        const data = {
          colId: '1',
          colName: '普法卫我',
          pageNum: this.pageNum,
          pageSize: 20,
        };
        api.selectArtiListByColId({
          data,
          success: (res) => {
            if (res.list && res.list.length == 0) {
              this.loading = 3;
            } else if (res.list && res.list.length > 0) {
              this.loading = 2;
              this.datalist = this.datalist.concat(res.list);
              res.list.map((element) => {
                element.play = false;
              });
              this.pageNum = this.pageNum + 1;
            }
          },
          fail: () => {
            this.loading = 3;
          },
        });
      },
      // clickItem(item) {
      //   // 点击去弹框下载
      //   this.$refs.confirmpop.open()
      // }
    },
  };
</script>

<style lang="scss" scoped>
  .audio {
    position: fixed;
    bottom: 200rpx;
    left: 32rpx;
    z-index: 2;
  }
  .small-video {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 22rpx;
    .item {
      width: 336rpx;
      background: #ffffff;
      border-radius: 16rpx;
      border: 4rpx solid #e5d6b6;
      margin-bottom: 15rpx;
      // margin-top: 24rpx;
      // margin-left: 21rpx;
      .top_img {
        width: 336rpx;
        height: 336rpx;
        border-radius: 16rpx;
      }
      .text {
        height: 100rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 50rpx;
        width: 296rpx;
        margin: 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .play {
        color: #ff5500;
      }
      .bottom {
        height: 88rpx;
        line-height: 88rpx;
        display: flex;
        justify-content: flex-start;
        .left_icon {
          width: 48rpx;
          height: 48rpx;
          margin-right: 12rpx;
          padding-top: 15rpx;
          padding-left: 15rpx;
        }
        .des {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
  }
  ._space {
    margin: 0 auto;
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
