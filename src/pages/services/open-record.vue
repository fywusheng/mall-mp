<template>
  <view class="open-record">
    <view v-for="item in list" :key="item.orderId" class="open-list">
      <view :class="{ active: item.actived }" class="list-item">
        <view class="name">{{ item.orderDetailDTO.productName }}</view>
        <view class="time">{{ item.paymentTime }}支付成功</view>
        <view class="valid-time">
          商城会员卡有效期：{{ item.orderDetailDTO.usageTime }}-{{
            item.orderDetailDTO.expirationTime
          }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import api from '@/apis/index.js';
  import dayjs from 'dayjs';
  export default {
    data() {
      return {
        list: [],
      };
    },
    created() {
      this.getMemberRecordInfo();
    },
    methods: {
      getMemberRecordInfo() {
        api.getOrderList({
          data: {
            pageNum: 1,
            pageSize: 100,
            orderSource: 6,
            orderStatus: 3,
          },
          success: (data) => {
            const firstData = data.list[0];
            firstData.actived = dayjs().isBefore(firstData.orderDetailDTO.expirationTime);
            data.list.forEach((element) => {
              element.paymentTime = element.paymentTime.split('-').join('.');
              element.orderDetailDTO.usageTime = element.orderDetailDTO.usageTime
                .split('-')
                .join('.');
              element.orderDetailDTO.expirationTime = element.orderDetailDTO.expirationTime
                .split('-')
                .join('.');
            });
            this.list = data.list;

            console.log('data: ', data);
          },
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .open-record {
    background: #ffffff;
    min-height: 100vh;
    .open-list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .list-item {
        display: flex;
        flex-direction: column;
        width: 686rpx;
        height: 300rpx;
        padding: 32rpx 22rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #271d1a;
        background-size: 100% 100%;
        background-image: url('http://192.168.1.187:10088/static/songhui/services/member-bg.png');
        &.active {
          background-image: url('http://192.168.1.187:10088/static/songhui/services/member-bg-active.png');
        }
        .name {
          font-size: 44rpx;
          font-weight: 500;
        }
        .time {
          color: #666666;
          font-size: 32rpx;
          margin-top: 12rpx;
        }
        .valid-time {
          margin-top: 76rpx;
        }
      }
    }
  }
</style>
