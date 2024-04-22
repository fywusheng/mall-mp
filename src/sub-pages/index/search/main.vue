<style lang="scss">
  @import '~@/styles/base';

  .page-search {
    position: relative;
    display: block;
    width: rpx(750);
    min-height: 100vh;
    padding-top: 24rpx;
    background-color: #f5f5f5;

    .search-header {
      position: relative;
      width: 686rpx;
      height: 88rpx;
      background: #ffffff;
      border-radius: 44px;
      border: 2rpx solid #ff5500;
      display: flex;
      align-items: center;
      background-color: #fff;
      z-index: 100;
      margin: 0 auto;

      form {
        display: block;
        width: 100%;
      }

      input {
        display: block;
        position: relative;
        width: 100%;
        padding-left: rpx(40);
        padding-right: rpx(30);
        height: rpx(88);
        font-size: rpx(36);
        color: $black;
        border-radius: 16rpx;
      }

      .icon-search {
        @include middle-center-y();
        left: rpx(54);
        width: rpx(40);
        height: rpx(40);
        z-index: 10;
      }

      .btn-clear {
        @include middle-center-y();
        right: rpx(30);
        font-size: rpx(36);
        font-weight: 400;
      }
    }

    .label-list-wrap {
      margin-top: 32rpx;
      padding: 0 32rpx;

      .title {
        position: relative;
        font-size: rpx(40);
        color: $black;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .del {
          display: flex;
          align-items: center;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 36rpx;
          color: #999999;
          img {
            margin-right: 20rpx;
            right: rpx(30);
            width: rpx(36);
            height: rpx(36);
          }
        }
      }

      .label-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .label {
          position: relative;
          margin-top: rpx(24);
          margin-right: rpx(30);
          height: rpx(68);
          line-height: rpx(68);
          padding: 0 10rpx;
          font-size: rpx(36);
          text-align: center;
          background-color: #f6f6f6;
          color: $black;
          @include ellipsis();
        }
      }
    }
    .hot-list {
      padding: 0 30rpx;
      margin-top: 32rpx;
      .title {
        font-size: 40rpx;
        font-weight: bold;
      }
      .list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .label {
          position: relative;
          margin-top: rpx(24);
          margin-right: rpx(30);
          height: rpx(68);
          line-height: rpx(68);
          padding: 0 10rpx;
          font-size: rpx(36);
          text-align: center;
          background-color: #f6f6f6;
          color: $black;
          @include ellipsis();
        }
      }
    }
  }
</style>

<template>
  <div class="page-search">
    <div class="search-header">
      <!-- <img class="icon-search" src="http://192.168.1.187:10088/static/images/common/icon-search.png" /> -->
      <input ref="searchInput" placeholder="搜索商品" confirm-type="search" :adjust-position="false" @confirm="search('')" v-model="key" />
      <div class="btn-clear" @click="search('')">搜索</div>
    </div>
    <div class="label-list-wrap" v-if="showHistory">
      <div class="title">
        最近搜索
        <view class="del" @click="clearHistory">
          <img src="http://192.168.1.187:10088/static/images/icon-delete.png" />
          <view>清空</view>
        </view>
      </div>
      <ul class="label-list">
        <li class="label" @click="search(history)" v-for="(history, index) in historyList" :key="index">
          {{ history }}
        </li>
      </ul>
    </div>
    <ul class="hot-list">
      <li class="title">热搜商品</li>
      <view class="list">
        <li class="label" @click="search(hot)" v-for="(hot, index) in hotList" :key="index">
          {{ hot }}
        </li>
      </view>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'SEARCH',
    data() {
      return {
        key: '搜索你想找的商品',
        historyList: uni.getStorageSync('SEARCH_HISTORY_LIST') || [],
        resultList: [],
        hotList: ['洗衣液', '奶粉', '拖鞋', '睡衣'],
      };
    },
    loadDefaultData: true,
    computed: {
      showHistory() {
        return this.historyList && this.historyList.length;
      },
    },
    methods: {
      cancel() {
        uni.navigateBack();
      },
      clearHistory() {
        uni.removeStorageSync('SEARCH_HISTORY_LIST');
        this.historyList = [];
      },
      async search(hot) {
        if (hot) {
          this.key = hot;
        }
        this.key && this.historyList.indexOf(this.key) === -1 && this.historyList.push(this.key);
        uni.setStorageSync('SEARCH_HISTORY_LIST', this.historyList);
        uni.navigateTo({
          url: '/sub-pages/index/item-list/main?key=' + this.key,
        });
      },
    },
    async onShow() {
      this.key = '';
    },
  };
</script>
