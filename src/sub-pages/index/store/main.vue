//商店
<template>
  <div class="storeDetail" @click="clickMap">
    <!-- <view class="bg"></view> -->
    <view class="_search">
      <view class="search-header _left">
        <img class="icon" src="http://192.168.1.187:10088/static/images/common/icon-search.png" />
        <input
          confirm-type="search"
          @blur="blurInput"
          @focus="focusInput"
          @confirm="search"
          :placeholder="key || '输入关键字搜索商品...'"
          v-model="key"
        />
        <view class="icon_h" @click="clear">
          <img
            class="btn-clear"
            v-if="showIcon"
            src="http://192.168.1.187:10088/static/images/item-list/clear.png"
          />
        </view>

        <view class="_right" @click.stop="clickPop">
          <image
            class="_img"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/images/store/pop.png"
          />
          <view v-if="showPop" class="pop" ref="popNotice">
            <view class="line" @click="clickItem(item)" v-for="(item, i) in notices" :key="i">
              <image mode="scaleToFill" class="_img" :src="item.icon" />
              <view class="name">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="top">
      <view class="_up">
        <view class="left">
          <img mode="scaleToFill" class="_img" :src="storeMap.supplierStorePicUrl" />
          <view class="_r">
            <view class="name">{{ storeMap.supplierStoreName }}</view>
            <view class="tel" @click="telClick(storeMap)">联系商家</view>
          </view>
        </view>
        <view class="right">
          <img
            @click="handleShareClick"
            class="share"
            src="http://192.168.1.187:10088/static/images/store/share.png"
          />
        </view>
      </view>
      <view class="_down" @click="goStore">
        <view class="_left">
          <img
            mode="scaleToFill"
            class="_img"
            src="http://192.168.1.187:10088/static/images/store/storeIcon.png"
          />
          <view class="label">门店</view>
        </view>
        <view class="_right">
          <view class="num">共计{{ number ? number : 0 }}家</view>
          <img
            mode="scaleToFill"
            class="_img"
            src="http://192.168.1.187:10088/static/images/store/right.png"
          />
        </view>
      </view>
    </view>
    <view v-if="storeMap.supplierStoreNotice.length > 0">
      <view class="space"></view>
      <view class="_upline" @click="showNotice">
        <view class="header">
          <view class="line"></view>
          <view class="_title">店铺公告</view>
        </view>
        <view class="des">
          {{ storeMap.supplierStoreNotice }}
        </view>
      </view>
    </view>

    <view class="space"></view>
    <view class="gg">
      <view class="_upline">
        <view class="header">
          <view class="line"></view>
          <view class="_title">店铺商品</view>
        </view>
        <view class="sort">
          <ul class="sort-list">
            <li class="sort" :class="{ active: !sortType }">综合</li>
            <li class="sort" @click="changeSortType(sortType === 11 ? 12 : 11)">
              时间
              <div class="img-wrap" v-if="sortType !== 11 && sortType !== 12">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png"
                />
              </div>
              <div class="img-wrap" v-if="sortType === 11">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png"
                />
              </div>
              <div class="img-wrap" v-if="sortType === 12">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png"
                />
              </div>
            </li>
            <li class="sort" @click="changeSortType(sortType === 21 ? 22 : 21)">
              价格
              <div class="img-wrap" v-if="sortType !== 21 && sortType !== 22">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png"
                />
              </div>
              <div class="img-wrap" v-if="sortType === 21">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png"
                />
              </div>
              <div class="img-wrap" v-if="sortType === 22">
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png"
                />
                <img
                  class="image"
                  src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png"
                />
              </div>
            </li>
            <li class="sort" @click="showFilter">
              筛选
              <img
                class="filter"
                src="http://192.168.1.187:10088/static/images/item-list/filter.png"
              />
            </li>
          </ul>
        </view>
      </view>
      <view class="shop_list">
        <scroll-view
          v-if="itemList.length || loading"
          scroll-y
          class="item-list-wrap"
          @scrolltolower="loadData"
          :lower-threshold="400"
        >
          <ul class="item-list">
            <li
              class="item"
              @click="goItem(item)"
              v-for="(item, subIndex) in itemList"
              :key="subIndex"
            >
              <div
                class="item-logo"
                :style="{ backgroundImage: 'url(' + item.proPictDir + ')' }"
              ></div>
              <div class="brand-name" v-if="item.brandName">{{ item.brandName }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">&yen;{{ item.salePrice }}</div>
              <div class="item-price">
                <view class="jf" v-if="item.isCreditPoints == 1">
                  积分抵扣￥{{
                    item.creditPoints || item.creditPoints == 0 ? item.creditPoints : ''
                  }}
                </view>
                <view v-else class="_line_height"></view>
                <!-- &yen;{{item.costPriceStr}} -->
              </div>
              <div class="sale-out-wrap" v-if="item.saleState !== 5 || item.availableStock === 0">
                <img
                  class="sale-out"
                  src="http://192.168.1.187:10088/static/images/item-list/sale-out.png"
                />
              </div>
            </li>
          </ul>
        </scroll-view>
        <div v-if="empty" class="empty">
          <img src="http://192.168.1.187:10088/static/images/item-list/empty.png" />
          没有搜到您想要的商品
          <div class="btn-home" @click="toHome">再去逛逛</div>
        </div>
        <search-filter
          ref="filter"
          @reset="reset"
          @changePrice="changePrice"
          @changeBrand="changeBrand"
          @changeCate="changeCate"
          @search="search"
          :priceList="priceList"
          :attrList="attrList"
          :brandList="brandList"
          :categoryList="categoryList"
        ></search-filter>
      </view>
    </view>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
    <uni-popup class="popup" ref="popup" type="bottom" :mask-click="true">
      <view class="share-pop pt-32">
        <view class="title fs-36">分享到</view>
        <view class="flex-h list fs-36">
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-wechat.png"
              mode="scaleToFill"
            />
            <text>微信好友</text>
          </button>
          <!-- #ifdef MP-ALIPAY -->
          <button class="item flex-v flex-c-c" open-type="share">
            <image src="http://192.168.1.187:10088/static/common/icon-qq.png" mode="scaleToFill" />
            <text>QQ好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-alipay.png"
              mode="scaleToFill"
            />
            <text>支付宝好友</text>
          </button>
          <button class="item flex-v flex-c-c" open-type="share">
            <image
              src="http://192.168.1.187:10088/static/common/icon-message.png"
              mode="scaleToFill"
            />
            <text>短信</text>
          </button>
          <!-- #endif -->
          <!-- <button  class="item flex-v flex-c-c" @click="handleCopyClick">
                    <image src="http://192.168.1.187:10088/static/common/icon-link.png"  mode="scaleToFill" />
                    <text>复制链接</text>
                  </button> -->
        </view>
        <view class="btn2">
          <view @click="handleCloseClick" class="cancle bg-white flex-h flex-c-c fs-44">取消</view>
        </view>
      </view>
    </uni-popup>
    <!-- 店铺公告 -->
    <uni-popup class="_notice" ref="notice" type="center" :mask-click="true">
      <view class="content">
        <view class="title">店铺公告</view>
        <view class="infor">{{ notices_info }}</view>
        <view class="close" @click="closed">知道了</view>
      </view>
    </uni-popup>
  </div>
</template>
<script>
import Top from '@/sub-pages/index/components/top.vue'
import SearchFilter from './components/filter'
import wx from 'utils/wx'
export default {
  name: 'stopList',
  data() {
    return {
      loading: true,
      filterType: 0,
      pageNo: 1,
      pageSize: 20,
      disabled: false,
      empty: false,
      itemList: [],
      brandList: [],
      brandId: '',
      dispId: '',
      sortType: '',
      key: '',
      name: '',
      attrList: [],
      categoryList: [],
      priceList: [],
      supplierId: '',
      storeMap: {},
      number: '',
      showPop: false,
      notices: [
        {
          type: 1,
          name: '消息',
          icon: 'http://192.168.1.187:10088/static/images/store/mess.png'
        },
        {
          type: 2,
          name: '首页',
          icon: 'http://192.168.1.187:10088/static/images/store/home.png'
        },
        {
          type: 3,
          name: '钱包',
          icon: 'http://192.168.1.187:10088/static/images/store/card.png'
        }
      ],
      isCollected: false,
      notices_info: '',
      showIcon: false
    }
  },
  computed: {
    title() {
      if (this.key) {
        return this.key
      }
      if (this.name) {
        return this.name
      }
      return '搜索'
    }
  },
  components: {
    Top,
    SearchFilter
  },
  async onLoad(e) {
    console.log('--onload--')
    if (e.supplierId) {
      this.supplierId = e.supplierId
      this.storeDetail()
    }
    this.brandId = this.$root.$mp.query.brandId
    this.planId = this.$root.$mp.query.planId
    this.dispId = this.$root.$mp.query.dispId
    this.key = this.$root.$mp.query.key
    this.$refs.filter.show(false)
    this.pageNo = 1
    this.disabled = false
    this.itemList = []
  },
  mounted() {
    // this.storeCount()
    console.log('---document--', document)
  },
  onShareAppMessage() {
    return {
      path: '/sub-pages/index/store/main?supplierId=' + this.supplierId,
      title: '',
      imageUrl: ''
    }
  },
  methods: {
    clickMap() {
      this.showPop = false
    },
    focusInput() {
      this.showIcon = true
    },
    blurInput() {
      if (this.key) {
        this.showIcon = true
      } else {
        this.showIcon = false
      }
    },
    showNotice() {
      this.$refs.notice.open()
    },
    closed() {
      this.$refs.notice.close()
    },
    telClick(item) {
      uni.makePhoneCall({
        phoneNumber: item.supplierStorePhone
      })
    },
    // 点击分享
    handleShareClick() {
      if (!uni.getStorageSync('token')) {
        uni.navigateTo({
          url: '/pages/user-center/login'
        })
        return
      }
      this.$refs.popup.open()
    },
    // 关闭分享
    handleCloseClick() {
      this.$refs.popup.close()
    },
    // TODO 店铺搜藏
    async changeFavor() {
      this.isCollected = !this.isCollected
      console.log('===点击33===', this.isCollected)
      // 商品收藏
      // if(!Store.getters.isLogin){
      //   wx.navigate({
      //     // url: '/sub-pages/index/login/main''
      //   })
      //   return false;
      // }
      // wx.showLoading('正在提交...');
      // const result = await Axios.post(this.product.isCollected == 1 ? '/product/deleteFavorites' : '/product/addFavorites', {
      //     id: this.productId,
      // })
      // wx.hideLoading();
      // if (result.code == 200) {
      //   this.product.isCollected = this.product.isCollected == 1 ? 0 : 1;
      //   wx.showToast(result.msg);
      // } else {
      //   wx.showToast(result.msg || '操作失败');
      // }
    },
    clickItem(item) {
      console.log('===itemid--', this.storeMap.id)
      const types = [1, 3]
      if (types.includes(item.type)) {
        if (!Store.getters.isLogin) {
          Store.dispatch('logout')
          uni.navigateTo({
            url: '/pages/user-center/login'
          })
          return false
        }
      }
      // const back = `/pages/pay/my-bank-card?back=${'/sub-pages/index/store/main?supplierId=' + this.storeMap.id}`
      const urls = {
        1: '/pages/user-center/message-center',
        2: '/pages/index/index',
        3: '/pages/pay/my-bank-card?back=1'
      }
      wx.navigateTo({ url: urls[item.type] })
    },
    clickPop() {
      this.showPop = !this.showPop
    },
    showList() {},
    goStore() {
      if (!this.number) return
      // this.storeMap.supplierCode  this.supplierId
      wx.navigateTo({ url: '/sub-pages/index/shop/main?supplierId=' + this.storeMap.id })
    },
    async storeCount() {
      const params = {
        supplierCode: this.storeMap.id
      }
      const result = await Axios.post('/srm/stores/getStoreCount', params)
      if (result.code == '200') {
        this.number = result.data
      } else {
        this.$uni.showToast(result.msg)
      }
    },
    async storeDetail() {
      const params = {
        id: this.supplierId
      }
      const result = await Axios.post('/srm/supplier/getByPk', params)
      if (result.code == '200') {
        this.storeMap = result.data || {}
        this.notices_info = this.storeMap.supplierStoreNotice
        this.storeCount()
        await this.loadData()
      } else {
        this.$uni.showToast(result.msg)
      }
    },
    toHome() {
      wx.switchTab({
        url: '/pages/index/main'
      })
    },
    goItem(item) {
      const sceneType = item.isCreditPoints === 1 ? '积分兑换' : '商品购买'
      uni.navigateTo({
        url: `/sub-pages/index/item/main?id=${item.id}&sceneType=${sceneType}`
      })
      // XIU.bridge.goItem(item.id)
    },
    back() {
      history.go(-1)
    },
    reset() {
      this.priceList.forEach((data) => {
        data.check = false
      })
      this.categoryList.forEach((data) => {
        data.check = false
      })
      this.brandList.forEach((data) => {
        data.check = false
      })
      this.attrList.forEach((data) => {
        data.dataList.forEach((child) => {
          child.check = false
        })
      })
      this.search()
    },
    changeSortType(type) {
      this.sortType = type
      this.search()
    },
    clear() {
      this.key = ''
      this.showIcon = false
      console.log('===清除--')
      this.search()
    },
    search() {
      this.pageNo = 1
      this.itemList = []
      this.disabled = false
      this.loadData()
    },
    changePrice(priceRange) {
      priceRange.check = !priceRange.check
      this.$set(this.priceList, priceRange.id, priceRange)
    },
    changeBrand(brand) {
      brand.check = !brand.check
      const index = this.brandList.findIndex((item) => {
        return item.brandId == brand.brandId
      })
      this.$set(this.brandList, index, brand)
    },
    changeCate(cate) {
      cate.check = !cate.check
      const index = this.categoryList.findIndex((item) => {
        return item.id == cate.id
      })
      this.$set(this.categoryList, index, cate)
    },
    showFilter() {
      this.$refs.filter.show(true)
    },
    async loadData() {
      if (this.disabled) {
        return false
      }
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNo++,
        supplierId: this.supplierId
      }

      Object.assign(
        params,
        this.storeMap.storeIds.length > 0 ? { ids: this.storeMap.storeIds } : {}
      )
      if (this.sortType) {
        params.sortType = this.sortType
      }
      if (this.brandId) {
        params.brandIds = this.brandId.join(',')
      }
      if (this.planId) {
        params.planId = this.planId
      }
      if (this.dispId) {
        params.categoryCodes = this.dispId
      }
      if (this.key) {
        params.keywords = this.key
      }
      const attrList = []
      this.attrList.forEach((attr) => {
        attr.dataList.forEach((condition) => {
          if (condition.check) {
            attrList.push(condition.value)
          }
        })
      })
      if (attrList.length) {
        params.attrValIds = attrList.join(',')
      }
      // 类别
      const dispIds = []
      this.categoryList.forEach((cate) => {
        if (cate.check) {
          dispIds.push(cate.id)
        }
      })
      if (dispIds.length) {
        params.categoryCodes = dispIds.join(',')
      }
      // 品牌
      const brandIds = []
      this.brandList.forEach((brand) => {
        if (brand.check) {
          brandIds.push(brand.brandId)
        }
      })
      if (brandIds.length) {
        params.brandIds = brandIds.join(',')
      }
      // 价格
      const priceIds = []
      this.priceList.forEach((price) => {
        if (price.check) {
          priceIds.push(price.name + '')
        }
      })
      if (priceIds.length) {
        params.priceRange = priceIds.join(',')
      }
      this.disabled = true
      wx.showLoading()
      // console.log("params: " + JSON.stringify(params))
      //  const searchResult = await Axios.get(ENV.SEARCH, { params: Object.assign(params, this.searchParams) })
      const searchResult2 = await Axios.post(
        '/product/getProductSearchList',
        Object.assign(params, this.searchParams)
      )

      console.log('result: ', searchResult2)
      if (searchResult2.code == '200') {
        const searchResult = searchResult2.data
        wx.hideLoading()
        this.loading = false
        if (searchResult.esProducts) {
          this.disabled = searchResult.pageNum >= searchResult.totalPage
          const list = []
          searchResult.esProducts.forEach((data) => {
            const tempData = _.pick(data, [
              'id',
              'skuList',
              'mainImgUrl',
              'brandName',
              'name',
              'price',
              'stockBlance',
              'saleState'
            ])
            let availableStock = 0
            let minMarkOffPrice = 0
            let maxMarkOffPrice = 0
            let minCostPrice = 0
            let maxCostPrice = 0
            tempData.skuList &&
                tempData.skuList.forEach((sku) => {
                  availableStock += sku.availableStock
                  if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
                    minMarkOffPrice = sku.markOffPrice
                  }
                  if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
                    maxMarkOffPrice = sku.markOffPrice
                  }
                  if (minCostPrice === 0 || minCostPrice > sku.sellingPrice) {
                    minCostPrice = sku.sellingPrice
                  }
                  if (maxCostPrice === 0 || maxCostPrice < sku.sellingPrice) {
                    maxCostPrice = sku.sellingPrice
                  }
                })
            if (minMarkOffPrice !== maxMarkOffPrice) {
              tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`
            } else {
              tempData.markOffPriceStr = minMarkOffPrice
            }
            if (minCostPrice !== maxCostPrice) {
              tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`
            } else {
              tempData.costPriceStr = minCostPrice
            }
            tempData.availableStock = availableStock
            tempData.proPictDir = XIU.getImgFormat(tempData.mainImgUrl, '/resize,w_750')
            Object.assign(tempData, data)
            console.log('===data--', tempData)
            list.push(tempData)
          })
          this.itemList = this.itemList.concat(list)
          this.brandList = []
          Object.keys(searchResult.brands).forEach((key) => {
            searchResult.brands[key].forEach((brand) => {
              this.brandList.push({
                brandId: brand.brandId,
                brandName: brand.brandName,
                check: false
              })
            })
          })
          this.categoryList = []
          searchResult.categorys.forEach((category) => {
            this.categoryList.push({
              id: category.code,
              name: category.name,
              check: false
            })
          })
          this.priceList = []
          searchResult.prices.forEach((data, index) => {
            this.priceList.push({
              id: index,
              name: data,
              check: false
            })
          })
          if (this.attrList.length) {
            return false
          }
          const attrs = []
          Object.keys(searchResult.attrs).forEach((key) => {
            const dataList = []
            const attr = key.split('@@@')
            searchResult.attrs[key].forEach((data) => {
              if (!data) {
                return false
              }
              const subAttr = data.split('@@@')
              dataList.push({
                id: subAttr[0],
                name: subAttr[1],
                value: data,
                check: false
              })
            })
            attrs.push({
              id: attr[0],
              name: attr[1],
              showMore: false,
              dataList: dataList
            })
          })
          this.attrList = attrs
          this.empty = !this.itemList
          // if(!this.itemList){
          //   this.empty = true
          // }else{
          //   this.empty = false
          // }
          // console.log("页面商品：" + JSON.stringify(this.itemList))
        } else {
          // wx.showToast(searchResult.result.message);
          this.empty = true
        }
      }
    }
  },
  onPageScroll(e) {
    // TODO 滚动问题
    // e.scrollTop > App.systemInfo.screenHeight
    this.$refs.toTop.show(true)
  }
  // async mounted() {
  //    console.log('--mounted--')
  //   this.brandId = this.$root.$mp.query.brandId;
  //   this.planId = this.$root.$mp.query.planId;
  //   this.dispId = this.$root.$mp.query.dispId;
  //   this.key = this.$root.$mp.query.key;
  //   this.$refs.filter.show(false);
  //   this.pageNo = 1;
  //   this.disabled=false;
  //   this.itemList = [];
  //   await this.loadData();
  // }
}
</script>
<style lang="scss" scoped>
  @import '~@/styles/base';
  .storeDetail {
    .bg {
      background-color: red;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .share-pop {
      background-color: #f2f2f2;
      border-radius: 16px 16px 0px 0px;
      color: #333333;
      .title {
        text-align: center;
        line-height: 50rpx;
      }
      .list {
        // #ifdef MP-ALIPAY
        justify-content: flex-start;
        // #endif

        // #ifdef MP-WEIXIN
        justify-content: center;
        // #endif

        align-items: center;

        padding: 24rpx 74rpx;
        flex-wrap: wrap;
        .item {
          height: 192rpx;
          flex-shrink: 0;
          width: 33.3%;
          margin-bottom: 28rpx;
          image {
            flex-shrink: 0;
            width: 134rpx;
            height: 134rpx;
            margin-bottom: 8rpx;
          }
          text {
            line-height: 50rpx;
          }
        }
      }
      .btn2 {
        padding: 24rpx 74rpx;
        box-sizing: border-box;
        .cancle {
          height: 108rpx;
          border-radius: 54rpx;
          color: #666;
          font-weight: 500;
        }
      }
    }
    ._search {
      .search-header {
        border-radius: 44rpx;
        border: 2rpx solid #ff5500;
        width: 80%;

        ._right {
          position: absolute;
          right: -70rpx;
          ._img {
            width: 40rpx;
            height: 34rpx;
          }
          .pop {
            position: absolute;
            right: 30rpx;
            width: 248rpx;
            height: 292rpx;
            background: #ffffff;
            box-shadow: 0rpx 8rpx 24rpx 0rpx rgba(0, 0, 0, 0.12);
            border-radius: 16rpx;
            padding: 0rpx 16rpx 0rpx 16rpx;
            .line {
              display: flex;
              justify-content: center;
              height: 92rpx;
              line-height: 92rpx;
              border-bottom: 2rpx solid #eeeeee;
              background-color: #fff;
              ._img {
                width: 48rpx;
                height: 48rpx;
                margin-top: 20rpx;
                margin-right: 24rpx;
              }
              .name {
                font-size: 36rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
              }
            }
          }
        }
        @include middle-center-x(fixed);
        top: 0;
        height: rpx(88);
        padding-left: rpx(32);
        padding-right: rpx(32);
        display: flex;
        align-items: center;
        background-color: #fff;
        z-index: 100;
        left: 45%;
        .icon {
          @include middle-center-y();
          left: rpx(52);
          width: rpx(30);
          height: rpx(30);
          z-index: 100;
        }
        input {
          line-height: 83rpx;
          height: 83rpx;
          background: #ffffff;
          border-radius: 44rpx;
          width: 94%;
          display: block;
          position: relative;
          width: 88%;
          padding-left: rpx(70);
          padding-right: rpx(30);
          font-size: rpx(28);
          color: $black;
        }
        .btn-back {
          @include middle-center-y();
          left: rpx(35);
          font-size: rpx(36);
        }
        .icon_h {
          position: absolute;
          top: 0;
          height: 83rpx;
          right: 23rpx;
          width: 49rpx;
          .btn-clear {
            width: rpx(30);
            height: rpx(30);
            position: absolute;
            top: 33%;
          }
        }
      }
    }

    .top {
      background-color: #fff;
      margin-top: 83rpx;
      ._up {
        display: flex;
        border-bottom: 1rpx solid #eeeeee;
        justify-content: space-between;
        padding: 32rpx 32rpx 0rpx 32rpx;
        .left {
          display: flex;
          ._img {
            width: 148rpx !important;
            height: 148rpx !important;
            border-radius: 10rpx;
            border: 2rpx solid #ffffff;
          }
          ._r {
            margin-left: 20rpx;
            .name {
              font-size: 48rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              margin-bottom: 21rpx;
            }
            .tel {
              width: 194rpx;
              height: 60rpx;
              background: linear-gradient(104deg, #ffac28 0%, #fd831e 100%);
              border-radius: 30rpx;
              font-size: 36rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 60rpx;
              margin-bottom: 24rpx;
              text-align: center;
            }
          }
        }
        .right {
          display: flex;
          width: 22%;
          height: 48rpx;
          justify-content: space-evenly;
          .store-wrap {
            width: rpx(48);
            height: rpx(48);
            .collected {
              width: rpx(45);
              height: rpx(45);
            }
          }
          .share {
            width: 46rpx;
            height: 46rpx;
          }
        }
      }
      ._down {
        height: 98rpx;
        line-height: 98rpx;
        display: flex;
        justify-content: space-between;
        padding: 0rpx 20rpx 0rpx 30rpx;
        ._left {
          display: flex;
          ._img {
            width: 48rpx;
            height: 48rpx;
            margin-top: 25rpx;
            margin-right: 10rpx;
          }
          .label {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
        ._right {
          display: flex;
          .num {
            font-size: 36rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
          ._img {
            width: 36rpx;
            height: 36rpx;
            margin-top: 33rpx;
            margin-left: 10rpx;
          }
        }
      }
    }
    .space {
      height: 20rpx;
      background: #f2f2f2;
    }
    ._upline {
      padding: 18rpx 32rpx 24rpx 32rpx;
      .header {
        display: flex;
        .line {
          width: 8rpx;
          height: 38rpx;
          background: #ff9500;
          border-radius: 4rpx;
          margin-right: 16rpx;
          margin-top: 9rpx;
        }
        ._title {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
      .des {
        margin-top: 18rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        padding-left: 24rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .sort {
        .sort-list {
          width: 100%;
          // @include middle-center-x(fixed);
          // top: rpx(88);
          // width: rpx(750);
          display: flex;
          // align-items: center;
          // z-index: 100;
          background-color: #fff;

          .sort {
            display: flex;
            align-items: center;
            justify-content: center;
            height: rpx(90);
            flex: 1;
            font-size: rpx(28);

            &.active {
              font-weight: 500;
            }

            .img-wrap {
              margin-left: rpx(8);

              .image {
                margin-bottom: rpx(4);
                display: block;
                width: rpx(14);
                height: rpx(8);

                &:last-child {
                  margin-bottom: 0;
                }
              }
            }

            .filter {
              margin-left: rpx(8);
              width: rpx(28);
              height: rpx(28);
            }
          }
        }
      }
    }
    .gg {
      .header {
        display: flex;
        .line {
          width: 8rpx;
          height: 38rpx;
          background: #ff9500;
          border-radius: 4rpx;
          margin-right: 16rpx;
          margin-top: 9rpx;
        }
        ._title {
          font-size: 40rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }

      .shop_list {
        .scroll-container {
          overflow: hidden;
        }

        .filter-list {
          display: flex;
          align-items: center;
          @include middle-center-x(fixed);
          top: rpx(102);
          width: rpx(750);
          background-color: #fff;
          z-index: 100;

          .filter {
            flex: 1;
            text-align: center;

            .content {
              display: inline-block;
              padding: rpx(20);
              font-size: rpx(30);
              border-bottom: 1px solid transparent;

              .iconfont {
                margin-left: rpx(5);
                font-size: rpx(25);
                font-weight: bold;
              }
            }

            &.active {
              .content {
                font-weight: bold;
                border-bottom: 1px solid $black;
              }
            }
          }
        }
        .item-list-wrap {
          box-sizing: border-box;
          // height: 100vh;
          background: #f2f2f2;
          // opacity: 0.72;
          padding: 32rpx 32rpx 24rpx 32rpx;
        }

        .item-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          .item {
            position: relative;
            padding-bottom: rpx(8);
            margin-bottom: rpx(24);
            border-radius: rpx(8);
            background-color: #fff;
            width: rpx(331);
            box-sizing: border-box;
            border-radius: 16rpx;

            .item-logo {
              border-radius: 16rpx 16rpx 0rpx 0rpx;
              position: relative;
              width: rpx(331);
              height: rpx(340);
              margin-bottom: rpx(30);
              background: center no-repeat;
              // background-size: contain;
              background-size: cover;
              .sale-out-wrap {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.3);

                .sale-out {
                  @include middle-center();
                  width: rpx(151);
                  height: rpx(151);
                }
              }
            }

            .brand-name {
              font-size: rpx(28);
              color: $black;
              @include ellipsis();
              line-height: rpx(42);
            }

            .item-name {
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              padding-top: rpx(10);
              font-size: rpx(36);
              line-height: rpx(42);
              color: $light-black;
              @include ellipsis();
              margin-left: 16rpx;
            }

            .item-price {
              padding-top: rpx(10);
              line-height: rpx(42);
              font-size: rpx(40);
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ff5500;
              margin-left: 16rpx;
              .jf {
                width: 217rpx;
                margin-top: 10rpx;
                margin-bottom: 18rpx;
                height: 48rpx;
                font-size: 28rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ff2600;
                border-radius: 4rpx;
                border: 2rpx solid #ff2600;
                padding: 4rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                word-wrap: break-word;
                white-space: normal !important;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
              ._line_height {
                height: 73rpx;
              }
            }
          }
        }

        .empty {
          padding-top: rpx(50);
          font-size: rpx(26);
          color: #25292d;
          text-align: center;
          width: 100%;
          white-space: nowrap;

          img {
            display: block;
            margin-bottom: rpx(30);
            margin-left: auto;
            margin-right: auto;
            width: rpx(202);
            height: rpx(280);
          }

          .btn-home {
            @include btn-block();
            margin-top: rpx(100);
            margin-left: auto;
            margin-right: auto;
            width: rpx(320);
            height: rpx(80);
            line-height: rpx(80);
            border-radius: rpx(40);
          }
        }
      }
    }
    ._notice {
      height: 790rpx;
      background: #ffffff;
      border-radius: 16rpx;
      overflow: auto;
      padding: 0rpx 64rpx 0rpx 64rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      text-align: center;
      .title {
        height: 54rpx;
        font-size: 44rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 54rpx;
        padding-top: 34rpx;
        padding-bottom: 62rpx;
      }
      .infor {
        width: 600rpx;
        height: 556rpx;
        padding: 0 64rpx 0 64rpx;
        overflow: auto;
      }
      .close {
        height: 100rpx;
        line-height: 100rpx;
        border-top: 1rpx solid #e5e5e5;
        font-size: 44rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
</style>
