<template>
  <view class="hospital-detail">
    <view class="section flex-v p-32">
      <text class="fs-44 fw-500 c-black">{{ dataDetail.name }}</text>
      <text class="fs-36 fw-500 c-black mt-24">
        性质：{{ dataDetail.infoDetail.hospital_nature }}
      </text>
      <text class="fs-36 fw-500 c-black mt-24" v-if="dataDetail.infoDetail.hospital_clinic">
        {{ dataDetail.infoDetail.hospital_clinic }}
      </text>
      <text class="fs-36 c-black mt-24">
        {{ dataDetail.distance }}｜{{ dataDetail.infoDetail.hospital_name }}
      </text>
      <view class="tags flex-h flex-c-s flex-wrap m-24-0">
        <text class="tag fs-32 c-white bg-primary mr-16 br-4">医院</text>
        <text class="tag fs-32 c-white bg-primary mr-16 br-4">
          {{ dataDetail.infoDetail.hospital_level }}
        </text>
      </view>
      <view class="actions flex-h flex-c-s">
        <view class="action flex-h flex-c-c mr-20 p-0-20" @click="handleMap">
          <image
            class="icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/map/icon-map-location.png"
          />
          <text class="text fs-36 c-lightgrey ml-8">位置</text>
        </view>
        <view class="action flex-h flex-c-c mr-20 p-0-20" @click="handlePhone">
          <image
            class="icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/map/icon-map-make-call-full.png"
          />
          <text class="text fs-36 c-lightgrey ml-8">电话</text>
        </view>
      </view>
      <!-- <view class="open-state flex-h flex-c-s mt-48">
        <text class="state fs-32 br-4 p-0-16">开园中</text>
        <text class="time fs-36 c-black ml-24">6:00-22:00开放</text>
      </view> -->
      <scroll-view class="images mt-24" :scroll-x="true" v-if="dataDetail.photoShop.length != 0">
        <image
          class="image mr-24 br-16"
          :src="item"
          mode="scaleToFill"
          @click="handleImageClick(dataDetail.photoShop)"
          v-for="(item, index) in dataDetail.photoShop"
          :key="index"
        />
      </scroll-view>
    </view>
    <view class="section flex-v p-32">
      <text class="section-title fs-40 fw-500 c-black">医院简介</text>
      <view class="mt-24">
        <text class="content fs-36 c-black">
          {{
            textShow
              ? dataDetail.infoDetail.hospital_intro
                ? dataDetail.infoDetail.hospital_intro
                : '暂无'
              : dataDetail.infoDetail.hospital_intro
              ? getString(dataDetail.infoDetail.hospital_intro)
              : '暂无'
          }}
        </text>
        <text
          v-if="dataDetail.infoDetail.hospital_intro.length > 100"
          class="fs-36"
          style="color: #0059ff"
          @click="handleText()"
        >
          {{ textShow ? '收起' : '...全文' }}
        </text>
      </view>
    </view>
    <view class="section flex-v p-32">
      <text class="content fs-36 c-black" v-if="dataDetail.infoDetail.hospital_create_time">
        {{ `创建时间：${dataDetail.infoDetail.hospital_create_time}` }}
      </text>
      <text class="content fs-36 c-black" v-if="dataDetail.infoDetail.hospital_bed">
        {{ `床位数量：${dataDetail.infoDetail.hospital_bed}` }}
      </text>
      <text class="content fs-36 c-black" v-if="dataDetail.infoDetail.hospital_clinic_numbers">
        {{ `科室数目：${dataDetail.infoDetail.hospital_clinic_numbers}` }}
      </text>
      <text class="content fs-36 c-black" v-if="dataDetail.infoDetail.hospital_clinic">
        {{ `特色科室：${dataDetail.infoDetail.hospital_clinic}` }}
      </text>
      <text class="content fs-36 c-black" v-if="dataDetail.infoDetail.hospital_website">
        {{ `网址：${dataDetail.infoDetail.hospital_website}` }}
      </text>
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
        //是否全文显示
        textShow: false,
        //电话列表
        phoneList: [],
        // 拨打电话弹窗选项
        actionSheetItems: [],
      };
    },
    methods: {
      /**
       * 图片点击事件
       */
      handleImageClick(item) {
        console.log('---hospital---');
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
          phoneNumber.split(',').forEach((item) => {
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
      /**
       * 点击全文
       */
      handleText() {
        this.textShow = !this.textShow;
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
  .hospital-detail {
    .section {
      border-bottom: 16rpx solid #f2f2f2;
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
