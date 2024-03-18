<template>
  <view class="insurance">
    <image
      class="icon"
      src="http://192.168.1.187:10088/static/life/icon-mofang.png"
      mode="widthFix"
    />
    <image
      class="icon bottom"
      src="http://192.168.1.187:10088/static/life/icon-mofang-bottom.png"
      mode="widthFix"
    />
  </view>
</template>
<script>
  export default {
    data() {
      return {};
    },
    onLoad() {},
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .insurance {
    .icon {
      width: 100%;
    }
    .bottom {
      position: fixed;
      left: 0;
      bottom: 0;
    }
  }
</style>
