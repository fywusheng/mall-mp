// 老年补贴
<template>
  <view class="older-allowance">
    <view class="top-img">
      <image class="icon" :src="icon" mode="scaleToFill" />
    </view>
    <view class="tab">
      <swiper-tab
        :tab-list="tabList"
        :tabClickIndex="tabClickIndex"
        @onTap="hanldeOnTap"
        ref="topTab"
      ></swiper-tab>
    </view>

    <image v-if="tabClickIndex == 0" class="icon-cont" :src="tabArry[0]" mode="widthFix" />
    <image v-if="tabClickIndex == 1" class="icon-cont" :src="tabArry[1]" mode="widthFix" />
    <image v-if="tabClickIndex == 2" class="icon-cont" :src="tabArry[2]" mode="widthFix" />

    <image class="icon-buttom" :src="iconBottom" mode="scaleToFill" @click="takePhone" />
  </view>
</template>

<script>
import SwiperTab from './components/swiper-tab.vue'
export default {
  data() {
    return {
      tabClickIndex: '',
      icon: 'http://192.168.1.187:10088/static/rights/icon-older-allowance.png',
      iconBottom: 'http://192.168.1.187:10088/static/rights/icon-zixun.png',
      tabArry: [
        'http://192.168.1.187:10088/static/rights/icon-tab1.png',
        'http://192.168.1.187:10088/static/rights/icon-tab2.png',
        'http://192.168.1.187:10088/static/rights/icon-tab3.png'
      ],
      tabList: [
        { name: '高龄津贴', value: '0' },
        { name: '失能老人补贴', value: '1' },
        { name: '地区性福利补贴', value: '2' }
      ]
    }
  },
  components: { SwiperTab },
  onLoad(e) {
    this.tabClickIndex = e.index || '0'
    this.$nextTick(() => {
      this.$refs.topTab.setIndex(this.tabClickIndex)
    })
  },
  methods: {
    hanldeOnTap(e) {
      this.tabClickIndex = e.value
      this.iconTab = this.tabArry[this.tabClickIndex]
    },
    takePhone() {
      uni.makePhoneCall({
        phoneNumber: '12345'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .older-allowance {
    background: #f5f5f5;
    padding-bottom: 160rpx;
    .tab {
      position: sticky;
      top: 0;
      left: 0;
    }
    .top-img {
      display: flex;
      justify-content: center;
      align-content: center;
      background: #ffffff;
    }
    .icon {
      width: 686rpx;
      height: 224rpx;
      padding: 32rpx;
      display: block;
    }
    .icon-cont {
      width: 100%;
      margin-top: 24rpx;
    }
    .icon-buttom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 160rpx;
    }
  }
</style>
