<template>
  <view class="page-logistics-info">
    <view class="info-list">
      <image
        class="icon"
        src="http://192.168.1.187:10088/static/songhui/common/logistics-icon.png"
        mode="scaleToFill"
      />
      <view class="right">
        <view class="info">快递公司: {{ orderExpressModel.expressProviderName }}</view>
        <view class="r-b">
          <view class="info">物流单号: {{ orderExpressModel.trackingNumber }} </view>
          <view class="copy" @click="handleClickCopy">复制</view>
         </view>
      </view>
     
    </view>
    <view class="trace-list">
      <log-steps :stepData="logistics.traceList" colors="#303133" />
    </view>
  </view>
</template>

<script>
  import LogSteps from './log-steps.vue';
  export default {
    components: {
      LogSteps,
    },
    data() {
      return {
        orderExpressModel: {
          expressProviderName: '',
          trackingNumber: '',
        },
        logistics: {
          traceList: [],
        },
      };
    },
    methods: {
      handleClickCopy() {
        uni.setClipboardData({
          data: this.orderExpressModel.trackingNumber,
          success: (res) => {
            uni.getClipboardData({
              success: (resp) => {
                console.log('resp:', resp);
                uni.showToast({
                  title: '已复制到剪贴板',
                });
              },
            });
          },
        });
      },
      async loadData() {
        this.loading = true;
        uni.showLoading();
        const result = await Axios.post('/express/getKdnExpress', {
          orderNo: this.id,
          // shipperCode: 'ZTO', // 测试用
          // logisticCode: '78414469979642', // 测试用
        });
        uni.hideLoading();
        this.loading = false;
        if (result.code == 200) {
          result.data.Traces.reverse()
          result.data.Traces.forEach((e, index) => {
            e.isNow = index ===0?1:0;
            e.type = 1;
            e.name = e.acceptStation;
            e.time = e.acceptTime;
          });
          this.logistics.traceList = result.data.Traces;
          this.orderExpressModel.expressProviderName = result.data.companyName
          this.orderExpressModel.trackingNumber = result.data.LogisticCode
        } else {
          uni.showToast(result.result.message);
        }
      },
    },
    onUnload() {
      this.order = {};
    },
    onPageScroll(e) {
      // this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight);
    },
    async mounted() {
      this.id = this.$root.$mp.query.id;
      this.loadData();
    },
  };
</script>

<style lang="scss">
  .page-logistics-info {
    padding: 16rpx 0;
    background: #F9F9F9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .info-list {
      width: 702rpx;
      height: 160rpx;
      background: #FFFFFF;
      border-radius: 16rpx;
      margin-bottom: 24rpx;
      background-image: url('http://192.168.1.187:10088/static/songhui/common/logistics-bg.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      padding: 28rpx 32rpx;
      .icon {
        width: 104rpx;
        height: 104rpx;
        margin-right: 24rpx;
      }
      .right {
        height: 104rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .r-b {
          display: flex;
          align-items: center;
          .info {
            height: 34rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #939099;
            line-height: 34rpx;
            font-style: normal;
            margin-right: 32rpx;
          }
          .copy{
            width: 80rpx;
            height: 38rpx;
            border-radius: 19rpx;
            border: 1rpx solid #FF5500;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 24rpx;
            color: #FF5500;
            line-height: 38rpx;
            text-align: center;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .info {
        height: 44rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #303133;
        line-height: 44rpx;
        font-style: normal;
        font-size: 36rpx;
        color: #333;
      }
    }
    .trace-list {
      width: 702rpx;
      background: #FFFFFF;
      border-radius: 16rpx;
      border: 2rpx solid #FFFFFF;
      .trace {
        position: relative;
        padding-left: 30rpx;
        padding-top: 30rpx;
        font-size: 32rpx;
        color: #333;
        .line {
          position: absolute;
          left: 5rpx;
          top: 0;
          bottom: 0;
          border-left: 1px solid #f2f2f2;
        }
      }
    }
  }
</style>
