<template>
  <view class="mine">
    <canvas canvas-id="canvas" id="canvas" class="canvas" :width="imgWidth" :height="imgHeight"></canvas>
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view @click="setting" class="iconSet">
      <image class="icon_set" src="http://192.168.1.187:10088/static/life/shezhi.png" />
    </view>
    <view class="user-info flex-h flex-c-s">
      <view class="imgbox" @click="handleChooseImageClick">
        <image class="avatar" mode="scaleToFill" :src="userInfo ? userInfo.iconUrl : header" />
        <image class="photo" src="http://192.168.1.187:10088/static/mine/icon-photo2x.png" mode="scaleToFill" />
      </view>
      <view v-if="!userInfo" @click="login">
        <text class="fs-60 c-black ml-12">请登录</text>
      </view>

      <view v-else class="flex-v ml-12 avatar-r">
        <view class="fs-60 c-black name-wrapper">
          <view class="name">
            {{ userInfo.name !== '' && userInfo.name !== ' ' ? nameFilter(userInfo.name) : userInfo.phone }}
          </view>
          <image
            v-if="userInfo.memberStatus === '1'"
            class="member-icon"
            src="http://192.168.1.187:10088/static/songhui/mine/member-icon.png"
            mode="scaleToFill"
          />
          <!-- <view v-if="userInfo.memberStatus === '0'">开通商城会员 尊享会员权益</view> -->
        </view>
        <view class="fs-30 time-wrapper">
          <!-- <view v-if="userInfo.memberStatus === '0'" @click="goOpenMember">开通商城会员 尊享会员权益</view> -->
          <view v-if="userInfo.memberStatus === '1'" class="end-time">
            {{ expirationTime }}
            会员到期
          </view>
          <view class="r" @click="signClick">
            <image class="sign" src="http://192.168.1.187:10088/static/songhui/mine/sign.png" mode="scaleToFill" />
            <view class="sign-txt">每日签到</view>
          </view>
        </view>
      </view>
      <!-- <view class="flex-v ml-12" v-else-if="userInfo.tel && userInfo.crtfStas === '0'">
        <text class="fs-60 c-black">{{ phoneNumberFilter(userInfo.tel) }}</text>
        <text class="fs-36 no-certi">未实名</text>
      </view>
      <view class="flex-v ml-12" v-else-if="userInfo.tel && userInfo.crtfStas !== '0'">
        <text class="fs-60 c-black">{{ nameFilter(userInfo.psnName) }}</text>
        <text class="fs-32 has-certi">已实名</text>
      </view> -->
    </view>

    <view v-if="userInfo.memberStatus === '1'" class="statistics">
      <view class="row">
        <view class="l" @click="goSaveMoney">
          <text>累计已省(元)</text>
          <image class="icon-right" src="http://192.168.1.187:10088/static/images/checkout/right.png" />
        </view>
        <view class="l" @click="openMemberRecord">
          <text>会员开通记录</text>
          <image class="icon-right" src="http://192.168.1.187:10088/static/images/checkout/right.png" />
        </view>
      </view>
      <view class="row">
        <view class="price">{{ totalMoney }}</view>
        <view class="btn" @click="openMember">立即续费</view>
      </view>
      <view class="benefit">
        <view v-for="item in benefitList" :key="item.name" class="benefit-item">
          <image class="benefit-icon" :src="item.icon" />
          <view class="txt">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <view class="service">
      <view class="area_top">
        <!-- <view class="_item" @click="handleServiceClick(5)">
          <img
            class="img"
            src="http://192.168.1.187:10088/static/mine/huilao.png"
            mode="scaleToFill"
          />
          <text class="text cards">惠老钱包</text>
        </view> -->
        <view class="_item" @click="handleServiceClick(6)">
          <img class="img" src="http://192.168.1.187:10088/static/songhui/mine/card.png" mode="scaleToFill" />
          <text class="text family">我的券包</text>
        </view>
        <view class="_item" @click="handleIntegralClick">
          <img class="img" src="http://192.168.1.187:10088/static/mine/jifeng.png" mode="scaleToFill" />
          <text class="text cards">我的积分</text>
        </view>

        <view class="_item" @click="handleServiceClick(7)">
          <img class="img" src="http://192.168.1.187:10088/static/life/order_icon.png" mode="scaleToFill" />
          <text class="text family">我的订单</text>
        </view>
      </view>
    </view>

    <view class="user flex-h flex-c-s flex-wrap m-0-32">
      <view class="user-item flex-v flex-c-c" @click="handleServiceClick(2)">
        <image class="img" src="http://192.168.1.187:10088/static/songhui/mine/profile.png" mode="scaleToFill" />
        <text>用户资料</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(2)">
        <image class="img" src="http://192.168.1.187:10088/static/mine/icon-invoice2x.png" mode="scaleToFill" />
        <text>我的发票</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(3)">
        <image class="img" src="http://192.168.1.187:10088/static/mine/icon-news2x.png" mode="scaleToFill" />
        <text>消息中心</text>
      </view>
    </view>

    <view class="user flex-h flex-c-s flex-wrap m-0-32">
      <view class="user-item flex-v flex-c-c" @click="handleUserClick(4)">
        <image class="img" src="http://192.168.1.187:10088/static/mine/icon-collection2x.png" mode="scaleToFill" />
        <text>收藏中心</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleServiceClick(1)">
        <image class="img" src="http://192.168.1.187:10088/static/songhui/mine/address.png" mode="scaleToFill" />
        <text>收货地址</text>
      </view>
      <view class="user-item flex-v flex-c-c" @click="handleFeedbackClick()">
        <image class="img" src="http://192.168.1.187:10088/static/mine/icon-tip2x.png" mode="scaleToFill" />
        <text>意见反馈</text>
      </view>
    </view>

    <sign-pop ref="signPop" :signDay="signDay"></sign-pop>
    <pop-entry-method ref="popup" :showImg="showImg" />
    <real-name-pop ref="realpop" @succFlag="succFlag" :headImg="'http://192.168.1.187:10088/static/common/loginAttest.png'"></real-name-pop>
    <!-- 首次登录 -->
    <real-name-pop
      ref="firstLogin"
      @succFlag="loginSuccess"
      :headImg="'http://192.168.1.187:10088/static/common/firstLogin-top-bg.png'"
    ></real-name-pop>
  </view>
</template>

<script>
  import PopEntryMethod from '@/components/pop-entry-method/pop-entry-method.vue';
  import api from '@/apis/index.js';
  import { desensitizeName, desensitizeInfo } from '@/utils/desensitization.js';
  import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue';
  import SignPop from './component/sign.vue';
  import { mapState } from 'vuex';
  import dayjs from 'dayjs';
  export default {
    components: { PopEntryMethod, RealNamePop, SignPop },
    data() {
      return {
        // 导航栏高度
        // #ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        // #endif
        // #ifdef MP-ALIPAY
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        // #endif

        // userInfo: {},
        // 图片地址，控件展示条件
        url: '',
        // 获取默认头像
        header: 'http://192.168.1.187:10088/static/user-center/icon-user-center-default-avatar.png',
        // 积分
        score: '',
        // 录入方式是否有图片
        showImg: false,
        benefitList: [
          {
            icon: 'http://192.168.1.187:10088/static/songhui/mine/benefit-1.png',
            name: '单笔最高千 元购物优惠',
          },
          {
            icon: 'http://192.168.1.187:10088/static/songhui/mine/benefit-2.png',
            name: '有效期内享 无限次包邮',
          },
          {
            icon: 'http://192.168.1.187:10088/static/songhui/mine/benefit-3.png',
            name: '积分兑换 0元拿好物',
          },
          {
            icon: 'http://192.168.1.187:10088/static/songhui/mine/benefit-4.png',
            name: '不定期发放 专属优惠券',
          },
          {
            icon: 'http://192.168.1.187:10088/static/songhui/mine/benefit-5.png',
            name: '1对1专属顾问 为您答疑解惑',
          },
        ],
        totalMoney: 0,
        // canvas的宽高
        imgWidth: '',
        imgHeight: '',
        hasLoading: false,

        signDay: 5,
      };
    },
    async onLoad() {
      // await this.$store.dispatch('getUserInfo');
      // this.getTotalSaveMoney();
    },
    async mounted() {
      // 监听登录回调
      // uni.$on('didLogin', this.handleLogin);
    },
    destroyed() {
      uni.$off('didLogin');
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
      expirationTime() {
        if (this.userInfo) {
          return dayjs(this.userInfo.expirationTime).format('YYYY-MM-DD');
        }
        return '';
      },
    },
    methods: {
      goOpenMember() {
        uni.navigateTo({
          url: '/pages/user-center/activate-member',
        });
      },
      // 用户头像报存
      async saveUserBanner(iconUrl) {
        const params = { ...this.userInfo, iconUrl };

        try {
          const result = await Axios.post('/member/sh/memberInformation/saveMemberInfo', params);
          if (result.code == 200) {
            this.$uni.showToast('修改成功');
            this.$store.dispatch('getUserInfo');
          } else {
            this.$uni.showToast(result.msg || result.data);
          }
        } catch (error) {
          this.$uni.showToast('保存失败');
        }
      },
      // 获取累计省钱详情
      async getTotalSaveMoney() {
        if (!(this.userInfo && this.userInfo.memberStatus === '1')) {
          return;
        }
        const result = await Axios.post('/order/getMemberSaveMoney', {
          memberSaveMoneyFlag: true,
          startTime: this.userInfo.usageTime,
          endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        });
        if (result.code === '200') {
          this.totalMoney = result.data.toFixed(2);
        }
      },
      // 自动签到
      async signClick() {
        // 签到
        await Axios.post('/member/sh/member/signRecords/saveSignRecords', {});
        // 获取签到次数
        const { code, data } = await Axios.post('/member/sh/member/signRecords/getSignRecordsById', {});
        if (code === '200') {
          this.signDay = data.consecutiveSigns > 7 ? 1 : data.consecutiveSigns;
          this.$refs.signPop.open();
        }
      },
      openMember() {
        uni.navigateTo({ url: '/pages/user-center/activate-member' });
      },
      openMemberRecord() {
        uni.navigateTo({ url: '/pages/services/open-record' });
      },
      goSaveMoney() {
        uni.navigateTo({ url: '/pages/services/save-money' });
      },
      // 姓名过滤器, 用于姓名脱敏
      nameFilter(value) {
        return desensitizeName(value);
      },
      // 身份证号过滤器, 用于身份证号脱敏
      idCardNumberFilter(value) {
        return desensitizeInfo(value);
      },
      // 手机号过滤器, 用于手机号脱敏
      phoneNumberFilter(value) {
        return desensitizeInfo(value);
      },
      setting() {
        uni.navigateTo({
          url: `/pages/user-center/setting`,
        });
      },
      imgRead() {
        const url = `${ENV.H5}/#/agreement?type=4`;
        uni.navigateTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`,
        });
      },
      loginSuccess(loginfirst) {
        if (loginfirst == 1) {
          const data = {
            uactId: this.userInfo.memberId,
            pageNum: 1,
            pageSize: 5,
          };
          api.findFamilyMemberList({
            data,
            success: (res) => {
              if (res.list.length > 0) {
                uni.navigateTo({
                  url: `/pages/user-center/real-name-result2?back=${'/pages/family-account/index'}`,
                });
              } else {
                uni.navigateTo({
                  url: `/pages/user-center/real-name-result2?back=${'/pages/family-account/select-type'}`,
                });
              }
            },
            fail: (err) => {
              console.log(err);
            },
          });
        }
      },
      // 实人认证
      succFlag(attest) {
        if (attest == 1) {
          uni.navigateTo({
            url: `/pages/user-center/real-name-result2?back=${'/pages/index/mine'}`,
          });
        }
      },
      /**
       * 检查用户状态
       */
      checkUserState(handler) {
        console.log('handle()');
        // 检查用户是否实名
        if (this.userInfo.crtfStas === '0') {
          // 未实名, 弹窗提示去领取
          this.showImg = true;
          this.$refs.firstLogin.open();
          return;
        } else {
          console.log('handle()');
          handler();
        }
      },
      // 点击设置
      handleSetting() {
        uni.navigateTo({
          url: '/pages/user-center/setting',
        });
      },
      // 点击裁剪确定按钮
      onok(ev) {
        this.path = ev.path;
        this.header = ev.path;
        this.url = '';
      },
      // 点击裁剪取消按钮
      oncancle() {
        // url设置为空，隐藏控件
        this.url = '';
      },

      // 更换头像
      updateUserHeader(url) {
        api.updateUserInfo({
          data: {
            psnId: this.userInfo.psnId,
            uactId: this.userInfo.memberId,
            userIcon: url,
          },
          success: (res) => {
            const userInfo = uni.getStorageSync('userInfo');
            uni.setStorageSync('userInfo', { ...userInfo, userIcon: url });
          },
        });
      },
      /**
       * 获取亲情账号列表
       */
      findFamilyMemberList() {
        return new Promise((resolve, reject) => {
          const data = {
            uactId: this.userInfo.memberId,
            pageNum: 1,
            pageSize: 5,
          };
          uni.showLoading({
            title: '加载中',
          });
          api.findFamilyMemberList({
            data,
            success: (res) => {
              resolve();
              console.log('接口所得res：', res);
              uni.hideLoading();
              if (res.list.length > 0) {
                uni.navigateTo({
                  url: '/pages/family-account/index',
                });
              } else {
                uni.navigateTo({
                  url: '/pages/family-account/select-type',
                });
              }

              //
            },
            fail: (err) => {
              reject();
              console.log('错误err：', err);
              uni.hideLoading();
              uni.showToast(err.message);
            },
          });
        });
      },

      // 登录
      login() {
        uni.navigateTo({
          url: '/pages/user-center/login',
        });
      },

      // 点击积分
      handleIntegralClick() {
        if (!this.userInfo.phone) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        uni.navigateTo({
          url: '/pages/user-center/my-points',
        });
      },

      // 获取用户积分
      handleScoreInfo() {
        api.scoreInfo({
          data: {
            userId: this.userInfo.memberId,
          },
          success: (res) => {
            this.score = res.score;
          },
        });
      },

      /**
       * 点击上传头像
       */
      handleChooseImageClick() {
        if (!this.userInfo) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return false;
        }
        uni.chooseImage({
          sourceType: ['album', 'camera'],
          count: 1,
          success: (res) => {
            // this.url = res.tempFilePaths[0]
            // 图片转base64
            console.log('res:', res);
            // 名称
            const imageName = res.tempFilePaths[0].split('/').pop();
            const arr = imageName.split('.');
            // 后缀
            const imageExt = arr[arr.length - 1];

            // #ifdef MP-WEIXIN

            uni.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0],
              encoding: 'base64',
              success: async (rs) => {
                console.log('rs:', rs);

                // 线上环境
                // uni.request({
                //   url: 'https://api.hpgjzlinfo.com/nepsp-api/cms/iep/web/cms/imgUpload',
                //   data: {
                //     base64String: rs.data,
                //     imageName,
                //     imageExt
                //   },
                //   method: 'POST',
                //   success: (imgres) => {
                //     const fileData = imgres.data.data
                //     this.saveUserBanner(fileData.absoluteUrl)
                //   }
                // })

                api.imgUpload({
                  data: {
                    base64String: rs.data,
                    imageName,
                    imageExt,
                  },
                  showsLoading: true,
                  success: (imgres) => {
                    console.log('图片上传成功res：', imgres);
                    this.saveUserBanner(imgres.absoluteUrl);
                  },
                });
              },
            });

            // #endif

            // #ifdef MP-ALIPAY
            my.getImageInfo({
              src: res.tempFilePaths[0],
              success: (resImg) => {
                console.log('图片数据resImg：', resImg);
                this.imgWidth = resImg.width;
                this.imgHeight = resImg.height;
                const canvas = my.createCanvasContext('canvas');
                canvas.drawImage(res.tempFilePaths[0], 0, 0, this.imgWidth, this.imgHeight);
                // 1. 绘制图片至canvas
                // 绘制完成后执行回调
                canvas.draw(false, () => {
                  console.log('绘制完成后执行回调');
                  canvas
                    .toDataURL({
                      width: this.imgWidth,
                      height: this.imgHeight,
                      quality: 1,
                    })
                    .then(async (baseImg) => {
                      console.log('图片baseImg：', baseImg);
                      // let base64 = baseImg.replace("data:image/png;base64,", "");
                      const base64 = baseImg.split(',')[1];
                      console.log('图片base64：', base64);
                      // const par = {
                      //   base64String: base64,
                      //   imageName,
                      //   imageExt,
                      // }
                      // const res = await Axios.post('https://api.hpgjzlinfo.com/nepsp-api/cms/iep/web/cms/imgUpload', par)
                      // console.log("===结果---", res)

                      api.imgUpload({
                        data: {
                          base64String: base64,
                          imageName,
                          imageExt,
                        },
                        showsLoading: true,
                        success: (imgres) => {
                          console.log('图片上传成功res：', imgres);
                          this.header = imgres.absoluteUrl;
                          this.updateUserHeader(imgres.absoluteUrl);
                        },
                      });
                    });
                  //  console.log("图片base64：",base64)
                  // base64 = base64.replace("data:image/png;base64,", "");
                  // 身份证识别
                });
              },
            });
            // #endif
          },
        });
      },

      /**
       * 登录回调
       */
      handleLogin(userInfo) {
        if (userInfo) {
          this.userInfo = userInfo;
          uni.setStorageSync('userInfo', userInfo);
        } else {
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync('token'),
            },
            success: (data) => {
              this.userInfo = data;
              uni.setStorageSync('userInfo', data);
              // this.userInfo = uni.getStorageSync('userInfo')
              if (this.userInfo.tel) {
                this.handleScoreInfo();
              }
              this.header = this.userInfo.userIcon || 'http://192.168.1.187:10088/static/user-center/icon-user-center-default-avatar.png';
              // 没有实名
              // if (this.userInfo.crtfStas !== '2') {
              //   this.$refs.firstLogin.open()
              //   return
              // }
            },
            fail: () => {
              uni.removeStorageSync('token');
              uni.removeStorageSync('userInfo');
            },
          });
        }
      },
      // 点击赡养扶养,亲情账号，我的券包，我的订单7
      handleServiceClick(type) {
        // 检查用户是否登录
        if ([1, 2, 4, 5, 6, 7].includes(type) && !uni.getStorageSync('token')) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        switch (type) {
          case 1:
            // this.checkUserState(() => {
            //   uni.navigateTo({
            //     url: '/pages/support/index',
            //     error: function (res) {
            //       console.log('console13', res);
            //     },
            //   });
            // });
            uni.navigateTo({
              url: '/sub-pages/me/address-list/main',
            });
            break;
          case 2:
            uni.navigateTo({
              url: '/pages/user-center/applicant-info?soure=mine',
            });
            break;
          case 3:
            // 消息中心
            this.$uni.showToast('功能尚未开放，敬请期待');
            break;
          case 4:
            uni.navigateTo({
              url: '/pages/supermarket/myOrder',
            });
            break;
          case 5:
            uni.navigateTo({
              url: '/pages/pay/my-bank-card',
            });
            break;
          case 6:
            uni.navigateTo({
              url: '/sub-pages/me/my-coupon/main',
            });
            break;

          case 7:
            uni.navigateTo({
              url: '/pages/order/orderList',
            });
            break;
          default:
            break;
        }
      },
      // 点击实名认证,积分兑换,消息中心，收藏中心
      handleUserClick(type) {
        // 检查用户是否登录
        if (!this.userInfo) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        switch (type) {
          case 1:
            if (this.userInfo.crtfStas !== '0') {
              this.$uni.showToast('您已完成实名认证，无需重复认证');
              return;
            }
            this.showImg = false;
            this.$refs.realpop.open();
            break;
          case 2:
            uni.navigateTo({
              url: '/pages/supermarket/myInvoice',
            });
            break;
          case 3:
            uni.navigateTo({
              url: '/pages/user-center/message-center',
            });
            break;
          case 4:
            // 收藏中心
            uni.navigateTo({
              url: '/pages/user-center/collect-center',
            });
            break;
          default:
            break;
        }
      },
      /**
       * 意见反馈点击事件
       */
      handleFeedbackClick() {
        // 备注：目前只有登录后才可以进行问题填报
        if (!this.userInfo.phone) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        uni.navigateTo({
          url: '/pages/user-center/feedback',
        });
      },
    },
    async onShow() {
      const curPages = getCurrentPages()[0];
      if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
        curPages.getTabBar().setData({
          tabIndex: 5, // 表示当前菜单的索引，该值在不同的页面表示不同
        });
      }
      await this.$store.dispatch('getUserInfo');
      this.getTotalSaveMoney();
    },
  };
</script>

<style lang="scss" scoped>
  .mine {
    min-height: 100vh;
    padding-bottom: 150rpx;
    background: #f2f2f2;
    background-image: url('http://192.168.1.187:10088/static/mine/icon-mine-bg.png');
    .iconSet {
      padding: 10rpx 30rpx 36rpx;
      display: flex;
      flex-direction: row-reverse;
      .icon_set {
        width: 48rpx;
        height: 48rpx;
      }
    }
    .illustration {
      @include size(680, 260);
      margin-bottom: 160rpx;
    }
    .has-certi {
      width: 112rpx;
      height: 48rpx;
      line-height: 48rpx;
      background: #6ac54d;
      border-radius: 8rpx;
      color: #ffffff;
      text-align: center;
    }
    .no-certi {
      width: 112rpx;
      height: 48rpx;
      line-height: 48rpx;
      background: #666666;
      border-radius: 8rpx;
      color: #ffffff;
      text-align: center;
    }
    & ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
      display: none;
    }
    position: relative;
    .canvas {
      position: absolute;
      z-index: -1000;
      // top: 500px;
      opacity: 0;
    }
    .setting {
      height: 100%;
      padding-left: 32rpx;
      .img {
        width: 48rpx;
        height: 46rpx;
      }
    }
    .c-grey {
      color: #999;
    }
    .mine-bg {
      position: fixed;
      top: 0;
      left: 0;
      height: 712rpx;
      width: 100vw;
      z-index: 0;
    }
    .user-info {
      margin: 0 30rpx 58rpx;
      margin-bottom: 58rpx;
      position: relative;
      flex: 1;
      .integral {
        position: absolute;
        top: 22rpx;
        right: 0;
        height: 68rpx;
        background: linear-gradient(180deg, #5f4705 0%, #403001 100%);
        border-radius: 34rpx 0 0 34rpx;
        padding-left: 26rpx;
        color: #fdeedb;
        line-height: 68rpx;
      }
      .imgbox {
        flex-shrink: 0;
        position: relative;
        border: 6rpx solid #fff;
        @include square(148);
        box-sizing: border-box;
        border-radius: 50%;
        .avatar {
          @include square(136, 68);
        }
        .photo {
          position: absolute;
          bottom: -4rpx;
          right: 0rpx;
          @include square(48);
        }
      }
      .avatar-r {
        flex: 1;
        .name-wrapper {
          display: flex;
          align-items: center;
          .member-icon {
            width: 210rpx;
            height: 50rpx;
            margin-left: 10rpx;
          }
        }
        .time-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .end-time {
            color: #999999;
          }
          .r {
            display: flex;
            align-items: center;
            .sign {
              width: 36rpx;
              height: 36rpx;
              margin-right: 12rpx;
            }
            .sign-txt {
              color: #ff5500;
            }
          }
        }
      }
    }
    .statistics {
      width: 688rpx;
      height: 420rpx;
      background-image: url('http://192.168.1.187:10088/static/songhui/mine/member-bg.png');
      background-size: 100% 100%;
      margin: 0 auto;
      padding: 24rpx 20rpx;
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .l {
          display: flex;
          align-items: center;
          height: 44rpx;
          font-size: 32rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 44rpx;
          .icon-right {
            width: 36rpx;
            height: 36rpx;
            margin-left: 10rpx;
          }
        }
        .price {
          height: 90rpx;
          font-size: 64rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 90rpx;
        }
        .btn {
          width: 186rpx;
          height: 72rpx;
          background: linear-gradient(90deg, #af763a 0%, #71471c 100%);
          border-radius: 40rpx;
          font-size: 36rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 72rpx;
          text-align: center;
        }
      }
      .benefit {
        width: 646rpx;
        height: 218rpx;
        background: #f5c998;
        border-radius: 16rpx;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        overflow: auto;
        padding: 0 20rpx;
        margin-top: 8rpx;
        .benefit-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 193rpx;
          height: 170rpx;

          font-size: 32rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-right: 40rpx;
          &:last-child {
            margin-right: 0;
          }
          .benefit-icon {
            width: 72rpx;
            height: 72rpx;
            margin-bottom: 10rpx;
          }
          .txt {
            // text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }
      }
    }
    .service {
      margin-bottom: 20rpx;
      margin-left: 15rpx;
      margin-right: 15rpx;
      .area_top {
        background-image: url('http://192.168.1.187:10088/static/mine/minebg.png');
        display: flex;
        justify-content: space-around;
        padding-top: 56rpx;
        padding-bottom: 60rpx;
        border-radius: 20rpx;
        background-size: 100% 100%;
        padding-left: 40rpx;
        padding-right: 40rpx;
        ._item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .img {
            width: 122rpx;
            height: 122rpx;
          }
          .text {
            font-size: 36rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 56rpx;
            margin-top: 16rpx;
          }
        }
      }
      &-item {
        @include size(330, 160);
        position: relative;
        padding: 24rpx 20rpx;
        box-sizing: border-box;
        .img {
          position: absolute;
          @include size(330, 160);
          top: 0;
          left: 0;
        }
        .text {
          font-size: 40rpx;
          font-weight: 500;
          line-height: 56rpx;
          position: relative;
          z-index: 1;
          &.support {
            color: #ffffff;
          }
          &.family {
            // color: #752f31;
            color: #ffffff;
          }
          &.cards {
            color: #ffffff;
          }
          &.orders {
            color: #ffffff;
          }
        }
      }
    }
    .user {
      // height: 480rpx;
      box-sizing: border-box;
      // padding-top: 16rpx;
      // box-shadow: 0px 4rpx 14rpx 0px rgba(0, 0, 0, 0.08);
      // border-radius: 16rpx;
      // margin-bottom: 40rpx;
      display: flex;
      // justify-content: space-between;
      &-item {
        width: 214rpx;
        height: 208rpx;
        // padding-top: 14rpx;
        margin-bottom: 24rpx;
        box-sizing: border-box;
        background: #ffffff;
        border-radius: 16px;
        margin-right: 20rpx;
        font-size: 38rpx;
        color: #333333;
        font-weight: 500;
        &:last-child {
          margin-right: 0;
        }
        .img {
          @include size(92, 92);
          margin-bottom: 2rpx;
        }
        .text {
          height: 56rpx;
          font-size: 40rpx;
          font-weight: 500;
          color: #333333;
          line-height: 56rpx;
          text-align: center;
        }
      }
    }
    .cropper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 100;
    }
  }
</style>
