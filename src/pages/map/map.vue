<template>
  <view class="map">
    <map
      ref="map"
      id="map"
      :show-scale="true"
      class="map-view"
      :latitude="centerLocation.latitude"
      :longitude="centerLocation.longitude"
      :show-location="true"
      :include-points="list"
      :markers="markers"
      :max-scale="maxScale"
      :enable-3D="false"
      @regionchange="handleMapRegionChange"
      @tap="handleMapClick"
      @markertap="handleMarkerClick"
    />
    <view class="search-view flex-h flex-c-b bg-white p-0-32">
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <text
          class="search-bar__text fs-36 flex-1"
          :class="keyword ? 'c-black' : 'c-lightgrey'"
          @click="handleSearchBarClick"
        >
          {{ keyword || '搜索地点、美食、景点、医院等' }}
        </text>
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon"
          src="http://192.168.1.187:10088/static/common/icon-common-input-clear.png"
          @click="handleCancelClick"
        />
        <template v-else>
          <view class="search-bar__line" />
          <image
            mode="scaleToFill"
            class="search-bar__voice ml-16"
            src="http://192.168.1.187:10088/static/common/icon-common-voice-grey.png"
            @click="handleVoiceInputClick"
          />
        </template>
      </view>
      <button
        v-if="keyword"
        class="cancel-button fs-36 c-black ml-24"
        hover-class="none"
        @click="handleCancelClick"
      >
        取消
      </button>
    </view>
    <button
      v-if="showsSearchInCurrentArea && keyword && (!off || !showsInfoCard)"
      class="search-button fs-36 c-black bg-white"
      @click="handleQuery"
    >
      在此区域搜索
    </button>
    <image
      class="welfare"
      src="http://192.168.1.187:10088/static/map/icon-map-welfare.png"
      @click="handleWelfareClick"
      mode="scaleToFill"
    />
    <view v-if="!showsInfoCard" class="actions flex-v">
      <view class="item flex-h flex-c-c bg-white br-16" @click="handleLocateClick">
        <image
          class="item__icon"
          src="http://192.168.1.187:10088/static/home/icon-home-locate.png"
          mode="scaleToFill"
        />
        <text class="fs-36 c-lightgrey ml-12">定位</text>
      </view>
      <view class="item flex-h flex-c-c bg-white br-16 mt-16" @click="handleRoadClick">
        <image
          class="icon-road"
          src="http://192.168.1.187:10088/static/map/road.png"
          mode="scaleToFill"
        />
        <text class="fs-36 c-lightgrey ml-12">路线</text>
      </view>
    </view>
    <scroll-view
      scroll-x="true"
      :enable-flex="true"
      :scroll-left="scrollToLeft"
      scroll-with-animation
      class="categories flex-h bg-white"
    >
      <view
        class="item menu-item flex-v flex-c-c mb-4"
        v-for="(item, index) in categories"
        :key="index"
        @click="(selectedIndex = index), handleCategoryClick(item.serviceOrder)"
      >
        <image
          class="item__icon"
          mode="scaleToFill"
          :src="
            item.serviceOrder == serviceIndex
              ? 'http://192.168.1.187:10088/static/map/menu-icon-selected' +
                item.serviceOrder +
                '.png'
              : 'http://192.168.1.187:10088/static/map/menu-icon' + item.serviceOrder + '.png'
          "
        />
        <text
          class="item__text fs-40 mt-24 animated"
          :class="item.serviceOrder == serviceIndex ? 'c-bold' : 'c-lightgrey'"
        >
          {{ item.serviceName }}
        </text>
      </view>
    </scroll-view>
    <view class="swiper-box" :animation="animationData" v-if="showsInfoCard">
      <uni-swiper-dot :info="markers" field="content" :mode="mode">
        <swiper
          class="height-500"
          @change="change"
          @animationfinish="animationfinish"
          :current="current"
          :duration="duration"
        >
          <swiper-item
            v-for="(item, index) in markers"
            :key="index"
            :item-id="index"
            @touchstart="handleTouchstart"
            @touchend="handleTouchend"
          >
            <view class="swiper-item">
              <view class="map-icon" @click="handleAnimation">
                <image
                  mode="scaleToFill"
                  src="http://192.168.1.187:10088/static/map/icon-map-arrow-upward.png"
                  :class="roateImage"
                ></image>
              </view>
              <view
                class="info-card flex-v m-0-32 bg-white br-24"
                @click="handleInfoCardClick(item)"
              >
                <view class="info flex-h">
                  <view class="photo-view flex-v flex-c-s">
                    <image
                      class="photo"
                      mode="scaleToFill"
                      :src="item.scenic_area_photos"
                      v-if="item.scenic_area_photos"
                    />
                    <image
                      class="photo"
                      mode="scaleToFill"
                      src="http://192.168.1.187:10088/static/home/image-home-article-default.png"
                      v-if="!item.scenic_area_photos"
                    />
                    <!-- 展示景点A级 -->
                    <view class="photo-rank" v-if="item.scenic_area_rank">
                      <text>{{ item.scenic_area_rank }}</text>
                    </view>
                    <!-- 展示医院级别 -->
                    <view class="photo-rank" v-if="item.hospital_level">
                      <text>{{ item.hospital_level }}</text>
                    </view>
                  </view>
                  <view class="text-view flex-v flex-1 ml-16">
                    <text class="text fs-44 c-black">{{ item.name }}</text>
                    <text class="text fs-36 c-grey mt-8">
                      {{ item.type }} | {{ item.my_distance }}
                    </text>
                    <text class="text fs-36 c-grey mt-8" v-if="item.address">
                      {{ item.address }}
                    </text>
                    <text class="text fs-36 c-grey mt-8" v-if="item.hospital_clinic">
                      特色科室：{{ item.hospital_clinic }}
                    </text>
                    <text
                      class="text fs-36 c-grey mt-8"
                      v-if="!item.address && item.scenic_area_opentime"
                    >
                      开放时间：{{ item.scenic_area_opentime }}
                    </text>
                    <text class="text fs-36 c-grey mt-8" v-if="!item.address">
                      特色介绍：{{ item.scenic_area_intro }}
                    </text>
                  </view>
                </view>
                <view class="functions flex-h flex-c-b">
                  <view class="flex-1 flex-h">
                    <view
                      class="item"
                      @click.stop="handleCollected(item)"
                      v-if="item.isCollected == 0 || item.isCollected == 1"
                    >
                      <image
                        class="icon"
                        mode="scaleToFill"
                        src="http://192.168.1.187:10088/static/map/icon-map-collected.png"
                        v-if="item.isCollected == 1"
                      />
                      <image
                        class="icon"
                        mode="scaleToFill"
                        src="http://192.168.1.187:10088/static/map/icon-map-uncollect.png"
                        v-else
                      />
                      <text class="fs-36 c-black mt-8">收藏</text>
                    </view>
                    <view
                      class="item"
                      @click.stop="makeToTel(item)"
                      v-if="showTel(item.scenic_area_tel)"
                    >
                      <image
                        class="icon"
                        mode="scaleToFill"
                        src="http://192.168.1.187:10088/static/map/icon-map-make-call.png"
                      />
                      <text class="fs-36 c-black mt-8">电话</text>
                    </view>
                    <view class="item" @click.stop="makeToCar">
                      <image
                        class="icon"
                        mode="scaleToFill"
                        src="http://192.168.1.187:10088/static/map/icon-map-take-taxi.png"
                      />
                      <text class="fs-36 c-black mt-8">打车</text>
                    </view>
                  </view>
                  <view
                    class="direction flex-h flex-c-c ml-12"
                    @click.stop="handleDirectionClick(item)"
                  >
                    <image
                      class="icon"
                      mode="scaleToFill"
                      src="http://192.168.1.187:10088/static/map/icon-map-direction.png"
                    />
                    <text class="fs-40 c-white ml-12">路 线</text>
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>
    <action-sheet
      ref="actionSheet"
      title="请选择拨打电话"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
  import api from '@/apis/index.js';

  import ActionSheet from '@/components/common/action-sheet';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import { uniSwiperDot } from '@dcloudio/uni-ui';
  import { showToast } from '@/utils/uni';

  var page;
  export default {
    components: { uniPopup, uniSwiperDot, ActionSheet },
    data() {
      return {
        // 当前位置信息
        location: uni.getStorageSync('location') || {},
        // 中心点位置信息
        centerLocation: {
          latitude: '39.993762',
          longitude: '116.473083',
        },
        // 是否显示在此区域搜索
        showsSearchInCurrentArea: false,
        // 搜索关键字
        keyword: '',
        // 选中的分类下标
        selectedIndex: 0,
        // 选中的分类 serviceOrder 值
        serviceIndex: '0',
        // 选中的分类标记
        key: '1',
        // 所有分类列表
        categories: [],
        // 标记点信息
        markers: [],
        // 标记点信息寄存
        setMarkers: [],
        // 是否显示标记点信息卡片
        showsInfoCard: false,
        // 点击的标记点信息
        info: [],
        // 搜索地图点详细信息
        searchInfo: {},
        // id循环累加不重复
        index: 0,
        // 电话号码列表
        phoneList: [],
        // 当前轮播页码
        current: 0,
        // 轮播动画时间
        duration: 0,
        // 轮播参数
        mode: 'round',
        // 卡片动画参数
        animationData: {},
        // 控制卡片动画
        off: false,
        // 图片旋转参数
        animationImage: {},
        // 控制图片旋转参数
        roateImage: '',
        // 控制是否需要中心点查询周边
        isCenterQuery: true,
        // 执行一次
        showOnce: false,
        // 控制是否需要下拉卡片的参数
        showCard: true,
        // 控制卡片延迟效果
        timeOut: '',
        // 控制动画延迟时间
        timeAnimation: '',
        // 拨打电话弹窗选项
        actionSheetItems: [],

        // 获取当前定位的城市
        city: '',

        scrollToLeft: 0, // scrollview需要滚动的距离
        navInfos: [], // 所有navitem的节点信息
        parentLeft: 0, // nav盒子的节点信息
        componentWidth: 0, // nav盒子的宽度

        baseList: [
          {
            serviceOrder: '0',
            serviceName: '全部',
            code: '060100|060200|060300|060400|061200|050000|110000|090100|090100|090200|090300|090400|090500|090600|100000|130000',
            distance: '20000',
            des: '',
            amapDes:
              '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店|餐饮服务|风景名胜|医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构|医药保健销售店|住宿服务|政府机构及社会团体',
            prepareIndex: -1,
          },
          {
            serviceOrder: '1', // 对应菜单serviceOrder
            serviceName: '助餐点', // 对应菜单名称
            code: '',
            distance: '20000', // 搜索范围
            des: '助餐点', // 我方地图接口参数
            amapDes: '', // 高德地图所需参数
            prepareIndex: -1,
          },
          {
            serviceOrder: '2',
            serviceName: '日间照料',
            code: '',
            distance: '20000',
            des: '日间照料',
            amapDes: '',
            prepareIndex: -1,
          },
          {
            serviceOrder: '3',
            serviceName: '商超',
            code: '060100|060200|060300|060400|061200',
            distance: '20000',
            des: '商超',
            amapDes: '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店',
            prepareIndex: 1,
          },
          {
            serviceOrder: '4',
            serviceName: '美食',
            code: '050000',
            distance: '20000',
            des: '美食',
            amapDes: '餐饮服务',
            prepareIndex: 0,
          },
          {
            serviceOrder: '5',
            serviceName: '景点',
            code: '110000',
            distance: '50000',
            des: '景点',
            amapDes: '风景名胜',
            prepareIndex: 0,
          },
          {
            serviceOrder: '6',
            serviceName: '医院',
            code: '090100|090100|090200|090300|090400|090500',
            distance: '20000',
            des: '医院',
            amapDes: '医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构',
            prepareIndex: 1,
          },
          {
            serviceOrder: '7',
            serviceName: '药店',
            code: '090600',
            distance: '20000',
            des: '药店',
            amapDes: '医药保健销售店',
            prepareIndex: 1,
          },
          {
            serviceOrder: '8',
            serviceName: '住宿',
            code: '100000',
            distance: '20000',
            des: '住宿',
            amapDes: '住宿服务',
            prepareIndex: 0,
          },
          {
            serviceOrder: '9',
            serviceName: '政务服务',
            code: '130000',
            distance: '20000',
            des: '政务服务',
            amapDes: '政府机构及社会团体',
            prepareIndex: 0,
          },
          {
            serviceOrder: '10',
            serviceName: '养老院',
            code: '',
            distance: '20000',
            des: '养老院',
            amapDes: '',
            prepareIndex: -1,
          },
        ],
        mapConext: null, // 地图对象

        // 是否使用include
        list: [],

        // 解决点击标记点同事触发点击地图事件
        onlyTap: true, // 只点击地图

        maxScale: 18, // 最大缩放比例
      };
    },
    beforeCreate() {
      page = this;
    },
    onLoad(e) {
      uni.$on('didMapSearchFinish', this.handleMapSearchFinish);
      this.getLocation().then((res) => {
        this.location = res;
        this.centerLocation = res;
        this.setCategories(res);
      });

      // 初始化卡片动画
      this.animation = uni.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      });
      // 首次执行一次赋予样式动画否则出现第一次无效点击
      if (!this.showOnce) {
        this.handleAnimation();
      }
    },
    onReady() {},
    onShow() {},
    onUnload() {
      uni.$off('didMapSearchFinish');
    },
    watch: {
      // 监听搜索词
      keyword(newVal, oldVal) {
        // if (newVal == '') {
        //   this.mapConext = uni.createMapContext('map', this)
        //   mapConext.getCenterLocation({
        //     success: (res) => {
        //       this.isCenterQuery = true
        //       this.handleCategoryClick(
        //         this.serviceIndex,
        //         this.key,
        //         res.latitude,
        //         res.longitude
        //       )
        //     },
        //     fail: () => {},
        //   })
        // }
      },
      // 监听卡片出现消失事件
      off(newVal, oldVal) {
        if (!newVal) {
          //  off为false卡片下层
          this.rotateAndScale();
          this.roateImage = 'down';
        } else {
          //  off为true卡片正常展示
          this.norotateAndScale();
          this.roateImage = 'uptop';
        }
      },
    },
    onShareAppMessage() {
      return {
        title: '',
        path: '/pages/map/map',
      };
    },
    methods: {
      handleWelfareClick() {
        this.$uni.showToast('福利待上线,敬请期待');
      },
      /**
       * 标记点点击事件
       */
      handleMarkerClick(e) {
        // 展示下拉图标
        this.showCard = false;
        if (!this.off) {
          this.off = true;
        }
        // 展示图片片
        this.showsInfoCard = true;
        this.onlyTap = false;
        setTimeout(() => {
          this.onlyTap = true;
        }, 400);
        console.log('标记点点击事件:', e);
        this.markers.some((item, index) => {
          if (item.id == e.detail.markerId) {
            this.info = item;
            this.current = index;
            this.list = [this.markers[index]];
            // #ifdef MP-ALIPAY
            this.centerLocation = { latitude: e.latitude, longitude: e.longitude };
            // #endif

            this.change({
              detail: {
                current: index,
              },
            });
            return true;
          }
        });

        this.timeOut = setTimeout(() => {
          this.showCard = true; // 延迟控制动画效果需要开启
        }, 800);
      },
      /*
       *卡片切换
       */
      change(e) {
        // this.list = []
        this.current = e.detail.current;
        // console.log('触发change', e)
        // 排他,其余重置图片大小
        let num;
        this.markers.map((item, index) => {
          if (index != this.current) {
            item.width = 35;
            item.height = 36;
            // #ifdef MP-WEIXIN
            this.markers[index].callout = {};
            // #endif

            // #ifdef MP-ALIPAY
            this.markers[index].label = null;
            // #endif
          } else {
            this.list = [this.markers[index]];
            num = index;
            item.width = 48;
            item.height = 50;
            // #ifdef MP-ALIPAY
            item.label = {
              content: item.name,
              color: '#000000',
              fontSize: 16,
              borderRadius: 5,
              bgColor: '#ffffff',
              padding: 12,
            };
            // #endif
            // #ifdef MP-WEIXIN
            item.callout = {
              content: item.name,
              color: '#000000',
              fontSize: 12,
              borderRadius: 6,
              bgColor: '#FFF',
              padding: 10,
              textAlign: 'center',
              display: 'ALWAYS',
            };
            // #endif
          }
          return;
        });

        if (!this.off) {
          this.off = true;
        }

        this.centerLocation = {
          latitude: this.markers[this.current].latitude,
          longitude: this.markers[this.current].longitude,
        };
        console.log('执行完毕---');
      },
      // 滑动
      animationfinish(e) {
        console.log('animationfinish', e);
        // console.log("滑动dx+++++",dx)
      },
      /*
       *第三方sdk接入查找周边景点和医院
       */
      getAround(latitude1, longitude1, drag, radius) {
        const latitude = latitude1;
        const longitude = longitude1;
        const city = uni.getStorageSync('city');
        let types = '';
        if (this.serviceIndex == '0') {
          this.categories.map((item, index) => {
            if (index > 0) {
              // console.log('==item.serviceOrder==', item.serviceOrder)
              types = types + this.baseList[Number(item.serviceOrder)].amapDes;
            }
          });
        } else {
          types = this.baseList[this.serviceIndex].amapDes;
        }
        console.log('types=---', types);
        api.aroundMap(
          {
            location: `${latitude},${longitude}`,
            keywords: this.keyword,
            city: city.code,
            types: types,
            radius: drag ? radius : this.baseList[this.serviceIndex].distance, // 搜索半径
            offset: 25,
          },
          {
            success: (res) => {
              console.log('获取结果：', res);
              console.log('this.serviceIndex === 0', this.serviceIndex == 0);
              // 遍历高德的数据
              let arry = [];
              res.pois.map((item, index) => {
                if (this.serviceIndex == 0) {
                  this.baseList.some((baseName, baseIndex) => {
                    // let key = item.type.split(';')[baseName.prepareIndex]
                    if (baseIndex > 2 && baseIndex < 10) {
                      const base = baseName.amapDes.split('|');
                      const conditions = base.some((itemp, indexp) => {
                        //  console.log('itemp==',itemp)
                        //  console.log('item.type==',item.type)
                        //  console.log('conditions',item.type.indexOf(itemp))
                        return item.type.indexOf(itemp) > -1;
                      });
                      if (conditions) {
                        {
                          // console.log('index:', index)
                          return arry.push({
                            id: this.index++,
                            type: baseName.des,
                            latitude: item.location.split(',')[1] - 0,
                            longitude: item.location.split(',')[0] - 0,
                            iconPath:
                              'http://192.168.1.187:10088/static/map/marker-icon' +
                              baseName.serviceOrder +
                              '.png',
                            width: 35,
                            height: 36,
                            name: item.name,
                            duplicates: item.name + item.address, // 去重条件
                            scenic_area_tel: item.tel,
                            address: item.address,
                            distance: this.getDistance(
                              item.location.split(',')[1],
                              item.location.split(',')[0],
                              this.location.latitude,
                              this.location.longitude,
                            ),
                            my_distance: this.calculations(
                              item.location.split(',')[1],
                              item.location.split(',')[0],
                            ),
                            scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                            scenic_area_rank:
                              typeof item.biz_ext.level == 'string' ? item.biz_ext.level : '',
                          });
                        }
                      } else if (!conditions && baseIndex > 9) {
                        console.log('其他数据的key：', index, key);
                        console.log('其他数据的type：', baseName.des);
                        return arry.push({
                          id: this.index++,
                          type: baseName.des,
                          latitude: item.location.split(',')[1] - 0,
                          longitude: item.location.split(',')[0] - 0,
                          iconPath: 'http://192.168.1.187:10088/static/map/marker-icon0.png',
                          width: 35,
                          height: 36,
                          name: item.name,
                          duplicates: item.name + item.address, // 去重字段
                          scenic_area_tel: item.tel,
                          address: item.address,
                          distance: this.getDistance(
                            item.location.split(',')[1],
                            item.location.split(',')[0],
                            this.location.latitude,
                            this.location.longitude,
                          ),
                          my_distance: this.calculations(
                            item.location.split(',')[1],
                            item.location.split(',')[0],
                          ),
                          scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                          scenic_area_rank:
                            typeof item.biz_ext.level == 'string' ? item.biz_ext.level : '',
                        });
                      }
                    }
                  });
                } else {
                  arry.push({
                    id: this.index++,
                    type: this.baseList[this.serviceIndex].des,
                    latitude: item.location.split(',')[1] - 0,
                    longitude: item.location.split(',')[0] - 0,
                    iconPath:
                      'http://192.168.1.187:10088/static/map/marker-icon' +
                      this.baseList[this.serviceIndex].serviceOrder +
                      '.png',
                    width: 35,
                    height: 36,
                    name: item.name,
                    scenic_area_tel: item.tel,
                    duplicates: item.name + item.address, // 去重字段
                    address: item.address,
                    distance: this.getDistance(
                      item.location.split(',')[1],
                      item.location.split(',')[0],
                      this.location.latitude,
                      this.location.longitude,
                    ),
                    my_distance: this.calculations(
                      item.location.split(',')[1],
                      item.location.split(',')[0],
                    ),
                    scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                    scenic_area_rank:
                      typeof item.biz_ext.level == 'string' ? item.biz_ext.level : '',
                  });
                }
              });
              // console.log('执行报错点3')

              arry = [...this.setMarkers, ...arry];
              // console.log('arry', arry)

              const hash = {};
              const newArray = arry.reduce((item, next) => {
                hash[next.name] ? '' : (hash[next.name] = true && item.push(next));
                return item;
              }, []);
              // console.log('执行报错点4')

              //  let newArry = arry.splice(0,lastNum)

              newArray.sort((m, n) => {
                var a = m['distance'];
                var b = n['distance'];
                return a - b; // 升序
              });
              // console.log('newArray', newArray)
              this.markers = newArray.slice(0, 25);
              // console.log('this.markers===', this.markers)

              if (!drag) {
                this.list = this.markers;
              } else {
                this.list = [];
              }
              if (this.markers.length === 0) {
                this.$uni.showToast('该区域无结果，换个位置试试吧~');
              }
            },
            fail(err) {
              uni.showToast({
                title: err.errMsg,
              });
            },
          },
        );
      },
      /**
       * 地图视野改变回调(兼容问题include-points属性：微信的include-points触发该函数，支付宝include-points不会触发该函数)
       * (拖动时两端都会触发该函数，根据事件触发原因来进行判断
       */
      handleMapRegionChange(e) {
        // console.log('地图视野改变回调:', e)

        // 在视野改变结束时才执行之后的操作
        if (e.type !== 'end') {
          if (this.showCard && this.showOnce && this.off) {
            this.off = false;
            // this.handleAnimation()
          }
          return;
        }
        this.list = [];
        // console.log('执行报错点7')
        this.centerLocation = { latitude: e.latitude, longitude: e.longitude };
        const causedBy = e.causedBy;
        if (causedBy == 'update') return;

        // 控制此区域搜索
        this.showsSearchInCurrentArea = true;
        // 判断是否需要查询周边
        if (!this.isCenterQuery || this.off) {
          return;
        }
        console.log('执行报错点6');
        // 使用全局的this.mapConext可能会报错，报错内容大概是改变了数据的类型（待探索
        const mapConext = uni.createMapContext('map');
        console.log('mapConext对象：', mapConext);

        // 获取地图东北和西南坐标算出地图的最新半径
        mapConext.getRegion({
          success: (res) => {
            console.log('成功res：', res);

            const lat = ((res.southwest.latitude + res.northeast.latitude) / 2).toFixed(6);
            // 获取当前屏幕半径
            const radius = (
              this.getDistance(lat, res.southwest.longitude, lat, res.northeast.longitude) / 2
            ).toFixed(0);

            // 获取中心点坐标，进行数据请求
            mapConext.getCenterLocation({
              success: (res) => {
                console.log('再次发起请求');
                // 首次进入页面不通过该方法，所以需要判断否则会出现两次加载的问题
                // if (this.showOnce) {
                this.handleCategoryClick(
                  this.serviceIndex,
                  res.latitude,
                  res.longitude,
                  true,
                  radius,
                );

                // }
              },
            });
          },
        });
      },

      /**
       * 地图点击事件
       */
      handleMapClick(e) {
        if (this.onlyTap) {
          console.log('====地图点击事件===', e);
          this.showsInfoCard = false;

          this.markers.map((item, index) => {
            if (index == this.current) {
              item.width = 35;
              item.height = 36;
              // #ifdef MP-WEIXIN
              this.markers[index].callout = {};
              // #endif

              // #ifdef MP-ALIPAY
              this.markers[index].label = null;
              // #endif
            }
          });
        }
      },

      /**
       * 点击收藏
       */
      handleCollected(item) {
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        if (item.isCollected == 0) {
          api.saveCollect({
            data: {
              colId: item.orgOfficeId,
              colType: '2',
              coordinate: item.longitude + ',' + item.latitude,
            },
            success: (data) => {
              item.isCollected = 1;
            },
          });
        } else {
          api.updateCollect({
            data: {
              requestColSingleDTOList: [
                {
                  delFlag: '1',
                  colId: item.orgOfficeId,
                },
              ],
            },
            success: (data) => {
              item.isCollected = 0;
            },
          });
        }
      },
      /**
       * 拨打电话按钮事件
       */
      makeToTel(item) {
        this.phoneList = [];
        if (item.scenic_area_tel) {
          const phoneNumber = item.scenic_area_tel.replace(/\//g, ',').replace(/\;/g, ',');
          phoneNumber.split(',').forEach((item1) => {
            this.phoneList.push(item1);
          });
        } else {
          showToast({
            title: '暂无电话',
          });
          return;
        }
        this.actionSheetItems = this.phoneList;
        this.$refs.actionSheet.open();
      },
      /**
       * action sheet 弹窗点击回调
       */
      handleActionSheetItemClick(index) {
        uni.makePhoneCall({
          phoneNumber: this.phoneList[index],
        });
      },
      /**
       * 打车
       */
      makeToCar() {
        showToast({
          title: '功能建设中，尽情期待',
        });
      },
      // 获取dom信息
      init() {
        const query = uni.createSelectorQuery();
        // console.log('query.select', query.select('.uni-nav'))
        query.select('.categories').fields({ rect: true, size: true }, (res) => {
          this.parentLeft = res.left;
          this.componentWidth = res.width;
          console.log('res==>', res);
        });
        // console.log('query.selectAll', query.selectAll('.nav-item'))
        query.selectAll('.menu-item').fields({ rect: true, size: true }, (data) => {
          console.log('domdata:', data);
          data.forEach((item, index) => {
            this.navInfos.push({ width: item.width, left: item.left });
          });
        });
        query.exec();
        setTimeout(() => {
          console.log('this.navInfos:', this.navInfos);
        }, 300);
      },
      // 滚动分类菜单
      scrollDom() {
        // console.log('获取元素：', this.navInfos)
        // console.log('元素索引：', )
        const info = this.navInfos[Number(this.selectedIndex)];
        // console.log('获取元素：', info)
        const offsetLeft = info.left - this.parentLeft;
        const scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2;
        this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft;
        console.log(this.scrollToLeft);
      },
      /**
       * 搜索完成回调
       */
      handleMapSearchFinish(data) {
        console.log('搜索完成回调');
        this.markers = [];
        this.isCenterQuery = false; // 是否需要中心点查询周边
        this.keyword = data.keyword;
        this.index = 1;
        console.log('===data==:', data);
        // 对搜索页面返回的数据进行处理，放入markers中
        data.results.forEach((item, index) => {
          (item.id = this.index++),
            // this.searchInfo = obj
            this.markers.push(item);
        });
        this.list = this.markers;
        // 触发第一个标记点的点击事件
        // this.handleMarkerClick({
        //   detail: {
        //     markerId: this.markers[0].id,
        //   },
        // })
        // #ifdef MP-ALIPAY
        // this.centerLocation = {latitude:e.latitude,longitude:e.longitude};
        // this.location = {
        //   latitude: this.markers[0].latitude,
        //   longitude: this.markers[0].longitude,
        // }
        // this.centerLocation = {
        //   latitude: this.markers[0].latitude,
        //   longitude: this.markers[0].longitude,
        // }
        // #endif

        return;
        setTimeout(() => {
          const mapConext = uni.createMapContext('map', this);
          mapConext.moveToLocation({
            latitude: this.location.latitude - 0,
            longitude: this.location.longitude - 0,
            success: (res) => {
              // #ifdef MP-ALIPAY
              this.centerLocation = {
                latitude: this.location.latitude - 0,
                longitude: this.location.longitude - 0,
              };
              // #endif
              setTimeout(() => {
                this.showsSearchInCurrentArea = false;
              }, 800);
            },
            fail: (res) => {},
          });
        }, 300);
      },
      /**
       * 搜索框点击事件
       */
      handleSearchBarClick() {
        this.showsSearchInCurrentArea = false;
        uni.navigateTo({
          url: '/pages/map/search?serviceIndex=' + this.serviceIndex,
        });
      },
      /*
       * 此区域搜索
       */
      handleQuery() {
        const mapConext = uni.createMapContext('map', this);

        console.log('mapConext对象：', mapConext);

        // 获取地图东北和西南坐标算出地图的最新半径
        mapConext.getRegion({
          success: (res) => {
            console.log('成功res：', res);

            const lat = ((res.southwest.latitude + res.northeast.latitude) / 2).toFixed(6);
            // 获取当前屏幕半径
            const radius = (
              this.getDistance(lat, res.southwest.longitude, lat, res.northeast.longitude) / 2
            ).toFixed(0);

            // 获取中心点坐标，进行数据请求
            mapConext.getCenterLocation({
              success: (res) => {
                console.log('再次发起请求');
                // 首次进入页面不通过该方法，所以需要判断否则会出现两次加载的问题
                // if (this.showOnce) {
                this.handleCategoryClick(
                  this.serviceIndex,
                  res.latitude,
                  res.longitude,
                  true,
                  radius,
                );

                // }
              },
            });
          },
        });

        // 获取当前视野内的坐标
        // this.mapConext.getRegion({
        //   success: (res) => {
        //     this.southwest = res.southwest //西南坐标
        //     this.northeast = res.northeast //东北坐标
        //   },
        // })
        // mapConext.getCenterLocation({
        //   success: (res) => {
        //     this.handleCategoryClick(this.serviceIndex,this.key,res.latitude,res.longitude)
        //   },
        //   fail: () => {}
        // })
      },

      /**
       * 语音输入图标点击事件
       */
      handleVoiceInputClick() {
        uni.navigateTo({
          url: '/pages/map/search?voice=1',
        });
      },
      /**
       * 取消点击事件
       */
      handleCancelClick() {
        this.keyword = '';
      },
      /**
       * 定位点击事件
       */
      handleLocateClick() {
        this.getLocation().then((res) => {
          this.location = res;
          this.centerLocation = res;
          this.handleCategoryClick(
            this.serviceIndex,
            // this.key,
            res.latitude,
            res.longitude,
          );
          setTimeout(() => {
            this.showOnce = true;
          }, 300);
        });
        const mapConext = uni.createMapContext('map', this);
        mapConext.moveToLocation({
          latitude: this.location.latitude,
          longitude: this.location.longitude,
          success: (res) => {},
          fail: (res) => {
            uni.showModal({
              title: '提示',
              content: '请确认定位相关权限已开启',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              },
            });
          },
        });
      },
      /**
       *  地图层路线点击事件
       */
      handleRoadClick() {
        uni.navigateTo({
          url: '/pages/map/direction?empt=1',
          success: (res) => {
            res.eventChannel.emit('didOpenPageFinish', {
              empty: true,
            });
          },
        });
      },
      /**
       * 分类点击事件
       */
      async handleCategoryClick(index, latitudeCenter, longitudeCenter, drag, radius) {
        this.serviceIndex = index;

        if (this.categories.length === this.navInfos.length) {
          this.scrollDom();
        }
        this.showsInfoCard = false;
        if (this.keyword) {
          // this.markers = []
          // this.polygonList.map((item, index) => {
          //   if (this.key === '4' && item.type === '景点') {
          //     this.markers.push(item)
          //   }
          //   if (this.key === '6' && item.type === '医院') {
          //     this.markers.push(item)
          //   }
          //   if (this.key === '1') {
          //     this.markers.push(item)
          //   }
          // })
          // return
        }

        let latitude = null;
        let longitude = null;
        if (latitudeCenter) {
          latitude = latitudeCenter;
          longitude = longitudeCenter;
        } else {
          // latitude = this.location.latitude.toString()
          // longitude = this.location.longitude.toString()
          latitude = this.location.latitude;
          longitude = this.location.longitude;
        }
        // 判断是否收藏过---开始
        const collectList = await this.handleCollecteMethod();
        // 收藏接口-----结束
        this.setMarkers = [];
        // 展示在此区域搜索 && 有关键字 && （卡片为下沉状态 或者 显示卡片）
        // if ( this.showsSearchInCurrentArea &&  this.keyword &&  (!this.off || !this.showsInfoCard)  ) {
        //   this.getAround(latitude, longitude, '全部', true)
        // } else {
        //   this.getAround(latitude, longitude, '全部', false)
        //   // this.getAround(latitude,longitude,"景点", true)
        //   // this.getAround(latitude,longitude,"医院", true)
        // }
        console.log('请求数据');
        api.getEcOrgOfficeInfoByPoint({
          data: {
            orgOfficeType: this.baseList[this.serviceIndex].des, // 场所类型,
            orgOfficeLat: latitude,
            orgOfficeLon: longitude,
            orgOfficeName: this.keyword,
            // areaCode:this.city,
            distance: drag ? radius : Number(this.baseList[this.serviceIndex].distance / 1000),
            size: 25,
          },
          success: (data) => {
            this.setMarkers = [];

            data.forEach((item, index) => {
              // 景点和医院的参数不同需要加些判断
              //  console.log("json：",JSON.parse(
              //           item.orgOfficeInfoDetail.replace(/\s*/g, '')
              //         ))
              let obj = {};
              switch (item.orgOfficeType) {
                case '景点':
                  // console.log('执行报错点11')
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon5.png',
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(
                      this.location.latitude,
                      this.location.longitude,
                      item.orgOfficeLat,
                      item.orgOfficeLon,
                    ),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  // console.log("景点数据：",item.orgOfficeInfoDetail)
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : '';
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : '';
                    obj['scenic_area_rank'] = area.scenic_area_rank;
                    obj['scenic_area_opentime'] = area.scenic_area_opentime;
                    obj['scenic_area_intro'] = area.scenic_area_intro;
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    }
                  }
                  collectList.some((itemCollect) => {
                    console.log('==收藏id===', itemCollect.colId);
                    if (itemCollect.colId == obj.orgOfficeId) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
                case '医院':
                  // console.log('执行报错点12')
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon6.png',
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(
                      this.location.latitude,
                      this.location.longitude,
                      item.orgOfficeLat,
                      item.orgOfficeLon,
                    ),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : '';
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : '';
                    obj['scenic_area_rank'] = area.scenic_area_rank;
                    obj['scenic_area_opentime'] = area.scenic_area_opentime;
                    obj['scenic_area_intro'] = area.scenic_area_intro
                      ? area.scenic_area_intro
                      : area.hospital_intro;
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    }
                  }
                  collectList.some((itemCollect) => {
                    if (itemCollect.colId == obj.orgOfficeId) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
                default:
                  // console.log('执行报错点13')
                  let iconPath = 'http://192.168.1.187:10088/static/map/marker-icon0.png';
                  const iconp = {
                    助餐点: 'http://192.168.1.187:10088/static/map/marker-icon1.png',
                    日间照料: 'http://192.168.1.187:10088/static/map/marker-icon2.png',
                    商超: 'http://192.168.1.187:10088/static/map/marker-icon3.png',
                    美食: 'http://192.168.1.187:10088/static/map/marker-icon4.png',
                    药店: 'http://192.168.1.187:10088/static/map/marker-icon7.png',
                    住宿: 'http://192.168.1.187:10088/static/map/marker-icon8.png',
                    政务服务: 'http://192.168.1.187:10088/static/map/marker-icon9.png',
                    养老院: 'http://192.168.1.187:10088/static/map/marker-icon10.png',
                  };
                  iconPath = iconp[item.orgOfficeType];

                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: iconPath,
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(
                      this.location.latitude,
                      this.location.longitude,
                      item.orgOfficeLat,
                      item.orgOfficeLon,
                    ),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    // obj["hospital_level"] = area.hospital_level ? area.hospital_level : ""
                    // obj["hospital_clinic"] = area.hospital_clinic ? area.hospital_clinic : ""
                    if (area.scenic_area_rank) {
                      obj['scenic_area_rank'] = area.scenic_area_rank;
                    } else if (area.common_service_rank) {
                      obj['scenic_area_rank'] = area.common_service_rank;
                    }
                    if (area.common_service_opentime) {
                      obj['scenic_area_opentime'] = area.common_service_opentime;
                    } else if (area.common_service_opentime) {
                      obj['scenic_area_opentime'] = area.common_service_opentime;
                    }
                    if (area.common_service_intro) {
                      obj['scenic_area_intro'] = area.common_service_intro;
                    } else if (area.scenic_area_intro) {
                      obj['scenic_area_intro'] = area.scenic_area_intro;
                    }

                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    } else if (area.common_service_photos) {
                      obj['scenic_area_photos'] = area.common_service_photos.split(',')[0];
                    }
                  }
                  console.log('collectList的值===', collectList);
                  collectList.some((itemCollect) => {
                    console.log('==其他收藏id===', itemCollect.colId);
                    console.log('==当前地点id===', obj.orgOfficeId);
                    if (itemCollect.colId == obj.orgOfficeId) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
              }
            });
            if (this.searchInfo['mapLocation']) {
              console.log('执行报错点14');
              this.setMarkers.push(this.searchInfo);
            }
            console.log('获取地址：', this.setMarkers);

            // let lastNum = 25 - data.length
            // 数据不够高德来凑
            if (this.baseList[this.serviceIndex].amapDes) {
              console.log('高德也有数据');

              this.getAround(latitude, longitude, drag, radius);
            } else {
              console.log('执行报错点15====', !drag);
              this.markers = this.setMarkers;
              if (!drag) {
                this.list = this.markers;
                // const mapConext = uni.createMapContext('map', this)
                // console.log(' mapConext1:', mapConext)
                // mapConext.includePoints({
                //   points: this.markers,
                //   padding: [40, 30, 0, 30],
                // })
              } else {
                this.list = [];
              }
              console.log('this.list:', this.list);
              // // #ifdef MP-ALIPAY
              // this.mapConext = my.createMapContext('map', this)
              // //#endif
              // //#ifdef MP-WEIXIN
              // this.mapConext = uni.createMapContext('map', this)
              // //#endif
            }
          },
        });
        return;
      },

      /**
       * 收藏接口
       */
      handleCollecteMethod() {
        return new Promise((resolve, reject) => {
          let collectList = [];
          // 判断是否收藏过---开始
          if (uni.getStorageSync('token')) {
            api.findListByParmas({
              data: {
                pageNum: 1,
                pageSize: 100,
                colType: '2',
                isDistanceOrder: true,
                coordinate: this.location.longitude + ',' + this.location.latitude,
              },
              success: (data) => {
                if (data) {
                  collectList = data.finalList;
                  resolve(collectList);
                }
              },
              fail: (data) => {
                reject(collectList);
              },
            });
          } else {
            resolve(collectList);
          }
          // 收藏接口-----结束
        });
      },

      /**
       * 消息卡片点击事件
       */
      handleInfoCardClick(item) {
        if (!item.orgOfficeInfoDetail) {
          showToast({
            title: '暂无详情信息',
          });
          return;
        }
        let type;
        if (item.iconPath == '/static/map/marker-icon4.png') {
          type = 'attraction';
        } else {
          type = 'hospital';
        }
        uni.navigateTo({
          url: '/pages/map/address-detail?orgOfficeId=' + item.orgOfficeId,
          // success: (res) => {
          //   res.eventChannel.emit("didOpenPageFinish", {
          //     type: type,
          //     item: item
          //   });
          // },
        });
      },
      // 导航点击事件
      handleDirectionClick(item) {
        const data = {
          name: item.name,
          longitude: item.longitude - 0,
          latitude: item.latitude - 0,
          distance: item.distance,
          address: item.address,
        };
        uni.navigateTo({
          url: '/pages/map/direction?data=' + encodeURIComponent(JSON.stringify(data)),
          success: (res) => {
            res.eventChannel.emit('didOpenPageFinish', data);
          },
        });
      },
      /**
       * 获取分类数据
       */
      setCategories() {
        api.getOfficeTypes({
          data: {
            areaCode: this.city,
          },
          success: (res) => {
            console.log('当前分类：', res);
            this.categories = [
              {
                serviceOrder: '0',
                serviceName: '全部',
              },
            ];
            res.map((item, index) => {
              this.categories.push({
                serviceOrder: item.serviceOrder,
                serviceName: item.serviceName,
              });
            });
            setTimeout(() => {
              this.init();
            });

            // getMarkersList({
            //   latitude: location.latitude,
            //   longitude: location.longitude,
            //   keyword: this.keyword,
            //   city: this.city,
            //   serviceOrder: this.categories[this.serviceIndex].serviceOrder,
            //   serviceName: this.categories[this.serviceIndex].serviceName,
            // })

            // 专门给支付宝使用的中心坐标

            this.handleCategoryClick(this.serviceIndex);
            setTimeout(() => {
              this.showOnce = true;
            }, 300);
          },
        });
      },
      /**
       * 获取当前位置信息
       */
      getLocation() {
        // 先将原有位置信息清空, 再重新定位, 位置信息发生变化, 才能将当前定位置于屏幕中心
        return new Promise((resolve, reject) => {
          // this.location = {}
          this.searchInfo = {};
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              this.location = res;
              uni.setStorage({
                key: 'location',
                data: res,
              });
              // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
              api.regeoMap(
                {
                  // location: '116.481488,36.990464',
                  location: res.longitude + ',' + res.latitude,
                },
                {
                  success: (resp) => {
                    console.log('resp:', resp);
                    // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                    if (typeof resp.regeocode.addressComponent.city === 'string') {
                      this.city = resp.regeocode.addressComponent.city;
                    } else {
                      this.city = resp.regeocode.addressComponent.province;
                    }
                    uni.setStorageSync('mapCity', {
                      city: this.city,
                      longitude: res.longitude,
                      latitude: res.latitude,
                      code: resp.regeocode.addressComponent.citycode,
                    });
                    resolve(res);
                  },
                },
              );
            },
            fail: (err) => {
              reject(err);
              uni.showModal({
                title: '提示',
                content: '请确认定位相关权限已开启',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                  }
                },
              });
            },
          });
        });
      },
      /**
       * 是否显示电话
       */
      showTel(tel) {
        if (typeof tel == 'string') {
          return true;
        } else {
          return false;
        }
      },
      /**
       * 手指头触摸开始事件
       */
      handleTouchstart(e) {
        console.log('手指头触摸开始事件');
        clearTimeout(this.timeOut);
        clearTimeout(this.timeAnimation);
        this.showCard = false; // 动画关闭
        this.duration = 300; // 切换动画开启
      },
      /**
       * 手指触摸结束事件
       */
      handleTouchend(e) {
        console.log('手指触摸结束事件');
        this.timeAnimation = setTimeout(() => {
          this.duration = 0; // 延迟后关闭动画时间
        }, 600);
        this.timeOut = setTimeout(() => {
          this.showCard = true; // 延迟控制动画效果需要开启
        }, 800);
      },
      /**
       * 箭头点击触发动画
       */
      handleAnimation() {
        this.off = !this.off;
      },
      /**
       * 定义动画内容
       */
      rotateAndScale() {
        // 定义动画内容
        this.animation.translateY('50%').step();
        // 导出动画数据传递给data层
        this.animationData = this.animation.export();
      },
      /**
       * 定义动画内容
       */
      norotateAndScale() {
        this.animation.translateY('0').step();
        this.animationData = this.animation.export();
      },
      /**
       * km,m单位转换
       */
      kmUnit(m) {
        var v;
        if (typeof m === 'number' && !isNaN(m)) {
          if (m >= 1000) {
            v = (m / 1000).toFixed(2) + 'km';
          } else {
            v = m + 'm';
          }
        } else {
          v = '0m';
        }
        return v;
      },
      /**
       * 返回单位km  lat:纬度  lng：经度
       */
      getDistance(lat1, lng1, lat2, lng2) {
        if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
          return '';
        }
        if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
          return '';
        }
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
            ),
          );
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s.toFixed(2) * 1000;
        if (s.toFixed(2) < 1) {
          return s.toFixed(2) * 1000 + '米';
        } else {
          return s.toFixed(2) + '公里';
        }
      },
      /**
       * 距离计算定义方法
       */
      rad(d) {
        return (d * Math.PI) / 180.0;
      },
      calculations(lat2, lng2) {
        // console.log('location,', this.location)
        const lat1 = this.location.latitude;
        const lng1 = this.location.longitude;

        if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
          return '';
        }
        if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
          return '';
        }
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
            ),
          );
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        if (s.toFixed(2) < 1) {
          return s.toFixed(2) * 1000 + '米';
        } else {
          return s.toFixed(2) + '公里';
        }
      },
    },
    filters: {},
  };
</script>

<style lang="scss" scoped>
  .map {
    padding-top: 112rpx;
    .map-view {
      width: 100vw;
      height: calc(100vh - 342rpx);
    }
    .search-view {
      position: fixed;
      top: 0;
      width: calc(100vw - 64rpx);
      height: 112rpx;
      .search-bar {
        height: 80rpx;
        border-radius: 40rpx;
        border: 2rpx solid $color-primary;
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
    }
    .search-button {
      @include size(284, 80);
      position: fixed;
      top: 144rpx;
      margin: 0 233rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
    }
    .welfare {
      @include square(200);
      position: fixed;
      top: 112rpx;
      right: 0;
      -webkit-animation: heartAnimate 1.5s ease infinite;
      -moz-animation: heartAnimate 1.5s ease infinite;
      -o-animation: heartAnimate 1.5s ease infinite;
      -ms-animation: heartAnimate 1.5s ease infinite;
      animation: heartAnimate 1.5s ease infinite;
    }
    .actions {
      position: fixed;
      bottom: 320rpx;
      right: 16rpx;
      .item {
        @include size(144, 64);
        &__icon {
          @include square(32);
        }
        .item__icon {
          width: 50rpx;
          height: 50rpx;
        }
        .icon-road {
          width: 35rpx;
          height: 35rpx;
        }
      }
    }
    .categories {
      z-index: 100;
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 230rpx;
      border-radius: 24rpx 24rpx 0 0;
      box-shadow: 0rpx 4rpx 22rpx black;
      .map-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        position: relative;
        // height: 0.5rem;
      }
      .item {
        flex-shrink: 0;
        // display: inline-block;
        width: 172rpx;
        &__icon {
          @include square(64);
        }
        &__text {
          color: #999999;
          line-height: 50rpx;
          text-shadow: 0px -4rpx 20rpx rgba(0, 0, 0, 0.1);
        }
        .c-bold {
          font-weight: bold;
          color: #333;
        }
      }
    }
    .info-card {
      // position: fixed;
      //bottom: 68rpx;
      .indicator {
        @include size(50, 14);
      }
      .info {
        .photo-view {
          overflow: hidden;
          border-radius: 10rpx;
          min-width: 200rpx;
          .photo {
            width: 200rpx;
            height: 180rpx;
          }
          .tag {
            @include size(200, 40);
            margin-top: -16rpx;
          }
          .photo-rank {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 50rpx;
            background: url('http://192.168.1.187:10088/static/map/photo-rank2x.png') no-repeat;
            background-size: 100% auto;
            background-position: center;
            color: #fff;
            transform: translateY(-10rpx);
          }
        }
        .text-view {
          .text {
            @include text-line(1);
            max-width: 420rpx;
          }
        }
      }
      .functions {
        margin: 24rpx 0 24rpx;
        width: 100%;
        .item {
          .icon {
            @include square(48);
          }
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 115rpx;
        }
        .direction {
          @include size(240, 100);
          background: linear-gradient(to right, $color-secondary, $color-primary);
          border-radius: 50rpx;
          .icon {
            @include square(48);
          }
        }
      }
    }
    .popup-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44rpx;
      width: 100%;
      height: 100rpx;
    }
    .popup-content {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      width: 100%;
      height: 100rpx;
    }
    .swiper-item {
      margin: 40rpx;
      height: 474rpx;
      background: #fff;
      box-shadow: 0rpx -4rpx 6rpx 0rpx rgba(0, 0, 0, 0.08);
      border-radius: 24rpx;
      .map-icon {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        image {
          width: 50rpx;
          height: 15rpx;
          transition: transform 0.2s;
        }
      }
    }
    .down {
      transform: rotate(0deg);
    }
    .uptop {
      transform: rotate(-180deg);
    }
  }
</style>
