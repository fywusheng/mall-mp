<template>
  <view class="setting">
    <view>
      <view class="blank"></view>
      <view class="list flex-v">
        <view class="item flex-h flex-c-b" @click="realClick">
          <text class="fs-40 c-black flex-1">实名认证</text>
          <view class="item__text flex-h flex-c-e">
            <text>{{ realName }}</text>
            <!-- <image
              class="item__accessory"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
            /> -->
          </view>
        </view>
        <view class="item flex-h flex-c-b" @click="handleModifyPhoneNumberClick" v-if="userInfo">
          <text class="fs-40 c-black flex-1">更换绑定手机号</text>
          <view class="item__text flex-h flex-c-e">
            <text>{{ userInfo.phone | phoneNumberFilter }}</text>
            <image
              class="item__accessory"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
            />
          </view>
        </view>
        <view
          class="item flex-h flex-c-b"
          @click="handleModifyPasswordClick"
          v-if="userInfo.needFirstSetPwd == '0'"
        >
          <text class="fs-40 c-black flex-1">设置登录密码</text>
          <view class="item__text flex-h flex-c-e">
            <text>{{ userInfo.needFirstSetPwd == '0' ? '已设置' : '未设置' }}</text>
            <image
              class="item__accessory"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
            />
          </view>
        </view>
        <view class="item flex-h flex-c-b" @click="about">
          <text class="fs-40 c-black flex-1">关于应用</text>
          <view class="item__text flex-h flex-c-e">
            <image
              class="item__accessory"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
            />
          </view>
        </view>
      </view>
      <view class="exitButton" @click="exitLoad" v-if="userInfo">退出登录</view>
      <view class="exitButton delUser" @click="delUser" v-if="userInfo">注销账号</view>
    </view>
    <!-- <real-name-pop ref="realpop" :showTop="showTop" @succFlag="succFlag" /> -->
  </view>
</template>

<script>
import { mapState } from 'vuex'
// import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue';
import { desensitizeInfo } from '@/utils/desensitization.js'
import api from '@/apis/index.js'

export default {
  components: {},
  data() {
    return {
      showTop: false
    }
  },
  filters: {
    // 手机号过滤器, 用于手机号脱敏
    phoneNumberFilter(value) {
      return desensitizeInfo(value)
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    realName() {
      if (this.userInfo && this.userInfo.name !== '' && this.userInfo.name !== ' ') {
        return '已实名'
      }
      return '未实名'
    }
  },
  methods: {
    exitLoad() {
      this.$uni.showConfirm({
        content: '是否退出登录',
        confirm: () => {
          api.logout({
            success: () => {
              Store.dispatch('logout')
              setTimeout(() => {
                // uni.reLaunch({
                //   url: '/pages/index/index',
                // });
              }, 2000)
            }
          })
        }
      })
    },
    delUser() {
      // TODO 注销账号
      uni.navigateTo({ url: '/pages/user-center/cancel-user' })
    },
    about() {
      uni.navigateTo({ url: '/pages/user-center/about' })
    },
    /**
       * 获取用户信息
       */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        api.getUserInfo({
          data: {
            accessToken: uni.getStorageSync('token')
          },
          success: (data) => {
            resolve(data)
          },
          fail: (error) => {
            reject(error)
          }
        })
      })
    },
    async succFlag(flag) {
      if (flag == 1) {
        const userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', userinfor)
        this.userInfo = userinfor
        this.$refs.realpop.close()
        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${'/pages/user-center/setting'}`
        })
      }
    },
    realClick() {
      // if (!this.userInfo.tel) {
      //   uni.navigateTo({
      //     url: '/pages/user-center/login',
      //   });
      //   return;
      // }
      // if (this.userInfo.crtfStas != '0') {
      //   return;
      // }
      // this.$refs.realpop.open();
    },
    /**
       * 修改手机号点击事件
       */
    handleModifyPhoneNumberClick() {
      uni.navigateTo({
        url: '/pages/user-center/modify-phone-number'
      })
    },
    /**
       * 修改密码点击事件
       */
    handleModifyPasswordClick() {
      uni.navigateTo({
        url: '/pages/user-center/modify-password'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting {
    height: 100vh;
    background-color: #f5f5f5;

    .blank {
      height: 16rpx;
      width: 100%;
    }
    .list {
      padding: 0 32rpx;
      background-color: #fff;
      overflow: hidden;
      font-size: 40rpx;
      .item {
        height: 120rpx;
        border-bottom: 2rpx solid $color-line;
        &:last-child {
          border-bottom: none;
        }
        &__text {
          color: #999999;
          text {
            line-height: 48rpx;
          }
        }
        &__icon {
          @include square(40);
        }
        &__accessory {
          @include square(48);
        }
      }
    }
    .exitButton {
      width: 686rpx;
      height: 108rpx;
      background: #ffffff;
      border-radius: 54rpx;
      border: 2rpx solid #dcdee0;
      margin: 48rpx 32rpx 32rpx 32rpx;
      text-align: center;
      line-height: 108rpx;
      font-size: 44rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
    }
    .delUser {
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      border: none;
      background: none;
      margin-top: 0rpx;
      line-height: 30rpx;
    }
  }
</style>
