<template>
  <view class="hospital-list">
    <view class="filters flex-h flex-c-b bg-white">
      <view class="filter flex-h flex-c-c flex-1">
        <!-- <text class="fs-36 c-black">北京市</text>
        <image
          class="triangle-icon ml-12"
          src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
        /> -->
        <picker class="" range-key="text" :range="citys" @change="handleCounty">
          <view class="filter flex-1 flex-h flex-c-c">
            <text class="fs-36 c-black">
              {{ citys.text || '北京市' }}
            </text>
            <image
              class="triangle-icon ml-12"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
            />
          </view>
        </picker>
      </view>
      <picker class="" range-key="text" :range="counties" @change="handleCountyChange">
        <view class="filter flex-1 flex-h flex-c-c">
          <text class="fs-36 c-black">
            {{ county.text || '全部' }}
          </text>
          <image
            class="triangle-icon ml-12"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
      </picker>
      <view class="flex-1"></view>
    </view>
    <view class="blank" style="height: 92rpx" />
    <template v-if="list.length > 0">
      <view class="list">
        <view class="item flex-v mt-24 bg-white" @click="handleItemClick()">
          <view class="flex-h">
            <!-- <image class="photo" src="http://192.168.1.187:10088/static/logo.png" /> -->
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
            <view class="flex-v ml-16">
              <text class="text fs-40 fw-500 c-black" v-if="item.name">
                {{ item.name }}
              </text>
              <text class="text fs-36 fw-400 c-black mt-16" v-if="item.distance">
                距离您 {{ item.distance }}
              </text>
              <text class="text fs-36 fw-400 c-black mt-16" v-if="item.hospital_clinic">
                特色科室:{{ item.hospital_clinic }}
              </text>
              <text class="text fs-36 fw-400 c-black mt-16" v-if="item.address">
                {{ item.address }}
              </text>
            </view>
          </view>
          <view class="flex-h flex-c-b mt-24">
            <view class="flex-v flex-c-c" @click.stop="handleCarClick">
              <image
                class="icon"
                src="http://192.168.1.187:10088/static/map/icon-map-take-taxi.png"
                mode="scaleToFill"
              />
              <text class="fs-32 c-lightgrey mt-8">打车</text>
            </view>
            <view
              class="flex-v flex-c-c"
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
              <text class="fs-32 c-lightgrey mt-8">收藏</text>
            </view>
            <view class="flex-v flex-c-c">
              <image
                class="icon"
                src="http://192.168.1.187:10088/static/map/icon-map-share.png"
                mode="scaleToFill"
              />
              <text class="fs-32 c-lightgrey mt-8">分享</text>
            </view>
            <view class="route-button flex-h flex-c-c" @click.stop="handleDirectionClick(item)">
              <image
                class="icon"
                src="http://192.168.1.187:10088/static/map/icon-map-route.png"
                mode="scaleToFill"
              />
              <text class="fs-36 fw-500 c-primary ml-8">路线</text>
            </view>
            <button
              class="reserve-button fs-36 fw-500 c-white"
              @click.stop="makeToTel(item)"
              v-if="showTel(item.scenic_area_tel)"
            >
              立即预约
            </button>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="no-data flex-v flex-c-c">
        <image
          class="no-data__image"
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <text class="fs-36 c-grey mt-24">暂无数据</text>
      </view>
    </template>
    <action-sheet
      ref="actionSheet"
      title="请选择拨打电话"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
import api from '@/apis/index.js'
import ActionSheet from '@/components/common/action-sheet'
export default {
  components: { ActionSheet },
  data() {
    return {
      // 区县列表
      counties: [
        { text: '朝阳区', value: '110000' },
        { text: '东城区', value: '110000' },
        { text: '西城区', value: '110000' }
      ],
      // 选择的区县
      county: { text: '朝阳区', value: '110000' },
      // 列表数据
      list: [{}],
      // 医院id
      medical: '',

      citys: [{ text: '北京市', value: '110000' }],
      city: {},
      // 处理后的详情
      item: {},
      // 当前定位
      person: {},
      // 电话号码列表
      phoneList: [],
      // 拨打电话弹窗选项
      actionSheetItems: []
    }
  },
  onLoad(options) {
    this.medical = options.medical
    this.list = options.list
    console.log('this.medical:', options.medical)
    // this.setCounties();
    this.getLocation()
  },
  methods: {
    /**
       * 选择城市
       */
    handleCounty(e) {
      this.citys = this.citys[e.detail.value]
    },
    /**
       * 点击打车事件
       */
    handleCarClick() {
      this.$uni.showToast({
        title: '功能建设中，敬请期待'
      })
    },
    /**
       * 区县选择器选择回调
       */
    handleCountyChange(e) {
      this.county = this.counties[e.detail.value]
    },
    // 前往详情页
    handleItemClick() {
      uni.navigateTo({
        url: '/pages/map/address-detail',
        success: (res) => {
          res.eventChannel.emit('didOpenPageFinish', {
            type: 'hospital',
            item: this.item
          })
        }
      })
    },

    // 根据id获取医院信息
    getEcOrgOfficeInfoById() {
      const useInfo = uni.getStorageSync('userInfo')
      api.getOfficeInfoById({
        data: {
          orgOfficeId: this.medical,
          userId: useInfo.uactId || '' // 用户id
        },
        success: (data) => {
          const obj = {
            orgOfficeId: data.orgOfficeId,
            rid: data.rid,
            type: data.orgOfficeType,
            latitude: data.orgOfficeLat,
            longitude: data.orgOfficeLon,
            name: data.orgOfficeName,
            orgOfficeInfoDetail: data.orgOfficeInfoDetail,
            scenic_area_tel: data.orgOfficeTel,
            isCollected: data.isCollected,
            orgId: data.orgId
          }
          if (this.person.latitude) {
            obj['distance'] = this.getDistance(
              this.person.latitude,
              this.person.longitude,
              data.orgOfficeLat,
              data.orgOfficeLon
            )
          }
          if (data.orgOfficeInfoDetail) {
            const area = JSON.parse(data.orgOfficeInfoDetail.replace(/\s*/g, ''))
            obj['hospital_level'] = area.hospital_level ? area.hospital_level : ''
            obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : ''
            obj['scenic_area_rank'] = area.scenic_area_rank
            obj['scenic_area_opentime'] = area.scenic_area_opentime
            obj['scenic_area_intro'] = area.scenic_area_intro
              ? area.scenic_area_intro
              : area.hospital_intro
            if (area.scenic_area_photos) {
              obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0]
            }
          }
          this.item = obj
        }
      })
    },
    /**
       * 设置曲线列表
       */
    setCounties() {
      this.counties = [
        { text: '东城区', value: '110000' },
        { text: '西城区', value: '110000' },
        { text: '朝阳区', value: '110000' }
      ]
    },
    /**
       * 返回单位km  lat:纬度  lng：经度
       */
    getDistance(lat1, lng1, lat2, lng2) {
      if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
        return ''
      }
      if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
        return ''
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
      if (s.toFixed(2) < 1) {
        return s.toFixed(2) * 1000 + '米'
      } else {
        return s.toFixed(2) + '公里'
      }
    },
    /**
       * 距离计算定义方法
       */
    rad(d) {
      return (d * Math.PI) / 180.0
    },
    /**
       * 获取当前位置信息
       */
    getLocation() {
      console.log('获取当前位置信息')
      // 先将原有位置信息清空, 再重新定位, 位置信息发生变化, 才能将当前定位置于屏幕中心
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.setStorage({
            key: 'location',
            data: res
          })
          this.person = res
          this.getEcOrgOfficeInfoById()
        },
        fail: (err) => {
          // uni.showModal({
          //     title: '提示',
          //     content: '请确认定位相关权限已开启',
          //     showCancel:false,
          //     success: function (res) {
          //         if (res.confirm) {
          //         }
          //     }
          // });
          this.getEcOrgOfficeInfoById()
        }
      })
    },
    /**
       * 拨打电话按钮事件
       */
    makeToTel(item) {
      this.phoneList = []
      if (item.scenic_area_tel) {
        const phoneNumber = item.scenic_area_tel.replace(/\//g, ',').replace(/\;/g, ',')
        phoneNumber.split(',').forEach((item1) => {
          this.phoneList.push(item1)
        })
      } else {
        showToast({
          title: '暂无电话'
        })
        return
      }
      this.actionSheetItems = this.phoneList
      this.$refs.actionSheet.open()
    },
    /**
       * action sheet 弹窗点击回调
       */
    handleActionSheetItemClick(index) {
      uni.makePhoneCall({
        phoneNumber: this.phoneList[index]
      })
    },
    /**
       * 是否显示电话
       */
    showTel(tel) {
      if (typeof tel == 'string') {
        return true
      } else {
        return false
      }
    },
    // 导航点击事件
    handleDirectionClick() {
      const item = this.item
      console.log('item导航点击事件:', item)
      uni.navigateTo({
        url: '/pages/map/direction',
        success: (res) => {
          if (this.list === '0') {
            res.eventChannel.emit('didOpenPageFinish', {
              name: item.name,
              longitude: item.longitude - 0,
              latitude: item.latitude - 0,
              distance: item.distance
              // address: item.address,
            })
          }

          console.log('传参成功')
        },
        fail: (err) => {
          console.log('fail:', err)
        },
        complete: (res) => {
          if (this.list === '1') {
            res.eventChannel.emit('didOpenPageFinish', {
              name: item.name,
              longitude: item.longitude - 0,
              latitude: item.latitude - 0,
              distance: item.distance
              // address: item.address,
            })
          }
          console.log('complete:', res)
        }
      })
    },
    /**
       * 点击收藏
       */
    handleCollected(item) {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      if (item.isCollected == 0) {
        api.saveCollect({
          data: {
            colId: item.orgOfficeId,
            colType: '2',
            coordinate: item.longitude + ',' + item.latitude
          },
          success: (data) => {
            item.isCollected = 1
          }
        })
      } else {
        api.updateCollect({
          data: {
            requestColSingleDTOList: [
              {
                delFlag: '1',
                colId: item.orgOfficeId
              }
            ]
          },
          success: (data) => {
            item.isCollected = 0
          }
        })
      }
    }
  },
  destroyed() {}
}
</script>

<style lang="scss" scoped>
  .hospital-list {
    min-height: 100vh;
    background: #fbf9f7;
    .filters {
      position: fixed;
      top: 0;
      width: 100vw;
      height: 92rpx;
      z-index: 999;
      .triangle-icon {
        @include size(18, 12);
      }
    }
    .list {
      .item {
        padding: 24rpx 32rpx;
        .photo {
          @include size(220, 254);
        }
        .text {
          @include text-line(1);
          max-width: 450rpx;
        }
        .icon {
          @include square(48);
        }
        .route-button {
          @include size(192, 96);
          border: 2rpx solid $color-primary;
          border-radius: 48rpx;
          box-sizing: border-box;
        }
        .reserve-button {
          @include size(208, 96);
          line-height: 96rpx;
          border-radius: 48rpx;
          background: linear-gradient(to right, $color-secondary, $color-primary);
        }
      }
    }
    .no-data {
      margin-top: 154rpx;
      &__image {
        @include size(440, 234);
      }
    }
  }
</style>
