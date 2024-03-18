<template>
  <view class="job2">
    <view class="center_list" v-if="jobList.length > 0">
      <view class="item" v-for="(item, i) in jobList" :key="i" @click="goDetailJob(item.id)">
        <view class="t">
          <view class="n">{{ item.postName }}</view>
          <view class="p">
            <view>{{ item.wagesMin / 1000 }}</view>
            <view v-if="item.wagesMax">-{{ item.wagesMax / 1000 }}</view>
            k
          </view>
        </view>
        <view class="flag">
          <view class="b">{{ item.cityName }}</view>
          <view class="b">{{ item.workExperience }}年</view>
          <view class="b">{{ item.education }}</view>
        </view>
        <view class="company">{{ item.companyName }}</view>
      </view>
    </view>
    <view v-else>
      <view class="flex-v flex-c-c status-box">
        <image
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
          mode="scaleToFill"
        />
        <view class="flex-c-c status-text">暂无相关职位</view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    props: {
      jobList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 20,
      };
    },
    created() {},
    mounted() {},
    onShareAppMessage() {
      return {
        title: '',
        path: '/pages/index/index?index=0',
      };
    },
    methods: {
      goDetailJob(id) {
        uni.navigateTo({ url: '/pages/job/jobDetail?id=' + id });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '~@/styles/base';
  .job2 {
    background-color: #f5f5f5;
    min-height: 100vh;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 10;
    .center_list {
      background-color: #f5f5f5;
      padding: 24rpx 32rpx 24rpx 32rpx;
      margin-top: 110rpx;
      .item {
        background: #ffffff;
        border-radius: 16px;
        padding: 24rpx;
        margin-bottom: 24rpx;
        .t {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24rpx;
          .n {
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            width: 56%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .p {
            display: flex;
            justify-content: flex-end;
            font-size: 40rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ff5500;
          }
        }
        .flag {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 24rpx;
          .b {
            width: fit-content;
            height: 48rpx;
            border-radius: 4rpx;
            border: 2rpx solid #1890ff;
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1890ff;
            line-height: 48rpx;
            padding: 0 7rpx;
            margin-right: 20rpx;
          }
        }
        .company {
          font-size: 32rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
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
  }
</style>
