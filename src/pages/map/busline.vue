<template>
  <view class="busline">
    <!-- 自定义导航栏 -->
    <navigation-bar :alpha="alpha" :shows-back-button="iswx" />
    <!-- 地图  :polyline="polyline" :include-points="includePoints"  :enable-scroll="isMapScrollable"-->
    <map
      class="map-view"
      :markers="markers"
      :polyline="polyline"
      :include-points="includePoints"
      :enable-scroll="isMapScrollable"
    />
    <!-- 公交信息面板 -->
    <view
      class="info-panel bg-white"
      :class="{ animated: isPanelAnimated, rounded: height !== maxHeight }"
      :style="{ height: height + 'rpx' }"
    
    >
      <!-- 顶部基础信息 -->
      <view id="header" class="header">
        <image class="indicator" :src="indicatorIconPath"  mode="scaleToFill"/>
        <swiper
          class="animated"
          indicator-active-color="#FF5000"
          :indicator-dots="true"
          :current="selectedIndex"
          @change="handleSwiperChange"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          @touchmove="handleTouchMove"
        >
          <!-- :style="{ height: swiperItemHeights[selectedIndex] + 'rpx' }" -->
          <swiper-item v-for="(item, index) in buslines" class="swiper-item" :key="index">
            <view class="basic-info flex-v" :id="'swiper-item-' + index">
              <view class="tranmit-info flex-h flex-c-s flex-wrap">
                <template v-for="(busline, bIndex) in item.buslines">
                  <text class="line fs-40 fw-bold c-black" :key="bIndex">
                    {{ busline }}
                  </text>
                  <image
                    v-if="bIndex !== item.buslines.length - 1"
                    class="arrow-icon m-0-24"
                    :key="bIndex" mode="scaleToFill"
                    src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-busline.png"
                  />
                </template>
              </view>
              <text class="fs-36 c-lightgrey mt-16">
                {{ item.duration }} | 步行{{ item.walking_distance }}
              </text>
            </view>
          </swiper-item>
        </swiper>
      </view>
      <!-- 底部详细信息 -->
      <scroll-view
        class="detail-info"
        :style="{ height: scrollViewHeight + 'rpx' }"
        :scroll-y="height === maxHeight"
      >
        <!-- 起点 -->
        <view class="origin flex-h flex-c-s">
          <view class="circle-view flex-h flex-c-c">
            <view class="circle green-border" />
          </view>
          <text class="fs-40 c-black ml-12">{{ origin.name }}</text>
        </view>
        <view
          v-for="(item, index) in buslines[selectedIndex].segments"
          :key="index"
        >
          <!-- 步行信息 -->
          <view v-if="item.walking.steps.length > 0" class="info flex-v">
            <view class="dot-view flex-v flex-c-b m-16-0">
              <view class="dot" />
              <view class="dot" />
            </view>
            <view class="walking-info flex-h flex-c-s">
              <view class="icon flex-v flex-c-c">
                <image
                  class="walking-icon" mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-walking.png"
                />
              </view>
              <text class="fs-36 c-lightgrey ml-12">
                步行{{ item.walking.distance }}
              </text>
            </view>
          </view>
          <!-- 公交信息 -->
          <view v-if="item.bus.buslines.length > 0" class="info flex-v">
            <view class="dot-view flex-v flex-c-b m-16-0">
              <view class="dot" />
              <view class="dot" />
            </view>
            <view class="bus-info flex-h">
              <view class="icon flex-v flex-c-b">
                <view class="line" :style="{ background: colors[index] }" />
                <image
                  v-if="item.type === 'subway'"
                  class="vehicle-icon" mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-vehicle-subway.png"
                  :style="{ background: colors[index] }"
                />
                <image
                  v-else-if="item.type === 'bus'"
                  class="vehicle-icon" mode="scaleToFill"
                  src="https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-vehicle-bus.png"
                  :style="{ background: colors[index] }"
                />
                <view
                  class="end-circle"
                  :style="{ border: '4rpx solid ' + colors[index] }"
                />
              </view>
              <view class="flex-v ml-76">
                <view>
                  <text class="fs-40 c-black">
                    {{ getDepartureStopName(item) }}
                  </text>
                </view>
                <view class="mt-16">
                  <text
                    class="fs-36 c-white p-0-12 br-4"
                    :style="{ background: colors[index] }"
                  >
                    {{ item.bus.buslines[0].name }}
                  </text>
                </view>
                <view class="m-32-0">
                  <text class="fs-36 c-lightgrey">
                    {{ getNextStopName(item) }}
                  </text>
                </view>
                <view>
                  <text class="fs-40 c-black">
                    {{ getArrivalStopName(item) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="info flex-v">
          <view class="dot-view flex-v flex-c-b m-16-0">
            <view class="dot" />
            <view class="dot" />
          </view>
        </view>
        <!-- 终点 -->
        <view class="destination flex-h flex-c-s">
          <view class="circle-view flex-h flex-c-c">
            <view class="circle red-border" />
          </view>
          <text class="fs-40 c-black ml-12">{{ destination.name }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import NavigationBar from "../../components/common/navigation-bar.vue";
export default {
  components: { NavigationBar },
  data() {
    return {
      // 公交信息面板高度
      height: 0,
      // 公交信息面板最小高度
      minHeight: 0,
      // 公交信息面板最大高度
      maxHeight: 0,
      // 所有 swiper-item 的高度
      swiperItemHeights: [],
      // swiper 当前下标
      selectedIndex: 0,
      // 地图是否可以滑动
      isMapScrollable: true,
      // 公交信息面板是否带有动画效果
      isPanelAnimated: false,
      // 出发地
      origin: {},
      // 目的地
      destination: {},
      // 公交信息列表
      buslines: [0, 1, 2, 3, 4],
      // 换乘方案颜色列表
      colors: [],
      //#ifdef MP-ALIPAY
      iswx:false,
      //#endif
      //#ifdef MP-WEIXIN
       iswx:true,
      //#endif
      
    };
  },
  computed: {
    // 导航栏透明度
    alpha() {
        console.log('===alpha--')
      return 1 - Math.min(this.maxHeight - this.height, 120) / 120;
    },
    // 标记点
    markers() {
       console.log('===markers--')
      return [
        {
          id: 0,
          iconPath: "https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-direction-origin.png",
          width: 15,
          height: 15,
          ...this.origin,
        },
        {
          id: 1,
          iconPath: "https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-direction-destination.png",
          width: 47,
          height: 54,
          ...this.destination,
        },
      ];
    },
    // 路线上的点
    polyline() {
      console.log('===polyline--', this.buslines[this.selectedIndex])
      const busline = this.buslines[this.selectedIndex];
      if (!busline) return {};

      const points = busline.segments
        .map((segment) => {
          let result = [];

          const steps = segment.walking.steps;
          if (steps && steps.length > 0) {
            result = result.concat(steps.map((step) => step.polyline));
          }
          const buslines = segment.bus.buslines;
          if (buslines && buslines.length > 0) {
            result.push(buslines[0].polyline);
          }

          return result;
        })
        .join(";")
        .split(";")
        .map((item) => item.split(","))
        .map((item) => {
          return {
            longitude: parseFloat(item[0]),
            latitude: parseFloat(item[1]),
          };
        });
        console.log('---polyline返回的值--',[{ points: points, color: "#0078F7", width: 10, arrowLine: true }])
      return [{ points: points, color: "#0078F7", width: 10, arrowLine: true }];
    },
    // 缩放视野以包含所有给定的坐标点
    includePoints() {
      console.log('===includePoints22--',this.polyline)
      const polyline = this.polyline;
      return polyline && polyline.length > 0 ? polyline[0].points : [];
    },
    // 图标路径
    indicatorIconPath() {
       console.log('===indicatorIconPath--')
      const iconPath = "https://ggllstatic.hpgjzlinfo.com/static/map/icon-map-arrow-upward.png";
      return this.height === this.maxHeight ? "" : iconPath;
    },
    // 详细信息视图高度
    scrollViewHeight() {
       console.log('===scrollViewHeight--')
      return this.maxHeight - this.minHeight - 128;
    },
  },
  onLoad(e) {
    //#ifdef MP-ALIPAY
    // const data = JSON.parse(decodeURIComponent(e.data))
    const data = uni.getStorageSync("busline")
    this.selectedIndex = data.index;
    this.origin = data.origin;
    this.destination = data.destination;
    this.buslines = data.buslines;
    this.reformData();
//#endif

    //#ifdef MP-WEIXIN
     this.getData();
    //#endif
    this.setColors();
  },
  onReady() {
   
  },
  mounted(){
  
  },
  methods: {
    /**
     * 公交信息面板开始滑动回调
     */
    handleTouchStart(e) {
      this.isMapScrollable = false;
      this.touchPoint = { ...e.touches[0], height: this.height };
      console.log("this.touchPoint:",this.touchPoint)
      console.log("this.touchPoint.height:",this.touchPoint.height)
    },
    /**
     * 公交信息面板结束滑动回调
     */
    handleTouchEnd() {
      this.isPanelAnimated = true;

      // 边界判断, 小于最小高度取最小, 大于最大高度取最大,
      const boundary1 = this.maxHeight * (1 / 4) + this.minHeight * (3 / 4);
      const boundary2 = this.maxHeight * (3 / 4) + this.minHeight * (1 / 4);
      if (this.height < boundary1) {
        this.height = this.minHeight;
        // 当且仅当公交信息面板高度为最小高度时, 地图才可以滑动
        this.isMapScrollable = true;
      } else if (this.height < boundary2) {
        this.height = (this.maxHeight + this.minHeight) / 2;
      } else {
        this.height = this.maxHeight;
      }
      setTimeout(() => {
        this.isPanelAnimated = false;
      }, 500);
    },
    /**
     * 公交信息面板滑动回调
     */
    handleTouchMove(e) {
      //#ifdef MP-WEIXIN
      const offset = this.touchPoint.pageY - e.touches[0].pageY;
      //#endif
      //#ifdef MP-ALIPAY
       const offset = (this.touchPoint.pageY - e.touches[0].pageY);
      //#endif

      console.log('this.touchPoint.pageY',this.touchPoint.pageY)
      console.log('e.touches[0].pageY',e.touches[0].pageY)
      console.log('offset',offset)
      // let height = this.touchPoint.height + this.$uni.pxToRpx(offset);
      let height = this.touchPoint.height + offset;
      height = height < this.minHeight ? this.minHeight : height;
      height = height > this.maxHeight ? this.maxHeight : height;
      this.height = height;
    },
    /**
     * swiper 下标改变回调
     */
    handleSwiperChange(e) {
      this.selectedIndex = e.detail.current;
    },
    /**
     * 获取从上一个页面传过来的数据
     */
    getData() {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on("didOpenPageFinish-busline", (data) => {
        console.log("上一页传来的数据：",data)
        this.selectedIndex = data.index;
        this.origin = data.origin;
        this.destination = data.destination;
        this.buslines = data.buslines;
        this.reformData();
      });
    },
    /**
     * 整理数据
     */
    reformData() {
      console.log('===开始---')
      this.buslines.forEach((busline) => {
        busline.segments.forEach((segment) => {
          // 地铁名称去掉后面括号中的内容
          segment.bus.buslines.forEach((busline) => {
            busline.name = busline.name.replace(/\(.*?\)/g, "");
          });
          // 判断是公交还是地铁
          const entrance = segment.entrance.name;
          const exit = segment.exit.name;
          segment.type = entrance || exit ? "subway" : "bus";
          // 步行距离
          if (segment.walking.distance > 1000) {
            const distance = (segment.walking.distance / 1000).toFixed(1);
            segment.walking.distance = `${distance}公里`;
          } else {
            segment.walking.distance = `${segment.walking.distance}米`;
          }
        });
        // this.getSwiperItemHeights();
        // setTimeout(this.getMinHeight, 1000);
        // setTimeout(this.getMaxHeight, 1000);
      });
      this.height = 250;
      this.minHeight = 250;
      const systemInfo = uni.getSystemInfoSync();
      const height = systemInfo.screenHeight - systemInfo.statusBarHeight - 44;
      this.maxHeight = this.$uni.pxToRpx(height);
    },
    /**
     * 设置换成方案颜色
     */
    setColors() {
      this.colors = [
        "#C74F4A",
        "#F6CB93",
        "#E8D84C",
        "#E290BA",
        "#E67246",
        "#2970A3",
        "#3CA67B",
        "#D8B1AB",
        "#E73586",
        "#E7353F",
        "#329AA6",
        "#9AC94B",
        "#6C4377",
        "#E67246",
        "#B03A8C",
        "#3EA6C4",
        "#85AC4F",
        "#ACA4C2",
        "#D7A131",
        "#2A5FA6",
        "#F65A53",
        "#E67246",
      ];
    },
    /**
     * 计算所有 swiper-item 的高度
     */
    getSwiperItemHeights() {
      this.swiperItemHeights = [];
      this.buslines.forEach((item, index) => {
        const query = uni.createSelectorQuery();
        query
          .select(`#swiper-item-${index}`)
          .boundingClientRect((data) => {
            console.log("处理 data：",data)
            // const height = this.$uni.pxToRpx(data.height);
            const height = 214;
            this.swiperItemHeights.push(height);
          })
          .exec();
      });
    },
    /**
     * 获取公交信息面板最小高度
     */
    getMinHeight() {
      const query = uni.createSelectorQuery();
      query
        .select("#header")
        .boundingClientRect((data) => {
          // this.minHeight = this.$uni.pxToRpx(data.height);
          this.minHeight = 250;
          this.height = this.minHeight;
        })
        .exec();
    },
    /**
     * 获取公交信息面板最大高度
     */
    getMaxHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const height = systemInfo.screenHeight - systemInfo.statusBarHeight - 44;
      this.maxHeight = this.$uni.pxToRpx(height);
    },
    /**
     * 获取出发站点名称
     */
    getDepartureStopName(item) {
      const stopName = item.bus.buslines[0].departure_stop.name;
      const entranceName = item.entrance.name;
      return entranceName ? `${stopName} - ${entranceName}进站` : stopName;
    },
    /**
     * 获取到达站点名称
     */
    getArrivalStopName(item) {
      const stopName = item.bus.buslines[0].arrival_stop.name;
      const exitName = item.exit.name;
      return exitName ? `${stopName} - ${exitName}出站` : stopName;
    },
    /**
     * 获取下一站/总站数
     */
    getNextStopName(item) {
      const stopNumber = Number(item.bus.buslines[0].via_num) + 1;

      let nextStopName = "";
      if (stopNumber > 1) {
        nextStopName = item.bus.buslines[0].via_stops[0].name;
      } else {
        nextStopName = item.bus.buslines[0].arrival_stop.name;
      }
      return `下一站:${nextStopName}｜共${stopNumber}站`;
    },
  },

};
</script>

<style lang="scss" scoped>
.busline {
  .map-view {
    width: 100vw;
    height: 100vh;
  }
  .info-panel {
    position: fixed;
    bottom: 0;
    width: 100vw;
    .animated{
      height: 214rpx !important;
      .swiper-item{
         height: 214rpx;
      }
    }
    .header {
      .indicator {
        @include size(50, 14);
        margin: 8rpx 350rpx;
      }
      .basic-info {
        // padding: 16rpx 32rpx 56rpx;
        padding-left:19rpx;
        .tranmit-info {
          .arrow-icon {
            @include size(12, 20);
          }
        }
      }
    }
    .detail-info {
      padding: 64rpx 32rpx;
      width: calc(100vw - 64rpx);
      border-top: 16rpx solid #f2f2f2;
      .origin,
      .destination {
        .circle-view {
          @include square(64);
          .circle {
            @include square(40);
            border-radius: 20rpx;
            box-sizing: border-box;
          }
          .green-border {
            border: 4rpx solid #12b362;
          }
          .red-border {
            border: 4rpx solid #f54743;
          }
        }
      }
      .info {
        .dot-view {
          @include size(64, 48);
          .dot {
            @include square(12);
            border-radius: 6rpx;
            background: #d8d8d8;
          }
        }
        .walking-info {
          .icon {
            @include square(64);
            .walking-icon {
              @include size(26, 40);
            }
          }
        }
        .bus-info {
          .icon {
            position: relative;
            width: 64rpx;
            .line {
              position: absolute;
              top: 8rpx;
              // margin: 0 22rpx;
              width: 20rpx;
              height: calc(100% - 16rpx);
              z-index: -1;
            }
            .vehicle-icon {
              @include square(64);
              border-radius: 32rpx;
            }
            .end-circle {
              @include square(32);
              border-radius: 16rpx;
              box-sizing: border-box;
              background: white;
            }
          }
        }
      }
    }
  }
  .rounded {
    border-radius: 20rpx 20rpx 0 0;
  }
}
</style>
