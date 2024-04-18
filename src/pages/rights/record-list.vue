<template>
  <view class="record-query">
    <view class="header bg-white">
      <!-- <image class="card-background" mode="scaleToFill"
             src="http://192.168.1.187:10088/static/rights/bg-rights-bank-card.png" /> -->
      <image
        class="card-background"
        mode="scaleToFill"
        src="http://192.168.1.187:10088/static/rights/icon-card-bg.png"
      />
      <view class="card flex-v p-32">
        <view class="bgWater">
          <text class="fs-36 fw-500 c-black">北京市人力资源和社会保障厅</text>
          <view class="flex-h mt-40">
            <image class="avatar" mode="scaleToFill" :src="basicInformation.headPortrait" />
            <view class="flex-v ml-32">
              <view class="row flex-h flex-c-s mb-24">
                <text class="row-title fs-28">姓名：</text>
                <text class="row-value fs-28 c-black">
                  {{ basicInformation.name | nameFilter }}
                </text>
              </view>
              <view class="row flex-h flex-c-s mb-24">
                <text class="row-title fs-28">社会保障号码：</text>
                <text class="row-value fs-28 c-black">
                  {{ basicInformation.socSecuNum | carteVitalFilter }}
                </text>
              </view>
              <view class="row flex-h flex-c-s mb-24">
                <text class="row-title fs-28">卡号：</text>
                <text class="row-value fs-28 c-black">{{ basicInformation.cardNum }}</text>
              </view>
              <view class="row flex-h flex-c-s mb-24">
                <text class="row-title fs-28">发卡日期：</text>
                <text class="row-value fs-28 c-black">{{ basicInformation.issuDate }}</text>
              </view>
            </view>
          </view>
          <view class="flex-h flex-c-s mt-28">
            <image
              class="bank-icon"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/rights/icon-rights-bank-boc.png"
            />
            <text class="fs-40 fw-400 c-black ml-32">
              卡号：{{ basicInformation.bottomCardNum | bankCrardFilter }}
            </text>
          </view>
        </view>
      </view>

      <view class="filters flex-h flex-c-b">
        <!-- TODO 当前版本突然不支持 uni-data-picker 组建故而替换为picker-->
        <!-- <uni-data-picker class="flex-1"
                         :localdata="cities_my"
                         v-model="params.city"
                         popup-title="请选择地区"
                         @change="handleCityChange">
          <view >
              <view class="filter flex-h flex-c-c"></view>
              <text class="fs-36 c-black">
                {{ params.text || "请选择" }}
              </text>
              <image
                class="triangle-icon ml-12" mode="scaleToFill"
                src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
              />
          </view>

        </uni-data-picker> -->

        <picker class="flex-1" range-key="text" :range="cities_my" @change="handleCityChange_end">
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

        <picker class="flex-1" :range="years" :value="yearIndex" @change="handleYearChange">
          <view class="filter flex-h flex-c-c">
            <text class="fs-36 c-black">{{ params.year }}年度</text>
            <image
              class="triangle-icon ml-12"
              mode="scaleToFill"
              src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
            />
          </view>
        </picker>
      </view>
    </view>

    <template v-if="list.length > 0">
      <view class="list" v-for="(item, index) in list" :key="index" @click="handleItemClick(item)">
        <view class="item flex-v m-32">
          <text class="fs-36 fw-500 c-black">{{ item.endAccountDate.substr(0, 6) }}</text>
          <view class="info flex-h flex-c-b mt-24 br-16 bg-white">
            <view class="date flex-v flex-c-c">
              <text class="fs-40 fw-500 c-white">{{ item.endAccountDate.substr(6, 2) }}</text>
              <text class="fs-40 fw-500 c-white">{{ item.week }}</text>
            </view>
            <view class="flex-v flex-1 ml-32">
              <text class="fs-36 c-black">{{ item.abstractA }}</text>
              <view class="blank" style="height: 24rpx" />
              <text class="fs-36 c-lightgrey">余额 {{ item.balance }}</text>
            </view>
            <view class="flex-v mr-24">
              <text class="currency fs-40 fw-500 c-black">人民币</text>
              <text class="amount fs-40 fw-500">{{ item.grantAmount }}</text>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="no-data flex-v flex-c-c">
        <image
          class="no-data__image"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/common/status-none2x.png"
        />
        <text class="fs-36 c-grey mt-24">本年度暂无数据</text>
      </view>
    </template>
    <modal-know ref="noticeModal"></modal-know>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { UniDataPicker } from '@dcloudio/uni-ui'
import { desensitizeName, desensitizeInfo, hideRule } from '@/utils/desensitization.js'
import api from '@/apis/index.js'
import ModalKnow from '@/pages/rights/components/modal-know.vue'
export default {
  components: { UniDataPicker, ModalKnow },
  data() {
    return {
      citysArray: [],
      citySelectDataY: {},

      cityGL: [],
      citySelectDataGL: {},
      type: 'annuity', // annuity 养老金查询      allowance 高龄津贴
      // 城市列表
      cities_my: [
        { value: '0', text: '北京市' },
        { value: '1', text: '成都市' }
      ],
      // 年份列表
      years: [2021],
      // 选择年份索引
      yearIndex: 0,
      // 接口入参
      params: {
        city: { value: '0', text: '北京市' },
        text: '北京',
        cityLable: '',
        year: '2021'
      },

      // 请求的数据
      info: {},
      // 总数据
      inindata: {},
      // 卡数据
      basicInformation: {},
      // 养老金列表
      list: [],
      items: [
        {
          value: '110000',
          text: '北京市',
          children: [
            {
              value: '110105',
              text: '朝阳区'
            },
            {
              value: '110108',
              text: '海淀区'
            }
          ]
        }
      ]
    }
  },
  computed: {
    // 当前选择的年份下标, 用于初始化年份选择器默认值
    // yearIndex() {
    //   return this.years.indexOf(this.params.year)
    // },
  },
  onLoad(e) {
    // this.$refs.noticeModal.open();
    // annuity 养老金查询      allowance 高龄津贴
    this.type = e.type
    console.log('====雷雨---', e.type)
    // 请求json数据
    this.init()
    // 设置标题
    this.setTitle(e)

    // this.setCities()
    // this.setYears()
  },
  onShareAppMessage() {
    return {
      title: '',
      path: '/pages/index/index?index=0'
    }
  },
  mounted() {
    this.$refs.noticeModal.open()
  },
  methods: {
    /**
       * 获取接口数据
       */
    init() {
      console.log('init---')
      api.getIndividualRights({
        data: {},
        showsLoading: true,
        success: (res) => {
          console.log('res:', res)
          // 数据处理
          // 养老金
          const yanglao = res.pension
          // 固定2021
          const cityTypeY = yanglao['2021']
          const citysY = []
          // Object.keys(cityTypeY)
          for (var city in cityTypeY) {
            console.log('===item---', city)
            citysY.push(city)
          }
          this.citysArray = citysY
          this.citySelectDataY = cityTypeY
          // 高龄津贴
          const gaoling = res.ageAllowance
          const cityeGL = gaoling['2021']
          const cityGL = []
          for (var city in cityeGL) {
            console.log('===item---', city)
            cityGL.push(city)
          }
          this.cityGL = cityGL
          this.citySelectDataGL = cityeGL

          // 养老金

          if (this.type == 'allowance') {
            // 高龄津贴
            this.inindata = res.ageAllowance
          } else {
            this.inindata = res.pension // 养老金
          }
          this.basicInformation = this.inindata['2021']['北京']['basicInformation']

          this.list = this.inindata['2021']['北京']['detail'].map((item, index) => {
            return {
              ...item,
              week: this.getWeek(item.endAccountDate)
            }
          })
          console.log('list:', this.list)
          // this.years = Object.keys(res.pension)
          // //高龄津贴
          // this.ageAllowance = res.ageAllowance   //高龄津贴
        }
      })
    },
    /**
       * 城市选择器选择回调  现在不用
       */
    // handleCityChange(e) {
    //   console.log("1111111111111111111e:",e)
    //   let index = e.detail.value.length - 1
    //   this.params.city = e.detail.value[index].value
    //   this.params.text = e.detail.value[index].text
    //   this.basicInformation = this.inindata['2021'][this.params.text]["basicInformation"]
    //   this.list=[]
    //   console.log("xixi:",this.inindata['2021'][this.params.text])
    //   this.list = this.inindata['2021'][this.params.text]["detail"].map((item,index)=>{
    //     return {
    //       ...item,
    //       week:this.getWeek(item.endAccountDate)
    //     }
    //   })
    // },
    handleCityChange_end(e) {
      this.params.city = this.cities_my[e.detail.value]
    },
    /**
       * 年份选择器选择回调
       */
    handleYearChange(e) {
      this.params.year = this.years[e.detail.value]
    },
    /**
       * 列表项点击事件
       */
    handleItemClick(item) {
      uni.navigateTo({
        url: `/pages/rights/record-detail?item=` + JSON.stringify(item)
      })
    },
    /**
       * 设置导航栏标题
       */
    setTitle(e) {
      this.type = e.type
      const titles = { annuity: '养老金查询', allowance: '高龄津贴查询' }
      this.$uni.setTitle(titles[this.type])
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
       * 设置年份列表
       */
    setYears() {
      this.years = Array.from({ length: 2100 })
        .map((item, index) => index + 1)
        .filter((item) => item > 1900)
        .filter((item) => item <= Number(dayjs().format('YYYY')))
      console.log('this.years:', this.years)
    },
    /**
       * 根据日期字符串获取星期几
       *
       * @param dateString 日期字符串（如：20161229），为空时为用户电脑当前日期
       * @returns {String}
       */
    getWeek(dateString) {
      var date
      if (!dateString) {
        date = new Date()
      } else {
        const changeStr =
            dateString.substr(0, 4) + '-' + dateString.substr(4, 2) + '-' + dateString.substr(6, 2)
        var dateArray = changeStr.split('-')
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
      }
      // var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
      // return "星期" + weeks[date.getDay()];
      return '周' + '日一二三四五六'.charAt(date.getDay())
    }
  },
  filters: {
    // 姓名过滤器, 用于姓名脱敏
    nameFilter(value) {
      return desensitizeName(value)
    },
    // 身份证号过滤器, 用于身份证号脱敏
    idCardNumberFilter(value) {
      return desensitizeInfo(value)
    },
    // 医保卡脱敏
    /**
       * 自定义脱敏规则
       * @param {string} val 脱敏目标值
       * @param {number} front 截取前几字符位个数
       * @param {number} back 截取后几位字符个数
       * @param {number} placeholder 中间占位个数
       * hideRule(val, front, back, placeholder)
       */
    carteVitalFilter(value) {
      if (value) {
        return hideRule(value, 6, 4, 8)
      }
    },
    // 银行卡脱敏
    /**
       * 自定义脱敏规则
       * @param {string} val 脱敏目标值
       * @param {number} front 截取前几字符位个数
       * @param {number} back 截取后几位字符个数
       * @param {number} placeholder 中间占位个数
       * hideRule(val, front, back, placeholder)
       */
    bankCrardFilter(value) {
      if (value) {
        return hideRule(value, 4, 4, 6)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .record-query {
    min-height: 100vh;
    background: #fbf9f7;
    .header {
      position: relative;
      padding: 30rpx 28rpx 0;
      .card-background {
        @include size(694, 442);
        position: absolute;
      }
      .card {
        @include size(630, 378);
        position: relative;
        .bgWater {
          // background-image: url('http://192.168.1.187:10088/static/rights/bgWater.png');
          background-size: cover;
        }
        .avatar {
          @include size(144, 184);
        }
        .row {
          &-title {
            color: #459bf4;
            line-height: 28rpx;
            letter-spacing: -2rpx;
          }
          &-value {
            line-height: 28rpx;
            letter-spacing: -2rpx;
          }
        }
        .bank-icon {
          @include size(138, 40);
        }
      }
      .filters {
        height: 100rpx;
        .triangle-icon {
          @include size(18, 12);
        }
      }
    }
    .list {
      .item {
        .info {
          height: 194rpx;
          overflow: hidden;
          .date {
            width: 130rpx;
            height: 100%;
            background: #459bf4;
          }
          .currency {
            text-align: right;
          }
          .amount {
            color: #da021b;
            text-align: right;
          }
        }
      }
    }
    .no-data {
      margin-top: 154rpx;
      &__image {
        @include size(440, 234);
      }
    }
  }
</style>
