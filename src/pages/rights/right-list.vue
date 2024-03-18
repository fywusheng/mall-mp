<template>
  <view class="right-list">
    <view class="banner m-32">
      <image
        class="image"
        mode="scaleToFill"
        src="http://192.168.1.187:10088/static/rights/banner-rights-introduce.png"
      />
      <view class="buttons flex-h flex-c-b p-0-16">
        <button class="button br-8 fs-32" @click="handleButtonClick(0)">敬老优待</button>
        <button class="button br-8 fs-32" @click="handleButtonClick(1)">养老保障</button>
        <button class="button br-8 fs-32" @click="handleButtonClick(2)">养老服务</button>
        <button class="button br-8 fs-32" @click="handleButtonClick(3)">医疗保障</button>
      </view>
    </view>
    <view class="list">
      <view
        class="item m-32 br-8"
        @click="jumpPage(item.path)"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="header flex-h flex-c-b">
          <text class="fs-36 fw-500 c-black ml-32">{{ item.title }}</text>
          <image
            class="accessory"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
            v-if="!item.items"
          />
        </view>
        <view
          class="child flex-h flex-c-b br-8"
          v-for="(child, cIndex) in item.items"
          :key="cIndex"
          @click="handleExaminationReserveClick(child.title)"
        >
          <text class="fs-36 c-black ml-32">{{ child.title }}</text>
          <image
            class="accessory"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
          />
        </view>
      </view>
    </view>
    <uni-popup class="popup" ref="popup" :mask-click="true">
      <view class="card flex-v br-16 bg-white p-0-24">
        <view class="header flex-h flex-c-b">
          <text class="fs-36 c-black">您的签约家庭医生：</text>
          <image
            class="close-icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-close.png"
            @click.stop="handlePopupCloseClick"
          />
        </view>
        <view class="info flex-h">
          <image
            class="avatar"
            :src="doctor.headPortrait"
            mode="scaleToFill"
            @error="handleHeadLoadFail"
          />
          <view class="flex-v ml-24">
            <view class="row flex-h">
              <text class="fs-48 fw-bold c-black" v-if="doctor.name">{{ doctor.name }}</text>
              <text class="fs-36 c-black ml-24 mb-4" v-if="doctor.title">{{ doctor.title }}</text>
            </view>
            <text class="hospital fs-36 c-black mt-24" v-if="doctor.hospital">
              {{ doctor.department }} {{ doctor.hospital }}
            </text>
            <text class="address fs-36 c-black mt-24" v-if="doctor.addr">{{ doctor.addr }}</text>
          </view>
        </view>
        <view class="description mt-40">
          <text class="fs-36 c-lightgrey">擅长：</text>
          <text class="fs-36 c-lightgrey" v-if="doctor.skilled">
            {{ doctor.skilled }}
          </text>
        </view>
        <view class="make-call-button flex-h flex-c-c" @click.stop="handleMakeCallClick">
          <image
            class="phone-icon"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/map/icon-map-make-call-white.png"
          />
          <text class="fs-36 c-white ml-8">立即拨打</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import { UniPopup } from '@dcloudio/uni-ui';
  import api from '@/apis/index.js';
  export default {
    components: { UniPopup },
    data() {
      return {
        // 列表数据
        list: [],
        //预约体检
        medical: '',
        //医生
        doctor: {},
      };
    },
    onLoad() {
      this.init();
      this.setData();
    },
    methods: {
      /**
       * 按钮点击事件
       */
      handleButtonClick(index) {
        uni.navigateTo({
          url: `/pages/rights/right-detail?index=${index}`,
        });
      },
      /**
       * 查看明细点击事件
       */
      jumpPage(path) {
        uni.navigateTo({
          url: path,
        });
      },
      /**
       * 设置列表数据
       */
      setData() {
        this.list = [
          { title: '养老金查询', path: '/pages/rights/record-list?type=annuity' },
          { title: '高龄津贴', path: '/pages/rights/record-list?type=allowance' },
          { title: '医保消费记录查询', path: '/pages/rights/consumption-record' },
          {
            title: '免费体检',
            items: [
              { title: '预约体检', path: '/pages/rights/consumption-record' },
              { title: '健康档案' },
            ],
          },
          {
            title: '家庭医生',
            items: [{ title: '电话问诊' }, { title: '在线问诊' }],
          },
        ];
      },
      /**
       * 获取接口数据
       */
      init() {
        api.getIndividualRights({
          data: {},
          showsLoading: true,
          success: (res) => {
            console.log('res:', res);
            //数据处理
            if (res.healthCare.medical) {
              this.medical = res.healthCare.medical;
            }
            console.log('this.medical:', this.medical);
            //家庭医生
            this.doctor = res.familyDoctor.callPhyVisit;
            this.doctor.headPortrait = 'https://images.weserv.nl/?url=' + this.doctor.headPortrait;
          },
        });
      },
      /**
       * 预约体检点击事件
       */
      handleExaminationReserveClick(title) {
        this.$uni.showToast('当前所在地区功能开通中');
        return;
        if (title === '预约体检') {
          if (this.medical) {
            uni.navigateTo({
              url: '/pages/rights/hospital-list?medical=' + this.medical + '&list=1',
            });
          } else {
            this.$uni.showToast('功能建设中，敬请期待~');
          }
        } else if (title === '健康档案') {
          this.$uni.showToast('功能建设中，敬请期待~');
        } else if (title === '电话问诊') {
          this.$refs.popup.open();
        } else if (title === '在线问诊') {
          this.$uni.showToast('功能建设中，敬请期待~');
        }
      },
      /**
       * 弹窗关闭图标点击事件
       */
      handlePopupCloseClick() {
        this.$refs.popup.close();
      },
      /**
       * 立即拨打点击事件
       */
      handleMakeCallClick() {
        // console.log("被点击了：",this.doctor.tel)
        uni.makePhoneCall({
          phoneNumber: this.doctor.tel,
        });
      },
      /**
       * 健康档案点击事件
       */
      handleHealthRecordClick() {
        this.$uni.showToast('功能建设中，敬请期待~');
      },
      /**
       * 电话问诊点击事件
       */
      handlePhoneInquiryClick() {
        // this.$uni.showToast('功能建设中，敬请期待~')
        this.$refs.popup.open();
      },
      /**
       * 在线问诊点击事件
       */
      handleOnlineInquiryClick() {
        this.$uni.showToast('功能建设中，敬请期待~');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .right-list {
    padding-top: 1rpx;
    .banner {
      @include size(686, 280);
      position: relative;
      .image {
        @include size(686, 280);
      }
      .buttons {
        position: absolute;
        bottom: 24rpx;
        width: 654rpx;
        .button {
          @include size(144, 50);
          line-height: 50rpx;
          background: #ffd85f;
          color: #b15629;
        }
      }
    }
    .list {
      .item {
        padding-bottom: 1rpx;
        box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.1);
        .header {
          height: 96rpx;
          .accessory {
            @include square(72);
          }
        }
        .child {
          margin: 0 24rpx 16rpx;
          height: 80rpx;
          background: #f6f7f8;
          .accessory {
            @include square(64);
          }
          &:last-child {
            margin-bottom: 24rpx;
          }
        }
      }
    }
    .card {
      width: 572rpx;
      .header {
        height: 88rpx;
        .close-icon {
          @include square(40);
        }
      }
      .info {
        .avatar {
          flex-shrink: 0;
          @include size(174, 214);
        }
        .row {
          align-items: flex-end;
        }
        .hospital,
        .address {
          @include text-line(1);
          max-width: 376rpx;
        }
      }
      .make-call-button {
        margin: 24rpx 44rpx;
        width: 484rpx;
        height: 96rpx;
        line-height: 96rpx;
        border-radius: 48rpx;
        background: linear-gradient(to right, $color-secondary, $color-primary);
        .phone-icon {
          @include size(36, 38);
        }
      }
    }
  }
</style>
