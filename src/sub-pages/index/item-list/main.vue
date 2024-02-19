<style lang="scss" scoped>
  @import '~@/styles/base';

  .search-header {
    // @include middle-center-x(fixed);
    // top: 0;
    width: 686rpx;
    height: rpx(88);
    padding-left: rpx(32);
    padding-right: rpx(32);
    display: flex;
    align-items: center;
    z-index: 100;
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
      padding-left: rpx(70);
      padding-right: rpx(63);
      height: rpx(88);
      // background-color: $extra-gray;
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
      right: rpx(52);
      width: rpx(36);
      height: rpx(36);
      z-index: 100;
    }
  }

  .sort-list {
    // @include middle-center-x(fixed);
    // top: rpx(88);
    position: relative;
    width: rpx(750);
    padding: 0 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
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

  // .item-list-wrap {
  //   padding-top: rpx(200);
  //   box-sizing: border-box;
  //   height: 100vh;
  // }

  // .item-list {
  //   display: flex;
  //   align-items: center;
  //   flex-wrap: wrap;

  //   .item {
  //     position: relative;
  //     padding-left: rpx(30);
  //     padding-right: rpx(30);
  //     padding-bottom: rpx(30);
  //     margin-bottom: rpx(30);
  //     border-radius: rpx(8);
  //     background-color: #fff;
  //     width: rpx(375);
  //     box-sizing: border-box;

  //     .item-logo {
  //       position: relative;
  //       width: rpx(315);
  //       height: rpx(315);
  //       margin-bottom: rpx(30);
  //       background: center no-repeat;
  //       background-size: contain;

  //       .sale-out-wrap {
  //         position: absolute;
  //         left: 0;
  //         right: 0;
  //         top: 0;
  //         bottom: 0;
  //         background-color: rgba(0, 0, 0, 0.3);

  //         .sale-out {
  //           @include middle-center();
  //           width: rpx(151);
  //           height: rpx(151);
  //         }
  //       }
  //     }

  //     .brand-name {
  //       font-size: rpx(36);
  //       color: $black;
  //       @include ellipsis();
  //       line-height: rpx(42);
  //     }

  //     .item-name {
  //       padding-top: rpx(10);
  //       font-size: rpx(36);
  //       line-height: rpx(42);
  //       color: $light-black;
  //       @include ellipsis();
  //     }

  //     .item-price {
  //       padding-top: rpx(10);
  //       line-height: rpx(42);
  //       font-size: rpx(36);
  //       color: $black;
  //     }
  //   }
  // }

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
    // position: fixed;
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
            height: 228rpx;
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

        .item-name {
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          padding-top: rpx(10);
          font-size: rpx(36);
          line-height: rpx(42);
          color: $color-grey;
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
  <div id="app">
    <div class="search-header">
      <img
        class="icon"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-search.png"
      />
      <input
        confirm-type="search"
        @confirm="search"
        :placeholder="key || '输入关键字搜索商品...'"
        v-model="key"
      />
      <img
        class="btn-clear"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/clear.png"
        @click="clear"
      />
    </div>
    <ul class="sort-list">
      <li class="sort" :class="{ active: !sortType }" @click="changeSortType('')">综合</li>
      <li
        class="sort"
        :class="{ active: [11, 12].includes(sortType) }"
        @click="changeSortType(sortType === 11 ? 12 : 11)"
      >
        时间
        <div class="img-wrap" v-if="sortType !== 11 && sortType !== 12">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </div>
        <div class="img-wrap" v-if="sortType === 11">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </div>
        <div class="img-wrap" v-if="sortType === 12">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png"
          />
        </div>
      </li>
      <li
        class="sort"
        :class="{ active: [21, 22].includes(sortType) }"
        @click="changeSortType(sortType === 21 ? 22 : 21)"
      >
        价格
        <div class="img-wrap" v-if="sortType !== 21 && sortType !== 22">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </div>
        <div class="img-wrap" v-if="sortType === 21">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_h@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_n@2x.png"
          />
        </div>
        <div class="img-wrap" v-if="sortType === 22">
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/up_n@2x.png"
          />
          <img
            class="image"
            src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/down_h@2x.png"
          />
        </div>
      </li>
      <li class="sort" @click="showFilter">
        筛选
        <img
          class="filter"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/filter.png"
        />
      </li>
      <li class="sort" @click="changeListType">
        <img
          class="filter"
          v-if="listType === 0"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/card-type.png"
        />
        <img
          class="filter"
          v-if="listType === 1"
          src="https://ggllstatic.hpgjzlinfo.com/static/images/common/list-type.png"
        />
      </li>
    </ul>

    <view class="shop_list">
      <scroll-view
        v-if="itemList.length || loading"
        scroll-y
        class="item-list-wrap"
        @scrolltolower="loadData"
        :lower-threshold="400"
      >
        <ul class="item-list">
          <template v-if="listType === 0">
            <li
              class="item"
              @click="goItem(item)"
              v-for="(item, subIndex) in itemList"
              :key="subIndex"
            >
              <div class="item-logo" :style="{ backgroundImage: 'url(' + item.proPictDir + ')' }">
                <div class="sale-out-wrap" v-if="item.soldOut === 0">
                  <img
                    class="sale-out"
                    src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png"
                  />
                </div>
              </div>
              <div class="brand-name" v-if="item.brandName">
                {{ item.brandName }}
              </div>
              <div class="item-name">{{ item.name }}||{{ item.soldOut }}</div>
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
            </li>
          </template>
          <template v-if="listType === 1">
            <li
              class="item list"
              @click="goItem(item)"
              v-for="(item, subIndex) in itemList"
              :key="subIndex"
            >
              <div class="item-logo" :style="{ backgroundImage: 'url(' + item.proPictDir + ')' }">
                <div class="sale-out-wrap" v-if="item.soldOut === 0">
                  <img
                    class="sale-out"
                    src="https://ggllstatic.hpgjzlinfo.com/static/home/empt.png"
                  />
                </div>
              </div>
              <view class="right">
                <div class="brand-name" v-if="item.brandName">
                  {{ item.brandName }}
                </div>
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
              </view>
            </li>
          </template>
        </ul>
      </scroll-view>
    </view>
    <div v-if="empty" class="empty">
      <img src="https://ggllstatic.hpgjzlinfo.com/static/images/item-list/empty.png" />
      没有搜到您想要的商品
      <div class="btn-home" @click="toHome">再去逛逛</div>
    </div>
    <top ref="toTop" :bottom="80" :showContact="false"></top>
    <search-filter
      ref="filter"
      @reset="reset"
      @changePrice="changePrice"
      @search="search"
      @changeBrand="changeBrand"
      @changeCate="changeCate"
      :priceList="priceList"
      :attrList="attrList"
      :brandList="brandList"
      :categoryList="categoryList"
    ></search-filter>
  </div>
</template>

<script>
  import Top from '@/sub-pages/index/components/top.vue';
  import SearchFilter from './components/filter';
  import wx from 'utils/wx';
  export default {
    name: 'SEARCH',
    data() {
      return {
        sceneType: '适老用品',
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
        sortType: '',
        key: '',
        name: '',
        attrList: [],
        categoryList: [],
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
        // XIU.bridge.goItem(item.id)
        uni.navigateTo({
          url: `/sub-pages/index/item/main?id=${item.id}&sceneType=${this.sceneType}`,
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
        this.loadData();
      },
      changePrice(priceRange) {
        priceRange.check = !priceRange.check;
        this.$set(this.priceList, priceRange.id, priceRange);
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
        this.$refs.filter.show(true);
      },
      async loadData() {
        if (this.disabled) {
          return false;
        }
        const params = {
          pageSize: this.pageSize,
          pageNum: this.pageNo++,
          isCreditPoints: 0,
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
        this.disabled = true;
        wx.showLoading();
        // console.log("params: " + JSON.stringify(params))
        let searchResult = await Axios.post('/product/getProductSearchList', {
          ...Object.assign(params, this.searchParams),
        });
        // console.log("result: " + JSON.stringify(searchResult))
        searchResult = {
          status: true,
          code: '200',
          msg: '获取商品列表成功',
          data: {
            pageNum: 1,
            totalCount: 8,
            totalPage: 1,
            categorys: [],
            attrs: {},
            esProducts: [
              {
                code: 'PRD1363804130820747405',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 3980.0,
                    presentPrice: 3600.0,
                    stockBalance: 9999,
                    markOffPrice: 4980.0,
                    stockPreCost: 5,
                  },
                ],
                creditPoints: 380.0,
                salePrice: 3980.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 3600.0,
                subName: '睡眠检测仪',
                saleState: 5,
                name: '睡眠检测仪SC500睡眠检测仪13+健康数据检测守护夜晚健康',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4C/FF/wKhLJ2L4jEaAKUgiAAEUn-8zyBo912.jpg',
                isCreditPoints: 1,
                id: '1363804130820747405',
              },
              {
                code: 'PRD1363804130820747395',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 120.0,
                    presentPrice: 0.0,
                    stockBalance: 1,
                    markOffPrice: 120.0,
                    stockPreCost: 1,
                  },
                ],
                creditPoints: 120.0,
                salePrice: 120.0,
                soldOutState: 0,
                soldOut: 0,
                presentPrice: 0.0,
                subName: '意外险',
                saleState: 5,
                name: '全民疫保通意外险（已抢光，正在积极备货中）',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4C/FD/wKhLJ2L2GbGAan7CAAmyadZ9Lys646.jpg',
                isCreditPoints: 1,
                id: '1363804130820747395',
              },
              {
                code: 'PRD1363804130820747406',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 100.0,
                    presentPrice: 0.0,
                    stockBalance: 1000,
                    markOffPrice: 100.0,
                    stockPreCost: 0,
                  },
                  {
                    sellingPrice: 100.0,
                    presentPrice: 0.0,
                    stockBalance: 1000,
                    markOffPrice: 100.0,
                    stockPreCost: 33,
                  },
                ],
                creditPoints: 100.0,
                salePrice: 100.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 0.0,
                subName: '权益包',
                saleState: 5,
                name: '华住酒店权益礼包新用户8.5折老用户免费早餐',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/07/wKhLJ2MWrWmAK2fTAAMqR6J703w35.jpeg',
                isCreditPoints: 1,
                id: '1363804130820747406',
              },
              {
                code: 'PRD1363804130820747409',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 298.0,
                    presentPrice: 0.0,
                    stockBalance: 1000000,
                    markOffPrice: 298.0,
                    stockPreCost: 6,
                  },
                ],
                creditPoints: 298.0,
                salePrice: 298.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 0.0,
                subName: '中医健康状态评估',
                saleState: 5,
                name: '国家卫健委科研所“5G+中老年健康促进方案”中医健康状态评估',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/30/wKhLJ2O3mhqAUpYRAACe3Psdi4078.jpeg',
                isCreditPoints: 1,
                id: '1363804130820747409',
              },
              {
                code: 'PRD1363804130820747408',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 299.0,
                    presentPrice: 99.0,
                    stockBalance: 200,
                    markOffPrice: 399.0,
                    stockPreCost: 1,
                  },
                ],
                creditPoints: 200.0,
                salePrice: 299.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 99.0,
                subName: 'softank多功能鞋垫',
                saleState: 5,
                name: 'softank多功能鞋垫',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/09/wKhLJ2Mqr4iADn_2AAFFC9iOV4Q230.jpg',
                isCreditPoints: 1,
                id: '1363804130820747410',
              },
              {
                code: 'PRD1363804130820747410',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 300.0,
                    presentPrice: 0.0,
                    stockBalance: 10000,
                    markOffPrice: 1000.0,
                    stockPreCost: 4,
                  },
                ],
                creditPoints: 300.0,
                salePrice: 300.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 0.0,
                subName: '养老私人顾问',
                saleState: 5,
                name: '家庭养老私人顾问服务',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/35/wKhLJ2PI9NiAdG_0AAUyS3SbdKg310.jpg',
                isCreditPoints: 1,
                id: '1363804130820747408',
              },
              {
                code: 'PRD1363804130820747386',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 15.0,
                    presentPrice: 0.0,
                    stockBalance: 999,
                    markOffPrice: 15.0,
                    stockPreCost: 74,
                  },
                ],
                creditPoints: 15.0,
                salePrice: 15.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 0.0,
                subName: '云听',
                saleState: 5,
                name: '云听15天VIP海量有声内容免费畅听',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/0B/wKhLJ2NBDtiAT1V2AADRYtud1Pg334.jpg',
                isCreditPoints: 1,
                id: '1363804130820747386',
              },
              {
                code: 'PRD1363804130820747407',
                supplierId: 272,
                skuList: [
                  {
                    sellingPrice: 1099.0,
                    presentPrice: 999.0,
                    stockBalance: 200,
                    markOffPrice: 1899.0,
                    stockPreCost: 0,
                  },
                  {
                    sellingPrice: 1099.0,
                    presentPrice: 999.0,
                    stockBalance: 200,
                    markOffPrice: 1699.0,
                    stockPreCost: 4,
                  },
                ],
                creditPoints: 100.0,
                salePrice: 1099.0,
                soldOutState: 1,
                soldOut: 1,
                presentPrice: 999.0,
                subName: '如意陪伴智慧健康终端',
                saleState: 5,
                name: '如意陪伴智慧健康终端',
                mainImgUrl:
                  'https://api.hpgjzlinfo.com/nepsp-file/group1/M00/4D/08/wKhLJ2MZhTiAENmUAAZH7wylysY236.jpg',
                isCreditPoints: 1,
                id: '1363804130820747407',
              },
            ],
            prices: ['0-200', '200-400', '400-800', '800-1500', '1500-5000'],
            brands: {
              ZL: [{ brandNameSpell: 'ZL', brandName: '中粮', brandId: 1461, brandNameEn: '中粮' }],
              ZSDS: [
                {
                  brandNameSpell: 'ZSDS',
                  brandName: '中商鼎盛',
                  brandId: 1469,
                  brandNameEn: 'zhongshangdingsheng',
                },
              ],
              怡SYL: [{ brandNameSpell: '怡SYL', brandName: '怡生养老', brandId: 1474 }],
              HZH: [
                {
                  brandNameSpell: 'HZH',
                  brandName: '华住会',
                  brandId: 1470,
                  brandNameEn: 'huazhu',
                },
              ],
              YST: [
                {
                  brandNameSpell: 'YST',
                  brandName: '玉生堂',
                  brandId: 1473,
                  brandNameEn: '玉生堂',
                },
              ],
              softank: [
                {
                  brandNameSpell: 'softank',
                  brandName: 'softank',
                  brandId: 1472,
                  brandNameEn: 'softank',
                },
              ],
              RYPB: [
                {
                  brandNameSpell: 'RYPB',
                  brandName: '如意陪伴',
                  brandId: 1471,
                  brandNameEn: '如意陪伴',
                },
              ],
            },
            deliveryRegions: [],
            supplierId: '',
            pointDedurt: '',
          },
        };
        searchResult = searchResult.data;
        wx.hideLoading();
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
            tempData.proPictDir = XIU.getImgFormat(tempData.mainImgUrl, '/resize,w_750');
            Object.assign(tempData, data);
            list.push(tempData);
          });
          this.itemList = this.itemList.concat(list);
          this.brandList = [];
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
    },
    onPageScroll(e) {
      // this.$refs.toTop.show(e.scrollTop > App.systemInfo.screenHeight);
      this.$refs.toTop.show(true);
    },
    async mounted() {
      this.brandId = this.$root.$mp.query.brandId;
      this.planId = this.$root.$mp.query.planId;
      this.dispId = this.$root.$mp.query.dispId;
      this.key = this.$root.$mp.query.key;
      this.$refs.filter.show(false);
      this.pageNo = 1;
      this.disabled = false;
      this.itemList = [];
      await this.loadData();
    },
  };
</script>
