<template>
  <view class="search">
    <view class="_search">
      <view class="search-header _left">
        <img class="icon"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-search.png">
        <input ref="search" :adjust-position="false" confirm-type="search" :focus="true"
          @blur="blurInput" @focus="focusInput" @confirm="searchBykey"
          :placeholder="key || '输入要搜索的职位...'" v-model="key">
        <view class="icon_h" @click="clear">
          <img class="btn-clear" v-if="showIcon"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/clear.png">
        </view>
        <view class="_right" @click="searchBykey">
          搜索
        </view>
      </view>
    </view>
    <view class="recond_search" v-if="searchHistory.length>0">
      <view class="line">
        <view class="l">最近搜索</view>
        <view class="r" @click="clearData">
          <image src="https://ggllstatic.hpgjzlinfo.com/static/home/del.png"></image>
          <view class="qk">清空</view>
        </view>
      </view>
      <view class="history">
        <view class="item" @click="goSearch(v)" v-for="(v,i) in searchHistory" :key="i">{{v}}</view>
      </view>
    </view>
    <list-job v-if="jobList.length>0 || empt == 2" :jobList="jobList"></list-job>
    <view class="bottom">
      <image @touchstart="handleTouchStart" @touchend="handleTouchEnd"
        src="https://ggllstatic.hpgjzlinfo.com/static/home/yuyin.png"></image>
      <text class="infor">{{ tips }}</text>
    </view>
  </view>
</template>
<script>
import api from '@/apis/index.js'
import ListJob from './components/list-job.vue'
export default {
  components: { ListJob },
  data() {
    return {
      city: '',
      jobList: [],
      postName: '',
      workArea: '',
      postType: '',
      pageNum: 1,
      pageSize: 20,
      empt: 1,
      showIcon: false,
      key: '',
      // 正在说话
      isSpeaking: false,
      searchHistory: [],
      manager: null
    }
  },
  computed: {
    tips() {
      return this.isSpeaking ? '松开发送' : '按住说话'
    }
  },
  created() {
    this.searchHistory = uni.getStorageSync('s_history_key')
  },
  mounted() {
    // console.log('==focus--', this.$refs.search)
    // this.$refs.search.focus()
  },
  onReady() {
    // #ifdef MP-ALIPAY
    this.initAlipay()
    // #endif

    // #ifdef MP-WEIXIN
    this.initRecordRecognitionManager()
    // #endif
  },
  // 分享处理
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  onReachBottom() {
    this.getJobList()
  },
  methods: {
    getJobList() {
      api.getJobList({
        data: {
          postName: this.key, // this.postName,
          workArea: '',
          postType: '',
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: (data) => {
          const list = data.list || []
          if (list.length > 0) {
            this.jobList = this.jobList.concat(list)
            this.pageNum++
          }
        }
      })
    },
    goSearch(v) {
      uni.setStorageSync('s_key', v)
      this.key = v
      this.empt = 2
      this.pageNum = 1
      this.jobList = []
      this.getJobList()
    },
    /**
     * 语音输入点击开始回调
     */
    handleTouchStart() {
      uni.showLoading()
      this.isSpeaking = true
      this.manager.start({ format: 'mp3', sampleRate: '16000', encodeBitRate: '96000' })
    },
    /**
     * 语音输入点击结束回调
     */
    handleTouchEnd() {
      uni.hideLoading()
      this.isSpeaking = false
      this.manager.stop()
    },
    /**
     * 初始化微信语音转文字插件
     */
    initRecordRecognitionManager() {
      // eslint-disable-next-line no-undef
      const plugin = requirePlugin('WechatSI')
      const manager = plugin.getRecordRecognitionManager()
      const self = this
      manager.onStart = function (res) {
        console.log('语音输入开始')
        self.reply = ''
      }
      manager.onRecognize = function (res) {
        self.content = res.result
      }
      manager.onStop = (res) => {
        console.log('语音输入结束', res)
        self.content = res.result
        this.key = res.result
      }
      manager.onError = function (res) {
        console.error('语音输入报错: ', res.msg)
      }
      this.manager = manager
    },
    // 初始化支付宝语音
    initAlipay() {
      const recorderManager = my.getRecorderManager()
      const innerAudioContext = my.createInnerAudioContext()
      const fs = my.getFileSystemManager()

      // 监听录音开始事件
      recorderManager.onStart(() => {
        console.log('recorder start')
      })
      // 监听录音暂停事件
      recorderManager.onPause(() => {
        console.log('recorder pause')
      })
      // 监听录音继续事件
      recorderManager.onResume(() => {
        console.log('recorder resume')
      })

      // 监听录音停止事件
      recorderManager.onStop((res) => {
        fs.saveFile({
          tempFilePath: res['tempFilePath'],
          filePath: `${my.env.USER_DATA_PATH}/temb1.mp3`,
          success: (res1) => {
            console.log(res1.savedFilePath)
            // my.alert({ content: res1.savedFilePath })

            fs.readFile({
              filePath: res1.savedFilePath,
              encoding: 'base64',
              success: (rs) => {
                this.getVoiceContent(rs.data)
                //  my.alert({ content: 'recorder onStop' + JSON.stringify(rs.data)});
              },
              fail: (r) => {
                my.alert({ content: 'recorder error' + JSON.stringify(r) })
              }
            })
            setTimeout(() => {
              innerAudioContext.src = res1.savedFilePath
              innerAudioContext.play()
            }, 1000)
          }
        })
      })
      // 监听录音错误事件
      recorderManager.onError((res) => {
        console.log('recorder error', res)
      })
      this.manager = recorderManager
    },
    // 语音识别
    getVoiceContent(base64) {
      api.getVoiceResult({
        data: {
          audioBase64: base64,
          videoType: 'mp3'
        },
        success: (data) => {
          this.content = data.text
          console.log(this.content, '语音识别结果支付宝：')
          this.key = data.text
        }
      })
    },
    focusInput() {
      this.showIcon = true
    },
    blurInput() {
      if (this.key) {
        this.showIcon = true
      } else {
        this.showIcon = false
      }
    },
    clear() {
      this.key = ''
      this.showIcon = false
      this.empt = 1
      this.jobList = []
    },
    searchBykey() {
      if (!this.key) {
        this.$uni.showToast('请输入您要搜索的词')
        return
      }
      uni.setStorageSync('s_key', this.key)
      const storageHistory = uni.getStorageSync('s_history_key')
      if (!storageHistory) {
        uni.setStorageSync('s_history_key', [this.key])
      } else {
        if (!storageHistory.includes(this.key)) {
          storageHistory.push(this.key)
          const rever = storageHistory.reverse()
          const data = rever.splice(0, 20)
          this.searchHistory = data
          uni.setStorageSync('s_history_key', data)
        }
      }
      this.empt = 2
      this.pageNum = 1
      this.jobList = []
      this.getJobList()
    },
    clearData() {
      uni.removeStorageSync('s_history_key')
      this.searchHistory = []
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/base';
.search {
  ._search {
    height: 111rpx;
    .search-header {
      border-radius: 44rpx;
      border: 2rpx solid #ff5500;
      width: 80%;

      ._right {
        position: absolute;
        right: -97rpx;
        font-size: 40rpx;
        ._img {
          width: 40rpx;
          height: 34rpx;
        }
        .pop {
          position: absolute;
          right: 30rpx;
          width: 248rpx;
          height: 292rpx;
          background: #ffffff;
          box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
          border-radius: 16rpx;
          padding: 0rpx 16rpx 0rpx 16rpx;
          .line {
            display: flex;
            justify-content: center;
            height: 92rpx;
            line-height: 92rpx;
            border-bottom: 2rpx solid #eeeeee;
            background-color: #fff;
            ._img {
              width: 48rpx;
              height: 48rpx;
              margin-top: 20rpx;
              margin-right: 24rpx;
            }
            .name {
              font-size: 36rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
      @include middle-center-x(fixed);
      top: 0;
      height: rpx(88);
      padding-left: rpx(32);
      padding-right: rpx(32);
      display: flex;
      align-items: center;
      background-color: #fff;
      z-index: 100;
      left: 45%;
      .icon {
        @include middle-center-y();
        left: rpx(52);
        width: rpx(30);
        height: rpx(30);
        z-index: 100;
      }
      input {
        line-height: 83rpx;
        height: 83rpx;
        background: #ffffff;
        border-radius: 44rpx;
        width: 94%;
        display: block;
        position: relative;
        width: 88%;
        padding-left: rpx(70);
        padding-right: rpx(30);
        font-size: rpx(40);
        color: $black;
      }
      .btn-back {
        @include middle-center-y();
        left: rpx(35);
        font-size: rpx(36);
      }
      .icon_h {
        position: absolute;
        top: 0;
        height: 83rpx;
        right: 23rpx;
        width: 49rpx;
        .btn-clear {
          width: rpx(30);
          height: rpx(30);
          position: absolute;
          top: 33%;
        }
      }
    }
  }
  .recond_search {
    padding: 22rpx 32rpx 32rpx 32rpx;
    background-color: #f5f5f5;
    height: 90vh;
    .line {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 36rpx;
      .l {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .r {
        display: flex;
        height: 42rpx;
        line-height: 42rpx;
        & > image {
          width: 40rpx;
          height: 40rpx;
        }
        .qk {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .history {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      flex-wrap: wrap;
      .item {
        width: fit-content;
        height: 66rpx;
        line-height: 66rpx;
        padding: 0 21rpx;
        background: #ffffff;
        border-radius: 8rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        margin-top: 20rpx;
        margin-right: 24rpx;
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 178rpx;
    background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/voice_bj.png');
    background-size: 100% 100%;
    & > image {
      width: 92rpx;
      height: 92rpx;
      position: absolute;
      left: 331rpx;
      top: 10rpx;
    }
    .infor {
      position: absolute;
      bottom: 24rpx;
      left: 310rpx;
    }
  }
}
</style>
