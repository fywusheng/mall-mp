<template>
  <view class="image-gallery">
    <view class="list flex-h flex-wrap">
      <image mode="scaleToFill"
        v-for="(item, index) in images"
        :key="index"
        class="item mr-24 mb-24"
        :src="item"
        @click="handleImageClick(index)"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      images: [],
    };
  },
  onLoad(e) {
    //#ifdef MP-ALIPAY
    if(e.imgs){
      this.images = JSON.parse(decodeURIComponent(e.imgs))
      this.$uni.setTitle(`图片(${this.images.length})`)
    }
    //#endif
    
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("openPhotoDetail", (data) => {
      this.images = data.item
      this.$uni.setTitle(`图片(${this.images.length})`)
    });
  },
  methods: {
    /**
     * 图片点击事件
     */
    handleImageClick(index) {
      uni.previewImage({
        urls: this.images,
        current: this.images[index],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-gallery {
  min-height: 100vh;
  background: #fbf9f7;
  .list {
    padding: 36rpx 28rpx;
    .item {
      @include size(335, 268);
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:nth-last-child(-n + 2) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
