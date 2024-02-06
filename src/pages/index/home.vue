<template>
  <view id="home" class="home" :style="{ display: currentIndex === 0 ? 'block' : 'none' }">
    <!-- 头部导航栏 -->
    <navigation-bar :alpha="0">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s">
          <image
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/home-logo.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-40 c-white flex-1">国家老龄服务平台</text>
        </view>
      </view>
    </navigation-bar>

    <!-- 搜索和城市 -->
    <view class="new-header" :style="{ paddingTop: navigationBarHeight + 'px' }">
      <view class="flex-h flex-c-b mr-20 ml-32" style="flex: 1">
        <view class="left-view mr-32 flex-h flex-c-e" @click="handleCityClick">
          <text class="city-name fs-36 c-white">
            {{ city.name || '定位中' }}
          </text>
          <image
            class="city-icon ml-8"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-white.png"
          />
        </view>
        <view class="search-bar flex-h flex-c-b flex-1 p-0-32 bg-white">
          <text class="search-bar__text fs-36 flex-1 c-lightgrey" @click="handleVoiceSearchClick">
            搜索养老服务
          </text>
          <template>
            <view class="search-bar__line" />
            <image
              class="search-bar__voice ml-16"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/icon-home-voice.png"
              @click="handleVoiceSearchClick"
            />
          </template>
        </view>
        <view class="_right">
          <image
            class="search-bar__voice ml-16"
            mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/notice.png"
            @click="handlerClickPop(1)"
          />
          <!-- <image class="search-bar__voice ml-16" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/round_add.png"
            @click="handlerClickPop(2)" /> -->
        </view>
      </view>
    </view>
    <view class="_height" :style="{ paddingTop: navigationBarHeight + 'px' }"></view>

    <view v-if="showPop" class="pop">
      <view class="line" @click="clickItem(item)" v-for="(item, i) in notices" :key="i">
        <image mode="scaleToFill" class="_img" :src="item.icon" />
        <view class="name">{{ item.name }}</view>
      </view>
    </view>
    <!-- 领证扫码 -->
    <view class="banner-wrapper">
      <uni-swiper-dot
        :info="banners"
        :current="currentIn"
        field="content"
        mode="round"
        :dotsStyles="dotsStyles"
      >
        <swiper
          class="banner-swiper"
          :indicator-dots="false"
          :autoplay="true"
          :interval="4000"
          :duration="500"
          @change="hanldeBannerChange"
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
      </uni-swiper-dot>
    </view>
    <view class="center_">
      <image class="fontS" src="https://ggllstatic.hpgjzlinfo.com/static/home/wq_s.png" />
      <!-- 老有所养 -->
      <view class="_margin">
        <view class="sy">
          <!-- <view class="_block">
            <image class="image" @click="goPathWay(0)"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/ylj.png" mode="scaleToFill" />
            <image class="image" src="https://ggllstatic.hpgjzlinfo.com/static/home/bt.png"
              mode="scaleToFill" @click="goOlder" />
          </view> -->
          <!-- 维权服务 -->
          <view class="wq">
            <view class="inline">
              <view class="contain">
                <image
                  class="image"
                  @click="goTab(0)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/pf2.png"
                  mode="scaleToFill"
                />
                <image
                  class="image"
                  @click="goTab(1)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/sf.png"
                  mode="scaleToFill"
                />
                <image
                  class="image"
                  @click="goTab(2)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/wq.png"
                  mode="scaleToFill"
                />
              </view>
              <!-- TODO 后期看接口情况进行兼容处理-->
              <view class="_h">
                <older-persion
                  :type="type"
                  ref="olderPersion"
                  class="swiper"
                  @play="hanldePlay"
                ></older-persion>
              </view>
              <image
                class="zx_image"
                src="https://ggllstatic.hpgjzlinfo.com/static/home/zx.png"
                mode="scaleToFill"
                @click="goConsult"
              />
            </view>
          </view>
          <view class="line_space _H">
            <view class="_leftLine"></view>
            <view class="left_name">老有所养</view>
          </view>
          <!-- 传承服务 -->
          <view class="wq will">
            <view class="inline">
              <view class="left_name">传承服务</view>
              <view class="contain">
                <image
                  class="left_image"
                  @click="goWill(0)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/will-left-1.png"
                  mode="scaleToFill"
                />
                <view class="right-block">
                  <image
                    class="right_image"
                    @click="goWill(1)"
                    src="https://ggllstatic.hpgjzlinfo.com/static/home/will-right-2.png"
                    mode="scaleToFill"
                  />
                  <image
                    class="right_image"
                    @click="goWill(2)"
                    src="https://ggllstatic.hpgjzlinfo.com/static/home/will-right-1.png"
                    mode="scaleToFill"
                  />
                </view>
              </view>
            </view>
          </view>
          <!-- 养老金 -->
          <view class="wq pension">
            <view class="inline">
              <view class="title" @click="goPathWay(0)">
                <view class="left_name">养老金</view>
                <view class="more">更多</view>
              </view>
              <view class="contain">
                <older-persion ref="olderPersion" class="swiper" @play="hanldePlay"></older-persion>
              </view>
            </view>
          </view>
          <!-- 老年补贴 -->
          <view class="wq subsidy">
            <view class="inline">
              <view class="title">
                <view class="left_name">老年补贴</view>
              </view>
              <view class="contain">
                <image
                  class="image"
                  @click="goOlder(0)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/subsidy-1.png"
                  mode="widthFix"
                />
                <image
                  class="image"
                  @click="goOlder(1)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/subsidy-2.png"
                  mode="widthFix"
                />
                <image
                  class="image"
                  @click="goOlder(2)"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/subsidy-3.png"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 老有所医 -->
      <view class="_margin">
        <view class="line_space">
          <view class="_leftLine"></view>
          <view class="left_name">老有所医</view>
        </view>
        <view class="sy">
          <!-- 看病服务 -->
          <view class="wq see-doctor">
            <view class="inline">
              <view class="title" @click="seeDoctor">
                <view class="left_name">看病服务</view>
                <view class="more">更多</view>
              </view>
              <view class="contain" @click="seeDoctorTip">
                <image
                  class="image"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/see-doctor-1.png"
                  mode="scaleToFill"
                />
                <image
                  class="image"
                  src="https://ggllstatic.hpgjzlinfo.com/static/home/see-doctor-2.png"
                  mode="scaleToFill"
                />
              </view>
              <image
                class="bottom-image"
                @click="seeDoctorTip"
                src="https://ggllstatic.hpgjzlinfo.com/static/home/see-doctor-3.png"
                mode="scaleToFill"
              />
            </view>
          </view>
          <!-- 在线中医 -->
          <image
            class="zy_image"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/line_zy.png"
            mode="widthFix"
            @click="goShop(2)"
          />
          <!-- 医保服务 -->
          <view class="wq insurance">
            <view class="inline">
              <view class="title" @click="goPathWay(1)">
                <view class="left_name">医保服务</view>
                <view class="more">更多</view>
              </view>
              <view class="contain">
                <b-case class="b-case" ref="bCase" colName="医保服务" @play="hanldePlay"></b-case>
              </view>
            </view>
          </view>
          <!-- <view class="_block">
            <image class="image" @click="seeDoctor"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/kb.png" mode="scaleToFill" />
            <image class="image" @click="goPathWay(1)"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/yb.png" mode="scaleToFill" />
          </view> -->
          <!-- 智慧中医 -->
          <view class="zh_zy">
            <view class="t">智慧中医</view>
            <view class="center">
              <image
                class="zy_image"
                v-for="(v, i) in zyImages"
                :key="i"
                :src="v.src"
                mode="widthFix"
                @click="onlineSeeDocotor(v.flag)"
              />
            </view>
            <image
              class="widthImg"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/jk_shop.png"
              mode="widthFix"
              @click="goShop(1)"
            />
          </view>
          <image
            class="sw_image"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/wj.png"
            mode="scaleToFill"
            @click="goQuestions"
          />
          <image
            class="sw_image"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/xl.png"
            mode="scaleToFill"
            @click="goOlderTrain"
          />
        </view>
      </view>
      <!-- 老有所为 -->
      <view class="_margin">
        <view class="line_space">
          <view class="_leftLine"></view>
          <view class="left_name">老有所为</view>
        </view>
        <image
          class="zhao_ping"
          src="https://ggllstatic.hpgjzlinfo.com/static/home/zhao_p.png"
          mode="widthFix"
          @click="fingWork"
        />
        <view class="tabs">
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/sx-1.png"
            mode="scaleToFill"
            @click="handleOlder(0)"
          />
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/sx-3.png"
            mode="scaleToFill"
            @click="handleOlder(1)"
          />
          <image
            class="img"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/sx-2.png"
            mode="scaleToFill"
            @click="handleOlder(2)"
          />
        </view>
        <!-- <view class="sy" @click="handleOlder">
          <image class="sw_image" src="https://ggllstatic.hpgjzlinfo.com/static/home/sw.png"
            mode="scaleToFill" />
        </view> -->
      </view>
      <view class="line-gray"></view>
      <video-list></video-list>
      <!-- 老有所乐 -->
      <!-- <view class="_margin">
        <view class="line_space">
          <view class="_leftLine"></view>
          <view class="left_name">老有所乐</view>
        </view>
        <view class="sy">
          <image class="sw_image" src="https://ggllstatic.hpgjzlinfo.com/static/home/sl.png"
            mode="scaleToFill" />
        </view>
      </view> -->
      <view class="into">
        <swiper
          :vertical="true"
          :current="current"
          :disable-touch="true"
          :circular="false"
          @change="changeItem"
        >
          <swiper-item>
            <image
              class="_icon"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/upIcon.png"
            />
            <view>继续上滑进入优惠</view>
          </swiper-item>
          <swiper-item>
            <image
              class="_icon"
              mode="scaleToFill"
              src="https://ggllstatic.hpgjzlinfo.com/static/home/upIcon.png"
            />
            <view>继续上滑进入优惠</view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view
      class="share-page-box"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <wxml-to-canvas class="widget" :width="canvasWidth" :height="canvasHeight"></wxml-to-canvas>
    </view>

    <uni-popup ref="tipPopup" background="none">
      <image
        class="img-bg"
        src="https://ggllstatic.hpgjzlinfo.com/static/life/icon-kanbing.png"
        @click="closeTipPop"
      />
    </uni-popup>

    <!-- 到店提示弹窗 -->
    <uni-popup ref="memberPopup" background="none">
      <view class="pop-content">
        <view class="content">
          <image
            class="get-point-bg"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/member-card.png"
            mode="scaleToFill"
          />
          <view class="card-btn" @click="showMemberCard">查看会员卡</view>
          <!-- <image
            class="card-btn"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/card-button.png"
            mode="scaleToFill"
            @click="showMemberCard"
          /> -->
        </view>

        <image
          class="icon-close"
          @click="memberPopclose"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-close.png"
          mode="scaleToFill"
        />
      </view>
    </uni-popup>

    <!-- 会员卡弹窗 -->
    <uni-popup ref="memberCardPopup" background="none">
      <view class="member-content">
        <view class="content" @click="getPoint">
          <image
            class="get-point-bg"
            src="https://ggllstatic.hpgjzlinfo.com/static/home/member-card-bg.png"
            mode="scaleToFill"
          />
          <view class="info">持卡人：{{ name }} &nbsp; &nbsp;&nbsp;&nbsp;年龄：{{ age }}</view>
          <view class="footer">
            <text class="label">NO.</text>
            <text class="">{{ code }}</text>
          </view>
        </view>

        <image
          class="save-btn"
          @click="extraImage"
          src="https://ggllstatic.hpgjzlinfo.com/static/home/save-btn.png"
          mode="scaleToFill"
        />

        <image
          class="icon-close"
          @click="memberCardPopclose"
          src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-close.png"
          mode="scaleToFill"
        />
        <view class="line"></view>
      </view>
    </uni-popup>

    <service-pop
      ref="popup"
      :modImg="modal.modImg"
      :cancelText="modal.cancelText"
      :confirmText="modal.confirmText"
      @cancel="cancel"
      @confirm="confirm"
      @event="event"
    ></service-pop>

    <scan-or-input-popup ref="cardPopup" :showImg="false" />
    <real-name-pop ref="realpop" @succFlag="succFlag" />
  </view>
</template>

<script>
  import NavigationBar from '../../components/common/navigation-bar.vue';
  import api from '@/apis/index.js';
  import ServicePop from '@/components/common/service-pop.vue';
  import ScanOrInputPopup from '@/components/pop-entry-method/pop-entry-method.vue';
  import BCase from './component/bCase.vue';
  import OlderPersion from './component/older-persion.vue';
  import VideoList from './component/video-list.vue';
  import { desensitizeName, desensitizeInfo } from '@/utils/desensitization.js';
  import RealNamePop from '@/pages/real-name-pop/real-name-pop.vue';
  import { uniSwiperDot } from '@dcloudio/uni-ui';
  const { wxml, style } = require('@/utils/DomData.js');
  export default {
    components: {
      NavigationBar,
      ServicePop,
      ScanOrInputPopup,
      RealNamePop,
      uniSwiperDot,
      BCase,
      OlderPersion,
      VideoList,
    },
    props: {
      currentIndex: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        type: 2, //维权推荐
        zyImages: [
          { src: 'https://ggllstatic.hpgjzlinfo.com/static/home/yangsheng.png', flag: 1 },
          { src: 'https://ggllstatic.hpgjzlinfo.com/static/home/mifang.png', flag: 2 },
          { src: 'https://ggllstatic.hpgjzlinfo.com/static/home/jiankang.png', flag: 3 },
          { src: 'https://ggllstatic.hpgjzlinfo.com/static/home/jieqi.png', flag: 4 },
        ],
        showPop: false,
        notices: [
          {
            type: 1,
            name: '扫一扫',
            icon: 'https://ggllstatic.hpgjzlinfo.com/static/home/sao.png',
          },
          {
            type: 2,
            name: '亮  证',
            icon: 'https://ggllstatic.hpgjzlinfo.com/static/home/liang_zheng.png',
          },
          {
            type: 3,
            name: '亮  码',
            icon: 'https://ggllstatic.hpgjzlinfo.com/static/home/liang_ma.png',
          },
        ],
        showDots: false,
        lifeList: [
          [
            {
              iconName: '',
              iconUrl: '',
              authFlag: 1,
              typeFlag: 3,
            },
          ],
        ],
        // 导航栏高度
        // #ifdef MP-WEIXIN
        navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
        // #endif
        // #ifdef MP-ALIPAY
        navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
        // #endif
        // 城市信息
        city: uni.getStorageSync('city'),
        // 用户信息
        userInfo: {},
        appStartInfo: null,
        // 通知公告列表
        // bulletins: [],
        // 轮播图列表
        banners: [
          { bannerUrl: 'https://ggllstatic.hpgjzlinfo.com/static/home/banner-home-default.png' },
        ],
        // 惠老服务列表
        services: [],
        // 惠老推荐列表
        hotServices: [],
        // 品牌商家列表
        supermarketList: null,
        pageNum: 1,
        needShow: 0,
        loadTxt: '加载中',
        showLoadMore: true,
        // rpx和px的比例
        rate: uni.getSystemInfoSync().windowWidth / 750,
        // 弹框类型
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
          bottom: 30,
          backgroundColor: '#FDFDFD',
          border: 'none',
          selectedBackgroundColor: '#FDFDFD',
          selectedBorder: 'none',
        },
        tab_index: null,
        pointList: [],
        current: 0,
        currentIn: 0,

        // 生成图片
        canvasWidth: 632 / 2, // 默认canvas宽高
        canvasHeight: 345 / 2,
        screenWidth: null, // 设备宽度
        name: '',
        age: '',
        code: '',
        widget: null,
        msg: '加载中，请稍等...', // 提示语
      };
    },
    computed: {
      // 用户信息显示的文字
      text() {
        if (!this.userInfo) {
          // 用户未登录, 显示立即登录
          return '立即登录';
        } else if (this.userInfo.psnName) {
          // 用户已实名, 显示用户姓名
          return desensitizeName(this.userInfo.psnName);
        } else {
          // 用户未实名, 显示用户手机号
          return desensitizeInfo(this.userInfo.tel);
        }
      },
      marginTop() {
        return parseInt(uni.getSystemInfoSync().statusBarHeight + 43 + this.rate * 94);
      },
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('===attached---');
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log('===detached---');
    },
    created() {
      console.log('===created---');
      this.getWarriorsList();
    },
    onShow() {
      console.log('===显示show333---');
    },
    onLoad() {
      console.log('===主组件load---');
    },
    onUnLoad() {
      console.log('===主组件隐藏---');
    },
    mounted() {
      uni.removeStorageSync('current_city');
      // this.requestData()

      // #ifdef MP-ALIPAY
      const navigationBarHeight =
        uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight;
      this.navigationBarHeight = Math.ceil(navigationBarHeight);
      // #endif

      this.getLocation();

      // 若存在 token 缓存, 则请求用户信息
      if (uni.getStorageSync('token')) {
        this.handleLogin();
        this.getHomePop();
      }

      // 监听城市选择回调
      uni.$on('didSelectCity', this.handleSelectCity);

      // 扫一扫
      uni.$on('didScanClick', this.handleScanCodeClick);

      // 监听登录回调
      uni.$on('didLogin', this.handleLogin);
      // 监听退出登录回调
      uni.$on('didLogout', this.handleLogout);

      this.$refs.memberPopup.open();

      setTimeout(() => {
        // #ifdef MP-WEIXIN
        const query = uni.createSelectorQuery().in(this);
        // #endif
        // #ifdef MP-ALIPAY
        const query = uni.createSelectorQuery();
        // #endif

        query
          .select('#home')
          .boundingClientRect((data) => {
            if (!data) return;
            this.$parent.pageHeight = data.height;
          })
          .exec();
      }, 2000);
    },
    destroyed() {
      // 取消监听登录回调
      uni.$off('didLogin');
      // 取消监听退出登录回调
      uni.$off('didLogout');
      this.$refs['olderPersion'].handleClose();
      this.$refs['bCase'].handleClose();
    },
    methods: {
      memberCardPopclose() {
        this.$refs.memberCardPopup.close();
      },
      memberPopclose() {
        this.$refs.memberPopup.close();
      },
      showMemberCard() {
        // 未登录, 跳转到登录页面
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }

        // 未实名
        if (this.userInfo.crtfStas === '0') {
          this.$refs.realpop.open();
          return;
        }

        // 已实名但小于50周岁
        if (this.userInfo.age < 50) {
          this.$uni.showToast('抱歉，您未满50周岁，无法使用会员权益卡');
          return;
        }

        this.memberPopclose();
        setTimeout(() => {
          this.renderImgFile();
        }, 1000);
        this.$refs.memberCardPopup.open();
      },
      // 生成图片并保存
      renderImgFile() {
        this.name = desensitizeName(this.userInfo.psnName);
        this.age = this.userInfo.age;
        this.code = this.userInfo.authCode;

        // 获取设备信息
        wx.getSystemInfo({
          success: (res) => {
            this.screenWidth = res.screenWidth;
            // this.canvasWidth = this.screenWidth * 0.9;
            // this.canvasHeight = this.screenWidth * 1.1;
            console.log('screenWidth', this.screenWidth);

            this.show = true;
            // 数字容器宽度 动态设置
            setTimeout(() => {
              // wx.showLoading({ title: '图片生成中...' });
              this.widget = this.selectComponent('.widget');
              this.renderToCanvas();
            }, 1000);
          },
        });
      },
      // wxml 转 canvas
      renderToCanvas() {
        console.log('this.widget', this.widget);
        const _wxml = wxml(this.name, this.age, this.code);
        const _style = style(this.screenWidth, this.canvasWidth, this.canvasHeight);
        const p1 = this.widget.renderToCanvas({ wxml: _wxml, style: _style });
        p1.then((res) => {
          console.log('图片生成成功');
          wx.hideLoading();
          // this.container = res
        }).catch((err) => {
          console.log('生成失败');
        });
      },
      // 保存到朋友圈
      extraImage() {
        console.log('12312');

        const p2 = this.widget.canvasToTempFilePath();
        let that = this;
        p2.then((result) => {
          let path = result.tempFilePath;
          wx.getSetting({
            success: (res) => {
              // 非初始化且未授权的情况，需要再次弹窗提示授权
              if (
                res.authSetting['scope.writePhotosAlbum'] != undefined &&
                res.authSetting['scope.writePhotosAlbum'] != true
              ) {
                wx.showModal({
                  title: '是否授权相册权限',
                  content: '需要获取相册权限，请确认授权，否则无法使用相关功能',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (dataAu) => {
                          if (dataAu.authSetting['scope.writePhotosAlbum'] == true) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'none',
                              duration: 1000,
                            });
                            that.saveIMg(path);
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'success',
                              duration: 1000,
                            });
                          }
                        },
                      });
                    }
                  },
                });
              } else {
                // 初始化且未授权，系统默认会弹窗提示授权
                // 非初始化且已授权，也会进入这里
                that.saveIMg(path);
              }
            },
          });
        });
      },
      // 保存到相册
      async saveIMg(tempFilePath) {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: async (res) => {
            this.$uni.showToast('图片已保存');
          },

          fail: function (res) {
            wx.showToast({
              title: '您取消了授权',
              icon: 'none',
              duration: 2000,
            });
          },
        });
      },
      fingWork() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({
          url: '/pages/job/jobList',
        });
      },
      onlineSeeDocotor(flag) {
        const token = uni.getStorageSync('token');
        // if (flag == 2 || flag == 3) {
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        // }
        //1中医养生 4 24节气养生  2秘方  3健康评估  5健康商城
        const urls = {
          1: 'https://hzy.ctc-medicine.com/yst_itcm/pArticleList/7?pltCode=64401',
          4: 'https://hzy.ctc-medicine.com/yst_itcm/articleDetail/0?pltCode=64401',
          2: `https://hzy.ctc-medicine.com/yst_itcm/dietIndex?pltCode=64401&pltId=${token}`,
          3: `https://hzy.ctc-medicine.com/yst_itcm/onlineAs?pltCode=64401&pltId=${token}`,
        };
        // const urls = {
        //   1: 'https://test.ctc-medicine.com/yst_itcm/pArticleList/7?pltCode=64401',
        //   4: 'https://test.ctc-medicine.com/yst_itcm/articleDetail/0?pltCode=64401',
        //   2: `https://test.ctc-medicine.com/yst_itcm/dietIndex?pltCode=64401&pltId=${token}`,
        //   3: `https://test.ctc-medicine.com/yst_itcm/onlineAs?pltCode=64401&pltId=${token}`
        // }
        if (urls[flag]) {
          const url = urls[flag];
          uni.navigateTo({ url: `/pages/common/webpage?url=${encodeURIComponent(url)}` });
        }
      },
      goShop(flag) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        //去唤起其余小程序商城
        const appid = { 1: 'wx7566c476e377fc9b', 2: 'wx184f795ce88789f7' };
        uni.navigateToMiniProgram({
          appId: appid[flag],
          path: `pages/index/index?pltCode=64401&pltId=${token}`,
          // envVersion: 'trial',
          success(res) {
            // 打开成功
            console.log('===打开其他小程序==', res);
          },
        });
      },
      seeDoctorTip() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        this.$refs.tipPopup.open();
      },
      closeTipPop() {
        this.$refs.tipPopup.close();
      },
      hanldePlay(name) {
        this.$refs[name].handleClose();
      },
      hanldeBannerChange(e) {
        this.currentIn = e.detail.current;
      },
      handleOlder(index) {
        uni.navigateTo({
          url: '/pages/protect-service/oldAgeWei?index=' + index,
        });
      },
      changeItem(e) {
        this.current = e.detail.current;
        uni.navigateTo({ url: '/pages/index/index?index=1' });
      },
      goPathWay(key) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        const urls = ['/pages/protect-service/oldAge', '/pages/protect-service/medical'];
        uni.navigateTo({ url: urls[key] });
      },
      goWill(index) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({ url: '/pages/services/will?index=' + index });
      },
      goConsult() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({ url: '/pages/services/activist' });
      },
      seeDoctor() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({ url: '/pages/life/seeDoctor' });
      },
      goTab(index) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({ url: '/pages/protect-service/power?index=' + index });
      },
      goOlderTrain() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({
          url: '/pages/rights/older-train',
        });
      },
      goQuestions() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({
          url: '/pages/rights/eva-question',
        });
      },
      goOlder(index) {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        uni.navigateTo({
          url: '/pages/rights/older-allowance?index=' + index,
        });
      },
      clickItem(item) {
        switch (item.type) {
          case 1:
            this.handleScanCodeClick();
            break;
          case 2:
            this.handleCertificateClick();
            break;
          case 3:
            this.handleQRCodeClick();
            break;
          default:
            break;
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

      getWarriorsList() {
        api.selectWarriors({
          data: { cityCodg: '110100' },
          success: (data) => {
            const list = data || [];
            if (list.length > 0) {
              const arrayList = [];
              for (var i = 0, len = data.length; i < len; i += 4) {
                arrayList.push(list.slice(i, i + 4));
              }
              this.lifeList = arrayList;
              if (arrayList.length > 1) {
                this.showDots = true;
              }
            } else {
              this.lifeList = [[]];
            }
            // console.log('====分割数据---', this.lifeList)
          },
          fail: (error) => {
            console.log(error);
          },
        });
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
          // if(this.tab_index == null) return
          // uni.navigateTo({
          //     url: `/pages/certificate/electronic-card?index=${this.tab_index}`
          // })
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
              // mock用户年龄为60
              // data.age = 60
              this.userInfo = data;
              uni.setStorageSync('userInfo', data);
            },
            fail: () => {
              uni.removeStorageSync('token');
              uni.removeStorageSync('userInfo');
            },
          });
        }
      },
      /**
       * 退出登录回调
       */
      handleLogout() {
        this.userInfo = null;
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
          url: '/pages/voice/voice-search',
        });
      },
      /**
       * 电子证点击事件
       */
      handleCertificateClick() {
        // 是否实名认证
        this.tab_index = 0;

        // 未登录, 跳转到登录页面
        if (!this.userInfo) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        uni.navigateTo({ url: '/pages/certificate/electronic-card?index=0' });
        // this.$uni.showToast('功能开通中')
        return false;

        // 未实名
        // if (this.userInfo.crtfStas === '0') {
        //   this.$refs.realpop.open()
        //   return
        // }

        // // 已实名但小于60周岁
        // if (this.userInfo.age < 60) {
        //   this.$uni.showToast('未满60周岁，无法使用该功能')
        //   return
        // }

        // // 已实名且年龄大于60周岁
        // uni.navigateTo({ url: '/pages/certificate/electronic-card?index=0' })
      },
      /**
       * 扫一扫点击事件
       */
      handleScanCodeClick() {
        // 解耦说明：是否登录--扫一扫
        if (!this.userInfo) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        uni.scanCode({
          onlyFromCamera: true,
          scanType: ['qrCode'],
          success: (res) => {
            this.getScanResult(res.result);
          },
        });
        // const handler = () => {
        //   uni.scanCode({
        //     onlyFromCamera: true,
        //     scanType: ['qrCode'],
        //     success: (res) => {
        //       this.getScanResult(res.result)
        //     },
        //   })
        // }
        // this.checkUserState(handler, 1)
      },
      /**
       * 老年码点击事件
       */
      handleQRCodeClick() {
        this.tab_index = 2;

        // 未登录, 跳转到登录页面
        if (!this.userInfo) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        // this.$uni.showToast('功能开通中')
        uni.navigateTo({ url: '/pages/certificate/electronic-card?index=2' });
        return false;
        // 未实名
        // if (this.userInfo.crtfStas === '0') {
        //   this.$refs.realpop.open()
        //   return
        // }
        // // 已实名但小于60周岁
        // if (this.userInfo.age < 60) {
        //   this.$uni.showToast('未满60周岁，无法使用该功能')
        //   return
        // }

        // // 已实名且年龄大于60周岁
        // uni.navigateTo({ url: '/pages/certificate/electronic-card?index=2' })
      },
      /**
       * 轮播图加载失败事件
       */
      handleBannerLoadFail(index) {
        // 图片加载失败时显示默认图片
        this.banners[index].bannerUrl =
          'https://ggllstatic.hpgjzlinfo.com/static/home/banner-home-default.png';
      },
      /**
       * 轮播图 banner 点击事件
       */
      handleBannerClick(index) {
        const item = this.banners[index];
        if (item.jumpUrl && item.jumpUrl.indexOf('http') !== -1) {
          uni.navigateTo({
            url: `/pages/common/webpage?url=${encodeURIComponent(item.jumpUrl)}`,
          });
        } else if (item.jumpText) {
          uni.navigateTo({
            url: `/pages/home/article?text=${item.jumpText}`,
          });
        }
      },

      /**
       * 请求数据
       */
      requestData() {
        // 获取轮播图数据
        api.getBanners({
          data: { bannerType: '0', status: '1' },
          success: (data) => {
            this.banners = data;
          },
        });
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
      /**
       * 检查用户状态
       * type: 0-亮证 1-扫一扫 2-老年码  解耦版本暂时不做处理
       */
      checkUserState(handler, type) {
        // 检查用户是否登录
        if (!this.userInfo) {
          // 未登录, 跳转到登录页面
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }

        // 如果用户未实名
        if (this.userInfo.crtfStas !== '2') {
          if (type === 0) {
            handler();
          } else if (type === 1) {
            this.$refs.cardPopup.open('1');
            // this.$refs.popup.open(2);
          } else if (type === 2) {
            handler();
          }
        } else {
          // 如果用户已实名,获取卡状态
          api.getCertificateState({
            showsLoading: true,
            data: {
              appId: '53928a083adb4a7dad2eecf05564873f',
              idType: '身份证',
              userName: this.userInfo.psnName,
              idNo: this.userInfo.idCard,
            },
            success: (data) => {
              const authState = data.authState;
              // 判断卡状态1：已授权已激活
              if (authState === '1') {
                // 卡状态为 1, 正常跳转
                handler();
              } else if (authState === '2') {
                // 卡状态为 2, 请求获取授权码接口

                api.getAuthorizationCode({
                  showsLoading: true,
                  data: {
                    uactId: this.userInfo.uactId,
                    psnName: this.userInfo.psnName,
                    certNo: this.userInfo.idCard,
                    appId: '53928a083adb4a7dad2eecf05564873f',
                  },
                  success: (data) => {
                    this.userInfo.authCode = data.authCode;
                    uni.setStorageSync('userInfo', this.userInfo);
                    handler();
                  },
                });
              } else if (authState === '3') {
                // 卡状态为 3:未激活 , 跳转到录入信息页面
                if (type === 1) {
                  this.$refs.popup.open(2);
                } else {
                  handler();
                }
              } else if (authState === '4') {
                // 卡状态为 4:正在审核,
                // 解耦版本说明:去掉领证才可以扫一扫 条件； hanxiaoya
                if (type === 1) {
                  this.$uni.showAlert({
                    content: '您尚未领证，无法扫码',
                  });
                } else {
                  handler();
                }
              } else if (authState === '5') {
                // 卡状态为 5:审核失败,审核失败
                if (type === 1) {
                  this.$uni.showAlert({
                    content: '您尚未领证，无法扫码',
                  });
                } else {
                  handler();
                }
              } else if (authState === '6') {
                // 卡状态为 6:其它渠道已经领取，在老龄委使用，需要进行用户授权
                if (type === 1) {
                  this.$uni.showAlert({
                    content: '您尚未领证，无法扫码',
                  });
                } else {
                  // 跳转到用户授权页面
                  uni.navigateTo({
                    url: '/pages/certificate/platform-authorization',
                  });
                }
              }
            },
          });
        }
      },
      getScanResult(result) {
        api.getECToken({
          data: {
            appId: '53928a083adb4a7dad2eecf05564873f',
            orgId: '91350200MA3470MR5D',
            ecQrCode: result,
            authCode: this.userInfo.authCode,
          },
          success: (data) => {
            api.checkECToken({
              data: {
                appId: '53928a083adb4a7dad2eecf05564873f',
                ecQrCode: result,
                authCode: this.userInfo.authCode,
                ecToken: data.ecToken,
              },
              success: (data) => {
                uni.navigateTo({
                  url: `/pages/certificate/scan-result?info=${data}`,
                });
              },
            });
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .content {
      width: 604rpx;
      height: 808rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: red;
      .title {
        font-size: 50rpx;
        font-weight: 500;
        margin-top: 40rpx;
        margin-bottom: 32rpx;
      }
      .cont {
        font-size: 36rpx;
      }
      .get-point-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 604rpx;
        height: 808rpx;
        z-index: -1;
      }
      .card-btn {
        position: absolute;
        left: 72rpx;
        bottom: 42rpx;
        width: 460rpx;
        height: 96rpx;
        z-index: 11;
        background: linear-gradient(117deg, #ff8800 0%, #ff5000 100%);
        border-radius: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
    .icon-close {
      width: 72rpx;
      height: 72rpx;
      margin-top: 36rpx;
    }
  }

  .share-page-box {
    position: absolute;
    top: 0;
    right: 10000px;
    // z-index: 100000;
  }

  .member-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 667rpx;
    position: relative;
    .content {
      width: 632rpx;
      height: 346rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: red;

      .info {
        position: absolute;
        top: 197rpx;
        right: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 24rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #62291b;
        line-height: 33rpx;
        .txt {
          margin-right: 42rpx;
        }
      }
      .footer {
        position: absolute;
        bottom: 23rpx;
        right: 30rpx;
        font-size: 24rpx;
        font-family: DingTalk, DingTalk;
        font-weight: normal;
        color: #a63117;
        line-height: 29rpx;
        .label {
          font-weight: bold;
        }
      }
      .title {
        font-size: 50rpx;
        font-weight: 500;
        margin-top: 40rpx;
        margin-bottom: 32rpx;
      }
      .cont {
        font-size: 36rpx;
      }
      .get-point-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 632rpx;
        height: 346rpx;
        z-index: -1;
      }
      .card-btn {
        position: absolute;
        left: 72rpx;
        bottom: 42rpx;
        width: 460rpx;
        height: 96rpx;
        z-index: -1;
      }
    }

    .icon-close {
      position: absolute;
      bottom: 0;
      right: 0rpx;
      width: 56rpx;
      height: 56rpx;
    }
    .line {
      position: absolute;
      bottom: 56rpx;
      right: 28rpx;
      width: 2rpx;
      height: 271rpx;
      background: #ffffff;
    }
    .save-btn {
      width: 460rpx;
      height: 88rpx;
      margin-top: 57rpx;
    }
  }
  .line_space {
    display: flex;

    ._leftLine {
      width: 8rpx;
      height: 38rpx;
      background: #ff9500;
      border-radius: 4rpx;
      margin-right: 16rpx;
      margin-top: 9rpx;
    }
    .left_name {
      font-size: 40rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
  }
  ._H {
    margin-top: 2rpx;
    margin-bottom: 32rpx;
  }
  .img-bg {
    width: 630rpx;
    height: 790rpx;
  }
  .sy {
    ._block {
      display: flex;
      justify-content: space-between;
      margin-top: 24rpx;
      .image {
        width: 332rpx;
        height: 180rpx;
      }
    }
    .zh_zy {
      background-image: url('https://ggllstatic.hpgjzlinfo.com/static/home/zy_bg.png');
      background-size: 100% 100%;
      padding: 24rpx 20rpx 24rpx 20rpx;
      margin-bottom: 32rpx;
      .t {
        font-size: 40rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #36a388;
      }
      .center {
        margin-top: 16rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        .zy_image {
          width: 48%;
        }
      }
      .widthImg {
        width: 100%;
      }
    }
    .sw_image {
      width: 100%;
      height: 220rpx;
      margin-bottom: 32rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .yz_image {
      width: 100%;
      height: 180rpx;
    }
    .wq {
      width: 100%;
      background: url('https://ggllstatic.hpgjzlinfo.com/static/home/wq_bg.png');
      background-size: 100% 100%;
      border-radius: 32rpx;
      margin-bottom: 32rpx;
      // margin-top: 22rpx;
      &:first-child {
        margin-bottom: 0;
        margin-top: 24rpx;
      }
      .inline {
        padding: 20rpx 20rpx;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .more {
          color: #999999;
        }
        .left_name {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #72472e;
        }
        .contain {
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin-top: 20rpx;
          .b-case {
            width: 100%;
          }
          .image {
            width: 31%;
            height: 268rpx;
            box-shadow: 0px 1px 8px 0px rgba(215, 215, 215, 0.5);
          }
        }
        ._h {
          margin-top: 26rpx;
        }
        .zx_image {
          width: 100%;
          height: 188rpx;
          margin-top: 24rpx;
        }
      }
      &.will {
        background: url('https://ggllstatic.hpgjzlinfo.com/static/home/will-bg.png');
        background-size: 100% 100%;
        .left_name {
          color: #755d40;
        }
        .left_image {
          width: 320rpx;
          height: 340rpx;
        }
        .right-block {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .right_image {
            width: 300rpx;
            height: 160rpx;
          }
        }
      }
      &.pension {
        background: url('https://ggllstatic.hpgjzlinfo.com/static/home/pension-bg.png');
        background-size: 100% 100%;
        .title {
          font-size: 40rpx;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left_name {
            color: #713939;
          }
          .more {
            color: #999999;
            font-size: 32rpx;
            font-weight: normal;
          }
        }
        .contain {
          .swiper {
            // height: 292rpx;
            width: 100%;
          }
        }
      }
      &.subsidy {
        background: url('https://ggllstatic.hpgjzlinfo.com/static/home/subsidy-bg.png');
        background-size: 100% 100%;
        .title {
          .left_name {
            color: #713939;
          }
        }
        .image {
          height: 232rpx;
          width: 200rpx;
        }
      }
      &.see-doctor {
        background: url('https://ggllstatic.hpgjzlinfo.com/static/home/see-doctor-bg.png');
        background-size: 100% 100%;
        margin-bottom: 32rpx;
        .left_name {
          color: #365aa3;
        }
        .inline {
          .contain {
            .image {
              width: 312rpx;
              height: 198rpx;
            }
          }
          .bottom-image {
            width: 646rpx;
            height: 216rpx;
            margin-top: 20rpx;
          }
        }
      }
      &.insurance {
        background: url('https://ggllstatic.hpgjzlinfo.com/static/home/insurance-bg.png');
        background-size: 100% 100%;
        .left_name {
          color: #367fa3;
        }
      }
    }
  }
  .zy_image {
    width: 100%;
    margin-bottom: 26rpx;
  }
  .home ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
  .box-shadow {
    box-shadow: 0px 2px 16px 0px rgba(198, 206, 232, 0.5);
  }
  .home {
    min-height: 100vh;
    background: #ffffff;
    z-index: 1;
    position: relative;
    &.gray {
      & ::v-deep image {
        filter: grayscale(100%);
      }
      .new-header {
        background: linear-gradient(180deg, #737373 0%, #858585 60%, #919191 100%);
      }
      ._leftLine {
        background: #a1a1a1;
      }
      .sy {
        .wq,
        .zh_zy {
          background: url('https://ggllstatic.hpgjzlinfo.com/static/home/icon-gray-bg.png');
          background-repeat: no-repeat;
        }
        .wq {
          .inline {
            .left_name {
              color: #333333;
            }
          }
        }
        .zh_zy {
          .t {
            color: #333333;
          }
        }
      }
    }

    ._height {
      height: 54px;
    }
    .navigation-bar {
      width: 100%;
      height: 100%;
      .image {
        @include size(48, 48);
        margin: 0 14rpx 0 30rpx;
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
      background: linear-gradient(#ff5121, #ff5e28);
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
    .center_ {
      width: 100%;
      height: auto;
      background: #ffffff;
      border-top-left-radius: 36rpx;
      border-top-right-radius: 36rpx;
      position: relative;
      margin-top: -48rpx;
      padding-top: 36rpx;
      // position: absolute;
      // top: 31%;
      //  top: 480rpx;
      padding-bottom: 230rpx;
      .fontS {
        width: 210rpx;
        height: 48rpx;
        padding-left: 33rpx;
      }
      ._margin {
        width: 92%;
        margin: 0 auto;
        margin-bottom: 48rpx;
        // margin-top: 36rpx;
        .tabs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 30rpx 0;
          .img {
            width: 212rpx;
            height: 120rpx;
          }
        }
        .zhao_ping {
          width: 100%;
          margin-top: 32rpx;
        }
      }
      .into {
        height: 150rpx;
        margin-top: 26rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        text-align: center;
        ._icon {
          width: 36rpx;
          height: 36rpx;
        }
      }
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

    .life {
      width: 686rpx;
      height: 247rpx;
      background: #ffffff;
      box-shadow: 0rpx 2rpx 16rpx 0rpx rgba(198, 206, 232, 0.5);
      border-radius: 16rpx;
      padding-top: 13rpx;
      .banner-swiper-life {
        height: 100% !important;
        .item {
          ._top {
            display: flex;
            justify-content: space-evenly;
            .top_item {
              display: flex;
              flex-direction: column;
              align-items: center;
              .icon {
                width: 146rpx;
                height: 146rpx;
              }
              .des {
                font-size: 36rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 50rpx;
              }
            }
          }
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
    .line-gray {
      width: 100%;
      height: 24rpx;
      background: #f2f2f2;
    }
  }
</style>
