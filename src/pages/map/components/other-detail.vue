<template>
  <view class="attraction-detail">
    <view class="section flex-v p-32">
      <text class="fs-44 c-black">{{ dataDetail.name }}</text>
      <view class="flex-h flex-c-s m-32-0">
        <text class="fs-36 c-black">{{ dataDetail.orgOfficeAddrArea }}</text>
      </view>
      <view class="fs-36 c-black distance">
        {{ dataDetail.distance }}｜{{ dataDetail.address }}
      </view>
      <view class="tags flex-h flex-c-s flex-wrap m-24-0">
        <text class="tag fs-32 c-white bg-primary mr-16 br-4">
          {{ dataDetail.type }}
        </text>
        <!-- <text class="tag fs-32 c-white bg-primary mr-16 br-4">
          {{ dataDetail.infoDetail.scenic_area_rank }}
        </text> -->
        <!-- <text class="tag fs-32 c-white bg-primary mr-16 br-4">
          含有老年优待
        </text> -->
      </view>
      <view class="actions flex-h flex-c-s">
        <view class="action flex-h flex-c-c mr-20 p-0-20" @click="handleMap">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-location.png"
            mode="scaleToFill"
          />
          <text class="text fs-36 c-lightgrey ml-8">位置</text>
        </view>
        <view class="action flex-h flex-c-c mr-20 p-0-20" @click="handlePhone">
          <image
            class="icon"
            src="http://192.168.1.187:10088/static/map/icon-map-make-call-full.png"
            mode="scaleToFill"
          />
          <text class="text fs-36 c-lightgrey ml-8">电话</text>
        </view>
      </view>
      <!-- <view class="open-state flex-h flex-c-s mt-48">
        <text class="state fs-32 br-4 p-0-16">开园中</text>
        <text class="time fs-36 c-black ml-24">6:00-22:00开放</text>
      </view> -->
      <scroll-view
        class="images mt-24"
        mode="scaleToFill"
        :scroll-x="true"
        v-if="dataDetail.photoShop.length != 0"
      >
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
    <view class="section flex-v p-32">
      <text class="section-title fs-40 fw-500 c-black">信息简介</text>
      <view :class="['mt-24', heightClass]">
        <text class="content fs-36 c-black">
          {{
            textShow1
              ? dataDetail.scenic_area_intro
                ? dataDetail.scenic_area_intro
                : '暂无'
              : dataDetail.scenic_area_intro
              ? getString(dataDetail.scenic_area_intro)
              : '暂无'
          }}
        </text>
        <text
          v-if="dataDetail.scenic_area_intro.length > 100"
          class="fs-36 text-position"
          style="color: #0059ff"
          @click="handleText(1)"
        >
          {{ textShow1 ? '收起' : '...全文' }}
        </text>
      </view>
    </view>
    <view class="section flex-v p-32" v-if="dataDetail.scenic_area_opentime">
      <text class="section-title fs-40 fw-500 c-black">营业时间</text>
      <text class="content fs-36 c-black mt-24">
        {{ dataDetail.scenic_area_opentime }}
      </text>
    </view>
    <!-- <view class="section flex-v p-32">
      <text class="section-title fs-40 fw-500 c-black">优待政策</text>
      <text class="content fs-36 c-black mt-24">
        {{ dataDetail.infoDetail.scenic_area_policies }}
      </text>
    </view>
    <view class="section flex-v p-32">
      <text class="section-title fs-40 fw-500 c-black">服务设施</text>
      <view :class="['mt-24', heightClass2]">
        <text class="content fs-36 c-black">
          {{
            textShow2
              ? dataDetail.infoDetail.scenic_area_facility
              : getString(dataDetail.infoDetail.scenic_area_facility)
          }}
        </text>
        <text
          class="fs-36 text-position"
          style="color: #0059FF"
          @click="handleText(2)"
        >
          {{ textShow2 ? "收起" : "全文" }}
        </text>
      </view>
    </view> -->
    <action-sheet
      ref="actionSheet"
      title="请选择拨打电话"
      :items="actionSheetItems"
      @click="handleActionSheetItemClick"
    />
  </view>
</template>

<script>
  import ActionSheet from '@/components/common/action-sheet';
  export default {
    components: { ActionSheet },
    props: {
      dataDetail: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        //控制服务全文显示行数
        heightClass: 'static-height',
        //是否显示景点介绍全文
        textShow1: false,
        //是否显示服务设施全文
        textShow2: false,
        //电话列表
        phoneList: [],
        //评分
        rateList: [],
        // 拨打电话弹窗选项
        actionSheetItems: [],
      };
    },
    created() {
      // this.isRate(this.dataDetail.infoDetail.scenic_area_score);
    },
    methods: {
      /**
       * 图片点击事件
       */
      handleImageClick(item) {
        console.log('====otherdetail---', item);
        uni.navigateTo({
          url: '/pages/map/image-gallery?imgs=' + encodeURIComponent(JSON.stringify(item)),
          success: (res) => {
            res.eventChannel.emit('openPhotoDetail', {
              item: item,
            });
          },
        });
      },
      /**
       * 点击全文
       */
      handleText(index) {
        switch (index) {
          case 1:
            this.textShow1 = !this.textShow1;
            break;
          case 2:
            this.textShow2 = !this.textShow2;
            break;
          default:
            break;
        }
      },
      /**
       * 点击位置
       */
      handleMap() {
        uni.navigateBack();
      },
      /**
       * 电话按钮事件
       */
      handlePhone() {
        this.phoneList = [];
        if (this.dataDetail.scenic_area_tel) {
          const phoneNumber = this.dataDetail.scenic_area_tel.replace(/\//g, ',');
          let array = phoneNumber.split(';');
          if (array.length > 0) {
            phoneNumber.split(';').forEach((item) => {
              this.phoneList.push(item);
            });
          } else {
            phoneNumber.split(',').forEach((item) => {
              this.phoneList.push(item);
            });
          }
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
      /**
       * 判断星级
       */
      isRate(rate) {
        const arr = rate.toString().split('.');
        if (arr.length == 1) {
          switch (arr[0]) {
            case '0':
              this.rateList = [];
              break;
            case '1':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '2':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '3':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '4':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '5':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
              ];
              break;
            default:
              break;
          }
        } else {
          switch (arr[0]) {
            case '0':
              this.rateList = [];
              break;
            case '1':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-map-star-half.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '2':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-map-star-half.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '3':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-map-star-half.png',
                },
                {
                  url: '@/static/map/rate1_0.png',
                },
              ];
              break;
            case '4':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-map-star-half.png',
                },
              ];
              break;
            case '5':
              this.rateList = [
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
                {
                  url: '@/static/map/icon-star-full.png',
                },
              ];
              break;
            default:
              break;
          }
        }
      },
      /**
       * 截取字符串
       */
      getString(string) {
        return string.substring(0, 100);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .attraction-detail {
    .section {
      border-bottom: 16rpx solid #f2f2f2;
      .distance {
        @include text-line(1);
      }
      .star {
        @include square(40);
      }
      .tags {
        .tag {
          padding: 4rpx 16rpx;
        }
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
