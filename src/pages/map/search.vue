<template>
  <view class="search">
    <view class="search-view flex-h flex-c-b bg-white p-0-32">
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <input
          v-model="keyword"
          :adjust-position="false"
          class="search-bar__input fs-36 c-black flex-1"
          placeholder="搜索地点、美食、景点、医院等"
          :maxlength="maxlength"
        />
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon ml-8"
          src="http://192.168.1.187:10088/static/common/icon-common-input-clear.png"
          @click="keyword = ''"
        />
        <template>
          <view v-if="!keyword" class="search-bar__line" />
          <image
            mode="scaleToFill"
            class="search-bar__voice ml-16"
            src="http://192.168.1.187:10088/static/common/icon-common-voice-grey.png"
            @click="handleVoiceInputClick"
          />
        </template>
      </view>
      <button class="cancel-button fs-36 c-black ml-24" hover-class="none" @click="handleSearchClick">搜索</button>
    </view>
    <template v-if="keyword">
      <view v-if="keyword" class="flex-h flex-c-s p-0-32 bg-white" @click="handleSearchClick">
        <!-- <image class="search-info__icon" src="http://192.168.1.187:10088/static/map/icon-map-search-around.png" />
        <text class="search-info__text fs-36 ml-24 flex-1">
          <text class="c-black">查找</text>
          <text class="c-primary" @click="handleQuery">“{{ keyword }}”</text>
        </text> -->
      </view>
      <view class="list">
        <view class="item flex-h bg-white" v-for="(item, index) in list" :key="index">
          <image class="icon mt-12" mode="scaleToFill" src="http://192.168.1.187:10088/static/map/location2x.png" />
          <view class="ml-24 flex-v flex-1">
            <!-- <rich-text nodes="{{nodes}}" bindtap="tap"/> -->
            <!-- <wxparser :rich-text="getHighline(item.name)" /> -->
            <rich-text :nodes="item.lastName"></rich-text>
            <text class="name fs-36 mb-8">
              <!-- <text class="c-black" v-html="getHighline(item.name)"></text> -->
              <!-- <text class="c-black">{{item.name}}</text> -->
              <!-- <text class="c-primary">{{ item.district }}</text> -->
              <!-- <text class="c-black">(长虹桥店)</text> -->
            </text>
            <text class="info fs-36 c-lightgrey mb-8">
              {{ item.address }}
            </text>
            <text class="distance fs-36 c-lightgrey mb-8" v-if="item.my_distance != 0">距离您：{{ item.my_distance }}</text>
            <button class="button fs-36 c-black" hover-class="none" @click="handleListItemClick(item)">查看地点</button>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="section m-32" v-if="searchHistories.length > 0">
        <view class="section-header flex-h flex-c-b">
          <text class="fs-40 c-black">最近搜索</text>
          <view class="flex-h flex-c-c" @click="handleClearClick">
            <image class="clear-icon" mode="scaleToFill" src="http://192.168.1.187:10088/static/map/delete2x.png" />
            <button class="fs-36 c-lightgrey ml-8" hover-class="none">清空</button>
          </view>
        </view>
        <view class="list flex-h flex-wrap">
          <text
            class="item bg-white bt-8 mr-24 mt-24"
            v-for="(item, index) in searchHistories"
            :key="index"
            @click="handleSearchHistoryItemClick(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>
      <view class="section m-32">
        <view class="section-header flex-h flex-c-b">
          <text class="fs-40 c-black">大家都在搜</text>
        </view>
        <view class="list flex-h flex-wrap">
          <text class="item bg-white bt-8 mr-24 mt-24" @click="handleHotSearchItemClick('北京')">北京</text>
          <text class="item bg-white bt-8 mr-24 mt-24" @click="handleHotSearchItemClick('故宫博物馆')">故宫博物馆</text>
          <text class="item bg-white bt-8 mr-24 mt-24" @click="handleHotSearchItemClick('八达岭长城')">八达岭长城</text>
          <text class="item bg-white bt-8 mr-24 mt-24" @click="handleHotSearchItemClick('骏豪中央广场')">骏豪中央广场</text>
        </view>
      </view>
    </template>
    <voice-input :show="showsVoiceInput" @change="handleVoiceInputChange" @end="handleVoiceInputFinish" />
    <uni-popup ref="popup" type="bottom">
      <view class="popup-top">
        <view>您可以试试这样说</view>
        <view class="popup-text">按摩椅/保温杯/养生产品</view>
      </view>

      <view class="bottom-view flex-v flex-c-c">
        <text class="bottom-view__text fs-40 c-grey">{{ tips }}</text>
        <image
          class="bottom-view__image"
          mode="scaleToFill"
          src="http://192.168.1.187:10088/static/voice/icon-voice-input-button.png"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        />
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import VoiceInput from './components/voice-input.vue';
  // import uniPopup from '@/components'
  export default {
    components: { VoiceInput },
    data() {
      return {
        // 搜索关键字
        keyword: '',
        // 最近搜索列表
        searchHistories: uni.getStorageSync('mapSearchHistories') || [],
        // 搜索结果列表
        list: [],
        // 当前位置
        location: '',
        // 当前搜索的类别090000是医院，110000是景点
        type: '',
        // 最大长度限制
        maxlength: 64,
        // 正在说话
        tips: '按住说话',
        // 语音转文字插件实例
        manager: null,
        // 基础分类
        baseList: [
          {
            serviceOrder: '0',
            serviceName: '全部',
            code: '060100|060200|060300|060400|061200|050000|110000|090100|090100|090200|090300|090400|090500|090600|100000|130000',
            distance: '20000',
            des: '',
            amapDes:
              '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店|餐饮服务|风景名胜|医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构|医药保健销售店|住宿服务|政府机构及社会团体',
            prepareIndex: -1,
          },
          {
            serviceOrder: '1', // 对应菜单serviceOrder
            serviceName: '助餐点', // 对应菜单名称
            code: '',
            distance: '20000', // 搜索范围
            des: '助餐点', // 我方地图接口参数
            amapDes: '', // 高德地图所需参数
            prepareIndex: -1,
          },
          {
            serviceOrder: '2',
            serviceName: '日间照料',
            code: '',
            distance: '20000',
            des: '日间照料',
            amapDes: '',
            prepareIndex: -1,
          },
          {
            serviceOrder: '3',
            serviceName: '商超',
            code: '060100|060200|060300|060400|061200',
            distance: '20000',
            des: '商超',
            amapDes: '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店',
            prepareIndex: 1,
          },
          {
            serviceOrder: '4',
            serviceName: '美食',
            code: '050000',
            distance: '20000',
            des: '美食',
            amapDes: '餐饮服务',
            prepareIndex: 0,
          },
          {
            serviceOrder: '5',
            serviceName: '景点',
            code: '110000',
            distance: '50000',
            des: '景点',
            amapDes: '风景名胜',
            prepareIndex: 0,
          },
          {
            serviceOrder: '6',
            serviceName: '医院',
            code: '090100|090100|090200|090300|090400|090500',
            distance: '20000',
            des: '医院',
            amapDes: '医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构',
            prepareIndex: 1,
          },
          {
            serviceOrder: '7',
            serviceName: '药店',
            code: '090600',
            distance: '20000',
            des: '药店',
            amapDes: '医药保健销售店',
            prepareIndex: 1,
          },
          {
            serviceOrder: '8',
            serviceName: '住宿',
            code: '100000',
            distance: '20000',
            des: '住宿',
            amapDes: '住宿服务',
            prepareIndex: 0,
          },
          {
            serviceOrder: '9',
            serviceName: '政务服务',
            code: '130000',
            distance: '20000',
            des: '政务服务',
            amapDes: '政府机构及社会团体',
            prepareIndex: 0,
          },
          {
            serviceOrder: '10',
            serviceName: '养老院',
            code: '',
            distance: '20000',
            des: '养老院',
            amapDes: '',
            prepareIndex: -1,
          },
        ],
        // 自己接口的请求数据
        setMarkers: [],
        // 接口请求结束是否返回上一页
        needBack: false,
        // 城市的citycode
        citycode: '',
        // 收藏列表
        collectList: [],
        // 城市名称
        mapCity: uni.getStorageSync('mapCity').city,
        voice: null,
      };
    },
    watch: {
      /**
       * 搜索框检索事件根据keyword变化立马检索
       */
      keyword(newVal, oldVal) {
        const unChinese = this.isKeyword(newVal);
        console.log('unChinese:', unChinese);
        if (!unChinese) {
          this.maxlength = 23;
        } else {
          this.maxlength = 63;
        }
        uni.getStorageSync('city');

        this.ourSearch();
      },
      list: {
        handler(newVal) {},
        deep: true,
      },
    },
    onLoad(option) {
      this.voice = option.voice;
      if (option.voice == 1) {
        // #ifdef MP-WEIXIN
        this.$refs.popup.open('top');
        this.initRecordRecognitionManager();
        // #endif
        console.log('onload');
      }
      if (uni.getStorageSync('token')) {
        this.getCollection();
      }

      this.getLocation();
    },
    onReady() {
      // #ifdef MP-ALIPAY
      this.initAlipay();
      // #endif
      // #ifdef MP-WEIXIN
      this.initRecordRecognitionManager();
      // #endif
      console.log('onReady');
    },
    mounted() {
      // #ifdef MP-ALIPAY
      if (this.voice == 1) {
        this.$refs.popup.open('top');
        this.initAlipay();
      }
      // #endif
    },
    methods: {
      // 初始化支付宝语音
      initAlipay() {
        const recorderManager = my.getRecorderManager();
        const innerAudioContext = my.createInnerAudioContext();
        const fs = my.getFileSystemManager();

        // 监听录音开始事件
        recorderManager.onStart(() => {
          console.log('recorder start');
        });
        // 监听录音暂停事件
        recorderManager.onPause(() => {
          console.log('recorder pause');
        });
        // 监听录音继续事件
        recorderManager.onResume(() => {
          console.log('recorder resume');
        });

        // 监听录音停止事件
        recorderManager.onStop((res) => {
          console.log('===支付宝开始---', res);
          fs.saveFile({
            tempFilePath: res['tempFilePath'],
            filePath: `${my.env.USER_DATA_PATH}/temb1.mp3`,
            success: (res1) => {
              console.log('读文件----', res1.savedFilePath);
              // my.alert({ content: res1.savedFilePath })

              fs.readFile({
                filePath: res1.savedFilePath,
                encoding: 'base64',
                success: (rs) => {
                  this.getVoiceContent(rs.data);
                  //  my.alert({ content: 'recorder onStop' + JSON.stringify(rs.data)});
                },
                fail: (r) => {
                  my.alert({ content: 'recorder error' + JSON.stringify(r) });
                },
              });
              setTimeout(() => {
                innerAudioContext.src = res1.savedFilePath;
                innerAudioContext.play();
              }, 1000);
            },
          });
        });
        // 监听录音错误事件
        recorderManager.onError((res) => {
          console.log('recorder error', res);
        });

        this.manager = recorderManager;
      },
      // 语音识别
      getVoiceContent(base64) {
        console.log('----识别---', base64);

        api.getVoiceResult({
          data: {
            audioBase64: base64,
            videoType: 'mp3',
          },
          success: (data) => {
            this.keyword = data.text;
            console.log(this.keyword, '语音识别结果');
          },
          fail: (error) => {
            console.log('----222222222222222----', error);
            this.$uni.showToast('对不起,我没有听懂您在说什么');
          },
        });
      },
      // 收藏接口
      getCollection() {
        return new Promise((resolve, reject) => {
          api.findListByParmas({
            showsLoading: true,
            data: {
              pageNum: 1,
              pageSize: 100,
              colType: '2',
              isDistanceOrder: true,
              coordinate: this.location.longitude + ',' + this.location.latitude,
            },
            success: (data) => {
              if (data) {
                this.collectList = data.finalList;
                resolve(data.finalList);
                // collectList = data.finalList
              }
            },
            fail: (err) => {
              this.collectList = [];
              resolve(err);
            },
          });
        });
      },
      /**
       * 语音输入图标点击事件
       */
      handleVoiceInputClick() {
        this.$refs.popup.open('top');
      },
      /**
       * 麦触摸事件
       */
      handleTouchStart() {
        uni.showLoading();
        this.tips = '正在说话';
        this.manager.start({ format: 'mp3', sampleRate: '16000', encodeBitRate: '96000' });
      },
      /**
       * 麦触摸事件
       */
      handleTouchEnd() {
        uni.hideLoading();
        this.tips = '按住说话';
        this.manager.stop();
        this.$refs.popup.close();
      },
      /**
       * 初始化微信语音转文字插件
       */
      initRecordRecognitionManager() {
        // eslint-disable-next-line no-undef
        const plugin = requirePlugin('WechatSI');
        const manager = plugin.getRecordRecognitionManager();
        const self = this;
        manager.onStart = function (res) {
          console.log('语音输入开始');
          self.reply = '';
        };
        manager.onRecognize = function (res) {
          self.content = res.result;
        };
        manager.onStop = function (res) {
          console.log('语音输入结束');
          self.keyword = res.result;
        };
        manager.onError = function (res) {
          console.error('语音输入报错: ', res.msg);
        };
        this.manager = manager;
      },

      // 调用自己的接口
      ourSearch(back) {
        const collectList = this.collectList;
        api.getEcOrgOfficeInfoByPoint({
          data: {
            orgOfficeType: '', // 场所类型,
            // areaCode:this.mapCity,
            orgOfficeLat: this.location.latitude,
            orgOfficeLon: this.location.longitude,
            orgOfficeName: this.keyword,
            distance: 50000, // 搜索半径,
            size: 25,
          },
          success: (data) => {
            this.setMarkers = [];

            data.forEach((item, index) => {
              // 景点和医院的参数不同需要加些判断
              //  console.log("json：",JSON.parse(
              //           item.orgOfficeInfoDetail.replace(/\s*/g, '')
              //         ))
              let obj = {};
              switch (item.orgOfficeType) {
                case '景点':
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon5.png',
                    width: 47,
                    height: 52,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(this.location.latitude, this.location.longitude, item.orgOfficeLat, item.orgOfficeLon),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  // console.log("景点数据：",item.orgOfficeInfoDetail)
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : '';
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : '';
                    obj['scenic_area_rank'] = area.scenic_area_rank;
                    obj['scenic_area_opentime'] = area.scenic_area_opentime;
                    obj['scenic_area_intro'] = area.scenic_area_intro;
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    }
                  }
                  collectList.some((itemCollect) => {
                    if (itemCollect.colId == obj.rid) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
                case '医院':
                  console.log('执行报错点12');
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon6.png',
                    width: 47,
                    height: 52,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(this.location.latitude, this.location.longitude, item.orgOfficeLat, item.orgOfficeLon),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : '';
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : '';
                    obj['scenic_area_rank'] = area.scenic_area_rank;
                    obj['scenic_area_opentime'] = area.scenic_area_opentime;
                    obj['scenic_area_intro'] = area.scenic_area_intro ? area.scenic_area_intro : area.hospital_intro;
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    }
                  }
                  collectList.some((itemCollect) => {
                    if (itemCollect.colId == obj.rid) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
                default:
                  console.log('执行报错点13');
                  let iconPath = 'http://192.168.1.187:10088/static/map/marker-icon0.png';
                  const iconp = {
                    助餐点: 'http://192.168.1.187:10088/static/map/marker-icon1.png',
                    日间照料: 'http://192.168.1.187:10088/static/map/marker-icon2.png',
                    商超: 'http://192.168.1.187:10088/static/map/marker-icon3.png',
                    美食: 'http://192.168.1.187:10088/static/map/marker-icon4.png',
                    药店: 'http://192.168.1.187:10088/static/map/marker-icon7.png',
                    住宿: 'http://192.168.1.187:10088/static/map/marker-icon8.png',
                    政务服务: 'http://192.168.1.187:10088/static/map/marker-icon9.png',
                    养老院: 'http://192.168.1.187:10088/static/map/marker-icon10.png',
                  };
                  iconPath = iconp[item.orgOfficeType];

                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: iconPath,
                    width: 47,
                    height: 52,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: this.getDistance(this.location.latitude, this.location.longitude, item.orgOfficeLat, item.orgOfficeLon),
                    my_distance: this.calculations(item.orgOfficeLat, item.orgOfficeLon),
                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail, // 去重字段
                  };
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''));
                    // obj["hospital_level"] = area.hospital_level ? area.hospital_level : ""
                    // obj["hospital_clinic"] = area.hospital_clinic ? area.hospital_clinic : ""
                    if (area.scenic_area_rank) {
                      obj['scenic_area_rank'] = area.scenic_area_rank;
                    } else if (area.common_service_rank) {
                      obj['scenic_area_rank'] = area.common_service_rank;
                    }
                    if (area.common_service_opentime) {
                      obj['scenic_area_opentime'] = area.common_service_opentime;
                    }
                    if (area.common_service_intro) {
                      obj['scenic_area_intro'] = area.common_service_intro;
                    } else if (area.scenic_area_intro) {
                      obj['scenic_area_intro'] = area.scenic_area_intro;
                    }

                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0];
                    } else if (area.common_service_photos) {
                      obj['scenic_area_photos'] = area.common_service_photos.split(',')[0];
                    }
                  }
                  collectList.some((itemCollect) => {
                    if (itemCollect.colId == obj.rid) {
                      obj['isCollected'] = 1;
                      return true;
                    }
                  });
                  this.setMarkers.push(obj);
                  break;
              }
            });

            console.log('获取地址：', this.setMarkers);

            this.getAround(back);

            // let lastNum = 25 - data.length
            // 数据不够高德来凑
            // if (this.baseList[this.selectedIndex].amapDes) {
            //   console.log('执行报错点1')

            //   this.getAround(latitude, longitude, drag, radius)
            // } else {
            //   console.log('执行报错点15')
            //   this.markers = this.setMarkers

            //   // // #ifdef MP-ALIPAY
            //   // this.mapConext = my.createMapContext('map', this)
            //   // //#endif
            //   // //#ifdef MP-WEIXIN
            //   // this.mapConext = uni.createMapContext('map', this)
            //   // //#endif
            //   // console.log('this.mapConext1:', this.mapConext)
            //   // this.mapConext.includePoints({
            //   //   points: this.markers,
            //   //   padding: [40, 30, 0, 30],
            //   // })
            // }
          },
        });
      },

      /*
       *第三方sdk接入查找周边景点和医院
       */
      getAround(back) {
        // let latitude = (latitude1-0).toFixed(6)
        // let longitude = (longitude1-0).toFixed(6)
        const latitude = this.location.latitude;
        const longitude = this.location.longitude;
        const city = uni.getStorageSync('city');
        api.searchMap(
          {
            location: `${latitude},${longitude}`,
            keywords: this.keyword,
            // city: city.code,
            city: this.city,
            types:
              '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
            // radius: 50000, //搜索半径
            offset: 25,
          },
          {
            success: (res) => {
              console.log('获取结果：', res);

              // 遍历高德的数据
              let arry = [];
              if (res.pois.length > 0) {
                res.pois.map((item, index) => {
                  this.baseList.some((baseName, baseIndex) => {
                    // let key = item.type.split(';')[baseName.prepareIndex]
                    if (baseIndex > 2 && baseIndex < 10) {
                      const base = baseName.amapDes.split('|');
                      const conditions = base.some((itemp, indexp) => {
                        // console.log("item.type.startsWith(itemp):",item.type.startsWith(itemp))
                        return item.type.indexOf(itemp) > -1;
                      });
                      // console.log('baseName:', baseName)
                      // console.log('conditions:', conditions)
                      if (conditions) {
                        {
                          // console.log('index:', index)
                          return arry.push({
                            type: baseName.des,
                            latitude: item.location.split(',')[1] - 0,
                            longitude: item.location.split(',')[0] - 0,
                            iconPath: 'http://192.168.1.187:10088/static/map/marker-icon' + baseName.serviceOrder + '.png',
                            width: 47,
                            height: 52,
                            name: item.name,
                            duplicates: item.name + item.address, // 去重条件
                            scenic_area_tel: item.tel,
                            address: item.address,
                            distance: this.getDistance(
                              item.location.split(',')[1],
                              item.location.split(',')[0],
                              this.location.latitude,
                              this.location.longitude,
                            ),
                            my_distance: this.calculations(item.location.split(',')[1], item.location.split(',')[0]),
                            scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                            scenic_area_rank: typeof item.biz_ext.level == 'string' ? item.biz_ext.level : '',
                          });
                        }
                      }
                    } else if (baseIndex > 9) {
                      // console.log('其他数据的key：', index, key)
                      // console.log('其他数据的type：', baseName.des)
                      return arry.push({
                        type: '其他',
                        latitude: item.location.split(',')[1] - 0,
                        longitude: item.location.split(',')[0] - 0,
                        iconPath: 'http://192.168.1.187:10088/static/map/marker-icon0.png',
                        width: 47,
                        height: 52,
                        name: item.name,
                        duplicates: item.name + item.address, // 去重字段
                        scenic_area_tel: item.tel,
                        address: item.address,
                        distance: this.getDistance(
                          item.location.split(',')[1],
                          item.location.split(',')[0],
                          this.location.latitude,
                          this.location.longitude,
                        ),
                        my_distance: this.calculations(item.location.split(',')[1], item.location.split(',')[0]),
                        scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                        scenic_area_rank: typeof item.biz_ext.level == 'string' ? item.biz_ext.level : '',
                      });
                    }
                  });
                });
                console.log('执行报错点3');

                console.log('arry', arry);
              }

              arry = [...this.setMarkers, ...arry];
              const hash = {};
              const newArray = arry.reduce((item, next) => {
                hash[next.name] ? '' : (hash[next.name] = true && item.push(next));
                return item;
              }, []);

              // console.log(" my.createMapContext('map')",  my.createMapContext('map'))

              //  let newArry = arry.splice(0,lastNum)

              newArray.sort((m, n) => {
                var a = m['distance'];
                var b = n['distance'];
                return a - b; // 升序
              });
              console.log('newArray', newArray);

              this.list = newArray.slice(0, 25);
              if (this.list.length === 0) {
                this.$uni.showToast('该区域无结果，换个位置试试吧~');
              }
              this.list.map((item, index) => {
                const arr = this.list[index]['name'].split(this.keyword);
                const nameArr = [];
                arr.map((item, index) => {
                  if (index < arr.length - 1) {
                    nameArr.push({
                      name: 'span',
                      children: [
                        {
                          type: 'text',
                          text: item,
                        },
                      ],
                    });
                    nameArr.push({
                      name: 'span',
                      attrs: {
                        style: 'color:red',
                      },
                      children: [
                        {
                          type: 'text',
                          text: this.keyword,
                        },
                      ],
                    });
                  } else {
                    nameArr.push({
                      name: 'span',
                      children: [
                        {
                          type: 'text',
                          text: item,
                        },
                      ],
                    });
                  }
                });
                this.list[index]['lastName'] = nameArr;
              });
              console.log('===this.list===', this.list);
              if (back || this.needBack) {
                this.navigateBack(this.list);
              }
            },
            fail(err) {
              uni.showToast({
                title: err.errMsg,
              });
            },
          },
        );
      },
      /**
       * 搜索点击事件目前暂时使用监听得业务逻辑
       */
      handleSearchClick() {
        if (this.keyword != '') {
          this.addToHistory(this.keyword);
        } else {
          return;
        }
        const city = uni.getStorageSync('city');
        const back = true;
        this.ourSearch(back);

        return;

        api.searchMap(
          {
            city: city.code,
            keyword: this.keyword,
            location: this.location,
            type: this.type,
          },
          {
            success: (data) => {
              this.list = data.pois;
              data.pois.forEach((item, index) => {
                if (typeof item.location != 'string') {
                  this.list.splice(index, 1);
                }
              });
              let type;
              switch (this.type) {
                case '110000|090000|010000|030000|050000|060000|070000|080000|100000|120000|130000|140000|150000|160000|170000|180000':
                  type = '其他';
                  break;
                case '110000':
                  type = '景点';
                  break;
                case '090000':
                  type = '医院';
                  break;
                default:
                  break;
              }
              this.list.forEach((item, index) => {
                if (typeof item.location == 'string') {
                  const distance = this.getDistance(
                    item.location.split(',')[1],
                    item.location.split(',')[0],
                    this.location.latitude,
                    this.location.longitude,
                  );
                  this.list[index]['distance'] = distance;
                } else {
                  this.list[index]['distance'] = 0;
                }
                if (this.list[index]['typecode'].indexOf('09') == 0 || this.list[index]['typecode'].indexOf('09') == 7) {
                  this.list[index]['type'] = '医院';
                } else if (this.list[index]['typecode'].indexOf('11') == 0 || this.list[index]['typecode'].indexOf('11') == 7) {
                  this.list[index]['type'] = '景点';
                } else {
                  this.list[index]['type'] = '其他';
                }

                // this.list[index]["type"] = type
                const arr = this.list[index]['name'].split(this.keyword);
                const nameArr = [];
                arr.map((item, index) => {
                  if (index < arr.length - 1) {
                    nameArr.push({
                      name: 'span',
                      children: [
                        {
                          type: 'text',
                          text: item,
                        },
                      ],
                    });
                    nameArr.push({
                      name: 'span',
                      attrs: {
                        style: 'color:red',
                      },
                      children: [
                        {
                          type: 'text',
                          text: this.keyword,
                        },
                      ],
                    });
                  } else {
                    nameArr.push({
                      name: 'span',
                      children: [
                        {
                          type: 'text',
                          text: item,
                        },
                      ],
                    });
                  }
                });
                this.list[index]['lastName'] = nameArr;
              });
              this.navigateBack(this.list);
            },
          },
        );
      },
      /**
       * 清空点击事件
       */
      handleClearClick() {
        this.$uni.showConfirm({
          content: '是否清除最近访问记录',
          confirm: () => {
            uni.removeStorageSync('mapSearchHistories');
            this.searchHistories = [];
          },
        });
      },
      /**
       * 最近搜索点击事件
       */
      handleSearchHistoryItemClick(item) {
        this.addToHistory(item);
        this.keyword = item;
        this.needBack = true;
        // setTimeout(() => {
        //   this.navigateBack(this.list)
        // }, 500)
      },
      /**
       * 大家都在搜点击事件
       */
      handleHotSearchItemClick(item) {
        this.addToHistory(item);
        this.keyword = item;
        this.needBack = true;

        // setTimeout(() => {
        //   this.navigateBack(this.list)
        // }, 500)
      },
      /**
       * 点击查找搜索地点
       */
      handleQuery() {},
      /**
       * 查看地点点击事件
       */
      handleListItemClick(item) {
        console.log('返回上一层的数据：', item);
        this.addToHistory(this.keyword);
        this.navigateBack([item]);
      },
      /**
       * 语音输入回调
       */
      handleVoiceInputChange(result) {
        this.keyword = result.replace(/。$/gi, '');
      },
      /**
       * 语音输入结束事件
       */
      handleVoiceInputFinish() {
        console.log('调用搜索');
      },
      /**
       * 添加到最近搜索
       */
      addToHistory(item) {
        const array = [...this.searchHistories];
        array.unshift(item);
        this.searchHistories = Array.from(new Set(array)).slice(0, 50);
        uni.setStorageSync('mapSearchHistories', this.searchHistories);
      },
      /**
       * 返回到上一级页面
       */
      navigateBack(items) {
        uni.navigateBack({
          success: () => {
            const data = {
              keyword: this.keyword,
              results: items,
            };
            uni.$emit('didMapSearchFinish', data);
          },
        });
      },
      /**
       * 获取当前位置
       */
      getLocation() {
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            this.location = res;
            api.regeoMap(
              {
                // location: '116.481488,36.990464',
                location: res.longitude + ',' + res.latitude,
              },
              {
                success: (resp) => {
                  console.log('resp:', resp);
                  // 当城市是省直辖县时返回为空，以及城市为北京、上海、天津、重庆四个直辖市时，该字段返回为[],否则为城市名称（字符串）
                  // if (typeof resp.regeocode.addressComponent.city === 'string') {
                  //    this.mapCity = resp.regeocode.addressComponent.adcode.substr(0,4)+'00'

                  // } else {
                  //   this.mapCity = resp.regeocode.addressComponent.province
                  // }
                  this.city = resp.regeocode.addressComponent.citycode;
                },
              },
            );
            console.log(this.location);
          },
        });
      },
      /**
       * 判断多少个字符
       */
      isKeyword(str) {
        let len = 0;
        let num = true;
        for (var i = 0; i < str.length; i++) {
          const c = str.charCodeAt(i);
          // 单字节加1
          if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
            len++;
            num = true;
          } else {
            len += 2;
            num = false;
            return false;
          }
        }
        return num;
        // return blen;
      },
      /**
       * 列表判断同名高亮显示
       */
      getHighline(str) {
        return str.replace(new RegExp(this.keyword, 'g'), `<text style="color: red;display:inline">${this.keyword}</text>`);
      },
      /**
       * 返回单位km  lat:纬度  lng：经度
       */
      getDistance(lat1, lng1, lat2, lng2) {
        if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
          return '不能计算';
        }
        if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
          return '不能计算';
        }
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s.toFixed(2) * 1000;
      },
      calculations(lat2, lng2) {
        // console.log('location,', this.location)
        const lat1 = this.location.latitude;
        const lng1 = this.location.longitude;

        if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90) {
          return '';
        }
        if (Math.abs(lng1) > 180 || Math.abs(lng2) > 180) {
          return '';
        }
        var radLat1 = this.rad(lat1);
        var radLat2 = this.rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.rad(lng1) - this.rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        if (s.toFixed(2) < 1) {
          return s.toFixed(2) * 1000 + '米';
        } else {
          return s.toFixed(2) + '公里';
        }
      },
      /**
       * 距离计算定义方法
       */
      rad(d) {
        return (d * Math.PI) / 180.0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search {
    min-height: 100vh;
    background: #fbf9f7;
    .search-view {
      width: calc(100vw - 64rpx);
      height: 112rpx;
      border-bottom: 2rpx solid #eeeeee;
      .search-bar {
        height: 80rpx;
        border-radius: 40rpx;
        border: 2rpx solid $color-primary;
        box-sizing: border-box;
        &__input {
          line-height: 80rpx;
        }
        &__icon {
          @include square(32);
          border-radius: 16rpx;
        }
        &__line {
          @include size(2, 24);
          background: #c9c9c9;
        }
        &__voice {
          @include square(48);
        }
      }
    }
    .search-info {
      height: 96rpx;
      border-bottom: 2rpx solid #eeeeee;
      &__icon {
        @include square(32);
      }
      &__text {
        @include text-line(1);
      }
    }
    .list {
      .item {
        padding: 20rpx 32rpx 16rpx;
        border-bottom: 2rpx solid #eeeeee;
        justify-content: flex-start;
        .icon {
          @include square(32);
        }
        .name,
        .info,
        .distance {
          @include text-line(1);
          max-width: 630rpx;
        }
        .button {
          background: rgba(0, 89, 255, 0.06);
        }
      }
    }
    .section {
      &-header {
        height: 56rpx;
        .clear-icon {
          @include square(40);
        }
      }
      .list {
        .item {
          padding: 8rpx 24rpx;
          line-height: 48rpx;
        }
      }
    }
    .c-primary {
      color: red;
    }
  }
  .popup-top {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 200rpx;
    font-size: 25rpx;
    margin-top: 100rpx;
  }
  .popup-text {
    font-size: 25rpx;
    text-align: center;
    margin-top: 15rpx;
    color: rgb(209, 204, 204);
  }
  .bottom-view__image {
    width: 150rpx;
    height: 150rpx;
  }
</style>
