<style lang="scss" scoped>
  @import '~@/styles/base';

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .search-header {
    width: 686rpx;
    height: rpx(88);
    padding-left: rpx(32);
    padding-right: rpx(32);
    display: flex;
    align-items: center;
    z-index: 10;
    margin: 0 auto;
    position: relative;

    background: #ffffff;
    border-radius: 44rpx;
    border: 2rpx solid #ff5500;
    .icon {
      @include middle-center-y();
      left: rpx(52);
      width: rpx(40);
      height: rpx(40);
      z-index: 100;
    }
    input {
      display: block;
      position: relative;
      width: 100%;
      padding-right: rpx(63);
      height: rpx(88);
      font-size: rpx(36);
      color: $black;
      border-radius: rpx(16);
    }

    .btn-back {
      @include middle-center-y();
      left: rpx(35);
      font-size: rpx(36);
    }

    .btn-clear {
      @include middle-center-y();
      right: rpx(32);
      width: rpx(36);
      height: rpx(36);
      z-index: 100;
    }
  }

  .sort-list {
    position: relative;
    width: rpx(750);
    padding: 0 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    background-color: #fff;

    .sort {
      display: flex;
      align-items: center;
      justify-content: center;
      height: rpx(90);
      // flex: 1;
      color: #999999;
      font-size: rpx(36);
      position: relative;

      &.active {
        font-weight: 500;
        color: #333333;
        box-sizing: border-box;
        &::after {
          content: '';
          display: block;
          width: 100%;
          height: 8rpx;
          background: #ff711a;
          border-radius: 5rpx;
          position: absolute;
          bottom: 0;
          left: 0;
        }
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
        width: rpx(42);
        height: rpx(40);
      }
    }
  }

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

  .empty {
    padding-top: rpx(360);
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

  .shop_list {
    flex: 1;
    background: #f2f2f2;
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
            border-bottom: 1px solid $color-black;
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
        &.list {
          width: 100%;
          display: flex;
          align-items: center;
          height: 276rpx;
          padding: 0 24rpx;
          box-sizing: border-box;
          .item-logo {
            width: 226rpx;
            height: 228rpx;
            margin-bottom: 0;
            flex-shrink: 1;
          }
          .right {
            width: 402rpx;
            // height: 228rpx;
            .item-name {
              white-space: pre-wrap;
              width: 402rpx;
              margin-left: 0;
              padding-left: 16rpx;
              margin-bottom: 16rpx;
              word-break: unset;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }

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
            background-color: rgba(0, 0, 0, 0.2);

            .sale-out {
              @include middle-center();
              width: 100%;
              height: 100%;
            }
          }
        }

        .brand-name {
          font-size: rpx(28);
          color: $color-black;
          @include ellipsis();
          line-height: rpx(42);
        }
        .coupon-wrapper {
          margin-left: 16rpx;
          margin-top: 22rpx;
          height: 48rpx;
        }
        .coupon {
          display: flex;
          align-items: center;
          height: 48rpx;
          width: fit-content;
          border-radius: 4rpx;
          border: 2rpx solid #ff2600;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 32rpx;
          .label {
            width: 48rpx;
            height: 48rpx;
            line-height: 48rpx;
            text-align: center;
            background: #ff2600;
            border-radius: 4rpx 0rpx 0rpx 4rpx;
            border: 2rpx solid #ff2600;
            color: #ffffff;
          }
          .coupon-price {
            padding: 0 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ff2600;
          }
        }

        .item-name {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          height: 110rpx;
          padding-top: rpx(10);
          font-size: rpx(36);
          color: $color-grey;
          white-space: unset;
          margin: 0 16rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
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
            margin-top: 10rpx;
            margin-bottom: 18rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #ff2600;
            border-radius: 4rpx;
            border: 2rpx solid #ff2600;
            padding: 4rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
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

      .img {
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
</style>

<template>
  <div class="app">
    <div class="search-header">
      <input confirm-type="search" @confirm="search" :placeholder="key || '输入关键字搜索商品...'" v-model="key" />
      <img v-if="key.length > 0" class="btn-clear" src="http://192.168.1.187:10088/static/images/item-list/clear.png" @click="clear" />
    </div>
    <ul class="sort-list">
      <li class="sort" :class="{ active: !sortType }" @click="changeSortType('')">综合</li>
      <li class="sort" :class="{ active: [11, 12].includes(sortType) }" @click="changeSortType(sortType === 11 ? 12 : 11)">
        时间
        <div class="img-wrap" v-if="sortType !== 11 && sortType !== 12">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png" />
        </div>
        <div class="img-wrap" v-if="sortType === 11">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png" />
        </div>
        <div class="img-wrap" v-if="sortType === 12">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png" />
        </div>
      </li>
      <li class="sort" :class="{ active: [21, 22].includes(sortType) }" @click="changeSortType(sortType === 21 ? 22 : 21)">
        价格
        <div class="img-wrap" v-if="sortType !== 21 && sortType !== 22">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png" />
        </div>
        <div class="img-wrap" v-if="sortType === 21">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_h@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_n@2x.png" />
        </div>
        <div class="img-wrap" v-if="sortType === 22">
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/up_n@2x.png" />
          <img class="image" src="http://192.168.1.187:10088/static/images/item-list/down_h@2x.png" />
        </div>
      </li>
      <li class="sort" @click="showFilter">
        筛选
        <img class="filter" src="http://192.168.1.187:10088/static/images/item-list/filter.png" />
      </li>
      <li class="sort" @click="changeListType">
        <img class="filter" v-if="listType === 0" src="http://192.168.1.187:10088/static/images/common/card-type.png" />
        <img class="filter" v-if="listType === 1" src="http://192.168.1.187:10088/static/images/common/list-type.png" />
      </li>
    </ul>

    <view v-if="itemList.length || loading" class="shop_list">
      <scroll-view scroll-y class="item-list-wrap" :lower-threshold="400">
        <ul class="item-list">
          <template v-if="listType === 0">
            <li class="item" @click="goItem(item)" v-for="(item, subIndex) in itemList" :key="subIndex">
              <div class="item-logo" :style="{ backgroundImage: 'url(' + item.proPictDir + ')' }">
                <div class="sale-out-wrap" v-if="item.soldOut === 0">
                  <img class="sale-out" src="http://192.168.1.187:10088/static/home/empt.png" />
                </div>
              </div>
              <div class="item-name">{{ item.name }}</div>
              <!-- 优惠券 -->
              <view class="coupon-wrapper">
                <view v-if="item.denomination" class="coupon">
                  <view class="label">券</view>
                  <view class="coupon-price">¥{{ item.denomination }}</view>
                </view>
              </view>

              <div class="item-price">{{ member ? '会员到手价' : '到手价' }}:&yen;{{ member ? item.memberPrice : item.finalPrice }}</div>
              <div class="item-price">
                <view class="jf" v-if="item.isCreditPoints == 1">积分抵扣￥{{ item.pointDiscountPoint }}</view>
                <view v-else class="_line_height"></view>
                <!-- &yen;{{item.costPriceStr}} -->
              </div>
            </li>
          </template>
          <template v-if="listType === 1">
            <li class="item list" @click="goItem(item)" v-for="(item, subIndex) in itemList" :key="subIndex">
              <div class="item-logo" :style="{ backgroundImage: 'url(' + item.proPictDir + ')' }">
                <div class="sale-out-wrap" v-if="item.soldOut === 0">
                  <img class="sale-out" src="http://192.168.1.187:10088/static/home/empt.png" />
                </div>
              </div>
              <view class="right">
                <div class="brand-name" v-if="item.brandName">
                  {{ item.brandName }}
                </div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">{{ member ? '会员到手价' : '到手价' }}:&yen;{{ member ? item.memberPrice : item.finalPrice }}</div>
                <!-- 优惠券 -->
                <view v-if="item.denomination" class="coupon">
                  <view class="label">券</view>
                  <view class="coupon-price">¥{{ item.denomination }}</view>
                </view>
                <div class="item-price">
                  <view class="jf" v-if="item.isCreditPoints == 1">积分抵扣￥{{ item.pointDiscountPoint }}</view>
                  <view v-else class="_line_height"></view>
                </div>
              </view>
            </li>
          </template>
        </ul>
      </scroll-view>
    </view>
    <div v-if="empty" class="empty">
      <img src="http://192.168.1.187:10088/static/images/item-list/empty.png" />
      没有搜到您想要的商品
      <!-- <div class="btn-home" @click="toHome">再去逛逛</div> -->
    </div>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
    <search-filter
      ref="filter"
      @reset="reset"
      @changePrice="changePrice"
      @search="search"
      @changeBrand="changeBrand"
      @changeTargetAudience="changeTargetAudience"
      @changeCate="changeCate"
      :priceList="priceList"
      :attrList="attrList"
      :brandList="brandList"
      :categoryList="categoryList"
    ></search-filter>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Top from '@/sub-pages/index/components/top.vue';
  import SearchFilter from './components/filter';
  export default {
    name: 'SEARCH',
    data() {
      return {
        loading: true,
        filterType: 0,
        pageNo: 1,
        pageSize: 20,
        disabled: false,
        empty: false,
        listType: 0,
        itemList: [],
        brandList: [],
        brandId: '',
        dispId: '',
        level: '',
        cateId: '',
        sortType: '',
        key: '',
        name: '',
        attrList: [],
        categoryList: [],
        targetAudienceList: [],
        priceList: [],
      };
    },
    computed: {
      title() {
        if (this.key) {
          return this.key;
        }
        if (this.name) {
          return this.name;
        }
        return '搜索';
      },
    },
    components: {
      Top,
      SearchFilter,
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
      // 是否会员
      member() {
        return this.userInfo && this.userInfo.memberStatus === '1';
      },
    },
    methods: {
      toHome() {
        uni.navigateTo({
          url: '/sub-pages/index/index/main',
        });
      },
      changeListType() {
        this.listType = this.listType === 0 ? 1 : 0;
      },
      goItem(item) {
        const sceneType = item.isCreditPoints === 1 ? '积分兑换' : '商品购买';
        uni.navigateTo({
          url: `/sub-pages/index/item/main?id=${item.id}&sceneType=${sceneType}`,
        });
      },
      back() {
        history.go(-1);
      },
      reset() {
        this.priceList.forEach((data) => {
          data.check = false;
        });
        this.categoryList.forEach((data) => {
          data.check = false;
        });
        this.brandList.forEach((data) => {
          data.check = false;
        });
        this.targetAudienceList.forEach((data) => {
          data.check = false;
        });
        this.attrList.forEach((data) => {
          data.dataList.forEach((child) => {
            child.check = false;
          });
        });
        this.search();
      },
      changeSortType(type) {
        this.sortType = type;
        this.search();
      },
      clear() {
        this.key = '';
        this.search();
      },
      search() {
        this.pageNo = 1;
        this.itemList = [];
        this.disabled = false;
        this.searchData();
      },
      changePrice(priceRange) {
        this.priceList.forEach((e) => {
          e.check = false;
        });
        priceRange.check = !priceRange.check;
        this.$set(this.priceList, priceRange.id, priceRange);
      },
      changeTargetAudience(list) {
        this.targetAudienceList = list;
      },
      changeBrand(brand) {
        brand.check = !brand.check;
        const index = this.brandList.findIndex((item) => {
          return item.brandId == brand.brandId;
        });
        this.$set(this.brandList, index, brand);
      },
      changeCate(cate) {
        cate.check = !cate.check;
        const index = this.categoryList.findIndex((item) => {
          return item.id == cate.id;
        });
        this.$set(this.categoryList, index, cate);
      },
      showFilter() {
        this.$refs.filter.show();
      },
      async loadData() {
        if (this.disabled) {
          return false;
        }
        const params = {
          pageSize: this.pageSize,
          pageNum: this.pageNo++,
          storeBrandIds: uni.getStorageSync('storeInfo').operatingBrand,
          businessScopeList: uni.getStorageSync('storeInfo').businessScope,
          // isCreditPoints: 0,
        };
        if (this.sortType) {
          params.sortType = this.sortType;
        }
        if (this.brandId) {
          params.brandIds = this.brandId.join(',');
        }
        if (this.planId) {
          params.planId = this.planId;
        }
        if (this.dispId) {
          params.categoryCodes = this.dispId;
        }
        if (this.level) {
          const s = ['firstCategoryId', 'twoCategoryId', 'threeCategoryId'];
          params[s[this.level - 1]] = this.cateId;
        }
        if (this.key) {
          params.name = this.key;
        }
        const attrList = [];
        this.attrList.forEach((attr) => {
          attr.dataList.forEach((condition) => {
            if (condition.check) {
              attrList.push(condition.value);
            }
          });
        });
        if (attrList.length) {
          params.attrValIds = attrList.join(',');
        }
        const dispIds = [];
        this.categoryList.forEach((cate) => {
          if (cate.check) {
            dispIds.push(cate.id);
          }
        });
        if (dispIds.length) {
          params.categoryCodes = dispIds.join(',');
        }
        const brandIds = [];
        this.brandList.forEach((brand) => {
          if (brand.check) {
            brandIds.push(brand.brandId);
          }
        });
        if (brandIds.length) {
          params.brandIds = brandIds.join(',');
        }
        const priceIds = [];
        this.priceList.forEach((price) => {
          if (price.check) {
            priceIds.push(price.name);
          }
        });
        if (priceIds.length) {
          params.priceRange = priceIds.join(',');
        }
        const targetAudiences = [];
        this.targetAudienceList.forEach((target) => {
          if (target.check) {
            targetAudiences.push(target.name);
          }
        });
        if (targetAudiences.length) {
          params.targetAudience = targetAudiences.join(',');
        }
        this.disabled = true;
        uni.showLoading();
        // console.log("params: " + JSON.stringify(params))
        let searchResult = await Axios.post('/product/getProductSearchList', {
          ...Object.assign(params, this.searchParams),
        });
        // console.log('searchResult: ', searchResult);

        searchResult = searchResult.data;
        uni.hideLoading();
        this.loading = false;
        if (searchResult.esProducts) {
          this.disabled = searchResult.pageNum >= searchResult.totalPage;
          const list = [];
          searchResult.esProducts.forEach((data) => {
            const tempData = _.pick(data, [
              'id',
              'skuList',
              'mainImgUrl',
              'brandName',
              'name',
              'price',
              'stockBlance',
              'saleState',
              'pointDiscountPoint',
            ]);
            let availableStock = 0;
            let minMarkOffPrice = 0;
            let maxMarkOffPrice = 0;
            let minCostPrice = 0;
            let maxCostPrice = 0;
            tempData.skuList &&
              tempData.skuList.forEach((sku) => {
                availableStock += sku.availableStock;
                if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
                  minMarkOffPrice = sku.markOffPrice;
                }
                if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
                  maxMarkOffPrice = sku.markOffPrice;
                }
                if (minCostPrice === 0 || minCostPrice > sku.sellingPrice) {
                  minCostPrice = sku.sellingPrice;
                }
                if (maxCostPrice === 0 || maxCostPrice < sku.sellingPrice) {
                  maxCostPrice = sku.sellingPrice;
                }
              });
            if (minMarkOffPrice !== maxMarkOffPrice) {
              tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`;
            } else {
              tempData.markOffPriceStr = minMarkOffPrice;
            }
            if (minCostPrice !== maxCostPrice) {
              tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`;
            } else {
              tempData.costPriceStr = minCostPrice;
            }
            tempData.availableStock = availableStock;
            tempData.proPictDir = tempData.mainImgUrl;
            Object.assign(tempData, data);
            list.push(tempData);
          });
          this.itemList = this.itemList.concat(list);
          this.brandList = [];
          console.log('searchResult: ', searchResult);
          Object.keys(searchResult.brands).forEach((key) => {
            searchResult.brands[key].forEach((brand) => {
              this.brandList.push({
                brandId: brand.brandId,
                brandName: brand.brandName,
                check: false,
              });
            });
          });
          this.categoryList = [];
          searchResult.categorys.forEach((category) => {
            this.categoryList.push({
              id: category.code,
              name: category.name,
              check: false,
            });
          });
          this.priceList = [];
          searchResult.prices.forEach((data, index) => {
            this.priceList.push({
              id: index,
              name: data,
              check: false,
            });
          });
          if (this.attrList.length) {
            return false;
          }
          const attrs = [];
          Object.keys(searchResult.attrs).forEach((key) => {
            const dataList = [];
            const attr = key.split('@@@');
            searchResult.attrs[key].forEach((data) => {
              if (!data) {
                return false;
              }
              const subAttr = data.split('@@@');
              dataList.push({
                id: subAttr[0],
                name: subAttr[1],
                value: data,
                check: false,
              });
            });
            attrs.push({
              id: attr[0],
              name: attr[1],
              showMore: false,
              dataList: dataList,
            });
          });
          this.attrList = attrs;
          this.empty = !this.itemList;
          // if(!this.itemList){
          //   this.empty = true
          // }else{
          //   this.empty = false
          // }
          // console.log("页面商品：" + JSON.stringify(this.itemList))
        } else {
          // wx.showToast(searchResult.result.message);
          this.empty = true;
        }
      },
      async searchData() {
        if (this.disabled) {
          return false;
        }
        const params = {
          pageSize: this.pageSize,
          pageNum: this.pageNo++,
          storeBrandIds: uni.getStorageSync('storeInfo').operatingBrand,
          businessScopeList: uni.getStorageSync('storeInfo').businessScope,
          // isCreditPoints: 0,
        };
        if (this.sortType) {
          params.sortType = this.sortType;
        }
        if (this.brandId) {
          params.brandIds = this.brandId.join(',');
        }
        if (this.planId) {
          params.planId = this.planId;
        }
        if (this.dispId) {
          params.categoryCodes = this.dispId;
        }
        if (this.level) {
          const s = ['firstCategoryId', 'twoCategoryId', 'threeCategoryId'];
          params[s[this.level - 1]] = this.cateId;
        }
        if (this.key) {
          params.name = this.key;
        }
        const attrList = [];
        this.attrList.forEach((attr) => {
          attr.dataList.forEach((condition) => {
            if (condition.check) {
              attrList.push(condition.value);
            }
          });
        });
        if (attrList.length) {
          params.attrValIds = attrList.join(',');
        }
        const dispIds = [];
        this.categoryList.forEach((cate) => {
          if (cate.check) {
            dispIds.push(cate.id);
          }
        });
        if (dispIds.length) {
          params.categoryCodes = dispIds.join(',');
        }
        const brandIds = [];
        this.brandList.forEach((brand) => {
          if (brand.check) {
            brandIds.push(brand.brandId);
          }
        });
        if (brandIds.length) {
          params.brandIds = brandIds.join(',');
        }
        const priceIds = [];
        this.priceList.forEach((price) => {
          if (price.check) {
            priceIds.push(price.name);
          }
        });
        if (priceIds.length) {
          params.priceRange = priceIds.join(',');
        }
        const targetAudiences = [];
        this.targetAudienceList.forEach((target) => {
          if (target.check) {
            targetAudiences.push(target.name);
          }
        });
        if (targetAudiences.length) {
          params.targetAudience = targetAudiences.join(',');
        }
        this.disabled = true;
        uni.showLoading();
        // console.log("params: " + JSON.stringify(params))
        let searchResult = await Axios.post('/product/getProductSearchList', {
          ...Object.assign(params, this.searchParams),
        });
        // console.log('searchResult: ', searchResult);

        searchResult = searchResult.data;
        uni.hideLoading();
        this.loading = false;
        if (searchResult.esProducts) {
          this.disabled = searchResult.pageNum >= searchResult.totalPage;
          const list = [];
          searchResult.esProducts.forEach((data) => {
            const tempData = _.pick(data, [
              'id',
              'skuList',
              'mainImgUrl',
              'brandName',
              'name',
              'price',
              'stockBlance',
              'saleState',
              'pointDiscountPoint',
            ]);
            let availableStock = 0;
            let minMarkOffPrice = 0;
            let maxMarkOffPrice = 0;
            let minCostPrice = 0;
            let maxCostPrice = 0;
            tempData.skuList &&
              tempData.skuList.forEach((sku) => {
                availableStock += sku.availableStock;
                if (minMarkOffPrice === 0 || minMarkOffPrice > sku.markOffPrice) {
                  minMarkOffPrice = sku.markOffPrice;
                }
                if (maxMarkOffPrice === 0 || maxMarkOffPrice < sku.markOffPrice) {
                  maxMarkOffPrice = sku.markOffPrice;
                }
                if (minCostPrice === 0 || minCostPrice > sku.sellingPrice) {
                  minCostPrice = sku.sellingPrice;
                }
                if (maxCostPrice === 0 || maxCostPrice < sku.sellingPrice) {
                  maxCostPrice = sku.sellingPrice;
                }
              });
            if (minMarkOffPrice !== maxMarkOffPrice) {
              tempData.markOffPriceStr = `${minMarkOffPrice}-${maxMarkOffPrice}`;
            } else {
              tempData.markOffPriceStr = minMarkOffPrice;
            }
            if (minCostPrice !== maxCostPrice) {
              tempData.costPriceStr = `${minCostPrice}-${maxCostPrice}`;
            } else {
              tempData.costPriceStr = minCostPrice;
            }
            tempData.availableStock = availableStock;
            tempData.proPictDir = tempData.mainImgUrl;
            Object.assign(tempData, data);
            list.push(tempData);
          });
          this.itemList = this.itemList.concat(list);
          this.empty = !this.itemList;
        } else {
          this.empty = true;
        }
      },
      // 获取门店信息
      async handleStoreNoChange() {
        const params = { queryObject: { storeNo: this.userInfo.storeNo } };
        const result = await Axios.post('/srm/sh/stores/listByPageNo', params);
        if (result.code == 200 && result.data.list.length) {
          uni.setStorageSync('storeInfo', result.data.list[0]);
        }
      },
    },
    onReachBottom() {
      this.searchData();
    },
    onPageScroll(e) {
      // this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight);
      this.$refs.toTop.show(true);
    },
    async mounted() {
      this.brandId = this.$root.$mp.query.brandId;
      this.planId = this.$root.$mp.query.planId;
      this.dispId = this.$root.$mp.query.dispId;
      this.cateId = this.$root.$mp.query.cateId;
      this.level = this.$root.$mp.query.level;
      this.key = this.$root.$mp.query.key;
      this.pageNo = 1;
      this.disabled = false;
      this.itemList = [];
      await this.handleStoreNoChange();
      await this.loadData();
    },
  };
</script>
