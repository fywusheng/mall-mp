<template>
  <view class="job">
    <view class="_search">
      <view class="_left" @click="handleCityClick">
        <text class="city-name">
          {{ city.name || '定位中' }}
        </text>
        <image mode="scaleToFill" src="http://192.168.1.187:10088/static/home/up.png" />
      </view>
      <view class="search-header">
        <img class="icon" src="http://192.168.1.187:10088/static/images/common/ss.png" />
        <input
          confirm-type="search"
          disabled
          @click="focusInput"
          :placeholder="key || '搜职位'"
          v-model="key"
        />
        <!-- <view class="icon_h" @click="clear">
          <img class="btn-clear" v-if="showIcon"
            src="http://192.168.1.187:10088/static/images/item-list/clear.png">
        </view> -->
      </view>
      <view class="_right" @click="jobType">
        <image src="http://192.168.1.187:10088/static/home/jobAll.png"></image>
        <view class="lable">{{ tradeName ? tradeName : '行业' }}</view>
      </view>
    </view>
    <view class="center_list" v-if="jobList.length > 0">
      <view class="item" v-for="(item, i) in jobList" :key="i" @click="goDetailJob(item.id)">
        <view class="t">
          <view class="n">{{ item.postName }}</view>
          <view class="p">
            <view>{{ item.wagesMin / 1000 }}</view>
            <view v-if="item.wagesMax">-{{ item.wagesMax / 1000 }}</view>
            k
          </view>
        </view>
        <view class="flag">
          <view class="b">{{ item.cityName }}</view>
          <view class="b">{{ item.workExperience }}年</view>
          <view class="b">{{ item.education }}</view>
        </view>
        <view class="company">{{ item.companyName }}</view>
      </view>
    </view>
    <view v-if="loading == 2 && jobList.length == 0">
      <view class="flex-v flex-c-c status-box">
        <image
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">暂无相关职位</view>
      </view>
    </view>
  </view>
</template>
<script>
import api from '@/apis/index.js'
export default {
  data() {
    return {
      key: '',
      city: '',
      jobList: [],
      workArea: '',
      postType: '',
      pageNum: 1,
      pageSize: 20,
      tradeName: '',
      loading: 1
    }
  },
  created() {
    // this.getLocation()
  },
  mounted() {
    this.city = uni.getStorageSync('city')
  },
  onHide() {
    uni.removeStorageSync('s_key')
    // uni.removeStorageSync('seletName')
    // uni.removeStorageSync('childChoice')
  },
  destroyed() {
    uni.removeStorageSync('s_key')
    uni.removeStorageSync('seletName')
    uni.removeStorageSync('childChoice')
  },
  onShow() {
    // this.getLocation()
    this.city = uni.getStorageSync('city')
    this.workArea = this.city.realCode || this.city.code || ''
    this.postType = uni.getStorageSync('childChoice')
    this.tradeName = uni.getStorageSync('seletName')
    this.pageNum = 1
    this.loading = 1
    this.jobList = []
    this.getJobList()
  },
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  onReachBottom() {
    this.getJobList()
  },
  methods: {
    getJobList() {
      api.getJobList({
        data: {
          postName: '',
          workArea: this.workArea,
          postType: this.postType,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: (data) => {
          const list = data.list || []
          this.loading = 1
          if (list.length > 0) {
            this.jobList = this.jobList.concat(list)
            this.pageNum++
          } else {
            this.loading = 2
          }
        },
        fail: (erro) => {
          this.loading = 2
        }
      })
    },
    jobType() {
      uni.navigateTo({ url: '/pages/job/trade' })
    },
    focusInput() {
      uni.navigateTo({ url: '/pages/job/jobSearch' })
    },
    goDetailJob(id) {
      uni.navigateTo({ url: '/pages/job/jobDetail?id=' + id })
    },
    handleCityClick() {
      uni.navigateTo({
        url: '/pages/common/city-picker'
      })
    },
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
                console.log('===当前定位--', res)
                this.areaCode = res.regeocode.addressComponent.adcode
                // TODO this.getLocalProdList()// 本地惠
                let city = {}
                // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                if (res.regeocode.addressComponent.city.length === 0) {
                  city = {
                    code: res.regeocode.addressComponent.adcode.substr(0, 2) + '0100',
                    name: res.regeocode.addressComponent.province,
                    realCode: res.regeocode.addressComponent.adcode.substr(0, 2) + '0000'
                  }
                } else {
                  city = {
                    code: res.regeocode.addressComponent.adcode.substr(0, 4) + '00',
                    name: res.regeocode.addressComponent.city
                  }
                }
                this.handleSelectCity(city)
              }
            }
          )
        },
        fail: () => {
          // 定位失败默认北京市
          const city = { code: 110100, name: '北京市', realCode: '110000' }
          this.handleSelectCity(city)
        }
      })
    },
    handleSelectCity(city) {
      this.city = city
      uni.setStorageSync('city', city)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/styles/base';
  .job {
    background-color: #f5f5f5;
    min-height: 100vh;
    ._search {
      display: flex;
      position: fixed;
      width: 100%;
      top: 0;
      height: 111rpx;
      background-color: #fff;
      ._left {
        display: flex;
        position: absolute;
        left: 30rpx;
        font-size: 36rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        top: 22rpx;
        .city-name {
          width: 115rpx;
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        & > image {
          width: 16rpx;
          height: 10rpx;
          margin-top: 21rpx;
          margin-left: 10rpx;
        }
      }
      ._right {
        position: absolute;
        right: 24rpx;
        display: flex;
        top: 22rpx;
        & > image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 8rpx;
        }
        .lable {
          width: 97rpx;
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
      }
      .search-header {
        border-radius: 54rpx;
        width: 50%;
        @include middle-center-x(fixed);
        top: 10rpx;
        height: rpx(72);
        padding-left: rpx(32);
        padding-right: rpx(32);
        display: flex;
        align-items: center;
        background-color: #f7f7f7;
        z-index: 100;
        left: 51%;
        .icon {
          @include middle-center-y();
          left: rpx(21);
          width: rpx(30);
          height: rpx(30);
          z-index: 100;
        }
        input {
          line-height: 72rpx;
          height: 72rpx;
          background-color: #f7f7f7;
          border-radius: 33rpx;
          width: 90%;
          display: block;
          position: relative;
          width: 88%;
          padding-left: rpx(30);
          padding-right: rpx(5);
          font-size: rpx(36);
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
        .btn-back {
          @include middle-center-y();
          left: rpx(35);
          font-size: rpx(36);
        }
        .icon_h {
          position: absolute;
          top: 0;
          height: 63rpx;
          right: 23rpx;
          width: 26rpx;
          .btn-clear {
            width: rpx(30);
            height: rpx(30);
            position: absolute;
            top: 33%;
          }
        }
      }
    }
    .center_list {
      background-color: #f5f5f5;
      padding: 24rpx 32rpx 24rpx 32rpx;
      margin-top: 110rpx;
      .item {
        background: #ffffff;
        border-radius: 9rpx;
        padding: 24rpx;
        margin-bottom: 24rpx;
        .t {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24rpx;
          .n {
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            width: 56%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .p {
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // word-wrap: break-word;
            // white-space: normal !important;
            // -webkit-line-clamp: 1;
            // -webkit-box-orient: vertical;
            // text-align: right;
          }
        }
        .flag {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 24rpx;
          .b {
            width: fit-content;
            height: 48rpx;
            border-radius: 4rpx;
            border: 2rpx solid #1890ff;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1890ff;
            line-height: 48rpx;
            padding: 0 7rpx;
            margin-right: 20rpx;
          }
        }
        .company {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .status-box {
      padding-top: 200rpx;
      image {
        width: 440rpx;
        height: 234rpx;
        margin-bottom: 24rpx;
      }
      .status-text {
        height: 50rpx;
        color: $color-grey;
      }
    }
  }
</style>
