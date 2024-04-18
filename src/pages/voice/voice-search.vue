<template>
  <view class="voice-search">
    <template v-if="!content">
      <section-header title="你可以这么问">
        <view class="refresh flex-h flex-c-c" @click="handleRefreshClick">
          <image
            class="refresh__icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/voice/icon-voice-refresh.png"
          />
          <text class="refresh__text fs-40 c-primary ml-8">换一换</text>
        </view>
      </section-header>
      <view class="search-items flex-h flex-wrap">
        <view
          class="item flex-h flex-c-c br-32 mr-20 mb-40"
          v-for="(item, index) in randomExamples"
          :key="index"
          @click="handleExampleItemClick(item)"
        >
          <image
            class="item__icon"
            src="http://192.168.1.187:10088/static/voice/icon-voice-item.png"
            mode="scaleToFill"
          />
          <text class="item__text fs-36 c-primary ml-16">
            {{ item.routSerName }}
          </text>
        </view>
      </view>
      <section-header title="大家都在找"></section-header>
      <view class="search-items flex-h flex-wrap">
        <view
          class="item flex-h flex-c-c br-32 mr-20 mb-40"
          v-for="(item, index) in hotExamples"
          :key="index"
          @click="handleExampleItemClick(item)"
        >
          <image
            class="item__icon"
            src="http://192.168.1.187:10088/static/voice/icon-voice-item.png"
            mode="scaleToFill"
          />
          <text class="item__text fs-36 c-primary ml-16">
            {{ item.routSerName }}
          </text>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="chat-view flex-v p-32">
        <view class="chat-bubble-self flex-h flex-c-e mb-32" v-if="content">
          <text class="chat-bubble-self__text fs-40 c-primary p-0-24">
            {{ content }}
          </text>
        </view>
        <view class="chat-bubble-robot flex-h flex-c-s mb-32" v-if="reply">
          <text class="chat-bubble-robot__text fs-40 c-black p-0-24">
            {{ reply }}
          </text>
        </view>
        <view class="flex-v" v-if="results.length > 0">
          <text
            class="result fs-40 c-primary mt-16"
            v-for="(item, index) in results"
            :key="index"
            @click="handleExampleItemClick(item)"
          >
            {{ item.routSerName }}
          </text>
        </view>
      </view>
    </template>
    <view class="bottom-view flex-v flex-c-c">
      <text class="bottom-view__text fs-40 c-grey">{{ tips }}</text>
      <image
        class="bottom-view__image"
        mode="scaleToFill"
        src="http://192.168.1.187:10088/static/voice/icon-voice-input-button.png"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      />
    </view>
  </view>
</template>

<script>
import SectionHeader from '../../components/common/section-header.vue'
import api from '@/apis/index.js'
export default {
  components: { SectionHeader },
  data() {
    return {
      // 随机示例("你可以这么问"列表)
      randomExamples: [],
      // 热门示例("大家都在找"列表)
      hotExamples: [],
      // 正在说话
      isSpeaking: false,
      // 语音转文字插件实例
      manager: null,
      // 用户输入的内容
      content: '',
      // 回复内容
      reply: '',
      // 搜索结果
      results: []
    }
  },
  computed: {
    tips() {
      return this.isSpeaking ? '松开发送' : '按住说话'
    }
  },
  onLoad() {
    this.requestData()
    // this.content = "证";
    // this.getVoiceSearchResult();
  },
  onReady() {
    // #ifdef MP-ALIPAY
    this.initAlipay()
    // #endif

    // #ifdef MP-WEIXIN
    this.initRecordRecognitionManager()
    // #endif
  },
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/voice/voice-search'
    }
  },
  methods: {
    /**
       * 换一换点击事件
       */
    handleRefreshClick() {
      this.getRandomExamples()
    },
    /**
       * 示例点击事件
       */
    handleExampleItemClick(item) {
      this.reply = ''
      this.results = []
      this.content = item.routSerName

      const userInfo = uni.getStorageSync('userInfo')
      if (item.lginFlag === '1' && !userInfo) {
        // 未登录, 跳转到登录页面
        uni.redirectTo({
          url: '/pages/user-center/login'
        })
        return
      }

      if (item.actnameFlag === '1' && userInfo.crtfStas !== 2) {
        // 未实名, 跳转到实名页面
        uni.redirectTo({
          url: '/pages/user-center/real-name-authentication'
        })
        return
      }

      if (item.acterFlag === '1' && userInfo.crtfStas !== 2) {
        // 未实名, 跳转到实名页面
        uni.redirectTo({
          url: '/pages/user-center/real-name-authentication'
        })
        return
      }

      if (item.regcdFlag === '1' && !userInfo.authCode) {
        // 未领卡, 跳转到领卡页面
        this.$uni.showConfirm({
          content: '您尚未领取老年人证电子证照是否马上领取？',
          confirmText: '马上领取',
          cancelText: '暂不领取',
          confirm: () => {
            uni.redirectTo({
              url: '/pages/certificate/applicant-info'
            })
          }
        })
        return
      }

      if (!item.routPathMP) {
        this.reply = `小程序暂不支持${item.routSerName}，请使用国家老龄服务平台 App 体验更多功能`
      } else if (item.routPathMP === '/scan') {
        uni.navigateBack()
        setTimeout(() => {
          uni.$emit('didScanClick')
        }, 300)
      } else {
        setTimeout(() => {
          this.reply = `正在为您打开${item.routSerName}...`
        }, 300)

        setTimeout(() => {
          uni.redirectTo({
            url: item.routPathMP
          })
        }, 500)
      }
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
       * 请求数据
       */
    requestData() {
      this.getRandomExamples()
      this.getHotExamples()
    },
    /**
       * 获取随机示例列表
       */
    getRandomExamples() {
      api.getRandomExamples({
        showsLoading: false,
        success: (data) => {
          this.randomExamples = data
        }
      })
    },
    /**
       * 获取热门示例列表
       */
    getHotExamples() {
      api.getHotExamples({
        data: {
          pageNum: '1',
          pageSize: '6'
        },
        success: (data) => {
          //  this.hotExamples = data.list;
          // 屏蔽掉养老地图热词
          const list = data.list || []
          if (list.length == 0) return
          this.hotExamples = list.filter((item, index, array) => {
            return item['routSerName'] !== '养老地图'
          })
        }
      })
    },
    /**
       * 语音搜索
       */
    getVoiceSearchResult() {
      if (!this.content) return
      if (this.content.indexOf('。') !== -1) {
        this.content = this.content.replace('。', '')
      }
      api.getVoiceSearchResult({
        data: {
          routSerName: this.content,
          pageNum: 1,
          pageSize: 10
        },
        success: (data) => {
          switch (data.list.length) {
            case 0:
              this.reply = `很抱歉，没有找到${this.content}的相关内容，请重新搜索`
              break
            case 1:
              this.handleExampleItemClick(data.list[0])
              break
            default:
              this.reply = `为您找到以下内容：`
              this.results = data.list
              break
          }
        }
      })
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
      manager.onStop = function (res) {
        console.log('语音输入结束', res)
        self.content = res.result
        self.getVoiceSearchResult()
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
        // 将文件临时路径 tempFilePath 作为音频播放源
        // setTimeout(()=>{
        //   innerAudioContext.src = res['tempFilePath'];
        //   innerAudioContext.play();
        // }, 1000)

        // my.uploadFile({
        //   url: 'https://httpbin.org/post',
        //   fileType: 'image',
        //   fileName: 'file',
        //   filePath: res['tempFilePath'],
        //   success: res => {
        //     my.alert({ title: '上传成功' });
        //   },
        //   fail: function(res) {
        //     my.alert({ title: '上传失败' });
        //   },
        // });

        // return
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

        // my.getFileSystemManager().readFile({
        //    filePath: res['tempFilePath'],
        //    encoding: 'base64',
        //    success: (rs) => {
        //      this.getVoiceContent(rs.data)
        //      // my.alert({ content: 'recorder onStop' + JSON.stringify(rs.data)});
        //    },
        //    fail: (r)=>{
        //      my.alert({ content: 'recorder error' + JSON.stringify(r)});
        //    }
        // })
        // my.alert({ content: 'recorder onStop' + JSON.stringify(res) + "  " + res['tempFilePath'] });
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
          console.log(this.content, '语音识别结果')
          this.getVoiceSearchResult()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .voice-search {
    height: 100vh;
    background-color: #fff;
    .refresh {
      position: absolute;
      right: 32rpx;
      &__icon {
        @include square(32);
      }
    }
    .search-items {
      padding: 32rpx 64rpx 0;
      .item {
        padding: 8rpx 24rpx;
        height: 64rpx;
        line-height: 64rpx;
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
        &__icon {
          @include square(32);
        }
      }
    }
    .chat-view {
      @mixin bubble() {
        max-width: 580rpx;
        min-height: 72rpx;
        line-height: 72rpx;
        border-radius: 16rpx;
        box-sizing: border-box;
      }
      .chat-bubble {
        &-self {
          &__text {
            @include bubble();
            border: 2rpx solid $color-primary;
          }
        }
        &-robot {
          &__text {
            @include bubble();
            border: 2rpx solid $color-lightgrey;
          }
        }
      }
      .result {
        text-decoration: underline;
      }
    }
    .bottom-view {
      position: fixed;
      bottom: 0;
      width: 100vw;
      &__image {
        @include square(204);
        margin: 32rpx 0 64rpx;
      }
    }
  }
</style>
