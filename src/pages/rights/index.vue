<template>
  <view class="index">
    <view class="panel flex-h flex-c-b p-32">
      <right-panel
        :info="receivedRightsInfo"
        :canvas-id="'leftPanel'"
        @click="handlePanelButtonClick(0)"
      />
      <right-panel
        :info="unreceivedRightsInfo"
        :canvas-id="'rightPanel'"
        @click="handlePanelButtonClick(1)"
      />
    </view>
    <view class="item bg-white br-16" @click="handleSeeDetailClick('annuity')">
      <view class="header flex-h flex-c-b p-0-32">
        <text class="fs-40 fw-bold c-black">养老金查询</text>
        <button class="see-detail fs-32" hover-class="none">查看明细 ></button>
      </view>
      <view class="p-32">
        <view class="flex-h flex-c-b">
          <text class="fs-36 c-black">
            您的养老金：{{ showsAnnuityValue ? pension.grantAmount : '****' }}元/月
          </text>
          <image
            class="eye-icon"
            :src="getStateIconURL(0)"
            mode="scaleToFill"
            @click.stop="showsAnnuityValue = !showsAnnuityValue"
          />
        </view>
        <view class="mt-32">
          <text class="state fs-36 c-black br-16">
            本月「
            <text class="c-orange">已到账</text>
            」
          </text>
        </view>
      </view>
    </view>
    <view class="item bg-white br-16" @click="handleSeeDetailClick('allowance')">
      <view class="header flex-h flex-c-b p-0-32">
        <text class="fs-40 fw-bold c-black">高龄津贴</text>
        <button class="see-detail fs-32" hover-class="none">查看明细 ></button>
      </view>
      <view class="p-32">
        <view class="flex-h flex-c-b">
          <text class="fs-36 c-black">
            您的高龄津贴：{{ showsAllowanceValue ? ageAllowance.grantAmount : '****' }}元/月
          </text>
          <image
            class="eye-icon"
            :src="getStateIconURL(1)"
            mode="scaleToFill"
            @click.stop="showsAllowanceValue = !showsAllowanceValue"
          />
        </view>
        <view class="mt-32">
          <text class="state fs-36 c-black br-16">
            本月「
            <text class="c-orange">已到账</text>
            <!-- <text class="c-blue">未到账</text> -->
            」
          </text>
        </view>
      </view>
    </view>
    <view class="item bg-white br-16" @click="handleSeeDetailClick('consumption')">
      <view class="header flex-h flex-c-b p-0-32">
        <text class="fs-40 fw-bold c-black">医保消费记录查询</text>
        <button class="see-detail fs-32" hover-class="none">查看明细 ></button>
      </view>
      <view class="p-32">
        <view class="flex-h flex-c-b">
          <text class="fs-36 c-black">
            您的医保账户余额(元)：{{ showsBalanceValue ? healInsuConsRecord.restAmount : '****' }}
          </text>
          <image
            class="eye-icon"
            :src="getStateIconURL(2)"
            mode="scaleToFill"
            @click.stop="showsBalanceValue = !showsBalanceValue"
          />
        </view>
      </view>
    </view>
    <view class="item bg-white br-16" @click="handleSeeDetailClick('policy')">
      <view class="header flex-h flex-c-b p-0-32">
        <text class="fs-40 fw-bold c-black">优待政策说明</text>
        <button class="see-detail fs-32" hover-class="none">查看明细 ></button>
      </view>
      <view class="p-32">
        <view class="flex-h flex-c-b">
          <rich-text class="fs-36 c-black" :nodes="description"></rich-text>
          <!-- <text class="fs-36 c-black">
            您享有
            <text class="c-orange">北京市</text>
            老年人证优待政策
          </text> -->
        </view>
      </view>
    </view>
    <view class="item bg-white br-16">
      <view class="header flex-h flex-c-b p-0-32">
        <text class="fs-40 fw-bold c-black">健康医疗</text>
        <button class="see-detail fs-32">查看明细 ></button>
      </view>
      <view class="p-32">
        <view class="functions flex-h flex-c-b">
          <view class="left flex-v p-32 br-16">
            <text class="fs-44 fw-bold c-black">免费体检</text>
            <view class="button flex-h flex-c-c mt-24 br-8" @click="handleExaminationReserveClick">
              <text class="fs-36 c-white">预约体检</text>
              <image
                class="triangle-icon ml-16"
                mode="scaleToFill"
                src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png"
              />
            </view>
            <view class="button flex-h flex-c-c mt-24 br-8" @click="handleHealthRecordClick">
              <text class="fs-36 c-white">健康档案</text>
              <image
                class="triangle-icon ml-16"
                mode="scaleToFill"
                src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png"
              />
            </view>
          </view>
          <view class="right flex-v p-32 br-16">
            <text class="fs-44 fw-bold c-black">家庭医生</text>
            <view class="button flex-h flex-c-c mt-24 br-8" @click="handlePhoneInquiryClick">
              <text class="fs-36 c-white">电话问诊</text>
              <image
                class="triangle-icon ml-16"
                mode="scaleToFill"
                src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png"
              />
            </view>
            <view class="button flex-h flex-c-c mt-24 br-8" @click="handleOnlineInquiryClick">
              <text class="fs-36 c-white">在线问诊</text>
              <image
                class="triangle-icon ml-16"
                mode="scaleToFill"
                src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-white.png"
              />
            </view>
          </view>
        </view>
        <!-- <view class="records">
          <view class="record-item flex-v m-32-0 p-24">
            <text class="fs-36 c-black">
              您最近一次体检时间：
              <text class="c-orange">2021.08.24</text>
            </text>
            <text class="fs-36 c-blue">下载报告 ></text>
          </view>
          <view class="record-item flex-v m-32-0 p-24">
            <text class="fs-36 c-black">
              您最近一次问诊时间：
              <text class="c-orange">2021.08.24</text>
            </text>
            <text class="fs-36 c-blue">下载病例/处方 ></text>
          </view>
        </view> -->
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
    <modal-know ref="noticeModal"></modal-know>
  </view>
</template>

<script>
  import RightPanel from './components/right-panel.vue';
  import { UniPopup } from '@dcloudio/uni-ui';
  import api from '@/apis/index.js';
  import ModalKnow from '@/pages/rights/components/modal-know.vue';
  export default {
    components: { RightPanel, UniPopup, ModalKnow },
    data() {
      return {
        // 已领取权益信息
        receivedRightsInfo: {
          title: '已有的权益',
          text: '已领取',
          percent: '0',
          count: '0',
          color1: '#FF5000',
          color2: '#FF8800',
        },
        // 未领取权益信息
        unreceivedRightsInfo: {
          title: '',
          text: '',
          percent: '',
          count: '',
          color1: '',
          color2: '',
        },
        // 是否显示养老金具体数值
        showsAnnuityValue: true,
        // 是否显示高龄补贴具体数值
        showsAllowanceValue: true,
        // 是否显示医保账户余额具体数值
        showsBalanceValue: true,
        //养老金
        pension: {
          grantAmount: '',
        },
        //高龄津贴
        ageAllowance: {
          grantAmount: '',
        },
        //医保记录
        healInsuConsRecord: {
          restAmount: '',
        },
        // 优待说明
        description: '',
        //预约体检
        medical: '',
        //医生
        doctor: {},
      };
    },
    onLoad() {
      // this.$refs.noticeModal.open();
      this.init();
      // this.setPanelData()
    },
    mounted() {
      this.$refs.noticeModal.open();
    },
    onShareAppMessage() {
      return {
        title: '个人权益',
        path: '/pages/index/index?index=0',
      };
    },
    methods: {
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

            this.unreceivedRightsInfo = {
              title: '未领取的权益',
              text: '未领取',
              percent:
                (
                  res.notBroughtEquity.length /
                  (res.hasBroughtEquity.length + res.notBroughtEquity.length)
                ).toFixed(3) *
                  100 +
                '',
              count: res.notBroughtEquity.length + '',
              color1: '#2CA3F6',
              color2: '#14C8F7',
            };
            this.receivedRightsInfo = {
              title: '已有的权益',
              text: '已领取',
              percent:
                (
                  res.hasBroughtEquity.length /
                  (res.hasBroughtEquity.length + res.notBroughtEquity.length)
                ).toFixed(2) *
                  100 +
                '',
              count: res.hasBroughtEquity.length + '',
              color1: '#FF5000',
              color2: '#FF8800',
            };
            //养老金
            this.pension = res.pension;
            //高龄津贴
            this.ageAllowance = res.ageAllowance;
            //医保记录
            this.healInsuConsRecord = res.healInsuConsRecord;
            // 优待说明
            let arr = res.preTreatPoliDesc['北京市'].description.split('北京市');
            let nameArr = [];
            arr.map((item, index) => {
              if (index < arr.length - 1) {
                nameArr.push({
                  name: 'span',
                  children: [
                    {
                      type: 'text',
                      text: item,
                    },
                  ],
                });
                nameArr.push({
                  name: 'span',
                  attrs: {
                    style: 'color:#ff5000',
                  },
                  children: [
                    {
                      type: 'text',
                      text: '北京市',
                    },
                  ],
                });
              } else {
                nameArr.push({
                  name: 'span',
                  children: [
                    {
                      type: 'text',
                      text: item,
                    },
                  ],
                });
              }
            });
            this.description = nameArr;
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
       * 权益面板按钮点击事件
       */
      handlePanelButtonClick(index) {
        switch (index) {
          case 0:
            uni.navigateTo({
              url: '/pages/rights/right-list',
            });
            break;
          case 1:
            uni.navigateTo({
              url: '/pages/rights/right-unclaimed',
            });
            break;
        }
      },
      /**
       * 医生头像加载失败
       */
      handleHeadLoadFail() {
        // 图片加载失败时显示默认图片
        // this.doctor.headPortrait = require("http://192.168.1.187:10088/static/common/icon-common-logo-watermark.png");
      },
      /**
       * 查看明细点击事件
       */
      handleSeeDetailClick(type) {
        switch (type) {
          case 'annuity':
          case 'allowance':
            //养老金查询 高龄津贴
            uni.navigateTo({
              url: `/pages/rights/record-list?type=${type}`,
            });
            break;
          case 'consumption':
            // 医保消费记录查询
            uni.navigateTo({
              url: '/pages/rights/consumption-record',
            });
            break;
          case 'policy':
            // 优待政策说明
            uni.navigateTo({
              url: '/pages/rights/right-detail',
            });
            break;
          default:
            break;
        }
      },
      /**
       * 预约体检点击事件
       */
      handleExaminationReserveClick() {
        this.$uni.showToast('当前所在地区功能开通中');
        // if(this.medical){
        //   uni.navigateTo({
        //     url: '/pages/rights/hospital-list?medical='+ this.medical + '&list=0',
        //   })
        // }else{
        //   this.$uni.showToast('功能建设中，敬请期待~')
        // }
      },
      /**
       * 健康档案点击事件
       */
      handleHealthRecordClick() {
        this.$uni.showToast('当前所在地区功能开通中');
      },
      /**
       * 电话问诊点击事件
       */
      handlePhoneInquiryClick() {
        this.$uni.showToast('当前所在地区功能开通中');
        // this.$refs.popup.open()
      },
      /**
       * 在线问诊点击事件
       */
      handleOnlineInquiryClick() {
        this.$uni.showToast('当前所在地区功能开通中');
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
        uni.makePhoneCall({
          phoneNumber: this.doctor.tel,
        });
      },
      /**
       * 设置权益面板数据
       */
      setPanelData() {
        this.receivedRightsInfo = {
          title: '已有的权益',
          text: '已领取',
          percent: '90',
          count: '10',
          color1: '#FF5000',
          color2: '#FF8800',
        };
        this.unreceivedRightsInfo = {
          title: '未领取的权益',
          text: '未领取',
          percent: '8',
          count: '2',
          color1: '#2CA3F6',
          color2: '#14C8F7',
        };
      },
      /**
       * 获取小眼睛图标路径
       */
      getStateIconURL(index) {
        const showIcon =
          'http://192.168.1.187:10088/static/user-center/icon-user-center-show-password.png';
        const hideIcon =
          'http://192.168.1.187:10088/static/user-center/icon-user-center-hide-password.png';
        const isShow = [this.showsAnnuityValue, this.showsAllowanceValue, this.showsBalanceValue][
          index
        ];
        return isShow ? showIcon : hideIcon;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .index {
    min-height: 100vh;
    background: #fbf9f7;
    padding-bottom: 1rpx;
    .item {
      margin: 0 32rpx 32rpx;
      .header {
        height: 100rpx;
        border-bottom: 1rpx solid #e5e5e5;
        .see-detail {
          color: #787878;
        }
      }
      .eye-icon {
        @include square(48);
      }
      .state {
        padding: 6rpx 16rpx;
        background: #f5f5f5;
      }
      .c-orange {
        color: #ff5000;
      }
      .c-blue {
        color: #006aff;
      }
      .functions {
        .left {
          width: 230rpx;
          background: rgba(71, 249, 180, 0.18);
          .button {
            @include size(230, 80);
            background: #00c97e;
          }
        }
        .right {
          width: 230rpx;
          background: rgba(213, 239, 254, 0.58);
          .button {
            @include size(230, 80);
            background: #007aff;
          }
        }
        .triangle-icon {
          @include size(28, 18);
          transform: rotate(-90deg);
        }
      }
      .records {
        .record-item {
          background: #f5f5f5;
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
