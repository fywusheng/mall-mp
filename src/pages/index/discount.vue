<template>
  <!-- 优惠 -->
  <view>
    <!-- 头部导航栏 -->
    <navigation-bar :alpha="0" statusBackGround="#ff5d28" :style="{ height: navHeight + 'px' }">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s">
          <image
            class="image"
            src="http://192.168.1.187:10088/static/home/home-logo.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-40 c-white flex-1">国家老龄服务平台</text>
        </view>
      </view>
    </navigation-bar>
    <view class="content">
      <view class="banner-wrapper" :style="{ 'margin-top': navHeight + 'px' }">
        <!-- banner -->
        <swiper
          class="banner-swiper"
          :indicator-dots="banners.length > 1"
          :autoplay="true"
          :interval="4000"
          :duration="500"
          indicator-active-color="red"
          indicator-color="rgba(0,0,0, .2)"
        >
          <swiper-item class="item" v-for="(item, index) in banners" :key="index">
            <image
              class="image"
              mode="scaleToFill"
              :src="item.bannerUrl"
              @click="handleBannerClick(index)"
              @error="handleBannerLoadFail(index)"
            />
          </swiper-item>
        </swiper>
      </view>
      <!-- 积分兑换 -->
      <view class="benefit ml-32 mr-32 mt-24 mb-48 br-16">
        <view class="benefit-top title-top flex-h flex-c-b" @click="goPath(0)">
          <view class="title-top-left flex-h flex-c-c">
            <view class="title-top-left-text _line">
              <view class="_leftLine"></view>
              积分兑换
            </view>
            <view class="_more">更多</view>
          </view>
          <view></view>
        </view>
        <view class="jf_bg">
          <view class="item">
            <view class="_item" v-for="(v, i) in pointList" :key="i" @click="goPath(0)">
              <image mode="scaleToFill" class="img" :src="v.mainImgUrl" />
              <view class="title">{{ v.name }}</view>
              <view class="btn">积分免费领</view>
              <!-- <view class="_line">
                <view class="_new">￥{{v.presentPrice?v.presentPrice:''}}</view>
                <view class="_old">￥{{v.salePrice?v.salePrice:''}}</view>
              </view>
              <view class="price">积分抵扣￥{{v.creditPoints?v.creditPoints:''}}</view> -->
            </view>
          </view>
        </view>
      </view>
      <!-- 消费养老 -->
      <view class="mili ml-32 mr-32 mt-24 mb-48 br-16" @click="goMili()">
        <view class="benefit-top title-top flex-h flex-c-b">
          <view class="title-top-left flex-h flex-c-c">
            <view class="title-top-left-text _line">
              <view class="_leftLine"></view>
              消费养老
            </view>
            <view class="_more">更多</view>
          </view>
          <view></view>
        </view>
        <view>
          <scroll-view class="mili-product-list" scroll-x="true">
            <view v-for="product in productList" :key="product.id" class="list-item">
              <view class="product">
                <image class="img" :src="product.img" mode="scaleToFill" />
                <view class="label">返养老金¥{{ product.pension_amount }}</view>
                <view class="price">{{ product.price }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 附近优惠 -->
      <view class="nearby-discount ml-32 mr-32 mt-24 mb-24 br-16">
        <view class="benefit-top title-top flex-h flex-c-b">
          <view class="title-top-left flex-h flex-c-c">
            <view class="title-top-left-text _line">
              <view class="_leftLine"></view>
              附近优惠
            </view>
          </view>
        </view>
        <view class="discount-img">
          <image
            src="http://192.168.1.187:10088/static/home/icon_nearby_discount.png"
            mode="scaleToFill"
            @click="handleSuperMarket"
          />
        </view>
      </view>
      <!-- 保险服务-->
      <view class="nearby-discount ml-32 mr-32 mt-24 mb-24 br-16" @click="goBaoXian">
        <view class="benefit-top title-top flex-h flex-c-b">
          <view class="title-top-left flex-h flex-c-c">
            <view class="title-top-left-text _line">
              <view class="_leftLine"></view>
              保险服务
            </view>
            <view class="_more">更多</view>
          </view>
        </view>
        <view class="bao-img">
          <image src="http://192.168.1.187:10088/static/home/bao_xian.png" mode="scaleToFill" />
        </view>
      </view>
      <!-- 为老地图-->
      <view class="nearby-discount ml-32 mr-32 mt-24 mb-24 br-16">
        <view class="benefit-top title-top flex-h flex-c-b">
          <view class="title-top-left flex-h flex-c-c">
            <view class="title-top-left-text _line">
              <view class="_leftLine"></view>
              为老地图
            </view>
          </view>
        </view>
        <view class="map-img" @click="handleMapClick">
          <image src="http://192.168.1.187:10088/static/home/map_old.png" mode="scaleToFill" />
        </view>
      </view>
    </view>
    <!-- 点击优惠买单审核中 -->
    <modal ref="confirmPop" cancelText=" " title=" " confirmText="确定" @confirm="handlConfirmPop">
      <view slot="text">
        <view class="confirm-main" style="height: unset; width: 440rpx">
          <view class="content">未满60周岁，无法使用该功能</view>
        </view>
      </view>
    </modal>
    <real-name-pop ref="realpop" @succFlag="succFlag" />
  </view>
</template>

<script>
import api from '@/apis/index.js'
import NavigationBar from '../../components/common/navigation-bar.vue'
import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue'
import Modal from '@/components/common/modal.vue'

export default {
  components: { NavigationBar, RealNamePop, Modal },
  props: {},
  data() {
    return {
      navHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      banners: [{}],
      // 用户信息
      userInfo: null,
      appStartInfo: null,
      pointList: [],
      productList: []
    }
  },
  computed: {},
  created() {
    this.getBanners()
    this.recommend(11)
    this.handleLogin()
    this.getMiliProductList()
  },
  mounted() {
    // 监听登录回调
    uni.$on('didLogin', this.handleLogin)
    // 监听退出登录回调
    uni.$on('didLogout', this.handleLogout)
  },
  methods: {
    getMiliProductList() {
      api.getMiliProductList({
        data: {},
        success: (data) => {
          this.productList = data
        },
        fail: (error) => {
          this.$uni.showToast(error.message)
          console.log(error)
        }
      })
    },
    goMili() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      const env = 'wechat_miniapp'
      if (!token) {
        const url = `${ENV.MILI_URL}/#/pages/sdk-entry/index?env=${env}&logout=1`
        uni.navigateTo({
          url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
        })
        return
      }
      api.getUserAndAddress({
        data: {},
        success: (data) => {
          const { appid, sign, timestamp } = data
          const token = encodeURIComponent(JSON.parse(data.data).token)
          const url = `${ENV.MILI_URL}/#/pages/encrypted-entry/index?data=${token}&appid=${appid}&timestamp=${timestamp}&sign=${sign}&env=${env}`
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
          })
        },
        fail: (error) => {
          console.log(error)
        }
      })
    },
    goBaoXian() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      uni.navigateTo({
        url: '/pages/life/insurance'
      })
    },
    async recommend(flag) {
      const params = { productType: flag }
      const list = await Axios.post('/product/getProductListByType', params)
      if (list.code == 200) {
        this.pointList = list.data.slice(0, 2) || []
      } else {
        wx.showToast(list.msg)
      }
    },
    handlConfirmPop() {
      this.$refs.confirmPop.close()
    },
    async succFlag(flag) {
      console.log('---实名认证成功后的回调----')
      if (flag == 1) {
        const userinfor = await this.getUserInfo()
        uni.setStorageSync('userInfo', userinfor)
        this.userInfo = userinfor
        this.$refs.realpop.close()
        uni.navigateTo({
          url: `/pages/user-center/real-name-result2?back=${'/pages/index/index'}`
        })
        // if(this.tab_index == null) return
        // uni.navigateTo({
        //     url: `/pages/certificate/electronic-card?index=${this.tab_index}`
        // })
      }
    },
    goPath(flag) {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      const urls = ['/sub-pages/point/index']
      uni.navigateTo({ url: urls[flag] })
    },
    /**
       * 登录回调
       */
    handleLogin() {
      const token = uni.getStorageSync('token')
      if (token) {
        api.getUserInfo({
          data: {
            accessToken: token
          },
          success: (data) => {
            this.userInfo = data
            uni.setStorageSync('userInfo', data)
          },
          fail: () => {
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
          }
        })
      }
    },
    /**
       * 退出登录回调
       */
    handleLogout() {
      this.userInfo = null
    },
    // 点击去优惠买单
    handleSuperMarket() {
      this.handleLogin()
      // 检查用户是否登录
      if (!this.userInfo) {
        // 未登录, 跳转到登录页面
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }

      // 获取系统启动参数
      api.getAppParams({
        data: {
          status: '1'
        },
        success: (data) => {
          // 是否开启实名认证
          this.appStartInfo = data || false
          uni.setStorageSync('app_start_info', data)
          const hasCertificat = this.appStartInfo.realNameAuth
          // 未实名
          if (hasCertificat && this.userInfo.crtfStas === '0') {
            this.$refs.realpop.open()
            return
          }
          // 已实名但小于60周岁
          if (hasCertificat && this.userInfo.age < 60) {
            this.$refs.confirmPop.open()
            return
          }
          //  登陆完直接跳转
          uni.navigateTo({
            url: '/pages/supermarket/index'
          })
        }
      })
    },
    // 点击养老地图
    handleMapClick() {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      uni.navigateTo({
        url: '/pages/map/map'
      })
    },
    getBanners() {
      api.getBanners({
        data: { bannerType: '3', status: '1' },
        success: (data) => {
          this.banners = data
        }
      })
    },
    /**
       * 轮播图加载失败事件
       */
    handleBannerLoadFail(index) {
      // 图片加载失败时显示默认图片
      this.banners[index].bannerUrl =
          'http://192.168.1.187:10088/static/home/banner-home-default.png'
    },
    /**
       * 轮播图 banner 点击事件
       */
    handleBannerClick(index) {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      // TODO 目前以积分为主写死只跳积分
      const item = this.banners[index]
      if (item.jumpUrl) {
        uni.navigateTo({
          url: `/sub-pages/index/item/main?id=${item.jumpUrl}&sceneType=积分兑换`
        })
      }

      // if (item.jumpUrl && item.jumpUrl.indexOf('http') !== -1) {
      //   uni.navigateTo({
      //     url: `/pages/common/webpage?url=${encodeURIComponent(item.jumpUrl)}`
      //   })
      // } else if (item.jumpText) {
      //   uni.navigateTo({
      //     url: `/pages/home/article?text=${item.jumpText}`
      //   })
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  .navigation-bar {
    width: 100%;
    height: 100%;
    background-color: #ff5d28;
    .image {
      @include size(48, 48);
      margin: 0 14rpx 0 30rpx;
    }
  }
  .content {
    padding-bottom: 200rpx;
    .banner-wrapper {
      height: 372rpx;
      width: 100%;
      position: relative;
      margin-top: 82rpx;
      .common-services {
        position: relative;
        height: 240rpx;
        padding-bottom: 22rpx;
        .background-image {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .item {
          z-index: 9;
          &__icon {
            @include square(96);
          }
        }
        .white-box {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 22rpx;
          background-color: #f5f5f5;
          border-radius: 28px 28px 0px 0px;
        }
      }
      .banner-swiper {
        height: 372rpx;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .item {
          height: 372rpx;
          .image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    // 附近优惠
    .nearby-discount {
      margin-bottom: 44rpx;
      .discount-img {
        image {
          width: 686rpx;
          height: 172rpx;
        }
      }
      .map-img {
        image {
          width: 100%;
          height: 242rpx;
        }
      }
      .bao-img {
        image {
          width: 100%;
          height: 300rpx;
        }
      }
    }
    ._leftLine {
      width: 8rpx;
      height: 38rpx;
      background: #ff9500;
      border-radius: 4rpx;
      margin-right: 16rpx;
    }
    ._line {
      display: flex;
      font-size: 40rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 43rpx;
    }
    .benefit-top {
      margin-bottom: 30rpx;
      .title-top-left {
        display: flex;
        width: 100%;
        justify-content: space-between;
        ._more {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    //新个人权益
    .benefit {
      .f-s-32 {
        font-size: 32rpx;
      }
      .m-r-28 {
        margin-right: 28rpx;
      }
      .more {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
      }
      .jf_bg {
        height: 278rpx;
        background-image: url('http://192.168.1.187:10088/static/home/jf_bj.png');
        background-size: contain;
        position: relative;
        background-repeat: no-repeat;
        .item {
          display: flex;
          position: absolute;
          top: 18rpx;
          left: 245rpx;
          text-align: center;
          .img {
            width: 100rpx;
            height: 100rpx;
            margin-top: 18rpx;
          }
          ._line {
            display: flex;
            ._new {
              font-size: 32rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ff5500;
            }
            ._old {
              font-size: 26rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              text-decoration: line-through;
            }
          }
          .price {
            width: 200rpx;
            height: 34rpx;
            border-radius: 4rpx;
            border: 2rpx solid #ff2600;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff2600;
            line-height: 34rpx;
          }
          ._item {
            margin-right: 15rpx;
            background: #ffffff;
            box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(226, 0, 0, 0.5);
            border-radius: 8rpx;
            width: 68%;
            .title {
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              word-wrap: break-word;
              white-space: normal !important;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .btn {
              width: 162rpx;
              height: 42rpx;
              background: linear-gradient(127deg, #fd831e 0%, #ffac28 100%);
              box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(98, 172, 219, 0.18);
              border-radius: 8rpx;
              font-size: 30rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 42rpx;
              margin: 10rpx auto 14rpx auto;
            }
          }
        }
      }
    }
    .mili {
      .mili-product-list {
        white-space: nowrap;
        width: 100%;
        .list-item {
          height: 252rpx;
          width: 192rpx;
          display: inline-block;
          .product {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            .img {
              width: 146rpx;
              height: 146rpx;
            }
            .label {
              width: 178rpx;
              height: 40rpx;
              border-radius: 4rpx;
              border: 2rpx solid #ff2600;
              font-size: 28rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ff2600;
              line-height: 40rpx;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .price {
              height: 44rpx;
              font-size: 32rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 44rpx;
            }
          }
        }
      }
    }
  }
</style>
