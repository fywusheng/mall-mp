// 维权服务
<template>
  <view class="activist">
    <view class="top">
      <image class="icon-bg" :src="iconBg" mode="scaleToFill" />
      <view class="txt">
        <view class="left">
          <view class="count">{{ upholdRightsClickNum }}</view>
          <view class="unit">累计有效维权(件)</view>
        </view>
        <view class="right">
          <view class="count">{{ upholdRightsUserNum }}</view>
          <view class="unit">累计服务用户(人)</view>
        </view>
      </view>
    </view>
    <view class="middle">
      <view class="icon-left"></view>
      <view class="txt">请您选择要咨询的维权类型</view>
      <view class="icon-right"></view>
    </view>
    <view class="right-wrapper">
      <view
        v-for="item in rightList"
        :key="item.type"
        class="list-item"
        @click="getPhoneNum(item.type)"
      >
        <image class="icon" :src="item.url" mode="scaleToFill" />
        <view class="txt">{{ item.txt }}</view>
      </view>
    </view>

    <pop-modal
      ref="confirmPop"
      cancelText="取消"
      title=" "
      confirmText="拨打电话"
      @confirm="handlConfirmPop"
      @cancel="handleCancel"
    >
      <view slot="text">
        <view class="confirm-main" style="height: unset; width: 440rpx">
          <view class="content">是否同意拨打电话给您的 专属律师进行维权咨询?</view>
        </view>
      </view>
    </pop-modal>

    <know-modal ref="knowPop"></know-modal>
  </view>
</template>

<script>
import PopModal from '@/components/common/modal.vue'
import KnowModal from './components/modal-know.vue'
import api from '@/apis/index.js'

export default {
  data() {
    return {
      iconBg: 'http://192.168.1.187:10088/static/services/icon-activist-bg.png',
      rightList: [
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-1.png',
          type: 0,
          txt: '赡养抚养'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-2.png',
          type: 1,
          txt: '住房维权'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-3.png',
          type: 7,
          txt: '债权债务'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-4.png',
          type: 8,
          txt: '劳动仲裁'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-5.png',
          type: 2,
          txt: '婚姻自由'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-6.png',
          type: 3,
          txt: '消费权益'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-7.png',
          type: 4,
          txt: '土地承包'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-8.png',
          type: 5,
          txt: '集资诈骗'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-9.png',
          type: 6,
          txt: '医疗纠纷'
        },
        {
          url: 'http://192.168.1.187:10088/static/services/icon-right-10.png',
          type: 9,
          txt: '其他'
        }
      ],
      // 累计服务用户数
      upholdRightsUserNum: 0,
      // 累计有效维权数
      upholdRightsClickNum: 0
    }
  },
  components: { PopModal, KnowModal },
  mounted() {
    this.getUploadNum()
  },
  methods: {
    handleCancel() {
      this.$refs.confirmPop.close()
    },
    handlConfirmPop() {
      this.$refs.confirmPop.close()
      if (this.phoneNum) {
        uni.makePhoneCall({
          phoneNumber: this.phoneNum
        })
      } else {
        this.$refs.knowPop.open()
      }
      this.getUploadNum(2)
    },
    getPhoneNum(type) {
      const token = uni.getStorageSync('token')
      if (!token) {
        uni.navigateTo({ url: '/pages/user-center/login' })
        return
      }
      api.getPhoneNumByType({
        data: { upholdRightsTypeCode: type },
        success: (data) => {
          this.phoneNum = data
          this.$refs.confirmPop.open()
        },
        fail: (error) => {
          this.phoneNum = ''
          console.log(error)
        }
      })
    },
    getUploadNum(queryType = 1) {
      api.findCountForRights({
        data: { queryType },
        success: (data) => {
          this.upholdRightsUserNum = data.upholdRightsUserNum
          this.upholdRightsClickNum = data.upholdRightsClickNum
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .activist {
    .top {
      width: 750rpx;
      height: 350rpx;
      position: relative;
      .icon-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 350rpx;
        z-index: -1;
      }
      .txt {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        .left,
        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 32rpx;
          color: #c28633;
          .count {
            font-size: 52rpx;
            color: #955700;
          }
        }
      }
    }
    .middle {
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-left {
        width: 116rpx;
        height: 4rpx;
        background: linear-gradient(to right, transparent, rgba(253, 131, 30, 1));
      }
      .icon-right {
        width: 116rpx;
        height: 4rpx;
        background: linear-gradient(to right, rgba(253, 131, 30, 1), transparent);
      }
      .txt {
        margin: 0 10rpx;
      }
    }
    .right-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .list-item {
        width: 332rpx;
        height: 148rpx;
        background: #ffffff;
        box-shadow: 0px 2rpx 16rpx 0px rgba(232, 215, 198, 0.5);
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        margin-bottom: 32rpx;
        .icon {
          width: 86rpx;
          height: 86rpx;
          margin: 0 34rpx 0 16rpx;
        }
        .txt {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 44rpx;
        }
      }
    }
    .confirm-main {
      width: 552rpx;
      margin: 0 auto;
      height: 180rpx;
      text-align: center;
      font-size: 40rpx;
      line-height: 54rpx;
      .wen {
        color: #ff5500;
      }
    }
  }
</style>
