// 权益保障法
<template>
  <view class="qy">
    <view v-for="(v, i) in imgPathList" :key="i">
      <image class="img" :src="v" mode="widthFix" />
    </view>
    <view class="_height"></view>
    <view class="bottom" @click="watchDetail">
      <image class="_img" src="http://192.168.1.187:10088/static/home/btn_bottom.png" />
    </view>
  </view>
</template>
<script>
  import api from '@/apis/index.js';

  export default {
    components: {},
    data() {
      return {
        colId: '',
        imgPathList: [],
      };
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        api.selectSeniorRights({
          success: (data) => {
            this.colId = data.colId;
            this.imgPathList = data.imgPathList || [];
          },
        });
      },
      watchDetail() {
        const token = uni.getStorageSync('token');
        if (!token) {
          uni.navigateTo({ url: '/pages/user-center/login' });
          return;
        }
        // 查看保障细则  文章id
        uni.navigateTo({
          url: `/pages/find/article-detail?contId=` + this.colId,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .qy {
    width: 100%;
    height: 100%;
    margin-top: 22rpx;
    ._height {
      height: 200rpx;
      width: 100%;
    }
    .img {
      width: 100%;
      height: 100%;
      margin-bottom: -10rpx;
    }
    .bottom {
      width: 100%;
      position: fixed;
      bottom: 0;
      height: 178rpx;
      left: 0;
      ._img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
