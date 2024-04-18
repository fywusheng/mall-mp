<template>
  <view class="direction">
    <view class="header flex-v bg-white">
      <view class="origin-destination-info flex-h flex-c-b pl-32">
        <view class="indicator flex-v flex-c-b">
          <view class="green-dot br-8" />
          <image
            class="dash-line"
            src="http://192.168.1.187:10088/static/map/icon-map-dash-line.png"
            mode="scaleToFill"
          />
          <view class="red-dot br-8" />
        </view>
        <view class="info flex-1 ml-16">
          <text
            :class="[
              'row',
              'fs-36',
              'c-black',
              'p-0-24',
              'br-16',
              'animated',
              isInterchanged ? 'bottom' : 'top',
              showEmpty ? 'selectable' : '',
            ]"
            @click="handleOriginClick"
          >
            {{
              isInterchanged
                ? destination.name
                  ? destination.name
                  : ''
                : origin.name
                ? origin.name
                : ''
            }}
          </text>
          <text
            :class="[
              'row',
              'fs-36',
              'c-black',
              'p-0-24',
              'br-16',
              'animated',
              isInterchanged ? 'top' : 'bottom',
              showEmpty ? '' : 'selectable',
            ]"
            @click="handleDestinationClick"
          >
            {{
              isInterchanged
                ? origin.name
                  ? origin.name
                  : ''
                : destination.name
                ? destination.name
                : ''
            }}
          </text>
        </view>
        <image
          class="interchange-icon m-0-48"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/map/icon-map-interchange.png"
          @click="handleInterchangeClick"
        />
      </view>
      <view class="trip-mode flex-h">
        <view
          class="mode flex-v flex-c-c flex-1"
          v-for="(item, index) in tripModes"
          :key="index"
          @click="handleTripModeClick(index)"
        >
          <view class="flex-h flex-c-c flex-1">
            <image
              v-if="index === selectedIndex"
              class="icon mr-12"
              :src="item.iconPath"
              mode="scaleToFill"
            />
            <text
              class="text fs-40 animated"
              :class="index === selectedIndex ? 'c-primary' : 'c-lightgrey'"
            >
              {{ item.name }}
            </text>
          </view>
          <text
            class="duration fs-36 animated duration-size"
            :class="index === selectedIndex ? 'c-black' : 'c-lightgrey'"
          >
            {{ item.duration }}
          </text>
        </view>
      </view>
      <view class="tab">
        <myTabbar :modelData="modelData" :initIndex="initIndex"></myTabbar>
      </view>
    </view>
    <map
      v-if="selectedIndex !== 1 && showEmpty"
      class="map-view"
      ref="map"
      id="map"
      :latitude="location.latitude"
      :longitude="location.longitude"
      :show-location="true"
      :polyline="polylines[selectedIndex]"
      :include-points="includePoints"
      :markers="markers"
      :enable-zoom="true"
      :enable-scroll="true"
    />
    <view v-else class="buslines">
      <view style="width: 100vw; height: 320rpx" />
      <template v-if="buslines.length > 0">
        <view
          class="item flex-h flex-c-b m-20 p-24 br-8 bg-white"
          v-for="(item, index) in buslines"
          :key="index"
          @click="handleBuslineClick(index)"
        >
          <view class="info flex-v">
            <view class="tags mb-16">
              <text
                class="tag fs-36 mr-16 p-8 br-4"
                v-for="(tag, tIndex) in item.tags"
                :key="tIndex"
              >
                {{ tag }}
              </text>
            </view>
            <view class="line-info flex-h flex-c-s flex-wrap">
              <template v-for="(busline, bIndex) in item.buslines">
                <text class="line fs-40 fw-bold c-black" :key="bIndex">
                  {{ busline }}
                </text>
                <image
                  v-if="bIndex !== item.buslines.length - 1"
                  class="line-icon m-0-24"
                  :key="bIndex"
                  mode="scaleToFill"
                  src="http://192.168.1.187:10088/static/map/icon-map-busline.png"
                />
              </template>
            </view>
            <text class="fs-36 c-lightgrey mt-16">
              {{ item.duration }} | 步行{{ item.walking_distance }}
            </text>
          </view>
          <image
            class="accessory"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
      </template>
      <template v-if="buslines.length <= 0 && showEmpty && !isDistanceLong">
        <view class="empty flex-v flex-c-c">
          <text class="fs-40 c-black">距离{{ tripModes[3].distance }}</text>
          <text class="fs-40 c-black mt-16">步行{{ tripModes[3].duration }}</text>
          <text class="fs-36 c-black mt-16">路线距离较短，建议步行前往</text>
          <button
            class="button fs-40 c-primary mt-48"
            hover-class="none"
            @click="handleTripModeClick(3)"
          >
            查看步行路线
          </button>
        </view>
      </template>
      <template v-if="buslines.length <= 0 && showEmpty && isDistanceLong">
        <view class="empty flex-v flex-c-c">
          <text class="fs-40 c-black">{{ tripModes[3].distance }}</text>
          <button
            class="button fs-40 c-primary mt-48"
            hover-class="none"
            @click="handleTripModeClick(0)"
          >
            查看驾车路线
          </button>
        </view>
      </template>
    </view>
    <view v-if="selectedIndex !== 1 && showEmpty" class="footer flex-v flex-c-c bg-white">
      <view class="text flex-h" v-if="tripModes[selectedIndex].duration != '暂无'">
        <text class="fs-36 c-lightgrey">全程{{ tripModes[selectedIndex].distance }}，预计</text>
        <text class="fs-44 c-black">
          {{ tripModes[selectedIndex].duration }}
        </text>
      </view>
      <view class="flex-button" v-if="selectedIndex == 0">
        <button class="button1 fs-44 c-white mt-32" @click="handleCarButtonClick">打车</button>
        <button class="button2 fs-44 c-white mt-32" @click="handleDirectButtonClick">导航</button>
      </view>
      <view v-if="selectedIndex != 0">
        <button class="button fs-44 c-white mt-32" @click="handleDirectButtonClick">
          使用地图导航
        </button>
      </view>
    </view>
    <view class="fiex-map" v-if="showEmpty && selectedIndex != 1">
      <view class="flex-map" @click="handlePosition(1)">
        <image src="http://192.168.1.187:10088/static/map/location2x.png" mode="scaleToFill" />
        <text>商户位置</text>
      </view>
      <view class="flex-map" @click="handlePosition(2)">
        <image
          src="http://192.168.1.187:10088/static/home/icon-home-locate.png"
          mode="scaleToFill"
        />
        <text>当前定位</text>
      </view>
    </view>
  </view>
</template>

<script>
import { showToast } from '@/utils/uni'
import myTabbar from './components/stzhang-tab'
export default {
  components: { myTabbar },
  data() {
    return {
      // 当前位置信息
      location: uni.getStorageSync('location'),
      // 起点和终点是否互换
      isInterchanged: false,
      // 出行方式列表
      tripModes: [
        {
          iconPath: 'http://192.168.1.187:10088/static/map/icon-map-trip-mode-driving.png',
          name: '驾车',
          distance: '',
          duration: ''
        },
        {
          iconPath: 'http://192.168.1.187:10088/static/map/icon-map-trip-mode-busing.png',
          name: '公交',
          distance: '',
          duration: ''
        },
        {
          iconPath: 'http://192.168.1.187:10088/static/map/icon-map-trip-mode-cycling.png',
          name: '骑行',
          distance: '',
          duration: ''
        },
        {
          iconPath: 'http://192.168.1.187:10088/static/map/icon-map-trip-mode-walking.png',
          name: '步行',
          distance: '',
          duration: ''
        }
      ],
      // 出行方式选中的下标
      selectedIndex: 1,
      // 下划线
      modelData: [{ label: '' }, { label: '' }, { label: '' }, { label: '' }],
      // 下划线下标
      initIndex: 1,
      // 起点信息
      origin: {},
      // 终点信息
      destination: {},
      // 路线信息
      polylines: [[], [], [], []],
      // 公交线路信息
      buslines: [],
      // 判断是否是空状态页面
      showEmpty: true,
      // 判断是否终点可点击
      isDestinationClick: false,
      // 判断是否距离过远
      isDistanceLong: false
    }
  },
  computed: {
    // 标记点
    markers() {
      console.log('生成markers')
      if (this.origin.latitude && this.destination.latitude) {
        return [
          {
            id: 0,
            iconPath: 'http://192.168.1.187:10088/static/map/icon-map-direction-origin.png',
            width: 15,
            height: 15,
            ...this.origin
          },
          {
            id: 1,
            iconPath: 'http://192.168.1.187:10088/static/map/icon-map-direction-destination.png',
            width: 47,
            height: 54,
            ...this.destination
          }
        ]
      } else if (this.origin.latitude) {
        return [
          {
            id: 0,
            iconPath: 'http://192.168.1.187:10088/static/map/icon-map-direction-origin.png',
            width: 15,
            height: 15,
            ...this.origin
          }
        ]
      } else if (this.destination.latitude) {
        return [
          {
            id: 1,
            iconPath: 'http://192.168.1.187:10088/static/map/icon-map-direction-destination.png',
            width: 47,
            height: 54,
            ...this.destination
          }
        ]
      }
    },
    // 缩放视野以包含所有给定的坐标点
    includePoints() {
      const polyline = this.polylines[this.selectedIndex]
      const points = polyline && polyline.length > 0 ? polyline[0].points : []
      if (points && this.origin.latitude & this.destination.latitude) {
        return [...points, this.origin, this.destination]
      }
    }
  },
  onLoad(e) {
    // #ifdef MP-ALIPAY
    if (e.empt) {
      const data = {
        empty: true
      }
      this.handleDidOpenPageFinish(data)
    }
    if (e.data) {
      const data = JSON.parse(decodeURIComponent(e.data))
      this.handleDidOpenPageFinish(data)
    }
    // #endif
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('didOpenPageFinish', this.handleDidOpenPageFinish)
    if (e.data) {
      const data = JSON.parse(decodeURIComponent(e.data))
      if (data) {
        this.handleDidOpenPageFinish(data)
      }
    }

    console.log('执行onload')
  },
  onShow() {
    uni.$on('didLocationSearchFinish', this.handleLocationSearchFinish)
  },
  watch: {
    selectedIndex(newVal, oldVal) {
      this.initIndex = newVal
    },
    origin(n, o) {
      console.log('n', n)
      console.log('o', o)
    }
  },
  methods: {
    handleDidOpenPageFinish(data) {
      console.log('传入的数据：', data)
      const location = uni.getStorageSync('location')
      this.origin = {
        name: '我的位置',
        longitude: location.longitude,
        latitude: location.latitude
      }
      console.log('this.origin:', this.origin)
      // 空状态路线页面
      if (data.empty) {
        this.showEmpty = false
        this.isDestinationClick = true
        this.destination = {
          name: ''
        }
      } else {
        this.destination = data
        this.calculateRoutes()
        if (this.isDistance(data.distance)) {
          this.handleTripModeClick(3)
        } else {
          this.handleTripModeClick(1)
        }
      }
    },
    /**
       * 地图选点完成回调
       */
    handleLocationSearchFinish(item) {
      console.log(item, '回调了啊111')
      if (this.isInterchanged) {
        this.destination = {
          name: item.name,
          longitude: item.longitude,
          latitude: item.latitude,
          address: item.address
        }
      } else {
        // 终点选址回调
        if (item.isDestination) {
          this.showEmpty = true
          this.destination = {
            name: item.name,
            longitude: item.longitude,
            latitude: item.latitude,
            address: item.address
          }
          this.handleTripModeClick(0)
        } else {
          this.origin = {
            name: item.name,
            longitude: item.longitude,
            latitude: item.latitude,
            address: item.address
          }
        }
      }

      this.calculateRoutes()
    },
    /**
       * 起点 or 终点点击事件
       */
    handleOriginClick() {
      if (!this.showEmpty) {
        // 空状态不能点击
        return
      }
      uni.navigateTo({
        url: '/pages/map/location-search'
      })
    },
    /**
       * 起点 or 终点点击事件
       */
    handleDestinationClick() {
      // 路线进来不带数据可以点击终点位置,否则不能点击
      if (!this.isDestinationClick) {
        return
      }
      uni.navigateTo({
        url: '/pages/map/location-search?destination=true',
        success: (res) => {
          res.eventChannel.emit('didOpenPageFinish', {
            destination: true
          })
        }
      })
    },
    /**
       * 起点终点互换点击事件
       */
    handleInterchangeClick() {
      this.isInterchanged = !this.isInterchanged;
      // 起点和终点信息互换
      [this.origin, this.destination] = [this.destination, this.origin]
      // 重新计算路线信息
      this.calculateRoutes()
    },
    /**
       * 出行方式点击事件
       */
    handleTripModeClick(index) {
      if (index === this.selectedIndex) return
      this.selectedIndex = index
    },
    /**
       * 公交路线点击事件
       */
    handleBuslineClick(index) {
      const data = {
        buslines: this.buslines,
        index: index,
        origin: this.origin,
        destination: this.destination
      }
      uni.setStorageSync('busline', data)
      uni.navigateTo({
        url: '/pages/map/busline',
        success: (res) => {
          res.eventChannel.emit('didOpenPageFinish-busline', data)
        }
      })
    },
    /**
       * 打车按钮点击事件
       */
    handleCarButtonClick() {
      showToast({
        title: '功能建设中，敬请期待'
      })
    },
    /**
       * 导航按钮点击事件
       */
    handleDirectButtonClick() {
      const point = this.isInterchanged ? this.origin : this.destination
      uni.openLocation(point)

      console.log('====外部去导航---', point)
      console.log('====外部导航---', Object.values(point))
    },
    /**
       * 计算各出行方式路线信息
       */
    calculateRoutes() {
      this.calculateDrivingRoute()
      this.calculateBusingRoute()
      this.calculateCyclingRoute()
      this.calculateWalkingRoute()
    },
    /**
       * 计算驾车路线信息
       */
    calculateDrivingRoute() {
      const origin = `${this.origin.longitude},${this.origin.latitude}`
      const destination = `${this.destination.longitude},${this.destination.latitude}`
      // 调用高德地图 API 所需的参数
      const parameters = [
        { key: 'key', value: '0e35e6dc56aec0c0841e7f6c82879aa3' },
        { key: 'origin', value: origin },
        { key: 'destination', value: destination }
      ]
        .map((item) => `${item.key}=${item.value}`)
        .join('&')
      uni.request({
        url: `https://restapi.amap.com/v3/direction/driving?${parameters}`,
        success: (res) => {
          const paths = res.data.route.paths

          // 距离
          if (paths[0].distance > 1000) {
            const distance = (paths[0].distance / 1000).toFixed(1)
            this.tripModes[0].distance = `${distance}公里`
          } else {
            this.tripModes[0].distance = `${paths[0].distance}米`
          }

          // 时长
          const duration = Math.ceil(paths[0].duration / 60)
          if (duration >= 60) {
            this.tripModes[0].duration = `${this.toHourMinute(duration)}`
          } else {
            this.tripModes[0].duration = `${duration}分钟`
          }

          // 路线上的点
          const points = res.data.route.paths[0].steps
            .map((item) => item.polyline)
            .join('')
            .split(';')
            .map((item) => {
              const location = item.split(',')
              return {
                longitude: parseFloat(location[0]),
                latitude: parseFloat(location[1])
              }
            })
          this.polylines.splice(0, 1, [
            {
              points: points,
              color: '#0078F7',
              width: 10,
              arrowLine: true
            }
          ])
        }
      })
    },
    /**
       * 计算公交路线信息
       */
    calculateBusingRoute() {
      const origin = `${this.origin.longitude},${this.origin.latitude}`
      const destination = `${this.destination.longitude},${this.destination.latitude}`
      // 调用高德地图 API 所需的参数
      const parameters = [
        { key: 'key', value: '0e35e6dc56aec0c0841e7f6c82879aa3' },
        { key: 'origin', value: origin },
        { key: 'destination', value: destination },
        { key: 'city', value: uni.getStorageSync('city').name }
      ]
        .map((item) => `${item.key}=${item.value}`)
        .join('&')
      uni.request({
        url: `https://restapi.amap.com/v3/direction/transit/integrated?${parameters}`,
        success: (res) => {
          console.log(res, '公交车路线')
          // 当状态是0的时候距离太远
          if (res.data.status == '0') {
            this.tripModes[3].distance = '当前路线较远，请更换出行方式'
            this.tripModes[1].duration = '暂无'
            this.isDistanceLong = true
            return
          }
          const route = res.data.route
          this.buslines = route.transits
          console.log(this.buslines, 'this.buslines')
          if (this.buslines.length === 0) {
            this.tripModes[1].duration = '暂无'
            return
          }

          this.buslines.forEach((busline) => (busline.tags = []))

          // 计算最短时间
          // item = this.buslines.reduce((p, v) => {
          //   return p.duration < v.duration ? p : v;
          // });

          this.buslines = route.transits.sort((prve, next) => {
            const valueN = prve['duration']
            const valueM = next['duration']
            if (valueN < valueM) return -1
            else if (valueN > valueM) return 1
            else return 0
          })
          // this.buslines.sort(this.objectArraySort('duration'))
          console.log('时间最短排行', this.buslines)
          this.buslines[0].tags.push('时间最短')
          // 计算换乘最少

          // //是否换乘最少(为true则不是)
          // let transfer =  this.buslines.some((busline)=>{
          //     return busline.segments.length < this.buslines[0].segments.length
          // })
          // //是否步行最少(为true则不是)
          // let walk =  this.buslines.some((busline)=>{
          //     return busline.walking_distance < this.buslines[0].walking_distance
          // })

          // 换乘最少
          let item = {}
          item = this.buslines.reduce((p, v) => {
            return p.segments.length <= v.segments.length ? p : v
          })
          item.tags.push('换乘最少')

          // 步行最少
          let walkItem = {}
          walkItem = this.buslines.reduce((p, v) => {
            console.log('p.walking_distance:', typeof p.walking_distance)
            console.log('v.walking_distance:', typeof v.walking_distance)
            console.log('bollen', p.walking_distance <= v.walking_distance)
            return Number(p.walking_distance) <= Number(v.walking_distance) ? p : v
          })
          console.log('步行最少的walkItem：', walkItem)
          walkItem.tags.push('步行最少')

          let transferIndex = 0
          this.buslines.map((item, index) => {
            if (item.tags.indexOf('换乘最少') > -1) {
              if (index > 1) {
                this.buslines.splice(index, 1)
                this.buslines.splice(1, 0, item)
                transferIndex = 1
              } else {
                transferIndex = index
              }
              console.log('换乘最少索引：', index)
            }
          })
          this.buslines.map((item, index) => {
            if (item.tags.indexOf('步行最少') > -1) {
              if (transferIndex == 0 && index > 1) {
                this.buslines.splice(index, 1)
                this.buslines.splice(1, 0, item)
              } else if (transferIndex == 1 && index > 1) {
                this.buslines.splice(index, 2)
                this.buslines.splice(2, 0, item)
              }
              console.log('步行最少索引：', index)
            }
          })

          // if(!transfer && !walk){
          //   this.buslines[0].tags.push("换乘最少").push("步行最少");
          // }else if(!transfer && walk){
          //   this.buslines[0].tags.push("换乘最少");

          // }else if(transfer && !walk){
          //   item = this.buslines.reduce((p, v) => {
          //     return p.segments.length <= v.segments.length ? p : v;
          //   });
          //   item.tags.push("换乘最少");
          //   this.buslines[0].tags.push("步行最少");
          // }else if(transfer && walk){
          //   item = this.buslines.reduce((p, v) => {
          //     return p.segments.length <= v.segments.length ? p : v;
          //   });
          //   item.tags.push("换乘最少");
          // 步行最少
          // walkItem = this.buslines.reduce((p, v) => {
          //         console.log("p.walking_distance:",p.walking_distance)
          //         console.log("v.walking_distance:",v.walking_distance)
          //   return p.walking_distance <= v.walking_distance ? p : v;
          // });
          // console.log("步行最少的walkItem：",walkItem)
          // walkItem.tags.push("步行最少");
          // }

          // const isUnique = this.buslines.every((busline) => {
          //   return busline.segments.length < item.segments.length;
          // });
          // isUnique && item.tags.push("换乘最少");

          // 步行最少
          // item = this.buslines.reduce((p, v) => {
          //          console.log("p.walking_distance:",p.walking_distance)
          //          console.log("v.walking_distance:",v.walking_distance)
          //   return p.walking_distance <= v.walking_distance ? p : v;
          // });
          // console.log("步行最少的item：",item)
          // item.tags.push("步行最少");

          // 距离
          // if (route.distance > 1000) {
          //   const distance = (route.distance / 1000).toFixed(1);
          //   this.tripModes[1].distance = `${distance}公里`;
          // } else {
          //   this.tripModes[1].distance = `${route.distance}米`;
          // }

          // 时长
          const duration = Math.ceil(this.buslines[0].duration / 60)
          if (duration >= 60) {
            this.tripModes[1].duration = `${this.toHourMinute(duration)}`
          } else {
            this.tripModes[1].duration = `${duration}分钟`
          }

          this.buslines.forEach((item) => {
            // 距离
            if (item.walking_distance > 1000) {
              const walkingDistance = (item.walking_distance / 1000).toFixed(1)
              item.walking_distance = `${walkingDistance}公里`
            } else {
              item.walking_distance = `${item.walking_distance}米`
            }

            // 时长
            const duration = Math.ceil(item.duration / 60)
            item.duration = `${duration}分钟`

            // 公交线路名称
            item.buslines = []
            item.segments.forEach((segment) => {
              const buslines = segment.bus.buslines
              if (buslines.length > 0) {
                const name = buslines
                  .map((busline) => {
                    return busline.name.replace(/\(.*?\)/g, '')
                  })
                  .join('/')
                item.buslines.push(name)
              }
            })
          })

          // 路线上的点
          this.polylines.splice(1, 1, [
            {
              points: [this.origin, this.destination],
              color: '#00000000',
              width: 10,
              arrowLine: true
            }
          ])
        }
      })
    },
    /**
       * 获取步行最少
       */
    /**
       * 对对象中的某个字段进行排序
       */
    objectArraySort(keyName) {
      return (objectN, objectM) => {
        var valueN = objectN[keyName]
        var valueM = objectM[keyName]
        if (valueN < valueM) return -1
        else if (valueN > valueM) return 1
        else return 0
      }
    },
    /**
       * 计算骑行路线信息
       */
    calculateCyclingRoute() {
      const origin = `${this.origin.longitude},${this.origin.latitude}`
      const destination = `${this.destination.longitude},${this.destination.latitude}`
      // 调用高德地图 API 所需的参数
      const parameters = [
        { key: 'key', value: '0e35e6dc56aec0c0841e7f6c82879aa3' },
        { key: 'origin', value: origin },
        { key: 'destination', value: destination }
      ]
        .map((item) => `${item.key}=${item.value}`)
        .join('&')
      uni.request({
        url: `https://restapi.amap.com/v4/direction/bicycling?${parameters}`,
        success: (res) => {
          const paths = res.data.data.paths

          // 距离
          if (paths[0].distance > 1000) {
            const distance = (paths[0].distance / 1000).toFixed(1)
            this.tripModes[2].distance = `${distance}公里`
          } else {
            this.tripModes[2].distance = `${paths[0].distance}米`
          }

          // 时长
          const duration = Math.ceil(paths[0].duration / 60)
          if (duration >= 60) {
            this.tripModes[2].duration = `${this.toHourMinute(duration)}`
          } else {
            this.tripModes[2].duration = `${duration}分钟`
          }

          // 路线上的点
          const points = res.data.data.paths[0].steps
            .map((item) => item.polyline)
            .join('')
            .split(';')
            .map((item) => {
              const location = item.split(',')
              return {
                longitude: parseFloat(location[0]),
                latitude: parseFloat(location[1])
              }
            })
          this.polylines.splice(2, 1, [
            {
              points: points,
              color: '#0078F7',
              width: 10,
              arrowLine: true
            }
          ])
        }
      })
    },
    /**
       * 计算步行路线信息
       */
    calculateWalkingRoute() {
      const origin = `${this.origin.longitude},${this.origin.latitude}`
      const destination = `${this.destination.longitude},${this.destination.latitude}`
      // 调用高德地图 API 所需的参数
      const parameters = [
        { key: 'key', value: '0e35e6dc56aec0c0841e7f6c82879aa3' },
        { key: 'origin', value: origin },
        { key: 'destination', value: destination }
      ]
        .map((item) => `${item.key}=${item.value}`)
        .join('&')
      uni.request({
        url: `https://restapi.amap.com/v3/direction/walking?${parameters}`,
        success: (res) => {
          console.log(res, '步行')
          if (res.data.status == '0') {
            this.tripModes[3].duration = '暂无'
            return
          }
          const paths = res.data.route.paths
          // 距离
          if (paths[0].distance > 1000) {
            const distance = (paths[0].distance / 1000).toFixed(1)
            this.tripModes[3].distance = `${distance}公里`
          } else {
            this.tripModes[3].distance = `${paths[0].distance}米`
          }

          // 时长
          const duration = Math.ceil(paths[0].duration / 60)
          if (duration >= 60) {
            this.tripModes[3].duration = `${this.toHourMinute(duration)}`
          } else {
            this.tripModes[3].duration = `${duration}分钟`
          }

          // 路线上的点
          const points = res.data.route.paths[0].steps
            .map((item) => item.polyline)
            .join('')
            .split(';')
            .map((item) => {
              const location = item.split(',')
              return {
                longitude: parseFloat(location[0]),
                latitude: parseFloat(location[1])
              }
            })
          this.polylines.splice(3, 1, [
            {
              points: points,
              color: '#0078F7',
              width: 10,
              arrowLine: true
            }
          ])
        }
      })
    },
    /*
       * 商户定位和当前定位方法
       */
    handlePosition(index) {
      const mapConext = uni.createMapContext('map', this)
      switch (index) {
        case 1:
          console.log(this.destination)
          mapConext.moveToLocation({
            latitude: this.destination.latitude,
            longitude: this.destination.longitude,
            success: (res) => {},
            fail: (res) => {}
          })
          break
        case 2:
          mapConext.moveToLocation({
            latitude: this.origin.latitude,
            longitude: this.origin.longitude,
            success: (res) => {},
            fail: (res) => {}
          })
          break
        default:
          break
      }
    },
    /*
       *分钟转换成小时
       */
    toHourMinute(minutes) {
      return Math.floor(minutes / 60) + '小时' + (minutes % 60) + '分钟'
      // 也可以转换为json，以方便专外部使用属
      // return {hour:Math.floor(minutes/60),minute:(minutes%60)};
    },
    /*
       * 判断是否小于1000米
       */
    isDistance(str) {
      console.log('str:', str)
      const arr = (str + '').split('')
      if (arr[arr.length - 1] == '米') {
        arr.pop()
        if (arr.join('') - 0 < 1000) {
          return true
        } else {
          return false
        }
      }
    }
  },
  onUnload() {
    // console.log()
  },
  destroyed() {
    console.log('页面销毁')
  }
}
</script>

<style lang="scss" scoped>
  .direction {
    min-height: 100vh;
    background: #fbf9f7;
    .map-view {
      position: fixed;
      top: 306rpx;
      width: 100vw;
      height: calc(100vh - 560rpx);
    }
    .header {
      position: fixed;
      top: 0;
      width: 100vw;
      // height: 290rpx;
      .origin-destination-info {
        height: 160rpx;
        .indicator {
          height: 96rpx;
          .green-dot {
            @include square(16);
            background: #12b362;
          }
          .dash-line {
            @include size(4, 48);
          }
          .red-dot {
            @include square(16);
            background: #f54743;
          }
        }
        .info {
          position: relative;
          height: 100%;
          .row {
            position: absolute;
            left: 0;
            width: calc(100% - 48rpx);
            height: 72rpx;
            line-height: 72rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .selectable {
            background: #eeeeee;
          }
          .top {
            top: 4rpx;
          }
          .bottom {
            top: 84rpx;
          }
        }
        .interchange-icon {
          @include square(40);
        }
      }
      .trip-mode {
        height: 120rpx;
        // padding-top: 20rpx;
        .mode {
          .icon {
            @include square(40);
          }
        }
      }
    }
    .buslines {
      .item {
        .info {
          .tags {
            .tag {
              display: inline-block;
              line-height: 36rpx;
              color: #12b362;
              border: 2rpx solid #12b362;
            }
          }
          .line-info {
            .line-icon {
              @include size(12, 20);
            }
          }
        }
        .accessory {
          @include square(48);
        }
      }
      .empty {
        height: calc(100vh - 560rpx);
        .button {
          @include size(340, 72);
          line-height: 72rpx;
          border-radius: 36rpx;
          border: 2rpx solid $color-primary;
          box-sizing: border-box;
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 280rpx;
      .text {
        align-items: flex-end;
      }
      .flex-button {
        display: flex;
        padding: 0 30rpx 0 30rpx;
      }
      .button1 {
        width: 350rpx;
        height: 108rpx;
        line-height: 100rpx;
        border-radius: 54rpx;
        margin-left: 20rpx;
        background: #fff;
        border: 2rpx solid $color-primary;
        color: red;
      }
      .button2 {
        width: 350rpx;
        height: 108rpx;
        line-height: 108rpx;
        border-radius: 54rpx;
        margin-left: 20rpx;
        background: linear-gradient(to right, $color-secondary, $color-primary);
      }
      .button {
        width: 600rpx;
        height: 108rpx;
        line-height: 108rpx;
        border-radius: 54rpx;
        background: linear-gradient(to right, $color-secondary, $color-primary);
      }
    }
  }
  .duration {
    width: 180rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-wrap: break-word;
    white-space: normal !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-align: center;
  }
  .duration-size {
    font-size: 32rpx;
  }
  .fiex-map {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 100;
    right: 32rpx;
    bottom: 400rpx;
    // width: 200rpx;
    // height: 100rpx;
    .flex-map {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      // margin-top: 25rpx;
      border-radius: 10rpx;
      // padding: 15rpx;
      box-sizing: border-box;
      box-shadow: 0px 0px 4rpx rgb(238, 235, 235);
      white-space: nowrap;
      width: 180rpx;
      height: 70rpx;
      overflow: auto;
      margin-bottom: 29rpx;
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .tab {
    width: 100%;
    height: 50rpx;
    background: #fff;
  }
</style>
