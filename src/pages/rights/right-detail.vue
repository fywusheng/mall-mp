//优待说明
<template>
  <view class="right-detail">
    <!-- #ifdef MP-ALIPAY -->
    <navigation-bar
      title="优待说明"
      title-color="#ffffff"
      :alpha="1"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
    />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <navigation-bar
      title="优待说明"
      title-color="#ffffff"
      background-color="linear-gradient(to right, #ff8800, #ff5000)"
      back-button-style="white"
      :alpha="1"
      :shows-back-button="true"
    />
    <!-- #endif -->
    <view class="blank" :style="{ height: navigationBarHeight + 'px' }" />
    <view class="header flex-h p-32">
      <text class="welfare fs-40 flex-1 fw-500 c-black flex-1">
        {{ cityLable }}老年人证优待说明
      </text>
      <!-- TODO 后期删除处理 -->
      <!-- <uni-data-picker class="ml-32"
                       :localdata="cities"
                       v-model="city"
                       popup-title="请选择地区"
                       @change="handleCityChange">
        <view  class="picker">
          <view class="filter flex-h flex-c-c"></view>
          <text class="fs-36 c-black">
            {{ params.text || "请选择" }}
          </text>
          <image class="triangle-icon ml-12"
                 mode="scaleToFill"
                 src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png" />
        </view>
      </uni-data-picker> -->
      <picker class="ml-32" range-key="text" :range="cities" @change="handleCityChange">
        <view class="filter flex-h flex-c-c">
          <text class="fs-36 c-black">
            {{ params.city.text || '请选择' }}
          </text>
          <image
            class="triangle-icon ml-12"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
      </picker>
      <!-- #ifdef MP-ALIPAY -->
      <!-- <uni-data-picker class="ml-32"
                       :localdata="items"
                       v-model="value"
                       popup-title="请选择地区"
                       @change="handleCityChange">
      </uni-data-picker> -->
      <!-- #endif -->
    </view>
    <scroll-view
      class="scroll-view p-0-32"
      :style="{ height: scrollViewHeight + 'rpx' }"
      :scroll-y="true"
      :scroll-into-view="'section-' + index"
    >
      <view
        class="section mb-48"
        v-for="(section, sIndex) in contents"
        :key="sIndex"
        :id="'section-' + sIndex"
      >
        <image class="banner" mode="scaleToFill" :src="getBannerImageURL(sIndex)" />
        <view v-for="(chapter, cIndex) in section" :key="cIndex">
          <view class="chapter-title fs-40 fw-500 m-36-0">
            {{ chapter.title }}
          </view>
          <view class="list flex-v">
            <text
              class="item fs-36 fw-400 c-black"
              v-for="(item, iIndex) in chapter.list"
              :key="iIndex"
            >
              ◎{{ item }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { UniDataPicker } from '@dcloudio/uni-ui'
import NavigationBar from '../../components/common/navigation-bar.vue'
import api from '@/apis/index.js'
export default {
  components: { NavigationBar, UniDataPicker },
  data() {
    return {
      // 导航栏高度
      // #ifdef MP-WEIXIN
      navigationBarHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      // #endif
      // #ifdef MP-ALIPAY
      navigationBarHeight:
          uni.getSystemInfoSync().statusBarHeight + uni.getSystemInfoSync().titleBarHeight,
      // #endif
      // 城市列表
      cities: [
        { text: '北京市', value: '110000' },
        { text: '四川省', value: '110001' }
      ],
      value: '110000',
      items: [
        {
          text: '北京市',
          value: '110000'
        },
        {
          text: '四川省',
          value: '110001'
        }
      ],
      // 选择的城市
      params: {
        city: { text: '北京市', value: '110000' },
        text: '北京市',
        cityLable: '',
        year: '2021'
      },
      city: '110000',
      cityLable: '北京市',
      // 优待内容
      contents: [],
      // 需要滚动的 id
      index: -1,
      // 暂存id
      id: -1,
      // 初始数据
      initData: {}
    }
  },
  computed: {
    // scroll view 高度
    scrollViewHeight() {
      const screenHeight = uni.getSystemInfoSync().screenHeight
      const pxHeight = screenHeight - this.navigationBarHeight
      const headerHeight = this.cityLable.length > 4 ? 176 : 120
      return this.$uni.pxToRpx(pxHeight) - headerHeight
    }
  },
  onLoad(e) {
    this.id = e.index
    this.init(this.cityLable)
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        // console.log(res)
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  methods: {
    /**
       * 获取接口数据
       */
    init(city) {
      api.getIndividualRights({
        data: {},
        showsLoading: true,
        success: (res) => {
          console.log('res:', res)
          // 全部数据
          this.inindata = res.preTreatPoliDesc[city]
          // Object.key(this.inindata).map((item,index)=>{
          //   this.inindata[item].map(()=>{

          //   })
          // })
          this.setContents(this.inindata)
        }
      })
    },
    /**
       * 城市选择器选择回调 uni-data-picker 目前不支持 所以暂时屏蔽
       */
    // handleCityChange(e) {
    //   this.city = e.detail.value[e.detail.value.length - 1]
    //   this.init(this.city.text)
    //   this.params.text = this.city.text
    //   this.cityLable = this.city.text
    // },
    handleCityChange_end(e) {
      this.params.city = this.cities[e.detail.value]
    },
    /**
       * 设置地区列表
       */
    setCities() {
      function map(list) {
        return list.map((item) => {
          const isProvince = item.code.endsWith('0000')
          const municipalities = ['北京市', '天津市', '上海市', '重庆市']
          const isMunicipality = municipalities.indexOf(item.name) !== -1
          return {
            text: item.name,
            value: item.code,
            children: isProvince && !isMunicipality ? map(item.list) : []
          }
        })
      }
      this.cities = map(cities)
    },
    /**
       * 设置优待内容
       */
    setContents(data) {
      const json = {
        pensionService: data.pensionService,
        respectPreferentialTreatment: data.respectPreferentialTreatment,
        oldAgeSecurity: data.oldAgeSecurity,
        healthCare: data.healthCare
      }
      const keys = [
        'respectPreferentialTreatment',
        'oldAgeSecurity',
        'pensionService',
        'healthCare'
      ]
      this.contents = keys
        .map((item) => {
          if (!json[item]) return false
          // 获取key，对key进行排序
          const arr = Object.keys(json[item]).sort((a, b) => {
            return a.substr(0, 2) - b.substr(0, 2)
          })
          if (arr[0].substr(0, 3) == '100') {
            arr.push(arr.shift())
          }
          return arr.map((key) => {
            return {
              title: key,
              list: json[item][key]
              // list:  this.listSort(json[item][key]),
            }
          })
        })
        .filter((item) => (!!item))
      setTimeout(() => {
        this.index = this.id
      })

      // this.listSort(json[item])
    },

    /**
       * 获取 banner 图路径
       */
    getBannerImageURL(index) {
      return `http://192.168.1.187:10088/static/rights/banner-rights-detail-${index}.png`
    }
  }
}
</script>

<style lang="scss" scoped>
  .right-detail {
    .header {
      align-items: flex-start;
      justify-content: space-between;
      .welfare {
        flex: auto;
      }
      .city-name {
        @include text-line(1);
        max-width: 180rpx;
        line-height: 56rpx;
      }
      .triangle-icon {
        @include size(18, 12);
      }
      .picker {
        flex-shrink: 0;
        width: 150rpx;
      }
    }
    .scroll-view ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
      display: none;
    }
    .scroll-view {
      width: 686rpx;
      /**去除滚动条样式 */

      .section {
        .banner {
          @include size(686, 182);
        }
        .chapter-title {
          color: #ff711a;
        }
        .item {
          line-height: 60rpx;
          text-align: justify;
        }
      }
    }
  }
</style>
