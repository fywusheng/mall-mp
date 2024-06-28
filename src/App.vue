<script>
  import UUID from 'uuid-js';
  import wx from 'utils/wx';
  import { mapState } from 'vuex';
  export default {
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
    },
    methods: {
      pushData() {
        const city = uni.getStorageSync('city');
        if (!city) return;
        uni.request({
          url: 'http://192.168.1.187:28800/srm/sh/stores/saveRetention',
          data: {
            area: city.name,
            userId: '',
          },
          method: 'POST',
          header: {
            'content-type': 'application/json;charset=utf-8',
            accessToken: uni.getStorageSync('token'),
            channel: uni.getSystemInfoSync().host.env,
          },
          success: (res) => {
            console.log('埋点数据上传成功', res.data);
            uni.setStorageSync('uploadTotal', true);
          },
        });
      },
    },
    async onLaunch() {
      // 将用户授权流量播放音频的操作重置
      uni.setStorageSync('network', false);
      wx.init();
      const deviceInfo = uni.getSystemInfoSync();
      App.systemInfo = deviceInfo;
      const isIphoneX = /iPhone X/i.test(deviceInfo.model);
      // iPhone X or iPhone XS
      const isIphoneXS =
        deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 3 && deviceInfo.screenWidth === 375 && deviceInfo.screenHeight === 812;
      // iPhone XS Max
      const isIphoneXSMAX =
        deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 3 && deviceInfo.screenWidth === 414 && deviceInfo.screenHeight === 896;
      // iPhone XR
      const isIphoneXR =
        deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 2 && deviceInfo.screenWidth === 414 && deviceInfo.screenHeight === 896;
      App.isIphoneHair = isIphoneX || isIphoneXS || isIphoneXSMAX || isIphoneXR;
      if (!uni.getStorageSync('deviceNumber')) {
        uni.setStorageSync('deviceNumber', UUID.create(4).toString());
      }
      // 埋点数据上传
      uni.setStorageSync('uploadTotal', false);
      this.pushData();
    },
    onShow() {
      const updateManager = uni.getUpdateManager();
      if (!updateManager) {
        return;
      }
      // 新版本更新
      if (uni.canIUse('getUpdateManager')) {
        // 判断当前微信版本是否支持版本更新
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            // 请求完新版本信息的回调
            updateManager.onUpdateReady(function () {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                },
              });
            });
            updateManager.onUpdateFailed(function () {
              uni.showModal({
                // 新的版本下载失败
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索(国家老龄服务平台)打开哟~',
              });
            });
          }
        });
      } else {
        uni.showModal({
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          title: '提示',
          content: '当前微信版本过低，部分功能无法使用，请升级到最新微信版本后重试。',
        });
      }

      // 若用户处于【登录状态】，但没有提交【用户信息】，
      // 则用户关闭商城小程序，再次打开商城小程序，自动跳转至【用户信息完善】页面，用户已填信息保留至登录失效
      if (this.userInfo && !this.userInfo.crtfStas) {
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/user-center/applicant-info',
          });
        }, 500);
      }
    },
  };
</script>

<style lang="scss">
  @import '@/styles/index.scss';
</style>
