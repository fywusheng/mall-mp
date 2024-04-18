<template>
  <view class="services-detail">
    <view class="section flex-v p-32">
      <text class="fs-44 mb-16 name" v-if="dataDetail.name">{{ dataDetail.name }}</text>
      <div class="img-bg"></div>
      <div class="panel-card">
        <view class="f-s-44 m-b-16">
          <!-- <text></text> -->
          <text v-if="dataDetail.infoDetail.social_service_contacts">
            联系人：{{ dataDetail.infoDetail.social_service_contacts }}
          </text>
        </view>
        <view class="m-b-16">
          <text v-if="dataDetail.distance">距您：{{ dataDetail.distance }}</text>
        </view>
        <view class="t-grey p-address m-b-16">
          <text v-if="dataDetail.infoDetail.social_service_addr">
            商家地址：{{ dataDetail.infoDetail.social_service_addr }}
          </text>
        </view>

        <view class="mb-16">
          <!-- <text v-if="dataDetail.infoDetail.social_service_area">{{ dataDetail.infoDetail.social_service_area }}</text> -->
          <template v-for="(item, index) in dataDetail.infoDetail.social_service_area">
            <text class="city-card" :key="index">{{ item }}</text>
          </template>
        </view>
      </div>

      <scroll-view class="images mt-24" :scroll-x="true" v-if="dataDetail.photoShop.length != 0">
        <image
          class="image mr-24 br-16"
          mode="scaleToFill"
          :src="item"
          @click="handleImageClick(dataDetail.photoShop)"
          v-for="(item, index) in dataDetail.photoShop"
          :key="index"
        />
      </scroll-view>
    </view>

    <view class="flex-v p-32 desc">
      <text class="section-title fs-40 fw-500">
        <text class="line-text"></text>
        服务描述
      </text>
      <rich-text :nodes="dataDetail.nodes"></rich-text>
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
import ActionSheet from '@/components/common/action-sheet'
export default {
  components: { ActionSheet },
  props: {
    dataDetail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 控制服务全文显示行数
      heightClass: 'static-height',
      // 是否显示景点介绍全文
      textShow1: false,
      // 是否显示服务设施全文
      textShow2: false,
      // 电话列表
      phoneList: [],
      // 评分
      rateList: [],
      // 服务描述
      nodes: [],
      // 拨打电话弹窗选项
      actionSheetItems: []
    }
  },

  created() {
    // this.isRate(this.dataDetail.infoDetail.scenic_service_score)
  },
  methods: {
    /**
       * 图片点击事件
       */
    handleImageClick(item) {
      uni.navigateTo({
        url: '/pages/map/image-gallery',
        success: (res) => {
          res.eventChannel.emit('openPhotoDetail', {
            item: item
          })
        }
      })
    },
    /**
       * 点击全文
       */
    handleText(index) {
      switch (index) {
        case 1:
          this.textShow1 = !this.textShow1
          break
        case 2:
          this.textShow2 = !this.textShow2
          break
        default:
          break
      }
    },
    /**
       * 点击位置
       */
    handleMap() {
      uni.navigateBack()
    },
    /**
       * 电话按钮事件
       */
    handlePhone() {
      this.phoneList = []
      if (this.dataDetail.scenic_service_tel) {
        const phoneNumber = this.dataDetail.scenic_service_tel.replace(/\//g, ',')
        phoneNumber.split(',').forEach((item) => {
          this.phoneList.push(item)
        })
      } else {
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
       * 判断星级
       */
    isRate(rate) {
      const arr = rate.toString().split('.')
      if (arr.length == 1) {
        switch (arr[0]) {
          case '0':
            this.rateList = []
            break
          case '1':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '2':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '3':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '4':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '5':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              }
            ]
            break
          default:
            break
        }
      } else {
        switch (arr[0]) {
          case '0':
            this.rateList = []
            break
          case '1':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-map-star-half.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '2':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-map-star-half.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '3':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-map-star-half.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/rate1_0.png'
              }
            ]
            break
          case '4':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-map-star-half.png'
              }
            ]
            break
          case '5':
            this.rateList = [
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              },
              {
                url: 'http://192.168.1.187:10088/static/map/icon-star-full.png'
              }
            ]
            break
          default:
            break
        }
      }
    },
    /**
       * 截取字符串
       */
    getString(string) {
      return string.substring(0, 100) + '...'
    }
  },
  watch: {
    dataDetail(n, o) {}
  }
}
</script>

<style lang="scss" scoped>
  .services-detail {
    color: #333;
    background: #f2f2f2;
    .desc {
      width: calc(100% - 64rpx);
      margin: 0 auto;
      background: #ffffff;
      box-sizing: border-box;
    }
    .line-text {
      display: inline-block;
      width: 8rpx;
      height: 38rpx;
      background: #ff5500;
      margin-right: 16rpx;
    }
    .t-grey {
      color: #999999;
    }
    .p-address {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .city-card {
      padding: 8rpx 12rpx;
      background: #ffe9de;
      border-radius: 4rpx;
      color: #ff5500;
      font-size: 32rpx;
      margin-right: 16rpx;
      margin-bottom: 8rpx;
      display: inline-block;
    }
    .m-b-16 {
      margin-bottom: 16rpx;
    }
    .f-s-44 {
      font-size: 44rpx;
    }
    .section {
      border-bottom: 16rpx solid #f2f2f2;
      position: relative;
      background: #f2f2f2;
      .name {
        line-height: 60rpx;
        z-index: 1;
      }
      .address {
        color: #999999;
        line-height: 50rpx;
      }
      .star {
        @include square(40);
      }
      .tags {
        .tag {
          padding: 4rpx 16rpx;
        }
      }
      .img-bg {
        width: 100%;
        height: 300rpx;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(
          180deg,
          #ffe3d5 0%,
          rgba(255, 229, 216, 0.93) 51%,
          rgba(255, 255, 255, 0) 100%
        );
      }
      .panel-card {
        width: 686rpx;
        // height: 308rpx;
        background: #ffffff;
        border-radius: 16rpx;
        padding: 32rpx 24rpx;
        font-size: 36rpx;
        box-sizing: border-box;
        z-index: 1;
      }
      .actions {
        .action {
          height: 68rpx;
          border-radius: 34rpx;
          box-sizing: border-box;
          border: 1px solid #eeeeee;
          .icon {
            @include square(40);
          }
        }
      }
      .open-state {
        .state {
          height: 40rpx;
          line-height: 40rpx;
          color: #12b362;
          background: rgba(18, 179, 98, 0.2);
        }
      }
      .images {
        white-space: nowrap;
        .image {
          @include size(640, 368);
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .content {
        line-height: 52rpx;
      }
      .mt-24 {
        // padding-right: 50rpx;
      }
    }
    .title {
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
  }
</style>
