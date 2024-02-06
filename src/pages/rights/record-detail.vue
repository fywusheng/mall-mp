<template>
  <view class="record-detail">
    <view class="flex-v m-32 p-32 bg-white br-16">
      <text class="title fs-36">收入金额（人民币元）</text>
      <text class="fs-64 c-black m-24-0">{{info.grantAmount}}</text>
      <view class="flex-h">
        <text class="title fs-36 w-180">对方账户名称/账户</text>
        <view class="flex-v flex-1 ml-64">
          <text class="fs-36 c-black">
            {{info.otherAccountName}}
          </text>
          <text class="fs-36 c-black">
            <!-- ******0134 -->
          </text>
        </view>
      </view>
    </view>
    <view class="flex-v m-32 p-32 bg-white br-16">
      <view class="flex-h">
        <text class="title fs-36 w-180">交易日期</text>
        <text class="fs-36 c-black flex-1 ml-64">{{info.endAccountDate.substr(0,4)}}/{{info.endAccountDate.substr(4,2)}}/{{info.endAccountDate.substr(6,2)}}</text>
      </view>
      <view class="flex-h mt-32">
        <text class="title fs-36 w-180">摘要</text>
        <text class="fs-36 c-black flex-1 ml-64">{{info.abstractA}}</text>
      </view>
      <view class="flex-h mt-32">
        <text class="title fs-36 w-180">附言</text>
        <text class="fs-36 c-black flex-1 ml-64">
          {{info.postScript}}
          <!-- 机关事业单位养老保险#2016997#23942190923848#100023123 -->
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data(){
    return{
      info:{
        abstractA:'',
        postScript:'',
        endAccountDate:'',
        otherAccountName:'',
        grantAmount:'',
      }
    }
  },
  onLoad(option) {
   
    this.setTitle('养老金明细');
    // console.log("option:",JSON.parse(option.item))
    this.info = JSON.parse(option.item)

  },
  methods: {
    /**
     * 设置导航栏标题
     */
    setTitle(e) {
      this.type = e.type;
      const titles = { annuity: "养老金明细", allowance: "高龄津贴明细" };
      this.$uni.setTitle(titles[this.type]);
    },
  },
};
</script>

<style lang="scss" scoped>
.record-detail {
  min-height: calc(100vh - 1rpx);
  background: #fbf9f7;
  padding-top: 1rpx;
  .title {
    @include text-line(2);
    color: #787878;
  }
  .w-180 {
    width: 180rpx;
  }
  text {
    word-break: break-all;
  }
}
</style>
