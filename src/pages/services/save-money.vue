<template>
  <view class="save-money">
    <view class="header">
      <view class="header-wrapper">
        <image class="avatar" :src="userInfo.iconUrl" mode="scaleToFill" />
        <view class="right">
          <view class="name">你好，{{ nameFilter(userInfo.name) }}</view>
          <view>您已尊享商城会员服务{{ day }}天</view>
        </view>
      </view>
    </view>
    <view class="cont">
      <view class="card">
        <me-tabs
          :tabs="tabs"
          field="name"
          v-model="select"
          font-size="36rpx"
          @change="handleTabClick"
        ></me-tabs>
        <view class="time">{{ startTime }}至{{ endTime }}</view>
        <view class="save">
          <view class="circle">
            <!-- 圆环 -->
            <canvas class="canvas-wrapper" canvas-id="saveMoney" id="saveMoney"></canvas>
          </view>
          <view class="bottom">
            <view class="point"></view>
            <text>购物</text>
            <view class="price">省¥{{ totalMoney.toFixed(2) }}</view>
          </view>
        </view>
      </view>
      <view class="line"></view>
      <view class="card">
        <view class="title">
          <image
            class="left"
            src="http://192.168.1.187:10088/static/songhui/services/left.png"
            mode="scaleToFill"
          />
          <text class="txt">省钱明细</text>
          <image
            class="left"
            src="http://192.168.1.187:10088/static/songhui/services/right.png"
            mode="scaleToFill"
          />
        </view>
        <view class="product">
          <view v-for="(item, index) in list" :key="item.id" class="product-list">
            <view class="timer">
              <text>{{ item.createdTime }}</text>
              <text>共 {{ item.itemList.length }} 件商品</text>
            </view>
            <view v-for="(subOrder, subIndex) in item.itemList" :key="subOrder.id">
              <view class="product-info">
                <image class="logo" :src="subOrder.imgUrl" mode="scaleToFill" />
                <view class="right">
                  <view class="name">{{ subOrder.productName }}</view>
                  <view class="total">
                    <text>合计省钱</text>
                    <text class="unit">¥</text>
                    <text class="price">{{ (item.orderAmount - item.paidAmount).toFixed(2) }}</text>
                    <image
                      :class="{ 'icon-bottom': !subOrder.showBenefit }"
                      class="icon"
                      src="http://192.168.1.187:10088/static/songhui/services/top.png"
                      mode="scaleToFill"
                      @click="handleChangeShowBenefit(index, subIndex)"
                    />
                  </view>
                </view>
              </view>
              <view v-if="subOrder.showBenefit" class="benefit-info">
                <view class="item">
                  <view class="desc">购物优惠</view>
                  <view class="benefit-price">
                    <text class="unit">¥</text>
                    <text class="number">12.00</text>
                  </view>
                </view>
                <view class="item">
                  <view class="desc">专享优惠券</view>
                  <view class="benefit-price">
                    <text class="unit">¥</text>
                    <text class="number">{{ item.couponAmount }}</text>
                  </view>
                </view>
                <view class="item">
                  <view class="desc">运费优惠</view>
                  <view class="benefit-price">
                    <text class="unit">¥</text>
                    <text class="number">12.00</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="line"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="open-btn" @click="openMember">
      <view class="txt">续费商城会员 享更多优惠</view>
      <view class="mask-btn">立即续费</view>
    </view>
  </view>
</template>
<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import { desensitizeName } from '@/utils/desensitization.js'
export default {
  data() {
    return {
      day: 0, // 成为会员天数
      memberStartTime: '', // 成为会员开始时间
      startTime: '',
      endTime: '',
      percent: 100,
      select: 0,
      totalMoney: 0,
      bottomTips: '',
      list: [],
      tabs: [{ name: '累计省钱' }, { name: '本周期省钱' }]
    }
  },
  created() {
    this.setTime()
    this.getShopOrderList()
    this.getTotalSaveMoney()
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    // 姓名过滤器, 用于姓名脱敏
    nameFilter(value) {
      return desensitizeName(value)
    },
    handleChangeShowBenefit(index, subIndex) {
      this.list[index].itemList[subIndex].showBenefit =
          !this.list[index].itemList[subIndex].showBenefit
    },
    openMember() {
      uni.navigateTo({ url: '/pages/user-center/activate-member' })
    },
    handleTabClick(index) {
      this.list = []
      this.$nextTick(() => {
        this.setTime()
        this.getShopOrderList()
        this.getTotalSaveMoney()
      })
    },
    setTime() {
      // this.startTime = dayjs()
      //   .subtract(this.select == 0 ? 5 : 1, 'year')
      //   .format('YYYY-MM-DD');
      // this.endTime = dayjs().format('YYYY-MM-DD');

      // if (this.select == 0) {
      this.startTime = this.userInfo.usageTime
      this.endTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      // }

      this.day = dayjs().diff(this.userInfo.usageTime, 'day')
    },
    // canvas
    initCanvas() {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#saveMoney')
        .boundingClientRect((data) => {
          const { width, height } = data
          const ctx = uni.createCanvasContext('saveMoney')
          ctx.scale(width / 126, height / 126) // 页面适配，获取缩放比例进行缩放
          // 先填充一个完整的圆作为背景
          ctx.beginPath() // 开始路径
          ctx.arc(63, 63, 52, 0, 2 * Math.PI)
          ctx.setStrokeStyle('#F2F2F2')
          ctx.setLineWidth(15) // 设置填充线宽
          ctx.stroke() // 开始描边
          ctx.closePath() // 结束路径
          // 起始位置在最上面，所以是-(Math.PI / 2)
          const startRadian = -(Math.PI / 2)
          // 根据百分比计算对应的弧度得出结束位置
          const angle = (360 * this.percent) / 100
          const radian = (angle * Math.PI) / 180
          const endRadian = startRadian + radian
          // 绘制进度条
          ctx.beginPath()
          ctx.arc(63, 63, 52, startRadian, endRadian) // 创建圆弧
          ctx.setStrokeStyle('#ff5500') // 设置填充颜色
          ctx.setLineWidth(10) // 设置填充线宽
          ctx.stroke() // 开始描边
          ctx.closePath()
          // 绘制进度条中间文字
          ctx.beginPath()
          ctx.setFontSize(14)
          ctx.setFillStyle('#666666')
          ctx.setTextAlign('center') // 设置文字居中
          ctx.fillText('我累计已省', 126 / 2, 126 / 2 - 5) // 第二个参数需要设置canvas宽度的一半
          ctx.closePath()
          // 绘制进度条中间百分比
          ctx.beginPath()
          ctx.setFontSize(16)
          ctx.setFillStyle('#ff5500')
          ctx.setTextAlign('center')
          ctx.fillText('¥' + this.totalMoney.toFixed(2), 126 / 2, 126 / 2 + 25)
          ctx.closePath()
          ctx.draw()
        })
        .exec()
    },
    // 获取累计省钱详情
    async getTotalSaveMoney() {
      const result = await Axios.post('/order/getMemberSaveMoney', {
        memberSaveMoneyFlag: true,
        startTime: this.startTime,
        endTime: this.endTime
      })
      if (result.code === '200') {
        this.totalMoney = result.data
        this.initCanvas()
      }
    },
    // 获取省钱明细
    async getShopOrderList() {
      uni.showLoading({
        title: '加载中'
      })
      const params = {
        pageNum: 1,
        numPerPage: 20,
        sceneType: '',
        memberSaveMoneyFlag: true,
        startTime: this.startTime,
        endTime: this.endTime
      }
      const result = await Axios.post('/order/list', params)
      uni.hideLoading()
      if (result.code == 200) {
        const list = result.data.list || []
        const res = []
        list.forEach((data) => {
          const itemList = []
          if (data.storeOrderItems) {
            data.storeOrderItems.forEach((orderItemModel) => {
              orderItemModel.items.forEach((item) => {
                item.showBenefit = false
                itemList.push(item)
              })
            })
            // const tempData = _.pick(data, [
            //   'createdTime',
            //   'orderId',
            //   'orderStatus',
            //   'totalQuantity',
            //   'orderType',
            //   'orderAmount',
            //   'orderStatusLabel',
            //   'payableAmount',
            //   'storeName',
            //   'storeId',
            //   'hzhH5',
            // ]);
            const tempData = data
            tempData.itemList = itemList
            tempData.orderMallIcon = data.storeOrderItems[0].orderMallIcon
            res.push(tempData)
          }
        })
        // return res;
        this.list = this.list.concat(res)
      } else {
        uni.showToast(result.msg)
      }
      if (result.total > 5) {
        this.bottomTips = result.hasNextPage ? 'more' : 'nomore'
      } else {
        this.bottomTips = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .save-money {
    position: relative;
    .header {
      width: 750rpx;
      height: 206rpx;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      .header-wrapper {
        width: 686rpx;
        height: 158rpx;
        background-image: url('http://192.168.1.187:10088/static/songhui/services/top-bg.png');
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        padding: 18rpx 22rpx;
        .right {
          height: 116rpx;
          margin-left: 22rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          font-size: 32rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
          .name {
            height: 56rpx;
            font-size: 40rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            line-height: 56rpx;
          }
        }
        .avatar {
          width: 116rpx;
          height: 116rpx;
          // background: gold;
        }
      }
    }
    .cont {
      position: absolute;
      left: 0;
      top: 183rpx;
      width: 100vw;
      padding-bottom: 112rpx;
      border-radius: 16rpx 16rpx 0 0;
      background: #ffffff;
      .line {
        width: 750rpx;
        height: 18rpx;
        background: #f2f2f2;
      }
      .card {
        padding: 32rpx;
        border-radius: 16rpx 16rpx 0 0;
        .time {
          width: 686rpx;
          height: 50rpx;
          margin-top: 30rpx;
          line-height: 50rpx;
          text-align: center;
          background: #ffefe6;
          border-radius: 8rpx;
          font-size: 32rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #ff5500;
        }
        .save {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-top: 30rpx;
          .circle {
            width: 424rpx;
            height: 424rpx;
            // background: red;
            .canvas-wrapper {
              width: 424rpx;
              height: 424rpx;
            }
          }
          .bottom {
            width: 686rpx;
            height: 76rpx;
            background: #f2f2f2;
            border-radius: 16rpx;
            font-size: 36rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #333333;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 30rpx;

            .point {
              width: 24rpx;
              height: 24rpx;
              margin-right: 10rpx;
              border-radius: 12rpx;
              background: linear-gradient(315deg, #fc7243 0%, #fda147 100%);
            }
            .price {
              height: 56rpx;
              font-size: 40rpx;
              font-family: PingFangSC, PingFang SC;
              font-weight: 500;
              color: #ff5500;
              line-height: 56rpx;
              margin-left: 24rpx;
            }
          }
        }
        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          .left,
          .right {
            width: 62rpx;
            height: 16rpx;
          }
          .txt {
            height: 60rpx;
            font-size: 44rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 60rpx;
            margin: 0 26rpx;
          }
        }
        .product {
          margin-top: 40rpx;
          .product-list {
            margin-bottom: 24rpx;
            .timer {
              width: 686rpx;
              height: 48rpx;
              background: #f2f2f2;
              color: #999999;
              padding: 0 10rpx;
              border-radius: 8rpx;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .product-info {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin: 20rpx 0;

              .logo {
                width: 224rpx;
                height: 224rpx;
                // background: gold;
              }
              .right {
                width: 442rpx;
                height: 224rpx;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .name {
                  width: 442rpx;
                  height: 100rpx;
                  font-size: 36rpx;
                  font-family: PingFangSC, PingFang SC;
                  font-weight: 400;
                  color: #333333;
                  line-height: 50rpx;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                }
                .total {
                  width: 442rpx;
                  height: 72rpx;
                  background-image: url('http://192.168.1.187:10088/static/songhui/services/total.png');
                  background-size: 100% 100%;
                  display: flex;
                  align-items: center;
                  padding-left: 64rpx;
                  padding-right: 30rpx;
                  font-size: 32rpx;
                  font-family: PingFangSC, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                  .icon {
                    width: 48rpx;
                    height: 48rpx;
                    margin-left: 52rpx;
                    &.icon-bottom {
                      transform: rotate(180deg);
                    }
                  }
                  .unit {
                    margin-left: 10rpx;
                  }
                  .price {
                    font-size: 40rpx;
                  }
                }
              }
            }
            .benefit-info {
              width: 686rpx;
              height: 140rpx;
              background: #ffefe6;
              border-radius: 16rpx;
              display: flex;
              align-items: center;
              justify-content: space-evenly;
              .item {
                font-size: 32rpx;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #666666;
                text-align: center;
                .benefit-price {
                  .unit {
                    font-size: 28rpx;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 400;
                    color: #333333;
                  }
                  .number {
                    font-size: 40rpx;
                    color: #333333;
                  }
                }
              }
            }
            .line {
              width: 686rpx;
              height: 2rpx;
              margin-top: 40rpx;
              background: #ebedf0;
            }
          }
        }
      }
    }
    .open-btn {
      position: fixed;
      bottom: 18rpx;
      left: 32rpx;
      width: 686rpx;
      height: 112rpx;
      background-image: url('http://192.168.1.187:10088/static/songhui/services/xufei-bg.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 36rpx;
      .txt {
        width: 408rpx;
        height: 50rpx;
        font-size: 36rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #6b4924;
        line-height: 50rpx;
      }
      .mask-btn {
        width: 186rpx;
        height: 72rpx;
        background: linear-gradient(90deg, #af763a 0%, #71471c 100%);
        border-radius: 40rpx;
        font-size: 36rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 72rpx;
        text-align: center;
      }
      // background: linear-gradient(134deg, #f6be81 0%, #fadfc2 40%, #f6be81 100%);
      // box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(191, 142, 87, 0.71);
      // border-radius: 16rpx;
    }
  }
</style>
