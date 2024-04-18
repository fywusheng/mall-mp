<template>
  <view class="location-search">
    <view class="search-view flex-h flex-c-b bg-white p-0-32">
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <input
          v-model="keyword"
          class="search-bar__input fs-36 c-black flex-1"
          placeholder="搜索地点"
        />
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon ml-8"
          src="http://192.168.1.187:10088/static/common/icon-common-input-clear.png"
          @click="keyword = ''"
        />
      </view>
      <button
        v-if="keyword"
        class="cancel-button fs-36 c-black ml-24"
        hover-class="none"
        @click="keyword = ''"
      >
        取消
      </button>
    </view>
    <view style="width: 100vw; height: 112rpx"></view>
    <view class="list" v-if="keyword">
      <view class="item flex-h bg-white" v-for="(item, index) in list" :key="index">
        <image
          class="icon mt-12"
          src="http://192.168.1.187:10088/static/map/location2x.png"
          mode="scaleToFill"
        />
        <view class="ml-24 flex-v flex-1" @click="handleBackDirection(item)">
          <!-- <wxparser :rich-text="getHighline(item.name)" /> -->
          <rich-text :nodes="item.lastName"></rich-text>
          <text class="name fs-36 mb-8"></text>
          <text class="info fs-36 c-lightgrey mb-8">
            {{ item.address }}
          </text>
          <text class="distance fs-36 c-lightgrey mb-8" v-if="item.distance != 0">
            距离您：{{ item.distance | setDistance }}
          </text>
        </view>
      </view>
    </view>
    <!-- <template v-if="keyword">
      <view class="list bg-white mt-12">
        <view
          class="item p-24 flex-v"
          v-for="index in 20"
          :key="index"
          @click="handleListItemClick(index)"
        >
          <view class="flex-h flex-c-s">
            <image class="address-icon" src="http://192.168.1.187:10088/static/logo.png" />
            <text class="address-text fs-36 c-black ml-16">
              骏豪·中央公园广场
            </text>
          </view>
          <view class="flex-h flex-c-s mt-8">
            <view class="address-icon" />
            <text class="address-text fs-36 c-lightgrey ml-16">
              三里屯 工体北路8号院三里屯SOHO吧啦吧啦
            </text>
          </view>
          <view class="flex-h flex-c-s mt-8">
            <view class="address-icon" />
            <text class="address-text fs-36 c-lightgrey ml-16">
              距离您：6.6公里
            </text>
          </view>
        </view>
      </view>
    </template> -->
    <template v-else>
      <view
        class="current-location m-32 p-0-24 flex-h flex-c-s bg-white br-16"
        @click="handleCurrentLocationClick"
        v-if="!isDestination"
      >
        <image
          class="location-icon"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/map/location2x.png"
        />
        <text class="fs-36 c-black ml-16">我的位置</text>
      </view>
      <view v-if="searchHistories.length > 0" class="list history bg-white br-16">
        <view class="header flex-h flex-c-s p-0-24">
          <text class="fs-36 c-black">历史选点</text>
        </view>
        <view
          class="item p-24 flex-v"
          v-for="(history, hIndex) in searchHistories"
          :key="hIndex"
          @click="handleSearchHistoryItemClick(hIndex)"
        >
          <view class="flex-h flex-c-s">
            <image
              class="address-icon"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/logo.png"
            />
            <text class="address-text fs-36 c-black ml-16">
              {{ item.name }}
            </text>
          </view>
          <view class="flex-h flex-c-s mt-8">
            <view class="address-icon" />
            <text class="address-text fs-36 c-lightgrey ml-16">
              {{ item.address }}
            </text>
          </view>
        </view>
        <view class="footer flex-h flex-c-c" @click="handleClearClick">
          <image
            class="clear-icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/logo.png"
          />
          <text class="fs-36 c-lightgrey ml-12">清空历史选点</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import api from '@/apis/index.js'
export default {
  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 最近搜索列表
      searchHistories: uni.getStorageSync('locationSearchHistories') || [],
      // 搜索结果列表

      list: [],
      // 当前位置信息
      location: uni.getStorageSync('location') || {},
      // 是否是终点的改变位置
      isDestination: false,
      // 当前城市code
      citycode: '',
      baseList: [
        {
          serviceOrder: '0',
          serviceName: '全部',
          code: '060100|060200|060300|060400|061200|050000|110000|090100|090100|090200|090300|090400|090500|090600|100000|130000',
          distance: '20000',
          des: '',
          amapDes:
              '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店|餐饮服务|风景名胜|医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构|医药保健销售店|住宿服务|政府机构及社会团体',
          prepareIndex: -1
        },
        {
          serviceOrder: '1', // 对应菜单serviceOrder
          serviceName: '助餐点', // 对应菜单名称
          code: '',
          distance: '20000', // 搜索范围
          des: '助餐点', // 我方地图接口参数
          amapDes: '', // 高德地图所需参数
          prepareIndex: -1
        },
        {
          serviceOrder: '2',
          serviceName: '日间照料',
          code: '',
          distance: '20000',
          des: '日间照料',
          amapDes: '',
          prepareIndex: -1
        },
        {
          serviceOrder: '3',
          serviceName: '商超',
          code: '060100|060200|060300|060400|061200',
          distance: '20000',
          des: '商超',
          amapDes: '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店',
          prepareIndex: 1
        },
        {
          serviceOrder: '4',
          serviceName: '美食',
          code: '050000',
          distance: '20000',
          des: '美食',
          amapDes: '餐饮服务',
          prepareIndex: 0
        },
        {
          serviceOrder: '5',
          serviceName: '景点',
          code: '110000',
          distance: '50000',
          des: '景点',
          amapDes: '风景名胜',
          prepareIndex: 0
        },
        {
          serviceOrder: '6',
          serviceName: '医院',
          code: '090100|090100|090200|090300|090400|090500',
          distance: '20000',
          des: '医院',
          amapDes: '医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构',
          prepareIndex: 1
        },
        {
          serviceOrder: '7',
          serviceName: '药店',
          code: '090600',
          distance: '20000',
          des: '药店',
          amapDes: '医药保健销售店',
          prepareIndex: 1
        },
        {
          serviceOrder: '8',
          serviceName: '住宿',
          code: '100000',
          distance: '20000',
          des: '住宿',
          amapDes: '住宿服务',
          prepareIndex: 0
        },
        {
          serviceOrder: '9',
          serviceName: '政务服务',
          code: '130000',
          distance: '20000',
          des: '政务服务',
          amapDes: '政府机构及社会团体',
          prepareIndex: 0
        },
        {
          serviceOrder: '10',
          serviceName: '养老院',
          code: '',
          distance: '20000',
          des: '养老院',
          amapDes: '',
          prepareIndex: -1
        }
      ]
    }
  },
  watch: {
    /**
       * 搜索框检索事件根据keyword变化立马检索
       */
    async keyword(newVal, oldVal) {
      const ownMarkers = await this.getAroundApi()
      const gdMarkers = await this.getAround()

      // 获取数据后先去重后再进行排序
      const arry = [...ownMarkers, ...gdMarkers]

      // 去重
      const hash = {}
      const newArray = arry.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
        return item
      }, [])

      // 排序
      newArray.sort((m, n) => {
        var a = m['distance']
        var b = n['distance']
        return a - b // 升序
      })
      this.list = newArray.slice(0, 25)
      console.log('this.list:', this.list)
      this.list.map((item, index) => {
        const arr = this.list[index]['name'].split(this.keyword)
        const nameArr = []
        arr.map((item, index) => {
          if (index < arr.length - 1) {
            nameArr.push({
              name: 'span',
              children: [
                {
                  type: 'text',
                  text: item
                }
              ]
            })
            nameArr.push({
              name: 'span',
              attrs: {
                style: 'color:red'
              },
              children: [
                {
                  type: 'text',
                  text: this.keyword
                }
              ]
            })
          } else {
            nameArr.push({
              name: 'span',
              children: [
                {
                  type: 'text',
                  text: item
                }
              ]
            })
          }
        })
        this.list[index]['lastName'] = nameArr
      })
    }
  },
  onLoad(e) {
    this.getLocation()
    // #ifdef MP-ALIPAY
    if (e.destination) {
      this.isDestination = true
    }
    // #endif
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('didOpenPageFinish', (data) => {
      console.log(data, '参数')
      // 当是终点点击进来的时候改变终点的位置
      if (data.destination) {
        this.isDestination = true
      }
    })
  },
  methods: {
    // 获取当前定位信息和当前城市
    getLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.setStorageSync('location', res)
          // 调用高德地图 API 逆地理编码, 通过经纬度获取当前位置城市信息
          api.regeoMap(
            {
              location: res.longitude + ',' + res.latitude
            },
            {
              success: (res) => {
                this.citycode = res.regeocode.addressComponent.adcode.citycode
              }
            }
          )
        }
      })
    },
    /*
       * 改变初始位置,返回到路线
       */
    handleBackDirection(item) {
      console.log(this.isDestination)
      let data = {}
      if (this.isDestination) {
        data = {
          latitude: item.latitude - 0,
          longitude: item.longitude - 0,
          name: item.name,
          isDestination: true,
          address: item.address
        }
      } else {
        data = {
          latitude: item.latitude - 0,
          longitude: item.longitude - 0,
          name: item.name,
          address: item.address
        }
      }
      this.navigateBack(data)
    },
    /**
       * 我的位置点击事件
       */
    handleCurrentLocationClick() {
      console.log(uni.getStorageSync('location'))
      this.navigateBack({
        name: '我的位置',
        ...uni.getStorageSync('location')
      })
    },
    /**
       * 清空点击事件
       */
    handleClearClick() {
      this.$uni.showConfirm({
        content: '是否清除最近访问记录',
        confirm: () => {
          uni.removeStorageSync('locationSearchHistories')
          this.searchHistories = []
        }
      })
    },
    /**
       * 最近搜索点击事件
       */
    handleSearchHistoryItemClick(item) {
      this.addToHistory(item)
    },
    /**
       * 查看地点点击事件
       */
    handleListItemClick(index) {
      const item = {
        id: 0,
        name: '日坛公园',
        latitude: 39.915538,
        longitude: 116.443795,
        iconPath: 'http://192.168.1.187:10088/static/map/marker-icon4.png',
        width: 47,
        height: 52
      }
      this.navigateBack(item)
    },
    /**
       * 添加到最近搜索
       */
    addToHistory(item) {
      const array = [...this.searchHistories]
      array.unshift(item)
      this.searchHistories = Array.from(new Set(array)).slice(0, 50)
      uni.setStorageSync('locationSearchHistories', this.searchHistories)
    },
    /*
       *  高德搜索周边api
       */
    getAround() {
      console.log('调用高德接口')
      return new Promise((resolve, reject) => {
        const latitude = this.location['latitude']
        const longitude = this.location['longitude']
        api.aroundMap(
          {
            location: `${latitude},${longitude}`,
            keywords: this.keyword ? this.keyword : '',
            city: this.citycode,
            types:
                '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店|餐饮服务|风景名胜|医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构|医药保健销售店|住宿服务|政府机构及社会团体',
            radius: 20000,
            offset: 25
          },
          {
            success: (res) => {
              // 遍历高德的数据
              const arry = []

              res.pois.map((item, index) => {
                arry.push({
                  latitude: item.location.split(',')[1] - 0,
                  longitude: item.location.split(',')[0] - 0,
                  name: item.name,
                  address: item.address,
                  distance: item.distance
                })
              })
              resolve(arry)
              // console.log('====最终数据===', arry)
            },
            fail(err) {
              uni.showToast({
                title: err.errMsg
              })
              reject([])
            }
          }
        )
      })
    },
    /*
       * 本地接口获取周边
       */
    getAroundApi() {
      return new Promise((resolve, reject) => {
        const arry = []
        api.getEcOrgOfficeInfoByPoint({
          data: {
            orgOfficeType: '', // 场所类型,
            // areaCode:this.mapCity,
            orgOfficeLat: this.location.latitude,
            orgOfficeLon: this.location.longitude,
            orgOfficeName: this.keyword,
            distance: 20, // 搜索半径,
            size: 25
          },
          success: (data) => {
            data.forEach((item, index) => {
              const obj = {
                orgOfficeId: item.orgOfficeId,
                latitude: item.orgOfficeLat,
                longitude: item.orgOfficeLon,
                name: item.orgOfficeName,
                distance: item.distance * 1000,
                address: item.orgOfficeAddrDetail
              }
              arry.push(obj)
            })

            console.log('==arry==', arry)
            resolve(arry)
          },
          fail: (err) => {
            console.log('请求分类数据失败=', err)
            uni.showToast(err.message)
            reject([])
          }
        })
      })
    },
    /**
       * 返回到上一级页面
       */
    navigateBack(item) {
      uni.$emit('didLocationSearchFinish', item)
      console.log('返回到上一级页面===', item)
      uni.navigateBack({
        success: () => {
          console.log('执行了success')
          // uni.$emit('didLocationSearchFinish', item)
        },
        complete: () => {
          console.log('执行了complete')
          //  #ifdef MP-ALIPAY
          // uni.$emit('didLocationSearchFinish', item)
          //  #endif
        }
      })
    },
    /**
       * 列表判断同名高亮显示
       */
    getHighline(str) {
      return str.replace(
        new RegExp(this.keyword, 'g'),
        `<text style="color: red;display:inline">${this.keyword}</text>`
      )
    },
    /**
       * 返回单位km  lat:纬度  lng：经度
       */
    getDistance(lat1, lng1, lat2, lng2) {
      if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
        return '不能计算'
      }
      if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
        return '不能计算'
      }
      var radLat1 = this.rad(lat1)
      var radLat2 = this.rad(lat2)
      var a = radLat1 - radLat2
      var b = this.rad(lng1) - this.rad(lng2)
      var s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
            )
          )
      s = s * 6378.137 // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000
      return s.toFixed(2)
    },
    /**
       * 距离计算定义方法
       */
    rad(d) {
      return (d * Math.PI) / 180.0
    }
  },
  filters: {
    setDistance(s) {
      s = Number(s / 1000)
      if (s.toFixed(2) < 1) {
        return s.toFixed(2) * 1000 + '米'
      } else {
        return s.toFixed(2) + '公里'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .location-search {
    min-height: 100vh;
    background: #fbf9f7;
    .search-view {
      position: fixed;
      top: 0;
      width: calc(100vw - 64rpx);
      height: 112rpx;
      border-bottom: 2rpx solid #eeeeee;
      .search-bar {
        height: 80rpx;
        border-radius: 40rpx;
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
        &__input {
          line-height: 80rpx;
        }
        &__icon {
          @include square(32);
          border-radius: 16rpx;
        }
      }
    }
    .current-location {
      height: 96rpx;
      .location-icon {
        @include square(32);
      }
    }
    .list {
      .header {
        height: 88rpx;
        border-bottom: 2rpx solid #eeeeee;
      }
      .item {
        border-bottom: 2rpx solid #eeeeee;
        .address-icon {
          @include square(32);
        }
        .address-text {
          @include text-line(1);
        }
      }
      .footer {
        height: 80rpx;
        .clear-icon {
          @include square(40);
        }
      }
      .item {
        padding: 20rpx 32rpx 16rpx;
        border-bottom: 2rpx solid #eeeeee;
        justify-content: flex-start;
        .icon {
          @include square(32);
        }
        .name,
        .info,
        .distance {
          @include text-line(1);
          max-width: 630rpx;
        }
        .button {
          background: rgba(0, 89, 255, 0.06);
        }
      }
    }
    .history {
      margin: 16rpx 32rpx;
    }
  }
</style>
