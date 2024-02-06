<template>
  <view class="address-detail">
    <services-detail :dataDetail="dataDetail" />

    <view style="width: 100vw; height: 150rpx;"></view>
    <view class="footer bg-white">
      <view class="flex-h flex-c-c mt-16">
        <button
          class="button-1 fs-44 flex-h flex-c-c c-primary m-0-16"
          hover-class="none"
          @click="handleDirectionClick"
        >
          <image class="route" src="https://ggllstatic.hpgjzlinfo.com/static/services/icon-road.png"  mode="scaleToFill" />
          <text>路线</text>
        </button>
        <button
          class="button-2 fs-44 flex-h flex-c-c c-primary m-0-16"
          hover-class="none"
          @click="handlePhone"
        >
          <image class="phone" src="https://ggllstatic.hpgjzlinfo.com/static/services/icon-phone.png"  mode="scaleToFill" />
          <text>电话</text>
        </button>
      </view>
    </view>
    <action-sheet
      ref="actionSheet"

      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
import ServicesDetail from "./components/services-detail.vue";
import ActionSheet from '@/components/common/action-sheet'
import parse from "mini-html-parser2";
import { showToast } from "@/utils/uni";
import api from "@/apis/index.js";

export default {
  components: { ServicesDetail, ActionSheet },
  data() {
    return {
      // 当前位置信息
      location: uni.getStorageSync("location") || {},
      //类型
      type: "",
      //详情数据
      dataDetail: {},
      // 拨打电话弹窗选项
      actionSheetItems: [],
    };
  },
  onShareAppMessage(res) {
    return {
      title: this.dataDetail.name,
      path:
        "/pages/services/address-detail?orgOfficeId=" + this.dataDetail.orgOfficeId,
    };
  },
  onShow() {
    // this.getCollect()
  },
  onLoad(e) {
    // 这是分享进入详情时需要查询的数据
    if (e.orgOfficeId) {
      api.getOfficeInfoById({
        data: {
          orgOfficeId: e.orgOfficeId,
        },
        success: (data) => {
          let obj = {
            address:data.orgOfficeAddr,
            orgOfficeId: data.orgOfficeId,
            rid: data.rid,
            type: data.orgOfficeType,
            latitude: data.orgOfficeLat,
            longitude: data.orgOfficeLon,
            width: 47,
            height: 52,
            name: data.orgOfficeName,
            orgOfficeInfoDetail: data.orgOfficeInfoDetail,
            social_service_tel: data.orgOfficeTel,
            distance: this.getDistance(
              this.location.latitude,
              this.location.longitude,
              data.orgOfficeLat,
              data.orgOfficeLon
            ),
            isCollected: data.isCollected,
            orgId: data.orgId,
          };
          this.dataDetail = obj;
          if (data.orgOfficeInfoDetail) {
            const detail = JSON.parse(
              data.orgOfficeInfoDetail.replace(/\s/g, " ")
            );
            console.log(detail.social_service_area)
            detail.social_service_area = detail.social_service_area.split('  ')
            this.dataDetail["infoDetail"] = detail;
            
            this.dataDetail["photoShop"] = [];
            parse(detail.social_service_intro, (err, nodesList) => {
              this.dataDetail["nodes"] = nodesList;
            });
            if (detail.social_service_photos) {
              this.dataDetail["photoShop"] = [
                ...detail.social_service_photos.split(","),
              ];
            }
            this.dataDetail["phoneList"] = [];
            if (detail.social_service_tel) {
              const phoneNumber = detail.social_service_tel.replace(/\//g, ",");
              phoneNumber.split(",").forEach((item) => {
                this.dataDetail["phoneList"].push(item);
              });
            } else if (detail.hospital_tel) {
              const phoneNumber = detail.hospital_tel.replace(/\//g, ",");
              phoneNumber.split(",").forEach((item) => {
                this.dataDetail["phoneList"].push(item);
              });
            }
          }
        },
      });
      return;
    }
  },
  methods: {
    /**
     * 点击打车事件
     */
    handleCarClick() {
      showToast({
        title: "功能建设中，敬请期待",
      });
    },
    /**
     * 点击收藏按钮事件
     */
    handleCollect() {
      if (!uni.getStorageSync("token")) {
        uni.navigateTo({
          url: "/pages/user-center/login",
        });
        return;
      }
      if (this.dataDetail.isCollected == 0) {
        api.saveCollect({
          data: {
            colId: this.dataDetail.orgOfficeId,
            colType: "2",
            coordinate:
              this.dataDetail.longitude + "," + this.dataDetail.latitude,
          },
          success: (data) => {
            this.dataDetail.isCollected = 1;
            this.$uni.showToast("收藏成功");
          },
        });
      } else {
        api.updateCollect({
          data: {
            requestColSingleDTOList: [
              {
                delFlag: "1",
                colId: this.dataDetail.orgOfficeId,
              },
            ],
          },
          success: (data) => {
            this.dataDetail.isCollected = 0;
            this.$uni.showToast("取消收藏");
          },
        });
      }
    },
    /*
     * 选择拨打电话
     */
    handlePhone() {
      this.phoneList = [];
      if (this.dataDetail.social_service_tel) {
        const phoneNumber = this.dataDetail.social_service_tel.replace(
          /\//g,
          ","
        );
        phoneNumber.split(",").forEach((item) => {
          this.phoneList.push(item);
        });
      } else {
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
    /*
     * 路线点击事件
     */
    handleDirectionClick() {
      const data = {
        name: this.dataDetail.name,
        longitude: this.dataDetail.longitude,
        latitude: this.dataDetail.latitude,
        address: this.dataDetail.address
      }
      console.log('-hhhhhh-----',this.dataDetail.address)
      uni.navigateTo({
        url: '/pages/map/direction?data=' + encodeURIComponent(JSON.stringify(data)),
        success: (res) => {
          res.eventChannel.emit("didOpenPageFinish", data);
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
        name: "我的位置",
      };
      uni.openLocation(point);
    },
    /**
     * 返回单位km  lat:纬度  lng：经度
     */
    getDistance(lat1, lng1, lat2, lng2) {
      if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
        return "";
      }
      if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
        return "";
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
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      if (s.toFixed(2) < 1) {
        return s.toFixed(2) * 1000 + "米";
      } else {
        return s.toFixed(2) + "公里";
      }
    },
    /**
     * 距离计算定义方法
     */
    rad(d) {
      return (d * Math.PI) / 180.0;
    },
  },
};
</script>

<style lang="scss" scoped>
.address-detail {
  .footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 150rpx;
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
    .button-1,
    .button-2 {
      @include size(328, 108);
      line-height: 108rpx;
      border-radius: 50rpx;
      box-sizing: border-box;
      border: 2rpx solid $color-primary;
      image {
        @include size(48, 48);
      }
      .route{
        margin-right: 10rpx;
      }
      .phone{
        margin-right: 8rpx;
      }
    }
    .button-2 {
      @include size(328, 108);
      line-height: 108rpx;
      border-radius: 54rpx;
      box-sizing: border-box;
      color: #FFFFFF;
      background: linear-gradient(to right, $color-secondary, $color-primary);
    }
  }
}
</style>
