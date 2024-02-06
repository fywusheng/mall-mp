// 米粒下单支付
<template>
  <view class="mili-pay">

  </view>
</template>

<script>
import api from '@/apis/index.js'
export default {
  data() {
    return {
      params: {
        flag: '', // 0→ 提交订单    1→ 已下单，继续付款
        productPrice: '', // 价格
        transactionSerialNo: '' // 订单编号

      }
    }
  },
  onLoad(options) {
    this.params.flag = options.flag
    console.log('flag: ', options.flag)
    this.params.productPrice = options.productPrice
    this.params.transactionSerialNo = options.transactionSerialNo
    if (this.params.flag == 1) {
      this.continuePay()
    } else {
      this.submitOrder()
    }
  },

  methods: {
    // 提交订单
    submitOrder() {
      const data = this.makeParams()
      api.putHotelOrder({
        showsLoading: true,
        data,
        success: (data) => {
          const url = `${ENV.H5}/#/checkstand?cashId=${data}`
          // #ifdef MP-ALIPAY
          uni.reLaunch({
            url: `/pages/common/webpage?url=${url}`
          })
          // #endif

          // #ifdef MP-WEIXIN
          uni.reLaunch({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
          })
          // #endif
        }
      })
    },
    // 继续付款
    continuePay() {
      // const data = this.makeParams()
      api.continuePayOrder({
        showsLoading: true,
        data: { orderNo: this.params.transactionSerialNo },
        success: (res) => {
          // 交易状态（0-未支付、1-已支付）
          const { transactionStatus, orderId } = res
          if (transactionStatus == 1) {
            this.$uni.showToast('该订单已支付')
            return
          }
          const url = `${ENV.H5}/#/checkstand?cashId=${orderId}`
          // #ifdef MP-ALIPAY
          uni.reLaunch({
            url: `/pages/common/webpage?url=${url}`
          })
          // #endif

          // #ifdef MP-WEIXIN
          uni.reLaunch({
            url: `/pages/common/webpage?url=${encodeURIComponent(url)}`
          })
          // #endif
        }
      })
    },
    // 组合参数
    makeParams() {
      const userInfo = uni.getStorageSync('userInfo')
      return {
        productPrice: this.params.productPrice * 100,
        transactionSerialNo: this.params.transactionSerialNo,
        orderSource: 5,
        supermarketId: 5,
        supermarketName: '米粒',
        uactId: userInfo.uactId
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.mili-pay {
  height: 100vh;
  background: #ffffff;
}
</style>
