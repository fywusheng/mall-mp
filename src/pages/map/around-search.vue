<template>
  <view class="around-search" @click="handleClose">
    <view class="header bg-white">
      <view class="search-view flex-h flex-c-b p-0-32">
        <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
          <text
            class="search-bar__text fs-36 flex-1"
            :class="keyword ? 'c-black' : 'c-lightgrey'"
            @click="handleSearchBarClick"
          >
            {{ placeholder || '搜索' }}
          </text>
          <image
            v-if="keyword"
            mode="scaleToFill"
            class="search-bar__icon ml-8"
            src="http://192.168.1.187:10088/static/common/icon-common-input-clear.png"
            @click="keyword = ''"
          />
        </view>
        <button
          v-if="keyword"
          class="cancel-button fs-36 c-black ml-24"
          hover-class="none"
          @click="keyword = ''"
        >
          取消
        </button>
      </view>
      <view class="filters flex-h">
        <view class="flex-width">
          <min-collapse
            ref="collapse1"
            :list="[]"
            :desc="collapseDesc1"
            textDirection="left"
            @clickTab="clickTab(1)"
          >
            <view class="around">
              <view class="flex-width">
                <view class="around-item">
                  <text>距离</text>
                </view>
              </view>
              <view class="flex-width">
                <view
                  :class="['minate-item', disCurrent == index ? 'hight-line' : '']"
                  v-for="(item, index) in distance"
                  :key="index"
                  @click="clickRound(index)"
                >
                  <text>{{ item.name }}</text>
                </view>
              </view>
            </view>
          </min-collapse>
        </view>
        <view class="flex-width">
          <min-collapse
            ref="collapse2"
            :list="categories"
            :desc="collapseDesc2"
            textDirection="center"
            @clickTab="clickTab(2)"
            @handleItemClick="handleItemClick"
          ></min-collapse>
        </view>
        <view class="flex-width">
          <min-collapse
            ref="collapse3"
            :list="[]"
            :desc="collapseDesc3"
            textDirection="right"
            @clickTab="clickTab(3)"
          >
            <view class="down-collapse">
              <view class="collapse-item">
                <view class="collapse-title">优惠</view>
                <view class="flex-list">
                  <view
                    :class="['list-item', disCountCurrent == index ? hightLine : '']"
                    v-for="(item, index) in disCountList"
                    :key="index"
                    @click="choiceClick(1, index)"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>
              <view class="collapse-item">
                <view class="collapse-title">服务</view>
                <view class="flex-list">
                  <view
                    :class="['list-item', serviceCurrent == index ? hightLine : '']"
                    v-for="(item, index) in serverList"
                    :key="index"
                    @click="choiceClick(2, index)"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>
              <view class="btns">
                <view class="flex-h flex-1 flex-c-c fs-40 btn" @click="resetClick">重置</view>
                <view class="flex-h flex-1 flex-c-c fs-40 btn sure" @click="confirmClick">
                  确定
                </view>
              </view>
            </view>
          </min-collapse>
        </view>
        <!-- <min-collapse :list="[1,2,3]" desc='附近'></min-collapse> -->
        <!-- <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">附近</text>
          <image
            class="filter-icon ml-8"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
          />
        </view> -->
        <!-- <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">全部分类</text>
          <image
            class="filter-icon ml-8"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
          />
        </view>
        <view class="filter flex-h flex-c-c flex-1">
          <text class="fs-36 c-black">优惠/服务</text>
          <image
            class="filter-icon ml-8"
            src="http://192.168.1.187:10088/static/common/icon-common-triangle-downward-black.png"
          />
        </view> -->
      </view>
    </view>
    <view style="width: 100vw; height: 204rpx" />
    <view class="list">
      <view
        class="item flex-h"
        v-for="(item, index) in aroundList"
        :key="index"
        @click="handleMapClick(item)"
      >
        <image
          class="image"
          :src="item.scenic_area_photos"
          v-if="item.scenic_area_photos"
          mode="scaleToFill"
        />
        <image
          class="image"
          src="http://192.168.1.187:10088/static/home/image-home-article-default.png"
          v-else
          mode="scaleToFill"
        />
        <view class="info flex-v ml-16">
          <text class="title fs-40 fw-500 map-title">{{ item.name }}</text>
          <text class="grey-color">{{ item.type }} | {{ item.distance | setDistance }}</text>
          <text class="title fs-30 fw-500 grey-color">{{ item.address.trim() }}</text>
          <!-- <view class="tags flex-h flex-wrap mt-16">
            <text class="tag fs-32 c-primary mr-16 mb-8 br-4">
              景点
            </text>
            <text class="tag fs-32 c-primary mr-16 mb-8 br-4">
              4A
            </text>
            <text class="tag fs-32 c-primary mr-16 mb-8 br-4">
              含有老年优待
            </text>
          </view> -->
        </view>
      </view>
      <block v-if="aroundList.length === 0">
        <view class="status-box flex-v flex-c-s">
          <image
            class="icon-img"
            src="http://192.168.1.187:10088/static/common/status-none2x.png"
            mode="scaleToFill"
          />
          <view>暂无内容</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import api from '@/apis/index.js'
import { showToast } from '@/utils/uni'
import minCollapse from './components/min-collep'
export default {
  components: { minCollapse },
  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 周边数据
      aroundList: [],
      // 搜索地址
      mapDetail: {},
      // 距离选择
      distance: [
        {
          name: '不限',
          value: '10000'
        },
        {
          name: '步行10分钟',
          value: '600'
        },
        {
          name: '1000米',
          value: '1000'
        },
        {
          name: '2000米',
          value: '2000'
        },
        {
          name: '3000米',
          value: '3000'
        }
      ],
      // 当前距离选择
      disCurrent: 0,
      // 距离名称
      collapseDesc1: '附近',
      // 分类名称
      collapseDesc2: '全部分类',
      // 当前类别下标
      typeCurrent: 0,
      // 优惠名称
      collapseDesc3: '优惠/服务',
      // 优惠列表
      disCountList: [
        {
          name: '优惠券'
        },
        {
          name: '促销'
        },
        {
          name: '团购'
        }
      ],
      // 优惠选择
      disCountCurrent: null,
      // 服务列表
      serverList: [
        {
          name: '预定'
        },
        {
          name: '排队'
        },
        {
          name: '外卖'
        }
      ],
      // 服务选择
      serviceCurrent: null,
      // 输入提醒
      placeholder: '搜索',
      // 当前位置信息
      city: uni.getStorageSync('mapCity'),
      // 全部分类
      baseList: [
        {
          serviceOrder: '0',
          serviceName: '全部',
          code: '060100|060200|060300|060400|061200|050000|110000|090100|090100|090200|090300|090400|090500|090600|100000|130000',
          distance: '20000',
          des: '',
          amapDes:
              '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店|餐饮服务|风景名胜|医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构|医药保健销售店|住宿服务|政府机构及社会团体',
          prepareIndex: -1
        },
        {
          serviceOrder: '1', // 对应菜单serviceOrder
          serviceName: '助餐点', // 对应菜单名称
          code: '',
          distance: '20000', // 搜索范围
          des: '助餐点', // 我方地图接口参数
          amapDes: '', // 高德地图所需参数
          prepareIndex: -1
        },
        {
          serviceOrder: '2',
          serviceName: '日间照料',
          code: '',
          distance: '20000',
          des: '日间照料',
          amapDes: '',
          prepareIndex: -1
        },
        {
          serviceOrder: '3',
          serviceName: '商超',
          code: '060100|060200|060300|060400|061200',
          distance: '20000',
          des: '商超',
          amapDes: '商场|便民商店/便利店|家电电子卖场|超级市场|专卖店',
          prepareIndex: 1
        },
        {
          serviceOrder: '4',
          serviceName: '美食',
          code: '050000',
          distance: '20000',
          des: '美食',
          amapDes: '餐饮服务',
          prepareIndex: 0
        },
        {
          serviceOrder: '5',
          serviceName: '景点',
          code: '110000',
          distance: '50000',
          des: '景点',
          amapDes: '风景名胜',
          prepareIndex: 0
        },
        {
          serviceOrder: '6',
          serviceName: '医院',
          code: '090100|090100|090200|090300|090400|090500',
          distance: '20000',
          des: '医院',
          amapDes: '医疗保健服务场所|综合医院|专科医院|诊所|急救中心|疾病预防机构',
          prepareIndex: 1
        },
        {
          serviceOrder: '7',
          serviceName: '药店',
          code: '090600',
          distance: '20000',
          des: '药店',
          amapDes: '医药保健销售店',
          prepareIndex: 1
        },
        {
          serviceOrder: '8',
          serviceName: '住宿',
          code: '100000',
          distance: '20000',
          des: '住宿',
          amapDes: '住宿服务',
          prepareIndex: 0
        },
        {
          serviceOrder: '9',
          serviceName: '政务服务',
          code: '130000',
          distance: '20000',
          des: '政务服务',
          amapDes: '政府机构及社会团体',
          prepareIndex: 0
        },
        {
          serviceOrder: '10',
          serviceName: '养老院',
          code: '',
          distance: '20000',
          des: '养老院',
          amapDes: '',
          prepareIndex: -1
        }
      ],
      // 当前城市分类
      categories: [],
      // 自己数据的点
      ownMarkers: [],
      // 高德的数据点
      gdMarkers: [],
      // 每页条数
      offset: 25,
      // 当前页数
      page: 1,
      // 需过滤的名称
      filterName: ''
    }
  },
  onLoad(e) {
    // 获取分类
    // #ifdef MP-ALIPAY
    if (e.data) {
      const data = JSON.parse(decodeURIComponent(e.data))
      this.mapDetail['latitude'] = data.latitude
      this.mapDetail['longitude'] = data.longitude
      this.placeholder = '"' + data.name + '"' + '附近搜索'
      this.filterName = data.name
      this.setCategories()
    }
    // #endif
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('didOpenMap', (data) => {
      this.mapDetail['latitude'] = data.latitude
      this.mapDetail['longitude'] = data.longitude
      this.placeholder = '"' + data.name + '"' + '附近搜索'
      this.filterName = data.name
      this.setCategories()
    })
    // 搜索事件
    uni.$on('didMapSearchFinish', this.handleMapSearchFinish)
  },
  watch: {
    keyword(newVal, oldVal) {
      this.getAround()
    }
  },
  methods: {
    /**
       * 获取分类数据
       */
    setCategories() {
      console.log('===城市---', this.city.city)
      console.log('===获取---', uni.getStorageSync('mapCity'))
      api.getOfficeTypes({
        data: {
          areaCode: this.city.city
        },
        success: (res) => {
          console.log('当前分类：', res)
          this.categories = [
            {
              serviceOrder: '0',
              serviceName: '全部'
            }
          ]

          res.map((item, index) => {
            this.categories.push({
              serviceOrder: item.serviceOrder,
              serviceName: item.serviceName
            })
          })
          this.aroundList = []
          this.page = 1
          this.handleDataList()
        }
      })
    },
    /*
       * 选择优惠和服务
       */
    choiceClick(type, index) {
      this.$refs.collapse3.closeClick()
      this.$uni.showToast(`功能建设中，敬请期待`)
    },
    /*
       * 优惠和服务重置按钮
       */
    resetClick() {
      this.$refs.collapse3.closeClick()
    },
    /*
       * 优惠和服务确定按钮
       */
    confirmClick() {
      this.$refs.collapse3.closeClick()
      // this.$uni.showToast(`功能建设中，敬请期待`)
    },

    /*
       * 搜索完成的回调
       */
    handleMapSearchFinish(data) {
      console.log('搜索 data', data.results)
      this.aroundList = data.results
      this.keyword = data.keyword
    },

    /*
       *  高德搜索周边api
       */
    getAround() {
      console.log('调用高德接口')
      return new Promise((resolve, reject) => {
        const latitude = this.mapDetail['latitude']
        const longitude = this.mapDetail['longitude']
        let distanceName = 200
        if (this.collapseDesc1 == '附近') {
          distanceName = 200
        } else {
          switch (this.distance[this.disCurrent].name) {
            case '不限':
              distanceName = 10000
              break
            case '步行10分钟':
              distanceName = 600
              break
            case '1000米':
              distanceName = 1000
              break
            case '2000米':
              distanceName = 2000
              break
            case '3000米':
              distanceName = 3000
              break
            default:
              break
          }
        }
        let listTypeName = ''
        if (this.typeCurrent == 0) {
          this.categories.map((item, index) => {
            if (index > 0) {
              listTypeName = listTypeName + this.baseList[Number(item.serviceOrder)].amapDes
            }
          })
          // this.baseList[this.typeCurrent].amapDes
        } else {
          listTypeName = this.baseList[this.typeCurrent].amapDes
        }
        if (listTypeName === '') {
          resolve([])
        }

        api.aroundMap(
          {
            location: `${latitude},${longitude}`,
            keywords: this.keyword ? this.keyword : '',
            city: this.city ? this.city.code : '',
            types: listTypeName,
            radius: distanceName,
            offset: 25,
            page: this.page
          },
          {
            success: (res) => {
              // 遍历高德的数据
              const arry = []
              if (res.pois && res.pois.length > 0) {
                this.page = this.page + 1
              }
              res.pois.map((item, index) => {
                if (this.typeCurrent === 0) {
                  this.baseList.some((baseName, baseIndex) => {
                    // let key = item.type.split(';')[baseName.prepareIndex]
                    if (baseIndex > 2 && baseIndex < 10) {
                      const base = baseName.amapDes.split('|')
                      const conditions = base.some((itemp, indexp) => {
                        // console.log("item.type.startsWith(itemp):",item.type.startsWith(itemp))
                        return item.type.indexOf(itemp) > -1
                      })
                      if (conditions) {
                        {
                          // console.log('index:', index)
                          return arry.push({
                            id: this.index++,
                            type: baseName.des,
                            latitude: item.location.split(',')[1] - 0,
                            longitude: item.location.split(',')[0] - 0,
                            iconPath:
                                'http://192.168.1.187:10088/static/map/marker-icon' +
                                baseName.serviceOrder +
                                '.png',
                            width: 35,
                            height: 36,
                            name: item.name,
                            duplicates: item.name + item.address, // 去重条件
                            scenic_area_tel: item.tel,
                            address: item.address,
                            distance: item.distance,

                            scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                            scenic_area_rank:
                                typeof item.biz_ext.level == 'string' ? item.biz_ext.level : ''
                          })
                        }
                      } else if (!conditions && baseIndex > 9) {
                        console.log('其他数据的key：', index, key)
                        console.log('其他数据的type：', baseName.des)
                        return arry.push({
                          id: this.index++,
                          type: baseName.des,
                          latitude: item.location.split(',')[1] - 0,
                          longitude: item.location.split(',')[0] - 0,
                          iconPath: 'http://192.168.1.187:10088/static/map/marker-icon0.png',
                          width: 35,
                          height: 36,
                          name: item.name,
                          duplicates: item.name + item.address, // 去重字段
                          scenic_area_tel: item.tel,
                          address: item.address,
                          distance: item.distance * 1000,
                          scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                          scenic_area_rank:
                              typeof item.biz_ext.level == 'string' ? item.biz_ext.level : ''
                        })
                      }
                    }
                  })
                } else {
                  arry.push({
                    id: this.index++,
                    type: this.baseList[this.typeCurrent].des,
                    latitude: item.location.split(',')[1] - 0,
                    longitude: item.location.split(',')[0] - 0,
                    iconPath:
                        'http://192.168.1.187:10088/static/map/marker-icon' +
                        this.baseList[this.typeCurrent].serviceOrder +
                        '.png',
                    width: 35,
                    height: 36,
                    name: item.name,
                    scenic_area_tel: item.tel,
                    duplicates: item.name + item.address, // 去重字段
                    address: item.address,
                    distance: item.distance,
                    scenic_area_photos: item.photos.length > 0 ? item.photos[0].url : '',
                    scenic_area_rank:
                        typeof item.biz_ext.level == 'string' ? item.biz_ext.level : ''
                  })
                }
              })
              resolve(arry)
              console.log('====最终数据===', arry)
            },
            fail(err) {
              uni.showToast({
                title: err.errMsg
              })
              reject(arry)
            }
          }
        )
      })
    },
    /*
       * 本地接口获取周边
       */
    getAroundApi() {
      return new Promise((resolve, reject) => {
        let distanceName = 0.2

        if (this.collapseDesc1 == '附近') {
          distanceName = 0.2
        } else {
          switch (this.distance[this.disCurrent].name) {
            case '不限':
              distanceName = 10
              break
            case '步行10分钟':
              distanceName = 0.6
              break
            case '1000米':
              distanceName = 1
              break
            case '2000米':
              distanceName = 2
              break
            case '3000米':
              distanceName = 3
              break
            default:
              break
          }
        }
        console.log(typeof distanceName)
        this.ownMarkers = []
        api.getEcOrgOfficeInfoByPoint({
          data: {
            orgOfficeType: this.baseList[this.typeCurrent].des, // 场所类型
            orgOfficeLat: this.mapDetail['latitude'],
            orgOfficeLon: this.mapDetail['longitude'],
            orgOfficeName: this.keyword,
            // areaCode:this.city,
            distance: distanceName,
            size: 25
          },
          // showsLoading: true,
          success: (data) => {
            data.forEach((item, index) => {
              let obj = {}
              switch (item.orgOfficeType) {
                case '景点':
                  console.log('执行报错点11')
                  if (this.filterName && this.filterName === item.orgOfficeName) {
                    break
                  }
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon5.png',
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: item.distance * 1000,

                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail // 去重字段
                  }
                  // console.log("景点数据：",item.orgOfficeInfoDetail)
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''))
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : ''
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : ''
                    obj['scenic_area_rank'] = area.scenic_area_rank
                    obj['scenic_area_opentime'] = area.scenic_area_opentime
                    obj['scenic_area_intro'] = area.scenic_area_intro
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0]
                    }
                  }
                  this.ownMarkers.push(obj)
                  break
                case '医院':
                  console.log('执行报错点12')
                  if (this.filterName && this.filterName === item.orgOfficeName) {
                    break
                  }
                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: 'http://192.168.1.187:10088/static/map/marker-icon6.png',
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: item.distance * 1000,

                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail // 去重字段
                  }
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''))
                    obj['hospital_level'] = area.hospital_level ? area.hospital_level : ''
                    obj['hospital_clinic'] = area.hospital_clinic ? area.hospital_clinic : ''
                    obj['scenic_area_rank'] = area.scenic_area_rank
                    obj['scenic_area_opentime'] = area.scenic_area_opentime
                    obj['scenic_area_intro'] = area.scenic_area_intro
                      ? area.scenic_area_intro
                      : area.hospital_intro
                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0]
                    }
                  }
                  this.ownMarkers.push(obj)
                  break
                default:
                  console.log('执行报错点13')
                  if (this.filterName && this.filterName === item.orgOfficeName) {
                    break
                  }
                  let iconPath = 'http://192.168.1.187:10088/static/map/marker-icon0.png'
                  const iconp = {
                    助餐点: 'http://192.168.1.187:10088/static/map/marker-icon1.png',
                    日间照料: 'http://192.168.1.187:10088/static/map/marker-icon2.png',
                    商超: 'http://192.168.1.187:10088/static/map/marker-icon3.png',
                    美食: 'http://192.168.1.187:10088/static/map/marker-icon4.png',
                    药店: 'http://192.168.1.187:10088/static/map/marker-icon7.png',
                    住宿: 'http://192.168.1.187:10088/static/map/marker-icon8.png',
                    政务服务: 'http://192.168.1.187:10088/static/map/marker-icon9.png',
                    养老院: 'http://192.168.1.187:10088/static/map/marker-icon10.png'
                  }
                  iconPath = iconp[item.orgOfficeType]

                  obj = {
                    orgOfficeId: item.orgOfficeId,
                    rid: item.rid,
                    id: this.index++,
                    type: item.orgOfficeType,
                    latitude: item.orgOfficeLat,
                    longitude: item.orgOfficeLon,
                    iconPath: iconPath,
                    width: 35,
                    height: 36,
                    name: item.orgOfficeName,
                    orgOfficeInfoDetail: item.orgOfficeInfoDetail,
                    scenic_area_tel: item.orgOfficeTel,
                    distance: item.distance * 1000,

                    isCollected: item.isCollected,
                    orgId: item.orgId,
                    address: item.orgOfficeAddrDetail,
                    duplicates: item.orgOfficeName + item.orgOfficeAddrDetail // 去重字段
                  }
                  if (item.orgOfficeInfoDetail) {
                    const area = JSON.parse(item.orgOfficeInfoDetail.replace(/\s*/g, ''))
                    // obj["hospital_level"] = area.hospital_level ? area.hospital_level : ""
                    // obj["hospital_clinic"] = area.hospital_clinic ? area.hospital_clinic : ""
                    if (area.scenic_area_rank) {
                      obj['scenic_area_rank'] = area.scenic_area_rank
                    } else if (area.common_service_rank) {
                      obj['scenic_area_rank'] = area.common_service_rank
                    }
                    if (area.common_service_opentime) {
                      obj['scenic_area_opentime'] = area.common_service_opentime
                    } else if (area.common_service_opentime) {
                      obj['scenic_area_opentime'] = area.common_service_opentime
                    }
                    if (area.common_service_intro) {
                      obj['scenic_area_intro'] = area.common_service_intro
                    } else if (area.scenic_area_intro) {
                      obj['scenic_area_intro'] = area.scenic_area_intro
                    }

                    if (area.scenic_area_photos) {
                      obj['scenic_area_photos'] = area.scenic_area_photos.split(',')[0]
                    } else if (area.common_service_photos) {
                      obj['scenic_area_photos'] = area.common_service_photos.split(',')[0]
                    }
                  }
                  this.ownMarkers.push(obj)
                  break
              }
              console.log('this.ownMarkers==', this.ownMarkers)
            })
            resolve(this.ownMarkers)
          },
          fail: (err) => {
            console.log('请求分类数据失败=', err)
            uni.showToast(err.message)
            reject(this.ownMarkers)
          }
        })
      })
    },
    // 加载数据
    async handleDataList() {
      console.log('==this,page==', this.page)
      // 第一页请求高德的数据和我们自己的数据，之后之请求高德的数据
      if (this.page === 1) {
        const ownMarkers = await this.getAroundApi()
        const gdMarkers = await this.getAround()
        console.log('ownMarkers', ownMarkers)

        // 获取数据后先去重后再进行排序
        const arry = [...ownMarkers, ...gdMarkers]

        // 去重
        const hash = {}
        const newArray = arry.reduce((item, next) => {
          hash[next.name] ? '' : (hash[next.name] = true && item.push(next))
          return item
        }, [])

        // 排序
        newArray.sort((m, n) => {
          var a = m['distance']
          var b = n['distance']
          return a - b // 升序
        })
        this.aroundList = newArray.slice(0, 25)
      } else {
        const gdMarkers = await this.getAround()
        this.aroundList = this.aroundList.concat(gdMarkers)
      }

      uni.stopPullDownRefresh()
    },
    /*
       * 点击详情
       */
    handleMapClick(item) {
      if (!item.orgOfficeInfoDetail) {
        showToast({
          title: '暂无详情信息'
        })
        return
      }
      // let type
      // switch (item.type) {
      //   case '景区':
      //     type = 'attraction'
      //     break
      //   case '医院':
      //     type = 'hospital'
      //     break
      //   default:
      //     break
      // }
      uni.navigateTo({
        url: '/pages/map/address-detail?orgOfficeId=' + item.orgOfficeId,
        success: (res) => {
          // res.eventChannel.emit('didOpenPageFinish', {
          //   type: type,
          //   item: item,
          // })
        }
      })
      // uni.navigateBack({
      //   delta: 2,
      //   success: (res) => {
      //     // res.eventChannel.emit("handleMapSearchFinish", {
      //     //   data: "ssdsdd"
      //     // });
      //     uni.$emit("didMapSearchFinish", {
      //       keyword: "",
      //       results: [
      //         {
      //           location: item.location,
      //           type: "其他",
      //           name: item.name,
      //           address: item.address,
      //         }
      //       ]
      //     });
      //   },
      // });
    },
    /*
       * 点击搜索框到搜索页
       */
    handleSearchBarClick() {
      uni.navigateTo({
        url: '/pages/map/search?serviceIndex=0'
      })
    },

    /*
       * 选择距离事件
       */
    clickRound(index) {
      this.disCurrent = index
      this.$refs.collapse1.closeClick()
      this.collapseDesc1 = this.distance[index].name

      this.aroundList = []
      this.page = 1
      this.handleDataList()
    },
    /*
       * 选择分类事件
       */
    async handleItemClick(serviceOrder) {
      this.typeCurrent = Number(serviceOrder)
      this.collapseDesc2 = this.baseList[this.typeCurrent].serviceName
      this.$refs.collapse2.closeClick()
      console.log('this.typeCurrent==', this.typeCurrent)
      this.aroundList = []
      this.page = 1
      this.handleDataList()
    },
    /*
       * 关闭
       */
    handleClose() {
      this.$refs.collapse1.closeClick()
      this.$refs.collapse2.closeClick()
      this.$refs.collapse3.closeClick()
    },
    /*
       * 关闭其余下拉框
       */
    clickTab(index) {
      ['collapse1', 'collapse2', 'collapse3'].map((itemp, indexp) => {
        if (index != indexp + 1) {
          this.$refs[itemp].closeClick()
        }
      })
      // switch (index) {
      //   case 1:
      //     this.$refs.collapse2.closeClick()
      //     this.$refs.collapse3.closeClick()
      //     break
      //   case 2:
      //     this.$refs.collapse1.closeClick()
      //     this.$refs.collapse3.closeClick()
      //     break
      //   case 3:
      //     this.$refs.collapse1.closeClick()
      //     this.$refs.collapse2.closeClick()
      //     break
      //   default:
      //     break
      // }
    },
    /**
       * 返回单位km ->m lat:纬度  lng：经度
       */
    getDistance(s) {
      s = Number(s)
      if (s.toFixed(2) < 1) {
        return s.toFixed(2) * 1000 + '米'
      } else {
        return s.toFixed(2) + '公里'
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // this.getOrderList()
    this.page = 1
    this.aroundList = []
    this.handleDataList()
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    this.handleDataList()
    // this.getOfficeByTypeWithPage(this.currentIndex)
  },
  filters: {
    setDistance(s) {
      console.log(s)
      console.log(typeof s)
      s = Number(s / 1000)
      if (s.toFixed(2) < 1) {
        const str = s.toFixed(2) * 1000
        if (str === 0) {
          return '距查询位置小于10米'
        } else {
          return s.toFixed(2) * 1000 + '米'
        }
      } else {
        return s.toFixed(2) + '公里'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .grey-color {
    color: #949494;
  }
  .around-search {
    .header {
      position: fixed;
      top: 0;
      width: 100vw;
      .search-view {
        height: 112rpx;
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
          &__text {
            width: 50rpx;
            height: 50rpx;
            overflow: hidden;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .filters {
        height: 92rpx;
        .filter {
          &-icon {
            @include size(16, 10);
          }
        }
        .flex-width {
          flex: 1;
          .around {
            display: flex;
            width: 100%;
            .around-item {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 80rpx;
              background: rgba(255, 85, 0, 0.1);
            }
            .minate-item {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 80rpx;
            }
            .hight-line {
              background: rgba(255, 85, 0, 0.1);
              color: #ff5500;
            }
          }
          .down-collapse {
            .collapse-item {
              padding: 0 24rpx;
            }
            .collapse-title {
              padding-left: 28rpx;
              font-size: 40rpx;
              color: #333;
              font-weight: 500;
              height: 56rpx;
            }
            .flex-list {
              display: flex;
              // justify-content: center;
              align-items: center;
              flex-wrap: wrap;

              .list-item {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 176rpx;
                height: 66rpx;
                margin: 10rpx 28rpx;
                background-color: #f2f2f2;
                border-radius: 8rpx;
              }
              .hight-line {
                background: rgba(255, 85, 0, 0.1);
                color: #ff5500;
              }
            }
            .btns {
              height: 100rpx;
              border-top: 1px solid #eeeeee;
              display: flex;
              align-items: center;
              margin-top: 44rpx;
              .btn {
                color: $color-lightgrey;
                height: 100%;
              }
              .sure {
                color: #ff5500;
                border-left: 1px solid #eeeeee;
              }
            }
          }
        }
      }
    }
    .list {
      border-top: 16rpx solid #f2f2f2;
      background-color: #fff;
      height: 100vh;
      .item {
        margin: 0 32rpx;
        padding: 24rpx 0 16rpx;
        border-bottom: 2rpx solid #eeeeee;
        .image {
          // @include size(222, 244);
          height: 200rpx;
          min-width: 200rpx;
          border-radius: 10rpx;
        }
        .star {
          @include square(32);
        }
        .tags {
          .tag {
            padding: 4rpx 16rpx;
            border: 2rpx solid $color-primary;
            box-sizing: border-box;
            line-height: 32rpx;
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .map-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: calc(100vw - 277rpx);
        }
      }
      .status-box {
        padding-top: 300rpx;
        .icon-img {
          width: 440rpx;
          height: 270rpx;
          margin-bottom: 24rpx;
        }
        .status-text {
          height: 50rpx;
          color: $color-grey;
        }
      }
    }
  }
</style>
