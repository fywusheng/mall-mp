<template>
  <view class="trade">
    <view class="spaceH"></view>
    <view class="center" v-if="list.length > 0">
      <view class="line" v-for="(item, i) in list" :key="i">
        <view
          class="parent"
          :class="{ clicked: selValue == item.id ? true : false }"
          @click="selectJob(item)"
        >
          <image
            v-if="selValue == item.id"
            class="left"
            src="http://192.168.1.187:10088/static/home/leftLight.png"
          ></image>
          <view class="pname">{{ item.postTypeName }}</view>
          <image
            class="right"
            v-if="selValue == item.id"
            src="http://192.168.1.187:10088/static/home/rightLight.png"
          ></image>
          <image
            class="right"
            v-else
            src="http://192.168.1.187:10088/static/home/right.png"
          ></image>
        </view>
        <view class="_right" v-if="selValue == item.id">
          <view
            class="child"
            :class="{ clickedChild: childValue == v.id }"
            @click="childClick(v)"
            v-for="(v, index) in item.childList"
            :key="index"
          >
            <image
              v-if="childValue == v.id"
              class="left"
              src="http://192.168.1.187:10088/static/home/correct.png"
            ></image>
            <view class="right_n" :class="{ rightClicked: childValue == v.id }">
              {{ v.postTypeName }}
            </view>
          </view>
        </view>
      </view>
      <view class="bottom_btn">
        <view class="reset" @click="resetHandler">重置</view>
        <view class="confirm" @click="okHandler">确认</view>
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
      childValue: '',
      selValue: '',
      list: [],
      seletName: ''
    }
  },
  created() {
    this.getTradeList()
  },
  mounted() {},
  onShow() {
    this.selValue = uni.getStorageSync('parentChoice')
    this.childValue = uni.getStorageSync('childChoice')
    this.seletName = uni.getStorageSync('seletName')
  },
  // 分享处理
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  methods: {
    resetHandler() {
      uni.removeStorageSync('childChoice')
      uni.removeStorageSync('seletName')
      uni.navigateBack()
    },
    okHandler() {
      uni.setStorageSync('parentChoice', this.selValue)
      uni.setStorageSync('childChoice', this.childValue)
      uni.setStorageSync('seletName', this.seletName)
      uni.navigateBack()
    },
    selectJob(item) {
      this.selValue = item.id
    },
    childClick(v) {
      this.childValue = v.id
      this.seletName = v.postTypeName
      console.log('===点击--', v.id, v.postTypeName)
    },
    getTradeList() {
      api.getTradeList({
        success: (data) => {
          this.list = data || []
          if (this.list.length > 0) {
            this.selValue = this.list[0].id
          } else {
            this.loading = 2
          }
        },
        fail: (erro) => {
          this.loading = 2
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .trade {
    background-color: #fff;
    min-height: 100vh;
    .spaceH {
      height: 24rpx;
      width: 100%;
    }
    .center {
      padding-bottom: 190rpx;
    }
    .line {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      .parent {
        background: #f5f5f5;
        width: 50%;
        display: flex;
        justify-content: space-around;
        .pname {
          width: 79%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-left: 15rpx;
        }
        .left {
          width: 6rpx;
          height: 38rpx;
          margin-top: 26rpx;
        }
        .right {
          width: 32rpx;
          height: 32rpx;
          margin-top: 29rpx;
        }
      }
      .clicked {
        background-color: #fff !important;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff5500;
      }
      ._right {
        display: flex;
        flex-direction: column;
        width: 50%;
        position: absolute;
        top: 24rpx;
        left: 50%;
        background-color: #fff;
        .child {
          width: 100%;
          display: flex;
          justify-content: center;
          & > image {
            width: 24rpx;
            height: 16rpx;
            margin-top: 40rpx;
            margin-left: 24rpx;
            margin-right: 14rpx;
          }
        }
        .clickedChild {
          font-weight: 500;
          color: #ff5500;
        }
        .right_n {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-left: 60rpx;
        }
        .rightClicked {
          margin-left: 0rpx;
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
    .bottom_btn {
      display: flex;
      justify-content: space-around;
      height: 137rpx;
      background-color: #fff;
      text-align: center;
      padding-top: 28rpx;
      position: fixed;
      bottom: 0;
      width: 100%;
      .reset {
        width: 328rpx;
        height: 108rpx;
        background: #ffffff;
        border: 2rpx solid #dcdee0;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 108rpx;
        border-radius: 54rpx;
      }
      .confirm {
        width: 328rpx;
        height: 108rpx;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
        border-radius: 54rpx;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 108rpx;
      }
    }
  }
</style>
