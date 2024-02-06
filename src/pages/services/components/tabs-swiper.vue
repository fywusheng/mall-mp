<template>
  <view>
    <scroll-view class="nav-scroll"
                 :enable-flex="true"
                 scroll-with-animation
                 :throttle="false"
                 :scroll-left="scrollToLeft"
                 scroll-x
                 @scroll="handleScroll">
      <view class="nav uni-nav">
        <view class="nav-item"
              :class="swiperIndex == index ? 'nav-item-act' : ''"
              :key="index"
              v-for="(item, index) in list"
              @click="taggleNav(index,item)">
          {{ item.serviceName }}
        </view>
        <view class="nav-line"
              :style="style"></view>
      </view>
    </scroll-view>
    <view class="swiper">
      <swiper :current="swiperIndex"
              :duration="300"
              class="swiper-1"
              easing-function="linear"
              @change="swiperChange">
        <swiper-item v-for="(item, index) in list"
                     :key="index + 'asdf'">
          <view class="example">

          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {}
  },
  computed: {
    style() {
      return `width:${this.navItemWidth}px; left:${this.navItemLeft}px`
    },
  },
  mounted() {
    // console.log("mounted执行初始化：",this.list)
    // this.init();
  },
  updated() {
    // console.log("updated执行：",this.list)
    //#ifdef MP-ALIPAY
    // this.init();
    //#endif
  },
  onLoad() {
    // this.getExampleData();
  },
  methods: {
    //图片加载失败
    handleArticleImageLoadFail(tab, index, imgIndex, type) {
      this.$emit('handleArticleImageLoadFail', tab, index, imgIndex, type)
    },

    //自定义上拉加载更多
    loadMore() {
      console.log('加载更多')
      // this.currentPage++;

      this.bottomTips = 'loading'
      this.$emit('loadMore')
      // setTimeout(() => {
      // 	// this.bottomTips = "more";
      // 	this.bottomTips = "more";
      // },1000)
    },
    // 获取dom信息
    init() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.uni-nav').fields({ rect: true, size: true }, (res) => {
        this.parentLeft = res.left
        this.componentWidth = res.width
        console.log('res==>', res)
      })
      query
        .selectAll('.nav-item')
        .fields({ rect: true, size: true }, (data) => {
          console.log('domdata:', data)
          data.forEach((item, index) => {
            if (index == 0) {
              this.navItemWidth = item.width
              this.navItemLeft = item.left
            }
            this.navInfos.push({ width: item.width, left: item.left })
          })
        })
      query.exec()
    },
    // 点击导航切换swiper
    taggleNav(val) {
      this.swiperIndex = val
      this.$emit('currentIndex', this.swiperIndex)
      this.bottomTips = ''
      if (
        this.list[this.swiperIndex].nomore &&
        this.list[this.swiperIndex].content.length > 4
      ) {
        this.bottomTips = 'nomore'
      }
      //#ifdef MP-ALIPAY
      this.scrollDom()
      //#endif
    },
    // 滚动tabs以及移动下划线
    scrollDom() {
      let info = this.navInfos[this.swiperIndex]
      console.log('获取元素：', info)
      let offsetLeft = info.left - this.parentLeft
      let scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2
      this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft
      this.navItemLeft = this.navInfos[this.swiperIndex].left
      setTimeout(() => {
        this.navItemWidth = info.width
      }, 50)
    },
    // swiper的index变动
    swiperChange(e) {
      this.swiperIndex = e.detail.current
      this.$emit('currentIndex', this.swiperIndex)
      if (
        this.list[this.swiperIndex].nomore &&
        this.list[this.swiperIndex].content.length > 4
      ) {
        this.bottomTips = 'nomore'
      } else {
        this.bottomTips = ''
      }
      this.scrollDom()
    },
    // tabs-scrollview触底
    handleScroll(e) {
      // this.scrollDom()
    },

    // swiper-ScrollLower触底
    swiperScrollLower() {
      uni.showToast({
        icon: 'none',
        title: `此时为${this.list[this.swiperIndex].title}触底`,
      })
      setTimeout(() => {
        // this.getData();
      }, 500)
    },



    //点击文章详情
    goDetail(e, tab, index) {
      this.$emit('goDetail', e, tab, index)
    },

  },
  watch: {
    list: {
      // immediate:true,
      handler(n, o) {
        if (n.length > o.length) {
          this.init()
        }
        // console.log(n)
        console.log('新数据的长度：', n.length)
        console.log('旧数据的长度：', o.length)
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-scroll {
  // display: flex;
  // justify-content: center;
}

.nav {
  white-space: nowrap;
  position: relative;
  height: 50upx;
  padding: 20upx 16rpx;
  .nav-item {
    display: inline-block;
    margin: 0 16upx;
    text-align: center;
    transition: color 0.3s ease;
    font-size: 40rpx;
    color: #999999;
  }
  .nav-item-act {
    color: #000;
    font-weight: bolder;
  }
  .nav-line {
    position: absolute;
    bottom: 0;
    height: 10upx;
    border-radius: 10upx;
    background-color: #ff711a;
    transition: left 0.3s ease;
  }
}
swiper {
  height: calc(100vh - 212rpx);
}
swiper-item {
  color: #000;
  position: relative;
  background-color: #fff;
  overflow-y: scroll;
}

</style>
