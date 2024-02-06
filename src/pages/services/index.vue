<template>
  <view class="service">
    <view class="_topbg">
      <image class="img" src="https://ggllstatic.hpgjzlinfo.com/static/services/bgTopImg.png"
        mode="scaleToFill" />
    </view>
    <view class="spaceWhite">
      <view class="spaceContent"></view>
      <view class="content">
        <view>
          <view class="page-main">
            <scroll-view class="nav-scroll" :enable-flex="true" scroll-with-animation
              :throttle="false" :scroll-left="scrollToLeft" scroll-x @scroll="handleScroll">
              <view class="nav uni-nav">
                <view class="nav-item" :class="tab1Index == index ? 'nav-item-act' : ''"
                  :key="index" v-for="(item, index) in services"
                  @click="handleServicesClick(item,index)">
                  {{ item.serviceName }}
                </view>
                <view class="nav-line" :style="style"></view>
              </view>
            </scroll-view>
            <scroll-view class="nav-scroll" :enable-flex="true" scroll-with-animation
              :throttle="false" :scroll-left="scrollToLeft" scroll-x @scroll="handleScroll">
              <view class="nav uni-nav">
                <view class="nav-item"
                  :class="currentIndex == index ? 'nav-item-act2' : 'classItem'" :key="index"
                  v-for="(item, index) in classList" @click="taggleNav(index,item)">
                  {{ item.serviceName }}
                </view>
                <view class="nav-line" :style="style"></view>
              </view>
            </scroll-view>
            <view class="swiper-bg"></view>
            <view class="swiper">
              <!-- stashData[tab1Index+'_'+currentIndex]['list'].length > 0 -->
              <view class="recommend-content"
                v-if="stashData[tab1Index+'_'+currentIndex]['list'].length > 0">
                <view class="recommend-item flex-h flex-c-b"
                  v-for="(artItem,artIndex) in stashData[tab1Index+'_'+currentIndex]['list']"
                  :key="artIndex" @click="handleServicesDetailClick(artItem)">
                  <view class="content-all-left">
                    <image class="img" :src="artItem.social_service_photos"
                      @error="handleServiceLoadFail(index,artIndex)" mode="aspectFill" />
                    <!-- <view class="text">距离446米</view> -->
                  </view>
                  <view class="content-all-right">
                    <view class="detail">
                      {{artItem.orgOfficeName}}
                    </view>
                    <view class="flex-h flex-c-b">
                      <image class="location"
                        src="https://ggllstatic.hpgjzlinfo.com/static/home/home-huilao-location.png"
                        mode="scaleToFill" />
                      <text class="text">{{artItem.orgOfficeAddrDetail}}</text>
                    </view>
                  </view>
                </view>
                <bottom-tips class="loadInfor"
                  v-if="stashData[tab1Index+'_'+currentIndex]['list'].length != 0" ref="bottomTips"
                  :bottomTips="bottomTips"></bottom-tips>
              </view>
              <block v-else>
                <view class="flex-v flex-c-c status-box2" v-if="loading === 1">
                  <image src="https://ggllstatic.hpgjzlinfo.com/static/common/business_loading.gif"
                    mode="scaleToFill" />
                </view>
                <!--  暂无图片 -->
                <view class="flex-v flex-c-c status-box" v-else>
                  <image src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"
                    mode="scaleToFill" />
                  <view class="flex-c-c status-text">暂无内容</view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from '@/apis/index.js'
import bottomTips from './components/bottom-tips'
// import hrPullLoad from '@/components/hr-pull-load/hr-pull-load.vue'
export default {
  components: { bottomTips },
  data() {
    return {
      loading: 1,
      stashData: {
        '0_0': {
          list: [],
          currentPage: 1,
          pageSize: 10
        },
        '0_1': {
          list: [],
          currentPage: 1,
          pageSize: 10
        }
      },
      tab1Index: 0, // 大类index
      services: [], // 大类
      // 分类列表
      classList: [],
      // 数据列表
      list: [],
      // 进入页面需加载次数
      begin: 0,
      // 当前页码列表的tab页下标
      currentIndex: 0,
      // 第一分类的id
      serviceId: '',
      // 每页条数
      pageSize: 10,
      // 将要调用的页码
      currentPage: 1,

      currentIndex: 0,

      scrollToLeft: 0, // scrollview需要滚动的距离
      navInfos: [], // 所有navitem的节点信息
      parentLeft: 0, // nav盒子的节点信息
      componentWidth: 0, // nav盒子的宽度

      // 提示信息
      bottomTips: ''
    }
  },
  onShareAppMessage() {
    return {
      title: '惠老服务',
      path:
        '/pages/services/index'
    }
  },
  onLoad(e) {
    // this.serviceId = e.serviceId
    this.$uni.setTitle('惠老服务')
    // this.getTab1()
    console.log('--onload')
  },
  created() {
    this.getTab1()
    console.log('--create')
  },
  // 下拉刷新
  onPullDownRefresh() {
    // this.refreshData()
    console.log('下拉刷新')
    this.currentPage = 1
    this.nomore = false
    this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage'] = this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage'] + 1
    this.loadMore()
    // this.refreshList(this.currentIndex)
  },
  onReachBottom() {
    console.log('上拉加载')
    this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage'] = this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage'] + 1
    this.loadMore()
    // this.getOfficeByTypeWithPage(this.currentIndex)
  },
  methods: {
    handleServicesClick(item, index) {
      this.tab1Index = index
      this.currentIndex = 0
      console.log('===tab1--tab2--', this.tab1Index + '_' + this.currentIndex)
      this.serviceId = item.serviceId
      this.getSecondClass()
    },
    getTab1() {
      // 惠老服务一级分类getFirstClass
      api.getFirstClass({
        data: {},
        success: (data) => {
          this.services = data
          this.serviceId = data[0]['serviceId']
          this.getSecondClass()
        }
      })
    },
    /**
     * 获取分类 tab2 小类
     */
    getSecondClass() {
      //  uni.showLoading({ title: '加载中'})
      this.loading = 1
      this.list = []
      api.getSecondClass({
        data: {
          serviceId: this.serviceId
        },
        success: (res) => {
          this.loading = 2
          // uni.hideLoading()
          console.log('获取栏目分类:', res)
          this.classList = res.map((item, index) => {
            return item
          })

          // this.stashData[this.tab1Index+'_'+this.currentIndex] = {
          //   list:[],
          //   currentPage:1,
          //   pageSize:10
          // }
          console.log('===拼接的数据0--', this.stashData)
          this.getList()
          // 根据分类获取列表
          // this.refreshList(0)
        },
        fail: (error) => {
          this.loading = 2
          // uni.hideLoading()
        }
      })
    },
    loadMore() {
      const params = this.stashData[this.tab1Index + '_' + this.currentIndex]

      if (!params) {
        this.stashData[this.tab1Index + '_' + this.currentIndex] = {
          list: [],
          currentPage: 1,
          pageSize: 10
        }
      }
      console.log('==11111---', params)
      const data = {
        orgOfficeTypeFirstClass: this.serviceId,
        orgOfficeTypeSecondClass: this.classList[this.currentIndex].serviceId,
        pageSize: this.stashData[this.tab1Index + '_' + this.currentIndex]['pageSize'], // this.pageSize,
        currentPage: this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage']// this.currentPage,
      }
      console.log('接口参数：', data)
      this.bottomTips = 'loading'
      api.getOfficeByTypeWithPage({
        data,
        success: (res) => {
          uni.stopPullDownRefresh()
          if (res.list && res.list.length > 0) {
            const arry = []
            res.list.map((items, indexs) => {
              const obj = items
              obj['score'] = items.score
              if (items.orgOfficeInfoDetail) {
                // console.err("items.orgOfficeInfoDetail:",items.orgOfficeInfoDetail)
                const area = JSON.parse(
                  items.orgOfficeInfoDetail.replace(/\s/g, ' ')
                )
                // console.log("area:",area)
                obj['hospital_level'] = area.hospital_level
                  ? area.hospital_level
                  : ''
                obj['hospital_clinic'] = area.hospital_clinic
                  ? area.hospital_clinic
                  : ''
                obj['scenic_service_rank'] = area.scenic_service_rank
                obj['scenic_service_opentime'] = area.scenic_service_opentime
                obj['scenic_service_intro'] = area.scenic_service_intro
                  ? area.scenic_service_intro
                  : area.hospital_intro
                if (area.social_service_photos) {
                  obj['social_service_photos'] =
                    area.social_service_photos.split(',')[0]
                }
              }
              // console.log('item:', obj)
              arry.push(obj)
            })

            //   this.list = arry
            //    this.currentPage = this.currentPage + 1

            if (arry.length != 0) {
              // this.stashData[this.tab1Index+'_'+this.currentIndex]['list'] = []
              this.stashData[this.tab1Index + '_' + this.currentIndex]['list'].push(...arry)
              // this.stashData[this.tab1Index+'_'+this.currentIndex]['list']  = this.stashData[this.tab1Index+'_'+this.currentIndex]['list'].concat(arry)
              // this.$set(
              //   this.stashData,
              //   this.stashData[this.tab1Index+'_'+this.currentIndex]['list'],
              //   [...arry]
              // )

              // this.$set(
              //     this.stashData[this.tab1Index+'_'+this.currentIndex]['list'],
              //     0,
              //    this.stashData[this.tab1Index+'_'+this.currentIndex]['list'].concat(arry)
              //   )
            }
            console.log('--存入的list3---', this.stashData)
            this.nomore = false
          } else {
            this.list = []
            this.nomore = false
            this.bottomTips = 'nomore'
          }
          //
        },
        fail: (err) => {
          // this.closeRefresh()
          uni.stopPullDownRefresh()
        }
      })
    },
    getList() {
      // uni.showLoading({ title: '加载中'})
      this.loading = 1
      const params = this.stashData[this.tab1Index + '_' + this.currentIndex]
      if (!params) {
        this.stashData[this.tab1Index + '_' + this.currentIndex] = {
          list: [],
          currentPage: 1,
          pageSize: 10
        }
      }
      console.log('==11111---', params)
      const data = {
        orgOfficeTypeFirstClass: this.serviceId,
        orgOfficeTypeSecondClass: this.classList[this.currentIndex].serviceId,
        pageSize: this.stashData[this.tab1Index + '_' + this.currentIndex]['pageSize'], // this.pageSize,
        currentPage: this.stashData[this.tab1Index + '_' + this.currentIndex]['currentPage']// this.currentPage,
      }
      console.log('接口参数：', data)
      this.bottomTips = 'loading'
      api.getOfficeByTypeWithPage({
        data,
        success: (res) => {
          this.loading = 2
          // uni.hideLoading()
          uni.stopPullDownRefresh()
          if (res.list && res.list.length > 0) {
            const arry = []
            res.list.map((items, indexs) => {
              const obj = items
              obj['score'] = items.score
              if (items.orgOfficeInfoDetail) {
                // console.err("items.orgOfficeInfoDetail:",items.orgOfficeInfoDetail)
                const area = JSON.parse(
                  items.orgOfficeInfoDetail.replace(/\s/g, ' ')
                )
                // console.log("area:",area)
                obj['hospital_level'] = area.hospital_level
                  ? area.hospital_level
                  : ''
                obj['hospital_clinic'] = area.hospital_clinic
                  ? area.hospital_clinic
                  : ''
                obj['scenic_service_rank'] = area.scenic_service_rank
                obj['scenic_service_opentime'] = area.scenic_service_opentime
                obj['scenic_service_intro'] = area.scenic_service_intro
                  ? area.scenic_service_intro
                  : area.hospital_intro
                if (area.social_service_photos) {
                  obj['social_service_photos'] =
                    area.social_service_photos.split(',')[0]
                }
              }
              // console.log('item:', obj)
              arry.push(obj)
            })

            //   this.list = arry
            //    this.currentPage = this.currentPage + 1
            if (arry.length != 0) {
              this.stashData[this.tab1Index + '_' + this.currentIndex]['list'] = []
              this.stashData[this.tab1Index + '_' + this.currentIndex]['list'].push(...arry)
              // this.stashData[this.tab1Index+'_'+this.currentIndex]['list']  = this.stashData[this.tab1Index+'_'+this.currentIndex]['list'].concat(arry)
              // this.$set(
              //   this.stashData,
              //   this.stashData[this.tab1Index+'_'+this.currentIndex]['list'],
              //   [...arry]
              // )

              // this.$set(
              //     this.stashData[this.tab1Index+'_'+this.currentIndex]['list'],
              //     0,
              //    this.stashData[this.tab1Index+'_'+this.currentIndex]['list'].concat(arry)
              //   )
            }
            console.log('--存入的list3---', this.stashData)
            this.nomore = false
            this.bottomTips = 'nomore'
          } else {
            this.bottomTips = 'nomore'
            this.nomore = false
          }
        },
        fail: (err) => {
          this.loading = 2
          // uni.hideLoading()
          // this.closeRefresh()
          uni.stopPullDownRefresh()
        }
      })
    },
    // 下拉刷新函数
    refreshList(index) {
      console.log(this.classList[index].serviceId)
      const data = {
        orgOfficeTypeFirstClass: this.serviceId,
        orgOfficeTypeSecondClass: this.classList[index].serviceId,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      console.log('接口参数：', data)
      api.getOfficeByTypeWithPage({
        data,
        success: (res) => {
          uni.stopPullDownRefresh()
          if (res.list && res.list.length > 0) {
            const arry = []
            res.list.map((items, indexs) => {
              const obj = items
              obj['score'] = items.score
              if (items.orgOfficeInfoDetail) {
                // console.err("items.orgOfficeInfoDetail:",items.orgOfficeInfoDetail)
                const area = JSON.parse(
                  items.orgOfficeInfoDetail.replace(/\s/g, ' ')
                )
                // console.log("area:",area)
                obj['hospital_level'] = area.hospital_level
                  ? area.hospital_level
                  : ''
                obj['hospital_clinic'] = area.hospital_clinic
                  ? area.hospital_clinic
                  : ''
                obj['scenic_service_rank'] = area.scenic_service_rank
                obj['scenic_service_opentime'] = area.scenic_service_opentime
                obj['scenic_service_intro'] = area.scenic_service_intro
                  ? area.scenic_service_intro
                  : area.hospital_intro
                if (area.social_service_photos) {
                  obj['social_service_photos'] =
                    area.social_service_photos.split(',')[0]
                }
              }
              // console.log('item:', obj)
              arry.push(obj)
            })
            this.list = arry
            this.currentPage = this.currentPage + 1
            this.nomore = false
          } else {
            this.list = []
            this.nomore = true
          }

          //
        },
        fail: (err) => {
          // this.closeRefresh()
          uni.stopPullDownRefresh()
        }
      })
    },

    // 上拉加载（分页接口）
    getOfficeByTypeWithPage(index) {
      const data = {
        orgOfficeTypeFirstClass: this.serviceId,
        orgOfficeTypeSecondClass: this.classList[index].serviceId,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.bottomTips = 'loading'
      api.getOfficeByTypeWithPage({
        data,
        showsLoading: true,
        success: (res) => {
          console.log('this.$refs：', this.$refs)
          if (res.list && res.list.length > 0) {
            res.list.map((items, indexs) => {
              const obj = items
              obj['score'] = items.score
              if (items.orgOfficeInfoDetail) {
                // console.log("items.orgOfficeInfoDetail:",items.orgOfficeInfoDetail)
                const area = JSON.parse(
                  items.orgOfficeInfoDetail.replace(/\s/g, ' ')
                )
                // console.log("area:",area)
                obj['hospital_level'] = area.hospital_level
                  ? area.hospital_level
                  : ''
                obj['hospital_clinic'] = area.hospital_clinic
                  ? area.hospital_clinic
                  : ''
                obj['scenic_service_rank'] = area.scenic_service_rank
                obj['scenic_service_opentime'] = area.scenic_service_opentime
                obj['scenic_service_intro'] = area.scenic_service_intro
                  ? area.scenic_service_intro
                  : area.hospital_intro
                if (area.social_service_photos) {
                  obj['social_service_photos'] =
                    area.social_service_photos.split(',')[0]
                }
              }
              // console.log('item:', obj)
              this.list.push(obj)
            })
            this.currentPage = this.currentPage + 1
            this.nomore = false
            // if(this.bottomTips){
            //   this.bottomTips = ""
            // }
          } else {
            this.bottomTips = 'nomore'
            this.nomore = true
          }

          console.log('加载结束：', this.currentPage)

          //
        }
        // fail: (err) => {
        //   this.closeRefresh()
        // },
      })
    },
    // 获取dom信息
    init() {
      const query = uni.createSelectorQuery()
      console.log('query.select', query.select('.uni-nav'))
      query.select('.uni-nav').fields({ rect: true, size: true }, (res) => {
        console.log('res:', res)
        this.parentLeft = res.left
        this.componentWidth = res.width
        console.log('res==>', res)
      })
      console.log('query.selectAll', query.selectAll('.nav-item'))
      query.selectAll('.nav-item').fields({ rect: true, size: true }, (data) => {
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
      setTimeout(() => {
        console.log('this.navInfos:', this.navInfos)
      }, 300)
    },
    // 点击导航切换swiper
    taggleNav(val) {
      this.currentIndex = val
      console.log('===tab1--tab2--', this.tab1Index + '_' + this.currentIndex)
      this.scrollDom()
      this.currentPage = 1
      this.list = []
      // this.stashData[this.tab1Index+'_'+this.currentIndex] = {
      //       list:[],
      //       currentPage:1,
      //       pageSize:10
      // }
      this.getList()
      // this.refreshList(this.currentIndex)
      // #ifdef MP-ALIPAY
      this.scrollDom()
      // #endif
      // this.bottomTips = ''
      // if (
      //   this.list[this.currentIndex].nomore &&
      //   this.list[this.currentIndex].content.length > 4
      // ) {
      //   this.bottomTips = 'nomore'
      // }

      // #ifdef MP-ALIPAY
      // this.scrollDom()
      // #endif
    },
    // 滚动tabs以及移动下划线
    scrollDom() {
      // console.log('获取元素：', this.navInfos)
      const info = this.navInfos[this.currentIndex]
      // console.log('获取元素：', info)
      const offsetLeft = info.left - this.parentLeft
      const scrollLeft = offsetLeft - (this.componentWidth - info.width) / 2
      this.scrollToLeft = scrollLeft < 0 ? 0 : scrollLeft
      this.navItemLeft = this.navInfos[this.currentIndex].left
      setTimeout(() => {
        this.navItemWidth = info.width
      }, 50)
    },

    // tabs-scrollview触底
    handleScroll(e) {
      this.scrollDom()
    },

    /**
     * 点击查看详情
     */
    handleServicesDetailClick(item) {
      uni.navigateTo({
        url: `/pages/services/address-detail?orgOfficeId=` + item.orgOfficeId
      })
    },
    /**
     * 图片加载失败
     */
    handleServiceLoadFail(tabIndex, index) {
      this.list[
        index
      ].social_service_photos = 'https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png'
    }
  },
  onShow() { },
  onUnload() { },
  watch: {
    classList: {
      // immediate:true,
      handler(n, o) {
        if (n.length > o.length) {
          setTimeout(() => {
            console.log('新数据的长度：', n)
            console.log('旧数据的长度：', o.length)
            this.init()
          }, 300)
        }
        // console.log(n)
        // console.log('新数据的长度：', n)
        // console.log('旧数据的长度：', o.length)
      },
      deep: true
    }
  },
  computed: {
    style() {
      return `width:${this.navItemWidth}px; left:${this.navItemLeft}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.service {
  background-color: #eeeeee;
  // min-height: 100vh;
  // background-color: #f2f2f2;
  height: 100vh;
  ._topbg {
    width: 100vw;
    height: 304rpx;
    .img {
      width: 100%;
      height: 304rpx;
    }
  }
  .spaceWhite {
    position: absolute;
    top: 269rpx;
    width: 100vw;
    background-color: #fff;
    border-top-left-radius: 30rpx;
    border-top-right-radius: 30rpx;
    .spaceContent {
      // background-color:#fff;
      // // height:182rpx;
      // border-top-left-radius: 16rpx;
      // border-top-right-radius: 16rpx;
      // padding-top:10rpx;
    }
    .page-main {
      .nav-scroll ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
        display: none;
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
          font-weight: bold;
          position: relative;
          &::after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: -18rpx;
            transform: translateX(-50%);
            width: 64rpx;
            height: 8rpx;
            background: #ff711a;
            border-radius: 5rpx;
          }
        }
        .nav-item-act2 {
          width: 196rpx;
          height: 60rpx;
          border-radius: 30rpx;
          background: rgba(255, 73, 0, 0.11);
          color: #ff5500;
          font-size: 32rpx;
          font-weight: 500;
          line-height: 60rpx;
        }
        .classItem {
          width: 196rpx;
          height: 60rpx;
          border-radius: 30rpx;
          background: #eeeeee;
          color: #333;
          font-size: 32rpx;
          font-weight: 400;
          line-height: 60rpx;
        }
        .nav-line {
          // position: absolute;
          // bottom: 0;
          // height: 10upx;
          // border-radius: 10upx;
          // background-color: #ff711a;
          // transition: left 0.3s ease;
        }
      }
      .swiper {
        // height: calc(100vh - 106rpx) !important;
        background-color: #eeeeee;
        .loadInfor {
          background-color: #fff;
        }
      }
      .swiper-l {
        height: calc(100vh - 106rpx);
      }
      swiper-item {
        color: #000;

        position: relative;

        overflow-y: scroll;
        height: calc(100vh - 106rpx);
      }
      .example {
        height: calc(100vh - 106rpx);
      }
      .swiper-bg {
        height: 16rpx;
        background-color: #eeeeee;
      }

      .recommend-content {
        margin: 0 20rpx 0 20rpx;
        // border-radius: 16rpx;
        // width: 710rpx;
        // min-height:100vh;
        .recommend-item {
          height: 236rpx;
          // border-bottom: 2rpx solid #eeeeee;
          background-color: #fff;
          margin-bottom: 12rpx;
          padding-left: 24rpx;
          padding-right: 24rpx;
          border-radius: 16rpx;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          .content-all-left {
            flex-shrink: 0;
            @include size(214, 176, 16);
            position: relative;
            overflow: hidden;
            image {
              width: 100%;
              height: 100%;
            }
            .text {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.6);
              text-align: center;
              @include text-line(1);
              color: #fff;
            }
          }
          .content-all-right {
            flex-shrink: 0;
            width: 438rpx;
            margin-left: 18rpx;
            .detail {
              height: 100rpx;
              font-size: 40rpx;
              font-weight: bold;
              color: #333333;
              line-height: 50rpx;
              @include text-line(2);
              margin-bottom: 30rpx;
            }
            .location {
              flex-shrink: 0;
              @include size(32, 36);
              margin-right: 12rpx;
            }
            .text {
              display: block;
              flex-shrink: 0;
              flex: 1;
              height: 48rpx;
              font-size: 36rpx;
              color: #666666;
              line-height: 50rpx;
              @include text-line(1);
            }
          }
        }
      }
      .status-box {
        background-color: #eeeeee;
        padding-top: 300rpx;
        image {
          width: 440rpx;
          height: 234rpx;
          margin-bottom: 24rpx;
        }
        .status-text {
          height: 50rpx;
          color: $color-grey;
        }
      }
      .status-box2 {
        padding-top: 300rpx;
        image {
          width: 160rpx;
          height: 160rpx;
        }
      }
    }
  }
}
</style>
