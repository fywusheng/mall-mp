<template>
  <view class="credits-popup flex-v flex-c-c" v-if="showsCreditsPopup" @touchmove.stop="touchmove">
    <image
      class="credits-image"
      mode="scaleToFill"
      src="http://192.168.1.187:10088/static/family-account/image-common-credits-300.png"
    />
    <image
      class="close-icon mt-32"
      mode="scaleToFill"
      src="http://192.168.1.187:10088/static/common/icon-common-popup-close.png"
      @click="showsCreditsPopup = false"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      showsCreditsPopup: false
    }
  },
  methods: {
    detailPoint() {
      uni.navigateTo({ url: '/pages/user-center/my-points' })
    }
  },
  watch: {
    showsCreditsPopup(n, o) {
      if (n) {
        setTimeout(() => {
          this.showsCreditsPopup = false
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .credits-popup {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    .credits-image {
      @include size(604, 808);
    }
    .close-icon {
      @include square(72);
    }
  }
</style>
