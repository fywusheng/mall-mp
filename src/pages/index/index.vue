<template>
  <view class="home" id="home">
    <!-- 头部导航栏 -->
    <navigation-bars :alpha="0" :backgroundColor="'linear-gradient(270deg, #FF5121 0%, #FF692D 60%, #FF7936 100%);'">
      <template v-slot:title1>
        <view class="navigation-bar flex-h flex-c-s">
          <image class="image" src="http://192.168.1.187:10088/static/songhui/common/logo.png" mode="scaleToFill" />
          <text class="navigation-bar__title fs-32 c-white flex-1">松辉云康｜国家老龄服务平台</text>
        </view>
      </template>
    </navigation-bars>

    <!-- 搜索和城市 -->
    <view class="new-header" :style="{ top: navigationBarHeight + 'px' }">
      <view class="flex-h flex-c-b mr-20 ml-32" style="flex: 1">
        <view class="left-view mr-32 flex-h flex-c-e" @click="handleCityClick">
          <text class="city-name fs-36 c-white">
            {{ city.name || '定位中' }}
          </text>
          <image class="city-icon ml-8" mode="scaleToFill" src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png" />
        </view>
        <view class="search-bar flex-h flex-c-b flex-1 p-0-32 bg-white">
          <text class="search-bar__text fs-36 flex-1 c-lightgrey" @click="handleVoiceSearchClick">搜索商品</text>
          <!-- <template>
            <view class="search-bar__line" />
            <image
              class="search-bar__voice ml-16"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/home/icon-home-voice.png"
              @click="handleVoiceSearchClick"
            />
          </template> -->
        </view>
        <view class="_right">
          <image
            class="search-bar__voice ml-16"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/home/notice.png"
            @click="handlerClickPop(1)"
          />
        </view>
      </view>
    </view>
    <view class="_height" :style="{ height: navigationBarHeight + 54 + 'px' }"></view>

    <!-- 领证扫码 -->
    <view class="banner-wrapper">
      <swiper
        class="banner-swiper"
        indicator-active-color="#ffffff"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        @change="hanldeBannerChange"
      >
        <swiper-item class="item" v-for="(item, index) in banners" :key="index">
          <image class="image" mode="scaleToFill" :src="item.bannerUrl" @click="handleBannerClick(index)" @error="handleBannerLoadFail(index)" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 商品分类 -->
    <scroll-view :scroll-x="true" enhanced :show-scrollbar="false" v-if="parts.length > 0" class="part-wraper">
      <view class="part" :class="{ 'one-line': parts.length < 8 }">
        <view class="item" v-for="(v, i) in parts" :key="i" @click="typeList(v, i)">
          <image class="img" mode="scaleToFill" :src="v.iconUrl" />
          <view class="name">{{ v.name }}</view>
        </view>
      </view>
    </scroll-view>

    <!-- 积分兑换 -->
    <view class="benefit ml-32 mr-32 mt-24 mb-48 br-16" @click="goPath(0)">
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
          </view>
        </view>
      </view>
    </view>
    <!-- 商品推荐 -->
    <view class="benefit ml-32 mr-32 mt-24 br-16">
      <view class="benefit-top title-top flex-h flex-c-b">
        <view class="title-top-left flex-h flex-c-c">
          <view class="title-top-left-text _line">
            <view class="_leftLine"></view>
            精品推荐
          </view>
        </view>
        <view></view>
      </view>
      <view class="recommed">
        <view class="_block" v-for="(v, i) in prodList" :key="i" @click="goItemClick(v)">
          <image mode="scaleToFill" class="icon" :src="v.mainImgUrl" />
          <view class="icon-block"></view>
          <image class="icon bgempt" v-if="v.soldOut === 0" src="http://192.168.1.187:10088/static/home/empt.png" />
          <view class="name">{{ v.name }}</view>
          <!-- 优惠券 -->
          <view v-if="v.denomination" class="coupon">
            <view class="label">券</view>
            <view class="coupon-price">¥{{ v.denomination }}</view>
          </view>
          <view class="_p">
            <text class="fs-32 label">{{ member ? '会员到手价' : '到手价' }}</text>
            <text>￥{{ member ? v.memberPrice : v.finalPrice }}</text>
          </view>

          <view v-if="v.isCreditPoints == 1" class="jf">积分抵扣￥{{ v.pointDiscountPoint }}</view>
        </view>
      </view>
      <!-- <uni-load-more :status="status" /> -->
      <!-- top -->
      <view class="top-layout">
        <div class="menu" @click="toTop">
          <image class="icon icon-top" src="http://192.168.1.187:10088/static/images/common/top.png" />
        </div>
      </view>
    </view>

    <!-- <service-pop
      ref="popup"
      :modImg="modal.modImg"
      :cancelText="modal.cancelText"
      :confirmText="modal.confirmText"
    />
    <scan-or-input-popup ref="cardPopup" :showImg="false" />
    <real-name-pop ref="realpop" @succFlag="succFlag" /> -->
  </view>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/apis/index.js';
  import NavigationBars from '../../components/common/navigation-bar.vue';
  // import ServicePop from '@/components/common/service-pop.vue';
  // import ScanOrInputPopup from '@/components/pop-entry-method/pop-entry-method.vue';
  // import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue';
  export default {
    components: {
      NavigationBars,
    },
    data() {
      return {
        popUrl: '',
        type: '2', // 维权推荐
        showPop: false,
        showDots: false,
        // 导航栏高度
        // #ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        // #endif
        // #ifdef MP-ALIPAY
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        // #endif
        // 城市信息
        city: uni.getStorageSync('city'),
        // 轮播图列表
        banners: [],
        poptype: '0',
        // 模态框参数
        modal: {
          modImg: '1',
          cancelText: '取消',
          confirmText: '确定',
        },
        dotsStyles: {
          width: 6,
          height: 6,
          // bottom: 30,
          backgroundColor: '#FDFDFD',
          border: 'none',
          selectedBackgroundColor: '#FF5500',
          selectedBorder: 'none',
        },
        current: 0,
        currentIn: 0,
        pointList: [],
        parts: [],
        status: 'more',
        pageNum: 1,
        prodList: [],
      };
    },
    mounted() {
      uni.removeStorageSync('current_city');
      this.getLocation();
      this.getCateGoryList();
      this.recommend1(21);
      // 监听城市选择回调
      uni.$on('didSelectCity', this.handleSelectCity);
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
      // 是否会员
      member() {
        return this.userInfo && this.userInfo.memberStatus === '1';
      },
    },
    onShow() {
      const curPages = getCurrentPages()[0];
      if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
        curPages.getTabBar().setData({
          tabIndex: 1, // 表示当前菜单的索引，该值在不同的页面表示不同
        });
      }
    },
    // onReachBottom() {
    //   console.log("到底了～～～～");
    //   if (this.status === "noMore") return;
    //   this.pageNum++;
    //   this.getProdList();
    // },
    methods: {
      goItemClick(item) {
        const sceneType = item.isCreditPoints === 1 ? '积分兑换' : '商品购买';
        uni.navigateTo({
          url: `/sub-pages/index/item/main?id=${item.id}&sceneType=${sceneType}`,
        });
      },
      toTop() {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 500,
        });
      },
      goPath() {
        console.log(123);
        uni.navigateTo({ url: '/sub-pages/point/index' });
      },
      hanldeBannerChange(e) {
        this.currentIn = e.detail.current;
      },
      typeList(v, index) {
        if (index === 7) {
          uni.switchTab({
            url: '/pages/index/category',
          });
          return;
        }
        uni.navigateTo({
          url: `/sub-pages/index/item-list/main?cateId=${v.id}&level=${v.level}`,
        });
      },
      async getCateGoryList() {
        const { data, code, msg } = await Axios.post('/category/getCategoryList', { type: 2 });
        if (code === '200') {
          if (data.length >= 7) {
            const temp = data.slice(0, 7);
            temp.push({
              name: '全部分类',
              iconUrl: 'http://192.168.1.187:10088/static/home/all.png',
            });
            this.parts = temp;
          } else {
            this.parts = data;
          }
        } else {
          this.$uni.showToast(msg);
        }
      },
      // 精选商品列表
      async recommend1(flag) {
        const params = { productType: flag };
        const list = await Axios.post('/product/getProductListByType', params);
        if (list.code == '200') {
          this.prodList = list.data || [];
        } else {
          this.$uni.showToast(list.msg);
        }
      },
      handlerClickPop(flag) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        if (flag == 1) {
          uni.navigateTo({
            url: '/pages/user-center/message-center',
          });
        } else if (flag == 2) {
          this.showPop = !this.showPop;
        }
      },

      handlConfirmPop() {
        this.$refs.confirmPop.close();
      },
      /**
       * 获取用户信息
       */
      getUserInfo() {
        return new Promise((resolve, reject) => {
          api.getUserInfo({
            data: {
              accessToken: uni.getStorageSync('token'),
            },
            success: (data) => {
              resolve(data);
            },
            fail: (error) => {
              reject(error);
            },
          });
        });
      },

      async succFlag(flag) {
        console.log('---实名认证成功后的回调----');
        if (flag == 1) {
          const userinfor = await this.getUserInfo();
          uni.setStorageSync('userInfo', userinfor);
          this.userInfo = userinfor;
          this.$refs.realpop.close();
          uni.navigateTo({
            url: `/pages/user-center/real-name-result2?back=${'/pages/index/index'}`,
          });
        }
      },

      /**
       * 首页待操作弹窗提示
       */
      getHomePop() {
        api.getHomePop({
          data: {
            userId: uni.getStorageSync('userInfo').uactId,
          },
          success: (res) => {
            // 弹框类型 0-领卡提醒2-亲情绑定提醒 1-赡养抚养提醒
            if (res.popoverType !== undefined) {
              this.$set(this.modal, 'modImg', res.popoverType);
              this.poptype = res.popoverType;
              if (res.popoverType === '0') {
                this.modal.cancelText = '放弃申领';
                this.modal.confirmText = '立刻申领';
                this.$refs.popup.open();
              } else if (res.popoverType === '2') {
                this.modal.cancelText = '放弃添加';
                this.modal.confirmText = '立刻添加';
                this.$refs.popup.open();
              } else if (res.popoverType === '1') {
                this.modal.cancelText = '放弃绑定';
                this.modal.confirmText = '立刻绑定';
                this.$refs.popup.open();
              } else if (res.popoverType === '5') {
                this.$refs.realpop.open();
              }
            }
          },
        });
      },

      /**
       * 城市选择回调
       */
      handleSelectCity(city) {
        this.city = city;
        uni.setStorageSync('city', city);
        this.requestData();
      },
      /**
       * 城市点击事件
       */
      handleCityClick() {
        uni.navigateTo({
          url: '/pages/common/city-picker',
        });
      },
      /**
       * 语音输入点击事件
       */
      handleVoiceSearchClick() {
        uni.navigateTo({
          url: '/sub-pages/index/search/main',
        });
      },
      /**
       * 轮播图加载失败事件
       */
      handleBannerLoadFail(index) {
        // 图片加载失败时显示默认图片
        this.banners[index].bannerUrl = 'http://192.168.1.187:10088/static/home/banner-home-default.png';
      },
      /**
       * 轮播图 banner 点击事件
       */
      handleBannerClick(index) {
        const item = this.banners[index];

        if (item.jumpUrl.startsWith('/')) {
          uni.navigateTo({
            url: item.jumpUrl,
          });
          return;
        }
        if (item.jumpUrl.startsWith('#appid')) {
          const activityUrl = item.jumpUrl.substring(6, item.jumpUrl.length);
          uni.navigateToMiniProgram({
            appId: 'wxfd6d1a32cce64511',
            path: activityUrl,
            extraData: {
              foo: 'bar',
            },
            envVersion: 'develop',
            success(res) {
              // 打开成功
            },
          });
          return;
        }
      },

      /**
       * 请求数据
       */
      requestData() {
        // 获取轮播图数据
        api.getBanners({
          data: { status: '1' },
          success: (data) => {
            this.banners = data;
          },
        });
        this.recommend(11);
      },
      async recommend(flag) {
        const params = { productType: flag };
        const list = await Axios.post('/product/getProductListByType', params);
        if (list.code == 200) {
          this.pointList = list.data.slice(0, 2) || [];
        } else {
          uni.showToast(list.msg);
        }
      },
      /**
       * 获取当前定位
       */
      getLocation() {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            uni.setStorageSync('location', res);
            // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
            api.regeoMap(
              {
                location: res.longitude + ',' + res.latitude,
              },
              {
                success: (res) => {
                  let city = {};
                  // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                  if (res.regeocode.addressComponent.city.length === 0) {
                    city = {
                      code: res.regeocode.addressComponent.adcode.substr(0, 2) + '0100',
                      name: res.regeocode.addressComponent.province,
                      realCode: res.regeocode.addressComponent.adcode.substr(0, 2) + '0000',
                    };
                  } else {
                    city = {
                      code: res.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                      name: res.regeocode.addressComponent.city,
                    };
                  }
                  this.handleSelectCity(city);
                },
              },
            );
          },
          fail: () => {
            // 定位失败默认北京市
            const city = { code: 110100, name: '北京市' };
            this.handleSelectCity(city);
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
  }

  .home {
    min-height: 100vh;
    background: #ffffff;
    z-index: 1;
    padding-bottom: 222rpx;

    ._height {
      background: linear-gradient(270deg, #ff5121 0%, #ff692d 60%, #ff7936 100%);
    }
    .navigation-bar {
      width: 100%;
      height: 100%;
      .image {
        @include size(48, 48);
        margin: 0 14rpx 0 30rpx;
      }
      .navigation-bar__title {
        height: 44rpx;
        font-size: 32rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 44rpx;
      }
    }
    .pop {
      top: 220rpx;
      background-color: #616266;
      position: fixed;
      right: 30rpx;
      width: 232rpx;
      box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
      border-radius: 16rpx;
      padding-top: 20rpx;
      z-index: 100;
      .line {
        display: flex;
        justify-content: center;
        height: 50rpx;
        line-height: 50rpx;
        margin-bottom: 38rpx;
        ._img {
          width: 40rpx;
          height: 40rpx;
          margin-top: 7rpx;
          margin-right: 24rpx;
        }
        .name {
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
          width: 108rpx;
        }
      }
    }
    .new-header {
      // padding-bottom: 14rpx;
      position: fixed;
      display: flex;
      align-items: center;
      width: 100%;
      height: 54px;
      top: 0;
      z-index: 100;

      background: linear-gradient(270deg, #ff5121 0%, #ff692d 60%, #ff7936 100%);
      transform: scale(1);
      .left-view,
      .right-view {
        flex-shrink: 0;
        max-width: 180rpx;
      }
      .city-name {
        @include text-line(1);
      }
      .city-icon {
        @include size(16, 10);
        min-width: 16rpx;
      }
      .search-bar {
        height: 80rpx;
        border-radius: 40rpx;
        box-sizing: border-box;
        &__icon {
          @include square(32);
          border-radius: 16rpx;
        }
        &__line {
          @include size(2, 24);
          background: #c9c9c9;
        }
        &__voice {
          @include square(48);
        }
      }
      ._right {
        line-height: 30rpx;
      }
    }

    .banner-wrapper {
      height: 300rpx;
      width: 100%;
      // position: relative;
      // margin-top: 39rpx;
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
        //height: 424rpx;
        height: 300rpx;
        width: 100%;
        // position: absolute;
        // top: 219rpx;
        // left: 0;
        .item {
          // height: 424rpx;
          height: 300rpx;
          .image {
            width: 100%;
            height: 100%;
          }
        }
      }
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
    .benefit {
      background: #ffffff;
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
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .title {
              width: 200rpx;
              font-size: 32rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap !important;
              margin-top: 10rpx;
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

      .shop-content {
        display: grid;
        grid-template-rows: 156rpx 156rpx;
        grid-template-columns: 332rpx 332rpx;
        grid-gap: 22rpx 24rpx;
        .img-item {
          .image {
            width: 332rpx;
            height: 156rpx;
          }
        }
      }
    }

    .part-wraper {
      width: 100vw;
      padding: 32rpx 46rpx;
      .part {
        overflow: auto;
        width: 658rpx;
        background: #ffffff;
        border-radius: 24rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &.one-line {
          flex-wrap: nowrap;
          .item {
            flex-shrink: 0;
            margin-bottom: 0;
          }
        }
        .item {
          width: 25%;
          text-align: center;
          margin-bottom: 46rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          &:nth-child(8),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
            margin-bottom: 0;
          }
          .img {
            width: 108rpx;
            height: 108rpx;
            margin-bottom: 16rpx;
          }
          .name {
            font-size: 36rpx;
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
        }
      }
    }

    .recommed {
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      // padding: 32rpx;
      box-sizing: border-box;
      min-height: 500rpx;
      ._block {
        background: #ffffff;
        border-radius: 16px;
        width: 332rpx;
        margin-bottom: 25rpx;
        position: relative;
        border: 4rpx solid #e5d6b6;
        overflow: hidden;
        padding-bottom: 24rpx;
        .icon-block {
          width: 326rpx;
          height: 340rpx;
        }
        .icon {
          width: 326rpx;
          height: 340rpx;
          position: absolute;
          top: 0;
          left: 0;
          &.bgempt {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .name {
          // height: 85rpx;
          word-break: break-all;
          font-size: 36rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          margin-top: 18rpx;
          margin-left: 18rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .jf {
          max-width: 270rpx;
          margin-left: 18rpx;
          width: fit-content;
          padding-right: 12rpx;
          height: 48rpx;
          border-radius: 4rpx;
          border: 2rpx solid #ff2600;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff2600;
          margin-top: 12rpx;
          line-height: 48rpx;
          padding-left: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        ._p {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
          margin: 8rpx 0;
          margin-left: 18rpx;
          display: flex;
          height: 50rpx;
          line-height: 50rpx;
          // .label {
          //   // margin-left: 8rpx;
          // }
          .getPrice {
            font-size: 28rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
          }
        }
        .coupon {
          display: flex;
          align-items: center;
          height: 48rpx;
          width: fit-content;
          border-radius: 4rpx;
          border: 2rpx solid #ff2600;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 32rpx;
          margin-left: 18rpx;
          margin-top: 12rpx;
          .label {
            width: 48rpx;
            height: 48rpx;
            line-height: 48rpx;
            text-align: center;
            background: #ff2600;
            border-radius: 4rpx 0rpx 0rpx 4rpx;
            border: 2rpx solid #ff2600;
            color: #ffffff;
          }
          .coupon-price {
            padding: 0 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff2600;
          }
        }
      }
    }
    .top-layout {
      position: fixed;
      right: 30rpx;
      bottom: 250rpx;
      z-index: 1000;
      .menu {
        position: relative;
        width: 75rpx;
        height: 75rpx;
        border-radius: 50%;
        margin-top: 20rpx;
        background-color: rgba(0, 0, 0, 0.3);
        border: none;
        text-align: center;
        line-height: 90rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        &:after {
          border: none;
        }
        // .icon {
        // @include middle-center();
        // }
        .icon-top {
          width: 33rpx;
          height: 41rpx;
        }
        .icon-service {
          width: 49rpx;
          height: 49rpx;
        }
      }
    }

    .d-line {
      width: 100%;
      height: 32rpx;
      background: #f2f2f2;
    }

    //modal弹框
    .confirm-main {
      width: 552rpx;
      margin: 0 auto;
      height: 180rpx;
      text-align: center;
      font-size: 40rpx;
      line-height: 54rpx;
      .wen {
        color: #ff5500;
      }
    }
  }
</style>
