<template>
  <view class="open-record">
    <view class="open-list">
      <view class="list-item">
        <view class="name">商城会员年卡</view>
        <view class="time">2023.2.1支付成功</view>
        <view class="valid-time">商城会员卡有效期：2023.02.01-2024.02.02</view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        percent: 50,
        select: 0,
        randomId: '123',
        tabs: [{ name: '累计省钱' }, { name: '本周期省钱' }],
      };
    },
    onLoad(e) {},
    created() {},
    methods: {
      openMember() {
        uni.navigateTo({ url: '/pages/user-center/activate-member' });
      },
      handleTabClick(index) {
        // this.tabIndex = index;
      },
      // canvas
      initCanvas() {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('#saveMoney')
          .boundingClientRect((data) => {
            const { width, height } = data;
            const ctx = uni.createCanvasContext('saveMoney');

            ctx.scale(width / 126, height / 126); // 页面适配，获取缩放比例进行缩放

            // 先填充一个完整的圆作为背景
            ctx.beginPath(); // 开始路径
            ctx.arc(63, 63, 52, 0, 2 * Math.PI);
            ctx.setStrokeStyle('#F2F2F2');
            ctx.setLineWidth(15); // 设置填充线宽
            ctx.stroke(); // 开始描边
            ctx.closePath(); // 结束路径

            // 起始位置在最上面，所以是-(Math.PI / 2)
            const startRadian = -(Math.PI / 2);

            // 根据百分比计算对应的弧度得出结束位置
            const angle = (360 * this.percent) / 100;
            const radian = (angle * Math.PI) / 180;
            const endRadian = startRadian + radian;

            // 绘制进度条
            ctx.beginPath();
            ctx.arc(63, 63, 52, startRadian, endRadian); // 创建圆弧
            ctx.setStrokeStyle('#ff5500'); // 设置填充颜色
            ctx.setLineWidth(15); // 设置填充线宽
            ctx.stroke(); // 开始描边
            ctx.closePath();

            // 绘制进度条中间文字
            ctx.beginPath();
            ctx.setFontSize(14);
            ctx.setFillStyle('#666666');
            ctx.setTextAlign('center'); // 设置文字居中
            ctx.fillText('我累计已省', 126 / 2, 126 / 2 - 5); // 第二个参数需要设置canvas宽度的一半
            ctx.closePath();

            // 绘制进度条中间百分比
            ctx.beginPath();
            ctx.setFontSize(16);
            ctx.setFillStyle('#ff5500');
            ctx.setTextAlign('center');
            ctx.fillText(this.percent.toFixed(1) + '%', 126 / 2, 126 / 2 + 25);
            ctx.closePath();

            ctx.draw();
          })
          .exec();
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
        background-image: url('https://ggllstatic.hpgjzlinfo.com/static/songhui/services/member-bg.png');
        &.active {
          background-image: url('https://ggllstatic.hpgjzlinfo.com/static/songhui/services/member-bg-active.png');
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
