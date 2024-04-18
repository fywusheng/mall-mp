<template>
  <view class="detal">
    <view v-if="jobContent.postName">
      <view class="top">
        <view class="t">
          <view class="n">{{ jobContent.postName }}</view>
          <view class="p">
            {{ jobContent.wagesMin / 1000 }}-{{ jobContent.wagesMax / 1000 }}k·{{
              jobContent.wagesMonth || 12
            }}薪
          </view>
        </view>
        <view class="year">
          <view class="base">
            <image mode="scaleToFill" src="http://192.168.1.187:10088/static/home/location.png" />
            <view class="name">{{ jobContent.cityName }}</view>
          </view>
          <view class="base">
            <image mode="scaleToFill" src="http://192.168.1.187:10088/static/home/work.png" />
            <view class="name">{{ jobContent.workExperience }}年</view>
          </view>
          <view class="base">
            <image mode="scaleToFill" src="http://192.168.1.187:10088/static/home/mz.png" />
            <view class="name">{{ jobContent.education }}</view>
          </view>
        </view>
        <view v-if="jobContent.labelDTOList.length > 0" class="lab">
          <view v-for="(item, i) in jobContent.labelDTOList" :key="i" class="item_block">
            {{ item.labelName }}
          </view>
        </view>
        <view class="tel_person">
          <image mode="scaleToFill" v-if="jobContent.wechatImg" :src="jobContent.wechatImg" />
          <image
            v-else
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/home/header.png"
          />
          <view class="person">{{ jobContent.linkman }}</view>
        </view>
      </view>
      <view class="descript">
        <view class="title">
          <image src="http://192.168.1.187:10088/static/home/jx.png"></image>
          <view class="des">职位描述</view>
        </view>
        <view class="content">
          {{ jobContent.workDetails }}
        </view>
      </view>
      <view class="descript">
        <view class="title">
          <image src="http://192.168.1.187:10088/static/home/jx.png"></image>
          <view class="des">公司名称</view>
        </view>
        <view class="content">
          {{ jobContent.companyName }}
        </view>
      </view>
      <view class="descript">
        <view class="title">
          <image src="http://192.168.1.187:10088/static/home/jx.png"></image>
          <view class="des">公司地址</view>
        </view>
        <view class="content">地址：{{ jobContent.areaAddress }}</view>
      </view>
      <view class="btn-Bottom"></view>
      <view class="fixBottom">
        <view class="btn" @click="tel(jobContent.linkmanPhone)">立即电话联系</view>
      </view>
    </view>
    <view v-if="loading == 2">
      <view class="flex-v flex-c-c status-box">
        <image
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">暂无内容</view>
      </view>
    </view>
  </view>
</template>
<script>
import api from '@/apis/index.js'
export default {
  data() {
    return {
      loading: 1,
      id: '',
      jobContent: null
    }
  },
  onLoad(e) {
    console.log('===接受到参数=--', e.id)
    this.id = e.id
    this.jobDetail()
  },
  created() {},
  mounted() {},

  // 分享处理
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  methods: {
    jobDetail() {
      api.jobDetail({
        data: { id: this.id },
        success: (data) => {
          this.jobContent = data || {}
          if (!this.jobContent.postName) {
            this.loading = 2
          }
        },
        fail: (erro) => {
          this.loading = 2
        }
      })
    },
    tel(telNum) {
      const token = uni.getStorageSync('token')
      if (token) {
        uni.makePhoneCall({
          phoneNumber: telNum
        })
      } else {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .detal {
    background: #f2f2f2;
    min-height: 100vh;
    .top {
      padding: 24rpx 32rpx 0 34rpx;
      background-color: #fff;
      .t {
        // display: flex;
        // justify-content: space-between;
        .n {
          font-size: 44rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #292626;
          line-height: 60rpx;
          letter-spacing: 1rpx;
          margin-bottom: 32rpx;
        }
        .p {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff5500;
          line-height: 60rpx;
        }
      }
      .year {
        display: flex;
        justify-content: flex-start;
        margin: 32rpx 0rpx;
        .base {
          display: flex;
          justify-content: flex-start;
          margin-right: 46rpx;
          & > image {
            width: 32rpx;
            height: 32rpx;
            margin-right: 6rpx;
            margin-top: 7rpx;
          }
        }
        .name {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3c3d40;
        }
      }
      .lab {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 36rpx;
        flex-wrap: wrap;
        .item_block {
          width: fit-content;
          height: 48rpx;
          border-radius: 4rpx;
          border: 2rpx solid #ff9500;
          line-height: 48rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff9500;
          padding: 0 10rpx;
          margin-right: 14rpx;
          margin-bottom: 10rpx;
        }
      }

      .tel_person {
        border-top: 1rpx solid #d4d4d4;
        height: 110rpx;
        line-height: 110rpx;
        display: flex;
        margin-bottom: 14rpx;
        & > image {
          width: 80rpx;
          height: 80rpx;
          margin-top: 14rpx;
          margin-right: 26rpx;
        }
        .person {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3c3d40;
        }
      }
    }
    .descript {
      padding: 32rpx;
      background-color: #fff;
      margin-bottom: 14rpx;
      .title {
        display: flex;
        justify-content: flex-start;
        & > image {
          width: 8rpx;
          height: 38rpx;
          margin-right: 12rpx;
          margin-top: 5rpx;
        }
        .des {
          font-size: 36rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #28292d;
        }
      }
      .content {
        margin-top: 24rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
    .btn-Bottom {
      height: 160rpx;
    }
    .fixBottom {
      position: fixed;
      bottom: 0;
      background-color: #fff;
      width: 100%;
      .btn {
        text-align: center;
        width: 90%;
        margin: 22rpx auto 27rpx auto;
        height: 108rpx;
        background: linear-gradient(144deg, #ff8800 0%, #ff5000 100%);
        border-radius: 54rpx;
        line-height: 108rpx;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
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
