<template>
  <view class="video">
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar :alpha="0" statusBackGround="">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s" :style="{ height: navigationBarHeight + 'px' }">
          <image class="back-icon" @click="handleNavBack" src="http://192.168.1.187:10088/static/songhui/common/back-white.png" mode="scaleToFill" />
        </view>
      </view>
    </navigation-bar>
    <!-- #endif -->
    <swiper class="swiper" vertical :interval="interval" :duration="duration" @animationfinish="animationfinish">
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="swiper-item uni-bg-red" @click="saveplay('video' + index)">
          <view>
            <video
              object-fit="contain"
              class="video"
              :id="'video' + index"
              @pause="stop('video' + index)"
              @play="start('video' + index)"
              @waiting="waiting"
              play-btn-position="center"
              :controls="true"
              :show-center-play-btn="true"
              :show-play-btn="true"
              :show-fullscreen-btn="false"
              :show-mute-btn="true"
              @error="videoErrorCallback"
              :src="item"
            ></video>
          </view>
          <view class="info">
            <view class="_float">
              <view class="desc">{{ item.ttl }}</view>
            </view>
          </view>
          <view class="audio">
            <view class="text-group">
              <view class="text"></view>
            </view>
          </view>
        </view>
        <!-- <view class="buttons">
          <view class="header_group" @click="goType(item)">
            <image mode="aspectFill" class="header" :src="item.logoUrl" />
          </view>
          <view class="button">
            <image @click="collect(item, index)" mode="widthFix" class="icon" :src="collectIcon(item.colFlag)" />
            <view>收藏</view>
          </view>
          <view class="button">
            <image @click="share(index)" mode="widthFix" class="icon" src="http://192.168.1.187:10088/static/find/fenxiang.png" />
            <view>分享</view>
          </view>
        </view> -->
      </swiper-item>
      <!-- <view class="netError" v-if="loading == 3">
				<view class="text_center">
					<image class="noData" src="../find/static/no-data.png" mode="scaleToFill" />
					<view class="err_info">视频加载失败</view>
					<view class="try" @click="retry">点击重试</view>
				</view>
			</view>  -->
    </swiper>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-wechat.png" mode="scaleToFill" />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-qq.png" mode="scaleToFill" />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-alipay.png" mode="scaleToFill" />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-message.png" mode="scaleToFill" />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <!-- <button class="item flex-v flex-c-c" @click="handleCopyClick">
            <image src="http://192.168.1.187:10088/static/common/icon-link.png" mode="scaleToFill" />
            <text>复制链接</text>
          </button> -->
        </view>
        <view class="btn">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import NavigationBar from '@/components/common/navigation-bar.vue';
  export default {
    name: 'small-video',
    components: { NavigationBar },
    props: {
      shareIcon: {
        type: String,
        default: 'http://192.168.1.187:10088/static/find/fenxiang.png',
      },
    },
    data() {
      return {
        loading: 1,
        current: 0,
        indicatorDots: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        list: [],
        pageNum: 1,
        pageSize: 5,
        categoryName: '',
        logoUrl: '',
        playState: {},
        navigationBarHeight: 44,
      };
    },
    created() {
      console.log('===created--');
      // uni.onNetworkStatusChange((res) => {
      //   if (res.isConnected) {
      //     console.log('===链接状态---', res.isConnected);
      //     this.loading = 2;
      //     const params = {
      //       contId: this.list[0][this.current].contId,
      //       pageNum: this.pageNum,
      //       pageSize: this.pageSize,
      //     };
      //     this.videoList(params);
      //   } else {
      //     this.$uni.showToast('没有网络');
      //     this.loading = 33;
      //   }
      // });
      // uni.getNetworkType({
      //   success: (res) => {
      //     if (res.networkType != 'none') {
      //       console.log();
      //     } else {
      //       this.loading = 3;
      //       this.$uni.showToast('没有网络');
      //     }
      //   },
      // });
      // this.playVideo();
    },
    onLoad(e) {
      // console.log('--onload---transInfor--', JSON.parse(decodeURIComponent(e.videoUrl)));
      if (e.videoUrl) {
        const videoItem = e.videoUrl;
        // videoItem['isStart'] = true;
        // this.categoryName = videoItem['categoryName'];
        // this.logoUrl = videoItem['logoUrl'];
        this.list.push(videoItem);
        // const params = {
        //   contId: videoItem.contId,
        //   pageNum: this.pageNum,
        //   pageSize: this.pageSize,
        // };
        // console.log('===去请求');
        // this.videoList(params);
      }
    },
    // 分享好友
    onShareAppMessage(res) {
      this.handleCloseClick();
      return {
        title: this.list[0][this.current].ttl,
        path: '/pages/find/video-swiper?transInfor=' + encodeURIComponent(JSON.stringify(this.list[0][this.current])),
        imageUrl: 'http://192.168.1.187:10088/static/common/bg-share.png',
        success(res) {
          this.$uni.showToast({
            title: '分享成功',
          });
        },
        fail(res) {
          this.$uni.showToast({
            title: '分享失败',
            icon: 'none',
          });
        },
      };
    },
    // 分享到朋友圈
    onShareTimeline() {
      this.handleCloseClick();
      return {
        title: this.list[0].ttl,
        path: '/pages/find/video-swiper',
        query: 'transInfor=' + encodeURIComponent(JSON.stringify(this.list[0][this.current])),
        imageUrl: 'http://192.168.1.187:10088/static/common/bg-share.png',
        success(res) {
          uni.showToast({
            title: '分享成功',
          });
        },
        fail(res) {
          uni.showToast({
            title: '分享失败',
            icon: 'none',
          });
        },
      };
    },
    methods: {
      // 返回上一页
      handleNavBack() {
        uni.navigateBack();
      },
      collectIcon(status) {
        const icons = {
          1: 'http://192.168.1.187:10088/static/map/icon-map-collected.png',
          0: 'http://192.168.1.187:10088/static/map/mr_sc.png',
        };
        return icons[status];
      },
      retry() {
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType != 'none') {
              console.log();
            } else {
              this.loading = 3;
              this.$uni.showToast('没有网络');
            }
          },
        });
      },
      waiting() {
        console.log('---视频在加载waiting----');
      },
      stop(id) {
        this.playState[id] = false;
      },
      start(id) {
        this.playState[id] = true;
      },
      saveplay(id) {
        const state = this.playState[id];
        if (state) {
          uni.createVideoContext(id, this).pause();
        } else {
          uni.createVideoContext(id, this).play();
        }
      },
      goType(item) {
        uni.redirectTo({
          url: '/pages/find/small-video-class?contId=' + item.contId + '&categoryName=' + this.categoryName + '&logoUrl=' + this.logoUrl,
        });
      },
      playVideo() {
        const _this = this;
        const currentId = 'video' + this.current;
        this.videoContent = uni.createVideoContext(currentId, _this).play();
        const trailer = this.list[0];
        trailer.forEach((item, index) => {
          if (item.mediaUrl != null && item.mediaUrl != '') {
            const temp = 'video' + index;
            if (temp != currentId) {
              uni.createVideoContext(temp, _this).pause();
            }
          }
        });
      },
      // 分享
      share() {
        this.$refs.popup.open();
      },
      // 关闭分享
      handleCloseClick() {
        this.$refs.popup.close();
      },

      // 点击复制链接
      handleCopyClick() {
        // 复制链接 需要h5支持 TODO
        return;
        uni.setClipboardData({
          data: `${ENV.H5}/#/discovery/app-detail/` + this.list[this.shareIndex].contId,
          success: (res) => {
            uni.getClipboardData({
              success: (resp) => {
                this.$refs.popup.close();
                uni.showToast({ title: '已复制到剪贴板' });
              },
            });
          },
        });
      },
      // 收藏
      collect(item, index) {
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        if (item.colFlag === '0') {
          api.saveCollect({
            data: {
              colId: item.contId,
              colType: '5',
            },
            success: (data) => {
              this.list[0][index].colFlag = '1';
              this.$uni.showToast('收藏成功');
            },
          });
        } else {
          api.updateCollect({
            data: {
              requestColSingleDTOList: [
                {
                  delFlag: '1',
                  colId: item.contId,
                },
              ],
            },
            success: (data) => {
              this.list[0][index].colFlag = '0';
              this.$uni.showToast('取消收藏');
            },
          });
        }
      },
      // 视频错误信息回调
      videoErrorCallback(e) {
        console.log('===视频错误信息回调---');
      },
      animationfinish(e) {
        return;
        console.log('===化东--', e);
        this.current = e.detail.current;
        this.playVideo();
        const start = this.list[0][e.detail.current]['isStart'];
        const end = this.list[0][e.detail.current]['isLoad'];
        if (start) {
          uni.navigateBack();
        }
        if (end) {
          const params = {
            contId: this.list[0][e.detail.current].contId,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          };
          this.videoList(params);
        }
      },
      videoList(params) {
        const userInfo = uni.getStorageSync('userInfo') || {};
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType != 'none') {
              console.log();
            } else {
              this.$uni.showToast('没有网络');
            }
          },
        });
        api.getRandomVideo({
          data: {
            userId: userInfo.memberId ? userInfo.memberId : '',
            contId: params.contId,
            pageNum: params.pageNum,
            pageSize: params.pageSize,
          },
          success: (res) => {
            this.loading = 2;
            const list = res.list || [];
            list[list.length - 1]['isLoad'] = true;
            if (list.length > 0) {
              this.$set(this.list, 0, this.list[0].concat(list));
              this.pageNum++;
            }
          },
          fail: (error) => {
            console.log(error);
            this.$uni.showToast('服务器异常,稍后再试');
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .video {
    height: 100vh;
    width: 100vw;
    background: #000000;
  }
  .swiper {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #000000;
    height: 100vh;
    //去除tabbar高度
    // height: calc(100vh - 30rpx);
    .swiper-item {
      width: 100%;
      height: 100%;

      .video {
        width: 100%;
        z-index: 0;
        height: 100vh;
        background: black;
        height: calc(100vh - 50rpx);
      }
    }
  }

  // 头部
  .navigation-bar {
    box-sizing: border-box;
    padding-left: 24rpx;
    width: 100vw;
    height: 100%;
    .back-icon {
      flex-shrink: 0;
      width: 44rpx;
      height: 44rpx;
      margin-right: 20rpx;
      position: relative;
      z-index: 10;
    }
    .icon-desc {
      flex-shrink: 0;
      width: 40rpx;
      height: 42rpx;
      margin-right: 12rpx;
      position: relative;
      z-index: 10;
    }
    .desc {
      color: #666666;
    }
    .navigation-bar__title {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      background-color: #fff;
      top: -40rpx;
      padding-top: 42rpx;
    }
  }
</style>
