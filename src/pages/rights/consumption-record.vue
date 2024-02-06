<template>
  <view class="consumption-record">
    <view class="filters flex-h flex-c-b bg-white">
      <!-- <uni-data-picker
        v-model="params.city"
        :localdata="cities"
        v-slot:default="{data, error, options}"
        popup-title="请选择地区"
        @change="handleCityChange"
      >
        <view>
           <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">
            {{ params.text || "请选择" }}
          </text>
          <image
            class="triangle-icon ml-12" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
        </view>
      </uni-data-picker> -->

      <!-- <picker
        range-key="text"
        :range="cities"
        @change="handleCityChange"
      >
        <view>
           <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">
            {{ params.city || "请选择" }}
          </text>
          <image
            class="triangle-icon ml-12" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
        </view>
      </picker> -->

      <picker
        range-key="text"
        :range="cities"
        @change="handleTypeChange2"
      >
        <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">
            {{ params.city.text || "请选择" }}
          </text>
          <image
            class="triangle-icon ml-12" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
      </picker>

      <picker
        range-key="text"
        :range="types"
        @change="handleTypeChange"
      >
        <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">
            {{ params.type.text || "就诊类型" }}
          </text>
          <image
            class="triangle-icon ml-12" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
      </picker>
      <picker
        :range="years"
        :value="yearIndex"
        @change="handleYearChange"
      >
        <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">{{ params.year }}年度</text>
          <image
            class="triangle-icon ml-12" mode="scaleToFill"
            src="https://ggllstatic.hpgjzlinfo.com/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
      </picker>
    </view>
    <view class="blank" style="height: 92rpx" />
    <template v-if="list.length > 0">
      <view class="water_img">
         <view class="card m-32 br-16 bg-white">
        <view class="header flex-h flex-c-b">
          <text class="fs-40 fw-500 c-black">年度汇总</text>
          <text class="fs-36 fw-400 c-grey">共计消费{{times}}笔</text>
        </view>
        <view class="line" />
        <view class="p-32">
          <view class="row flex-h flex-c-b">
            <text class="fs-36 c-black">年度消费总额</text>
            <text class="fs-36 c-primary">{{totalAnnualExpenses}} 元</text>
          </view>
          <view class="row flex-h flex-c-b mt-24">
            <text class="fs-36 c-black">医保支付总额</text>
            <text class="fs-36 c-primary">{{totalPayment}} 元</text>
          </view>
          <view class="row flex-h flex-c-b mt-24">
            <text class="fs-36 c-black">自付金额</text>
            <text class="fs-36 c-primary">{{selfPayAmount}} 元</text>
          </view>
        </view>
        <view class="line" />
        <!-- #ifdef MP-ALIPAY -->
        <view class="illustration p-32 flex-h">
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '1' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{outpatient}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">门诊</view>
            <canvas canvas-id="canvas-1" class="canvas" id="canvas-1"/>
          </view>
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '2' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{pharmacy}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">药店</view>
            <canvas canvas-id="canvas-2" class="canvas" id="canvas-2"/>
          </view>
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '3' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{hospitalization}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">住院</view>
            <canvas canvas-id="canvas-3" class="canvas" id="canvas-3"/>
          </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->   
        <view class="illustration p-32 flex-h" v-if="isShow">
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '1' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{outpatient}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">门诊</view>
            <canvas canvas-id="canvas-1" class="canvas" id="canvas-1"/>
          </view>
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '2' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{pharmacy}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">药店</view>
            <canvas canvas-id="canvas-2" class="canvas" id="canvas-2"/>
          </view>
          <view class="item flex-1 flex-v flex-c-b" v-if="params.type.value === '0' || params.type.value === '3' ">
            <view class="percent flex-h flex-c-c" >
              <text class="fs-44 fw-500 c-black">{{hospitalization}}</text>
              <text class="fs-32 fw-400 c-black">%</text>
            </view>
            <view class="fs-36 c-black mt-24">住院</view>
            <canvas canvas-id="canvas-3" class="canvas" id="canvas-3"/>
          </view>
        </view>
        <!-- #endif -->
      
      </view>
      <view
        class="card m-32 br-16 bg-white"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="header">
          <view class="flex-h flex-c-b">
            <text class="title fs-40 fw-500 c-black">
              {{item.name}}
            </text>
            <text class="tag fs-28 c-white bg-primary br-8 ml-12">
              {{item.type}}
            </text>
          </view>
          <text class="fs-36 c-grey mt-8">{{item.date}}</text>
        </view>
        <view class="line" />
        <view class="p-32">
          <view class="row flex-h flex-c-b">
            <text class="fs-40 c-black">总费用</text>
            <text class="fs-36 c-primary">{{item.totalFee}} 元</text>
          </view>
        </view>
        <view class="line" />
        <view class="p-32">
          <view class="row flex-h flex-c-b">
            <text class="fs-36 c-black">现金支付</text>
            <text class="fs-36 c-primary">{{item.cashPayment}} 元</text>
          </view>
          <view class="row flex-h flex-c-b mt-24">
            <text class="fs-36 c-black">基金支付</text>
            <text class="fs-36 c-primary">{{item.fundPay}} 元</text>
          </view>
          <view class="row flex-h flex-c-b mt-24">
            <text class="fs-36 c-black">个账支付</text>
            <text class="fs-36 c-primary">{{item.billPayment}} 元</text>
          </view>
        </view>
      </view>
      </view>
    </template>
    <template v-else>
      <view class="no-data flex-v flex-c-c">
        <image class="no-data__image" src="https://ggllstatic.hpgjzlinfo.com/static/common/status-none2x.png"  mode="scaleToFill"/>
        <text class="fs-36 c-grey mt-24">本年度暂无数据</text>
      </view>
    </template>
    <modal-know ref="noticeModal" @close="closeHander"></modal-know>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { UniDataPicker } from "@dcloudio/uni-ui";
import api from '@/apis/index.js'
import ModalKnow from '@/pages/rights/components/modal-know.vue'
export default {
  components: { UniDataPicker,ModalKnow },
  data() {
    return {
      isShow:false,
      // 城市列表
      cities: [
          { value: '0', text: '北京' },
          { value: '1', text: '成都' }
      ],
      // 就诊类型
      types: [
         { value: '0', text: '就诊类型' },
         { value: '1', text: '门诊' },
         { value: '2', text: '药店' },
         { value: '3', text: '住院' }
      ],
      // 年份列表
      years: [2021],
      // 接口入参
      params: {
        city: { value: '0', text: '北京' },
        text:'北京',
        type:  { value: '0', text: '就诊类型' },
        year: 2021,
      },
      // 数据列表
      list: [{}],
      //消费笔数
      times:0,
      // 年度消费总额
      totalAnnualExpenses:0,
      // 医保支付总额
       totalPayment:0,
      // 自付金额
      selfPayAmount:0,
      // 门诊比例
      outpatient:0,
      // 药店比例
      pharmacy:0,
      // 住院比例
      hospitalization:0,
      //总数据
      initData:{}


    };
  },
  computed: {
    // 当前选择的年份下标, 用于初始化年份选择器默认值
    yearIndex() {
      return this.years.indexOf(this.params.year);
    },
  },
  onLoad() {
    // this.$refs.noticeModal.open();
    // this.setCities();
    // this.setTypes();
    // this.setYears();
    this.init();
  },
  mounted() {
     this.$refs.noticeModal.open();
    // this.isShow=  false;
    uni.createSelectorQuery().select(".card").boundingClientRect((res)=>{ uni.pageScrollTo({ duration:0, scrollTop:1000}) }).exec();
  },
   onShareAppMessage() {
     return {
      title:'',
      path:
        "/pages/index/index?index=0",
    };
  },
  methods: {
    closeHander(flag){
      console.log("====首页--",flag)
      if(flag == 1){
        //#ifdef MP-WEIXIN
        this.isShow=  true;
        //#endif
      }
    },
    /**
     * 城市选择器选择回调
     */
    handleCityChange(e) {
     // console.log("城市选择：",e.detail.value[e.detail.value.length - 1].value)
       this.params.city = e.detail.value[e.detail.value.length - 1].value;
       console.log("===hahah---",this.params.city)
      // const city = {0:'北京',1:'成都'}   
      // this.params.city =  city[e.detail.value]
      // this.params.city = this.cities[e.detail.value]; 
       
    },
      handleTypeChange2(e) {
      this.params.city = this.cities[e.detail.value]; 
      console.log("this.params.type:",this.params.type.value)
    },
    /**
     * 就诊类型选择器选择回调
     */
    handleTypeChange(e) {
      this.params.type = this.types[e.detail.value]; 
      console.log("this.params.type:",this.params.type.value)
      setTimeout(()=>{
        this.screenFun(this.params.type.value)
      },100)
      

    },
    /**
     * 年份选择器选择回调
     */
    handleYearChange(e) {
      this.params.year = this.years[e.detail.value];
    },
    /**
     * 设置地区列表
     */
    setCities() {
      function map(list) {
        return list.map((item) => {
          const isProvince = item.code.endsWith("0000");
          const municipalities = ["北京市", "天津市", "上海市", "重庆市"];
          const isMunicipality = municipalities.indexOf(item.name) !== -1;
          return {
            text: item.name,
            value: item.code,
            children: isProvince && !isMunicipality ? map(item.list) : [],
          };
        });
      }
      this.cities = map(cities);
    },
    /**
     * 设置就诊类型列表
     */
    setTypes() {
      this.types = [
        { text: "类型 1", value: "value1" },
        { text: "类型 2", value: "value2" },
        { text: "类型 3", value: "value3" },
      ];
    },
    /**
     * 设置年份列表
     */
    setYears() {
      this.years = Array.from({ length: 2100 })
        .map((item, index) => index + 1)
        .filter((item) => item > 1900)
        .filter((item) => item <= Number(dayjs().format("YYYY")));
    },
      /**
     * 获取接口数据
     */
    init() {
      api.getIndividualRights({
        data: {},
        showsLoading: true,
        success: (res) => {
          console.log('res:', res)
          //全部数据
          this.inindata = res.healInsuConsRecord['2021']['北京市']
          this.screenFun('0')
        },
      })
    },
    // 数据处理函数
    screenFun(key){
      //  年度消费总额
      let total = this.inindata['住院']['annualSummary']['totalAnnualExpenses'] +this.inindata['药店']['annualSummary']['totalAnnualExpenses']  +this.inindata['门诊']['annualSummary']['totalAnnualExpenses']
      switch (key) {
        case '0':
          // 选择全部
          // 消费笔数
          this.times  = this.inindata['住院']['detail'].length +this.inindata['药店']['detail'].length+this.inindata['门诊']['detail'].length
          //  年度消费总额
          this.totalAnnualExpenses = total
          // 医保支付总额
          this.totalPayment = this.inindata['住院']['annualSummary']['totalPayment'] +this.inindata['药店']['annualSummary']['totalPayment']  +this.inindata['门诊']['annualSummary']['totalPayment']
          // 自付金额
          this.selfPayAmount = this.inindata['住院']['annualSummary']['selfPayAmount'] +this.inindata['药店']['annualSummary']['selfPayAmount']  +this.inindata['门诊']['annualSummary']['selfPayAmount']
          // 门诊比例
          this.outpatient = ((this.inindata['门诊']['annualSummary']['totalAnnualExpenses']/this.totalAnnualExpenses)*100).toFixed(1)
          // 药店比例
          this.pharmacy = ((this.inindata['药店']['annualSummary']['totalAnnualExpenses']/this.totalAnnualExpenses)*100).toFixed(1)
          // 住院比例
          this.hospitalization = ((this.inindata['住院']['annualSummary']['totalAnnualExpenses']/this.totalAnnualExpenses)*100).toFixed(1)
          // 列表
          this.list = this.inindata['门诊']['detail'].concat(this.inindata['药店']['detail']).concat(this.inindata['住院']['detail'])
          console.log("门诊比例:",this.outpatient)
          console.log("药店比例:",this.pharmacy)
          console.log("住院比例:",this.hospitalization)
          this.draw("canvas-1", { color: "#17E58F", percent: this.outpatient });
          this.draw("canvas-2", { color: "#17D4E5", percent: this.pharmacy });
          this.draw("canvas-3", { color: "#176DE5", percent: this.hospitalization });
        break;
        case '1':
          // 消费笔数
          this.times  = this.inindata['门诊']['detail'].length 
          //  年度消费总额
          this.totalAnnualExpenses = this.inindata['门诊']['annualSummary']['totalAnnualExpenses'] 
          
          // 医保支付总额
          this.totalPayment = this.inindata['门诊']['annualSummary']['totalPayment'] 
          // 自付金额
          this.selfPayAmount = this.inindata['门诊']['annualSummary']['selfPayAmount'] 
           // 门诊比例
          this.outpatient = ((this.inindata['门诊']['annualSummary']['totalAnnualExpenses']/total)*100).toFixed(1)
          // 列表
          this.list = this.inindata['门诊']['detail']
          this.draw("canvas-1", { color: "#176DE5", percent: this.outpatient });
         break;
        case '2':
          // 消费笔数
          this.times  = this.inindata['药店']['detail'].length 
          //  年度消费总额
          this.totalAnnualExpenses = this.inindata['药店']['annualSummary']['totalAnnualExpenses'] 
          // 医保支付总额
          this.totalPayment = this.inindata['药店']['annualSummary']['totalPayment'] 
          // 自付金额
          this.selfPayAmount = this.inindata['药店']['annualSummary']['selfPayAmount'] 
          // 药店比例
          this.pharmacy = ((this.inindata['药店']['annualSummary']['totalAnnualExpenses']/total)*100).toFixed(1)
          // 列表
          this.list = this.inindata['药店']['detail']
           this.draw("canvas-2", { color: "#17E58F", percent: this.pharmacy });
         break;
        case '3':
          // 消费笔数
          this.times  = this.inindata['住院']['detail'].length 
          //  年度消费总额
          this.totalAnnualExpenses = this.inindata['住院']['annualSummary']['totalAnnualExpenses'] 
          // 医保支付总额
          this.totalPayment = this.inindata['住院']['annualSummary']['totalPayment'] 
          // 自付金额
          this.selfPayAmount = this.inindata['住院']['annualSummary']['selfPayAmount'] 
          // 住院比例
          this.hospitalization = ((this.inindata['住院']['annualSummary']['totalAnnualExpenses']/total)*100).toFixed(1)
          // 列表
          this.list = this.inindata['住院']['detail']
          this.draw("canvas-3", { color: "#17D4E5", percent: this.hospitalization });

         break;
        default:
          break;
      }
    },
    draw(canvasID, data) {
      const context = uni.createCanvasContext(canvasID, this);

      // 画灰色底环
      context.beginPath();
      context.arc(
        this.convert(84),
        this.convert(84),
        this.convert(84) - 6,
        0,
        2 * Math.PI
      );
      context.setLineWidth(12);
      context.setStrokeStyle("#f2f2f2");
      context.stroke();

      // 计算角度
      const degree = (Number(data.percent) / 100).toFixed(2) * 2 * Math.PI;
      // 画进度条
      context.beginPath();
      context.arc(
        this.convert(84),
        this.convert(84),
        this.convert(84) - 6,
        -Math.PI / 2,
        degree - Math.PI / 2
      );
      context.setLineWidth(12);
      context.setLineCap("round");
      context.setStrokeStyle(data.color);
      context.stroke();
      context.draw();
    },
    convert(length) {
      return Math.round((uni.getSystemInfoSync().windowWidth * length) / 750);
    },
  },
};
</script>

<style lang="scss" scoped>
.consumption-record {
  min-height: 100vh;
  background: #fbf9f7;
  .filters {
    position: fixed;
    top: 0;
    width: 90%;
    height: 92rpx;
    z-index: 999;
    left: 35rpx;
    .triangle-icon {
      @include size(18, 12);
    }
  }
  .water_img{
  .card {
        background-image: url('https://ggllstatic.hpgjzlinfo.com/static/rights/bgwater2.png');
        background-size: cover;
    .header {
      padding: 22rpx 32rpx;
      .title {
        @include text-line(1);
      }
      .tag {
        @include size(80, 44);
        line-height: 44rpx;
        text-align: center;
      }
    }
    .line {
      width: 100%;
      height: 1rpx;
      background: #e5e5e5;
    }
    .illustration {
      width: 622rpx;
      .percent {
        @include square(168);
      }
      .item {
        position: relative;
        .canvas {
          @include square(168);
          position: absolute;
        }
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
