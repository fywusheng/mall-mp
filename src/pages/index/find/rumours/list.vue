<template>
  <view class="rumours-list">
    <view class="banner">
      <image src="http://192.168.1.187:10088/static/rumours/banner2x.png" mode="scaleToFill" />
    </view>
    <view class="blank"></view>
    <view class="list">
      <view
        class="item flex-h flex-c-b"
        v-for="(item, index) in list"
        :key="index"
        @click="handleDetailClick(item)"
      >
        <view class="left">{{ item.ttl }}</view>
        <view class="right">{{ item.crteTime | dateFilter }}</view>
      </view>
    </view>

    <view class="bottomTips" v-if="bottomTips">
      <view class="loading" v-if="bottomTips == 'loading'">
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
        <text class="list"></text>
      </view>
      <view>{{ bottomTips | judgeBottomTips }}</view>
    </view>
  </view>
</template>

<script>
import api from '@/apis/index.js'
import dayjs from 'dayjs'

export default {
  components: {},
  data() {
    return {
      list: [],
      lowerThreshold: 30,
      bottomTips: '',
      isAllowPullDown: false, // 是否触发下拉刷新
      isInterval: false, // 防止鼠标或者手指移动时多次执行逻辑判断
      contId: undefined, // 类目id
      pageNum: 1, // 当前页数
      pageSize: 20 // 每页条数
    }
  },
  props: {
    currentIndex: {
      type: Number,
      default: 1
    }
  },
  watch: {
    currentIndex(changeIndex) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  onLoad(option) {
    this.contId = option.contId
    this.getList()
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    this.getList()
  },
  // onShareAppMessage() {
  //   return {
  //     title:'辟谣警示',
  //     path:
  //       "/pages/rumours/list",
  //   };
  // },
  methods: {
    // 获取辟谣列表
    getList() {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      uni.showLoading({
        title: '加载中'
      })
      api.getRumorDetail({
        data,
        success: (res) => {
          uni.hideLoading()
          if (res.list) {
            res.list.map((items, indexs) => {
              this.list.push(items)
            })
            this.pageNum = this.pageNum + 1
          } else {
            if (this.pageNum > 0) {
              this.bottomTips = 'nomore'
            }
          }
        },
        fail: (err) => {}
      })
    },
    // 查看详情
    handleDetailClick(item) {
      // uni.navigateTo({
      //   url: '/pages/rumours/detail?contId='+item.contId,
      // })
      uni.navigateTo({
        url: '/pages/find/article-detail?contId=' + item.contId + '&isShare=false'
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('触发refresh')
    this.pageNum = 1
    this.list = []
    this.getList()
    // setTimeout(() => {
    //   uni.stopPullDownRefresh()
    // })
  },
  filters: {
    // 判断底部提示文字
    judgeBottomTips(type) {
      switch (type) {
        case 'nomore':
          return '没有更多数据了'
          break
        case 'loading':
          return '正在努力加载中...'
          break
        case 'more':
          return '上拉加载更多'
          break
        default:
          break
      }
    },
    // 日期过滤器, 用于格式化日期
    dateFilter(value) {
      return dayjs(value).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
  .rumours-list {
    min-height: 100vh;
    background: #eeeeee;
    .banner {
      box-sizing: border-box;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        margin: 12rpx 0;
        width: 686rpx;
        height: 232rpx;
      }
    }
    .blank {
      width: 100%;
      height: 16rpx;
      background: #eeeeee;
    }
    .list {
      background-color: #fff;
      min-height: calc(100vh - 296rpx);
      padding: 0 32rpx;
      .item {
        height: 120rpx;
        color: #323233;
        font-size: 32rpx;
        border-bottom: 2rpx solid #eeeeee;
        .left {
          flex-shrink: 0;
          width: 468rpx;
          margin-right: 14rpx;
          @include text-line(1);
        }
        .right {
          flex: 1;
          color: #999;
        }
      }
    }
    .bottomTips {
      width: 100%;
      height: 80rpx;
      font-size: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .loading {
        width: 110rpx;
        height: 110rpx;
        position: relative;
        transform: scale(0.4);
        margin-right: -20rpx;
        .list {
          width: 15rpx;
          height: 15rpx;
          border-radius: 30px;
          background: #090909;
          position: absolute;
          animation: opaticyAnimation linear 0.7s infinite;
          -webkit-animation: opaticyAnimation linear 0.7s infinite;
        }
        .list:nth-child(1) {
          left: 24px;
          top: 2px;
          animation-delay: 0s;
        }
        .list:nth-child(2) {
          left: 40px;
          top: 8px;
          animation-delay: 0.1s;
        }
        .list:nth-child(3) {
          left: 47px;
          top: 24px;
          animation-delay: 0.2s;
        }
        .list:nth-child(4) {
          left: 40px;
          top: 40px;
          animation-delay: 0.3s;
        }
        .list:nth-child(5) {
          left: 24px;
          top: 47px;
          animation-delay: 0.4s;
        }
        .list:nth-child(6) {
          left: 8px;
          top: 40px;
          animation-delay: 0.5s;
        }
        .list:nth-child(7) {
          left: 2px;
          top: 24px;
          animation-delay: 0.6s;
        }
        .list:nth-child(8) {
          left: 8px;
          top: 8px;
          animation-delay: 0.7s;
        }
        @keyframes opaticyAnimation {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      }
    }
  }
</style>
