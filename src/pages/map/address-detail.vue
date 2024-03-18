<template>
  <view class="address-detail">
    <attraction-detail v-if="type === 'attraction'" :dataDetail="dataDetail" />
    <hospital-detail v-else-if="type === 'hospital'" :dataDetail="dataDetail" />
    <other-detail v-else-if="type === 'other'" :dataDetail="dataDetail" />
    <restaurant-detail v-else-if="type === 'restaurant'" />
    <view style="width: 100vw; height: 310rpx"></view>
    <view class="footer bg-white">
      <view class="functions flex-h p-16-0">
        <view class="flex-v flex-c-c flex-1" @click="handleCollect">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-collected.png"
            mode="scaleToFill"
            v-if="dataDetail.isCollected == 1"
          />
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-uncollect.png"
            mode="scaleToFill"
            v-else
          />
          <text class="fs-36 c-lightgrey mt-8">收藏</text>
        </view>
        <view class="flex-v flex-c-c flex-1" @click="handleAroundClick">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-search-around.png"
            mode="scaleToFill"
          />
          <text class="fs-36 c-lightgrey mt-8">周边</text>
        </view>
        <view class="flex-v flex-c-c flex-1" @click="handleShareClick(dataDetail)">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-share.png"
            mode="scaleToFill"
          />
          <text class="fs-36 c-lightgrey mt-8">分享</text>
        </view>
        <view class="flex-v flex-c-c flex-1" @click="handleCarClick">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-take-taxi.png"
            mode="scaleToFill"
          />
          <text class="fs-36 c-lightgrey mt-8">打车</text>
        </view>
      </view>
      <view class="flex-h flex-c-c mt-16">
        <button
          class="button-1 fs-44 c-primary m-0-16"
          hover-class="none"
          @click="handleDirectButtonClick"
        >
          导航
        </button>
        <button
          class="button-2 fs-44 c-white m-0-16"
          hover-class="none"
          @click="handleDirectionClick"
        >
          路线
        </button>
      </view>
    </view>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="_list">
          <button class="share_icon" open-type="share">
            <image
              class="_img"
              src="http://192.168.1.187:10088/static/common/icon-wechat.png"
              mode=""
            />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="share_icon" open-type="share">
            <image
              class="_img"
              src="http://192.168.1.187:10088/static/common/icon-qq.png"
              mode="scaleToFill"
            />
            <text>QQ好友</text>
          </button>
          <button class="share_icon" open-type="share">
            <image
              class="_img"
              src="http://192.168.1.187:10088/static/common/icon-alipay.png"
              mode="scaleToFill"
            />
            <text>支付宝好友</text>
          </button>
          <button class="share_icon" open-type="share">
            <image
              class="_img"
              src="http://192.168.1.187:10088/static/common/icon-message.png"
              mode="scaleToFill"
            />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <button class="share_icon" @click="handleCopyClick">
            <image
              src="http://192.168.1.187:10088/static/common/icon-link.png"
              class="_img"
              mode=""
            />
            <text>复制链接</text>
          </button>
        </view>
        <view class="btn">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import AttractionDetail from './components/attraction-detail.vue';
  import HospitalDetail from './components/hospital-detail.vue';
  import RestaurantDetail from './components/restaurant-detail.vue';
  import OtherDetail from './components/other-detail.vue';
  import { showToast } from '@/utils/uni';
  import api from '@/apis/index.js';
  import { UniPopup } from '@dcloudio/uni-ui';

  export default {
    components: {
      AttractionDetail,
      HospitalDetail,
      RestaurantDetail,
      OtherDetail,
      UniPopup,
    },
    data() {
      return {
        shareData: {},
        // 当前位置信息
        location: uni.getStorageSync('location') || {},
        // 类型
        type: '',
        // 详情数据
        dataDetail: {},
        orgOfficeId: '',
      };
    },

    onShow() {},
    onLoad(e) {
      // 这是分享进入详情时需要查询的数据
      /**
       * 获取当前定位
       */
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.setStorageSync('location', res);
          if (e.orgOfficeId) {
            this.orgOfficeId = e.orgOfficeId;
            api.getOfficeInfoById({
              data: {
                orgOfficeId: e.orgOfficeId,
                // userId: "" 用户id
              },
              success: (data) => {
                console.log(data, 'data');
                switch (data.orgOfficeType) {
                  case '景点':
                    this.type = 'attraction';
                    break;
                  case '医院':
                    this.type = 'hospital';
                    break;
                  default:
                    this.type = 'other';
                    break;
                }
                const obj = {
                  orgOfficeId: data.orgOfficeId,
                  rid: data.rid,
                  type: data.orgOfficeType,
                  latitude: data.orgOfficeLat,
                  longitude: data.orgOfficeLon,
                  orgOfficeAddrArea: data.orgOfficeAddrArea,
                  address: data.orgOfficeAddr,
                  width: 47,
                  height: 52,
                  name: data.orgOfficeName,
                  orgOfficeInfoDetail: data.orgOfficeInfoDetail,
                  scenic_area_tel: data.orgOfficeTel,
                  distance: this.getDistance(
                    this.location.latitude,
                    this.location.longitude,
                    data.orgOfficeLat,
                    data.orgOfficeLon,
                  ),
                  isCollected: data.isCollected,
                  orgId: data.orgId,
                };
                this.dataDetail = obj;
                if (data.orgOfficeInfoDetail) {
                  const detail = JSON.parse(data.orgOfficeInfoDetail.replace(/\s*/g, ''));
                  this.dataDetail['infoDetail'] = detail;
                  this.dataDetail['photoShop'] = [];

                  if (detail.scenic_area_photos) {
                    this.dataDetail['photoShop'] = [...detail.scenic_area_photos.split(',')];
                  } else if (detail.common_service_photos) {
                    this.dataDetail['photoShop'] = [...detail.common_service_photos.split(',')];
                  }
                  if (detail.scenic_area_rank) {
                    this.dataDetail['scenic_area_rank'] = detail.scenic_area_rank;
                  } else if (detail.common_service_rank) {
                    this.dataDetail['scenic_area_rank'] = detail.common_service_rank;
                  }
                  if (detail.scenic_area_intro) {
                    this.dataDetail['scenic_area_intro'] = detail.scenic_area_intro;
                  } else if (detail.common_service_intro) {
                    this.dataDetail['scenic_area_intro'] = detail.common_service_intro;
                  }
                  console.log;
                  if (detail.common_service_opentime) {
                    this.dataDetail['scenic_area_opentime'] = detail.common_service_opentime;
                  } else if (detail.scenic_area_opentime) {
                    this.dataDetail['scenic_area_opentime'] = detail.scenic_area_opentime;
                  }

                  this.dataDetail['phoneList'] = [];
                  if (detail.scenic_area_tel) {
                    const phoneNumber = detail.scenic_area_tel.replace(/\//g, ',');
                    phoneNumber.split(',').forEach((item) => {
                      this.dataDetail['phoneList'].push(item);
                    });
                  } else if (detail.hospital_tel) {
                    const phoneNumber = detail.hospital_tel.replace(/\//g, ',');
                    phoneNumber.split(',').forEach((item) => {
                      this.dataDetail['phoneList'].push(item);
                    });
                  } else if (detail.common_service_tel) {
                    const phoneNumber = detail.common_service_tel.replace(/\//g, ',');
                    phoneNumber.split(',').forEach((item) => {
                      this.dataDetail['phoneList'].push(item);
                    });
                  }
                }

                this.getCollect();
              },
            });
            return;
          }
        },
      });

      // 当前处理数据医院和景点合在一起，一些字段不同所以需要多加一些判断
      return;
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('didOpenPageFinish', (data) => {
        this.type = data.type;
        this.dataDetail = data.item;
        if (data.item.orgOfficeInfoDetail) {
          const detail = JSON.parse(data.item.orgOfficeInfoDetail.replace(/\s*/g, ''));
          this.dataDetail['infoDetail'] = detail;
          this.dataDetail['photoShop'] = [];
          if (detail.scenic_area_photos) {
            this.dataDetail['photoShop'] = [...detail.scenic_area_photos.split(',')];
          }
          this.dataDetail['phoneList'] = [];
          if (detail.scenic_area_tel) {
            const phoneNumber = detail.scenic_area_tel.replace(/\//g, ',');
            phoneNumber.split(',').forEach((item) => {
              this.dataDetail['phoneList'].push(item);
            });
          } else if (detail.hospital_tel) {
            const phoneNumber = detail.hospital_tel.replace(/\//g, ',');
            phoneNumber.split(',').forEach((item) => {
              this.dataDetail['phoneList'].push(item);
            });
          }
        }
      });
    },
    methods: {
      // 点击复制链接
      handleCopyClick() {
        let url = '';
        if (this.type === 'attraction') {
          url = `${ENV.H5}/#/map/scenic-details/${this.orgOfficeid}?isShare=1`;
        } else if (this.type === 'hospital') {
          url = `${ENV.H5}/#/map/hospital-details/${this.orgOfficeId}?isShare=1`;
        }
        uni.setClipboardData({
          data: url,
          success: (res) => {
            uni.getClipboardData({
              success: (resp) => {
                this.$refs.popup.close();
                console.log('resp:', resp);
                uni.showToast({
                  title: '已复制到剪贴板',
                });
              },
            });
          },
        });
      },
      // 点击分享
      handleShareClick(data) {
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        console.log('---分享的数据---', data);
        this.shareData = data;
        this.$refs.popup.open();
      },
      // 关闭分享
      handleCloseClick() {
        this.$refs.popup.close();
      },
      /**
       * 获取收藏列表
       */
      getCollect() {
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
                console.log('data.finalList==', data.finalList);
                console.log('this.dataDetail.orgOfficeId==', this.dataDetail);
                data.finalList.some((item) => {
                  if (item.colId == this.dataDetail.orgOfficeId) {
                    this.dataDetail['isCollected'] = 1;
                    return true;
                  }
                });
              }
            },
            fail: (data) => {},
          });
        }
      },
      /**
       * 周边点击事件
       */
      handleAroundClick() {
        const data = {
          latitude: this.dataDetail.latitude,
          longitude: this.dataDetail.longitude,
          name: this.dataDetail.name,
        };
        uni.navigateTo({
          url: '/pages/map/around-search?data=' + encodeURIComponent(JSON.stringify(data)),
          success: (res) => {
            res.eventChannel.emit('didOpenMap', {
              latitude: this.dataDetail.latitude,
              longitude: this.dataDetail.longitude,
              name: this.dataDetail.name,
            });
          },
        });
      },
      /**
       * 点击打车事件
       */
      handleCarClick() {
        showToast({
          title: '功能建设中，敬请期待',
        });
      },
      /**
       * 点击收藏按钮事件
       */
      handleCollect() {
        if (!uni.getStorageSync('token')) {
          uni.navigateTo({
            url: '/pages/user-center/login',
          });
          return;
        }
        if (this.dataDetail.isCollected == 0) {
          api.saveCollect({
            data: {
              colId: this.dataDetail.orgOfficeId,
              colType: '2',
              coordinate: this.dataDetail.longitude + ',' + this.dataDetail.latitude,
            },
            success: (data) => {
              this.dataDetail.isCollected = 1;
              this.$uni.showToast('收藏成功');
            },
          });
        } else {
          api.updateCollect({
            data: {
              requestColSingleDTOList: [
                {
                  delFlag: '1',
                  colId: this.dataDetail.orgOfficeId,
                },
              ],
            },
            success: (data) => {
              this.dataDetail.isCollected = 0;
              uni.setStorageSync('colId', this.dataDetail.orgOfficeId);
              this.$uni.showToast('取消收藏');
            },
          });
        }
      },
      /*
       * 选择拨打电话
       */
      handlePhone(item) {
        if (!item) {
          this.$uni.showToast('暂无电话号码');
          return false;
        }
        uni.makePhoneCall({
          phoneNumber: item,
          success: (res) => {
            console.log('调用成功!');
          },
          fail: (res) => {
            console.log('调用失败!');
          },
        });
      },
      /*
       * 路线点击事件
       */
      handleDirectionClick() {
        const data = {
          name: this.dataDetail.name,
          longitude: this.dataDetail.longitude,
          latitude: this.dataDetail.latitude,
          address: this.dataDetail.address,
        };
        console.log('----6666666666666-----', this.dataDetail.address);
        uni.navigateTo({
          url: '/pages/map/direction?data=' + encodeURIComponent(JSON.stringify(data)),
          success: (res) => {
            res.eventChannel.emit('didOpenPageFinish', data);
          },
        });
      },
      /**
       * 导航按钮点击事件
       */
      handleDirectButtonClick() {
        const point = {
          latitude: this.dataDetail.latitude,
          longitude: this.dataDetail.longitude,
          address: this.dataDetail.address,
          name: this.dataDetail.name,
        };
        // console.log("====详情去导航---",point)
        //  console.log("====外部导航---",Object.values(point))
        // //uni.openLocation(point)
        uni.openLocation(point);
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
    },
    // 分享好友
    onShareAppMessage(res) {
      return {
        title: this.dataDetail.name,
        path: '/pages/map/address-detail?orgOfficeId=' + this.orgOfficeId,
        imageUrl:
          this.dataDetail.photoShop.length > 0
            ? this.dataDetail.photoShop[0]
            : 'http://192.168.1.187:10088/static/common/bg-share.png',
        success(res) {
          this.$uni.showToast({
            title: '分享成功',
          });
        },
        fail(res) {
          this.$uni.showToast({
            title: '分享失败',
            icon: 'none',
          });
        },
      };
    },
    // 分享到朋友圈
    onShareTimeline() {
      return {
        title: this.dataDetail.name,
        path: '/pages/map/ddress-detail',
        query: 'orgOfficeId=' + this.orgOfficeId,
        imageUrl:
          this.dataDetail.photoShop.length > 0
            ? this.dataDetail.photoShop[0]
            : 'http://192.168.1.187:10088/static/common/bg-share.png',
        success(res) {
          uni.showToast({
            title: '分享成功',
          });
        },
        fail(res) {
          uni.showToast({
            title: '分享失败',
            icon: 'none',
          });
        },
      };
    },
  };
</script>

<style lang="scss" scoped>
  .address-detail {
    background-color: #fff;
    .footer {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 310rpx;
      border-top: 2rpx solid #f2f2f2;
      .functions {
        position: relative;
        .share-button {
          position: absolute;
          top: 16rpx;
          left: 50vw;
          width: 25vw;
          height: 106rpx;
        }
      }
      .icon {
        @include square(48);
      }
      .button-1 {
        @include size(328, 108);
        line-height: 108rpx;
        border-radius: 50rpx;
        box-sizing: border-box;
        border: 2rpx solid $color-primary;
      }
      .button-2 {
        @include size(328, 108);
        line-height: 108rpx;
        border-radius: 54rpx;
        box-sizing: border-box;
        background: linear-gradient(to right, $color-secondary, $color-primary);
      }
    }
    .share-pop {
      background-color: #f2f2f2;
      border-radius: 16rpx 16rpx 0rpx 0rpx;
      color: #333333;
      .title {
        text-align: center;
        line-height: 50rpx;
      }
      ._list {
        width: 95%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 0 auto;
        margin-left: 45rpx;
        margin-top: 15rpx;
        .share_icon {
          width: 30%;
          height: auto;
          margin-right: 10rpx;
          line-height: initial;
          display: flex;
          flex-direction: column;
          ._img {
            width: 174rpx;
            margin: 0 auto;
            background-position: center;
            background-size: 100% 100%;
            height: 174rpx;
          }
        }
      }
      .list {
        // #ifdef MP-ALIPAY
        justify-content: flex-start;
        // #endif

        // #ifdef MP-WEIXIN
        justify-content: center;
        // #endif

        align-items: center;

        padding: 24rpx 74rpx;
        .item {
          image {
            flex-shrink: 0;
            width: 134rpx;
            height: 134rpx;
            margin-bottom: 8rpx;
          }
          text {
            line-height: 50rpx;
          }
        }
      }
      .btn {
        padding: 24rpx 74rpx;
        box-sizing: border-box;
        .cancle {
          height: 108rpx;
          border-radius: 54rpx;
          color: #666;
          font-weight: 500;
        }
      }
    }
  }
</style>
