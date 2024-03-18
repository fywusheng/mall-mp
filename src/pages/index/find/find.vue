<template>
  <view class="find">
    <!-- 头部导航栏 -->
    <navigation-bar :alpha="0" statusBackGround="#ff5d28">
      <view slot="title1">
        <view class="navigation-bar flex-h flex-c-s">
          <image
            class="image"
            src="http://192.168.1.187:10088/static/home/home-logo.png"
            mode="scaleToFill"
          />
          <text class="navigation-bar__title fs-40 c-white flex-1">国家老龄服务平台</text>
        </view>
      </view>
    </navigation-bar>

    <view
      class="search-view flex-h flex-c-b bg-white p-0-32"
      :style="{ 'margin-top': navHeight + 'px' }"
    >
      <view class="search-bar flex-h flex-c-b flex-1 p-0-32">
        <text
          class="search-bar__text fs-36 flex-1"
          :class="keyword ? 'c-black' : 'c-lightgrey'"
          @click="handleSearchBarClick"
        >
          {{ keyword || '搜你想看' }}
        </text>
        <image
          v-if="keyword"
          mode="scaleToFill"
          class="search-bar__icon"
          src="http://192.168.1.187:10088/static/common/icon-common-input-clear.png"
        />
        <template v-else>
          <view class="search-bar__line" />
          <image
            class="search-bar__voice ml-16"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-voice-grey.png"
            @click="handleVoiceInputClick"
          />
        </template>
      </view>
      <button v-if="keyword" class="cancel-button fs-36 c-black ml-24" hover-class="none">
        取消
      </button>
    </view>
    <view class="content">
      <tab-list
        :list="list"
        @handleNoimg="handleNoimg"
        @handleSwitchPlay="handleSwitchPlay"
        @currentIndex="swiperChange"
        @loadMore="loadMore"
        @refreshData="refreshData"
        @goDetail="goDetail"
        @goVedio="goVedio"
        @goSmallVedio="goSmallVedio"
        @handleArticleImageLoadFail="handleArticleImageLoadFail"
        :stopPlay="stopPlay"
        ref="tabs"
      ></tab-list>
    </view>
    <!-- 音频组件控制模块 -->
    <view class="bg-black" v-if="!closeAudio" @click="closeAudio = true"></view>
    <view class="audio" v-if="showAudion">
      <y-audio
        @handleClose="handleClose"
        ref="yaudio"
        @prePlay="prePlay"
        @handleSwitchPlay="handleSwitchPlay"
        @nextPlay="nextPlay"
        :title="title"
        :stopPlay="stopPlay"
        :videoBg="videoBg"
        :closeAudio="closeAudio"
        @triggleBg="triggleBg"
      ></y-audio>
    </view>
  </view>
</template>

<script>
  import api from '@/apis/index.js';
  import TabList from './components/tabs-swiper';
  import YAudio from './components/audio';
  import NavigationBar from '../../../components/common/navigation-bar.vue';
  export default {
    components: { TabList, YAudio, NavigationBar },
    data() {
      return {
        // 判断是否存在定位信息
        city: null,
        // 搜索词
        keyword: '',
        // 数据列表
        list: [],
        // 控制音频显示
        showAudion: false,
        // 进入页面需加载次数
        begin: 0,
        // 当前页码列表的tab页下标
        currentIndex: 0,
        // 音频播放对象
        innerAudioContext: null,
        // 音频文章标题
        title: '',
        // 播放音频的下标
        playindex: null,
        // 当前播放音频所在tab
        tabIndex: null,
        // 暂停播放
        stopPlay: true,
        // 音频背景板是否关闭
        closeAudio: true,
        // 已经执行完成上一篇
        prefun: true,
        // 已经执行完成下一篇
        nextfun: true,
        // 用于监听是否刷新完的定时器
        timer: null,
        // 是否刷新完毕
        refreshOver: true,
        // 设置默认图片
        videoBg: 'http://192.168.1.187:10088/static/find/process_bg2x.png',
        // 作为循环播放时改变的下标
        loopIndex: 0,
        navHeight: uni.getSystemInfoSync().statusBarHeight + 44,
      };
    },
    created() {
      // 判断是否存在定位信息 展示相关城市
      if (uni.getStorageSync('city')) this.city = uni.getStorageSync('city');

      // 获取栏目分类
      this.queryColList();
    },
    onLoad(e) {
      // 判断是否存在定位信息 展示相关城市
      if (uni.getStorageSync('city')) this.city = uni.getStorageSync('city');

      // 获取栏目分类
      this.queryColList();

      // uni.startPullDownRefresh()
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.refreshData();
    },
    onShareAppMessage() {
      return {
        title: '',
        path: '/pages/index/index',
      };
    },
    methods: {
      // 图片加载失败
      handleArticleImageLoadFail(tab, index, imgIndex, type) {
        if (type == 1) {
          // 视频或者单张图片
          this.$set(this.list[tab].content[index].imgs, imgIndex, '/static/find/video-bg2x.png');

          //  this.list[tab].content[index].imgs[imgIndex] = "/static/find/video-bg2x.png"
        } else {
          // 多张图片
          this.$set(this.list[tab].content[index].imgs, imgIndex, '/static/find/video-bg2x.png');
          console.log('this.list[tab].content[index].imgs:', this.list[tab].content[index].imgs);
          //  this.list[tab].content[index].imgs[imgIndex] =  "/static/find/video-bg2x.png"
        }
      },
      /**
       * 第一次获取栏目分类 (1、在首次进入页面时执行)
       */
      queryColList() {
        let data = {};
        if (uni.getStorageSync('city')) {
          data = {
            cityCodg: this.city.code,
            cityName: this.city.name,
          };
        }
        this.list = [];
        api.queryColList({
          data,
          success: (res) => {
            // 小程序中没有视频栏目所以过滤掉 小视频，怀旧剧场  isRumorFlag=1 辟谣警示
            // if (res.length > 0) {
            //   res = res.filter((item, index) => {
            //     return item.columnFlag == '0'
            //   })
            // }
            this.list = res.map((item, index) => {
              return Object.assign(item, {
                pageNum: 1,
                pageSize: 20,
                randStr: null,
                content: [],
                topList: [],
                artiType: [],
              });
            });

            this.getColList(0);
            return;

            // 根据分类获取文章列表置顶
            this.list.map((item, index) => {
              if (item.colId.indexOf('cityCodg') > -1) {
                this.getTopList(item, index, 'city');
              } else {
                this.getTopList(item, index, 'item');
              }
            });

            // 根据分类和citycode获取文章(先执行一次刷新接口再执行一次分页接口)
            this.list.map((item, index) => {
              // 根据目标Id获取文章列表（分页接口）
              // this.selectArtiListByColId(item, index)
              // // 根据目标Id获取文章列表(刷新接口)
              // this.getCmsReflushList(item, index)
              //   .then((data) => {
              //     console.log('执行index：', index)
              //     // 根据目标Id获取文章列表（分页接口）
              //     this.selectArtiListByColId(item, index)
              //   })
              //   .catch((err) => {
              //     // 根据目标Id获取文章列表（分页接口）
              //     this.selectArtiListByColId(item, index)
              //   })
              // // }
            });
          },
        });
      },
      // 获取tab内容
      getColList(index) {
        const item = this.list[index];
        if (item.colId.indexOf('cityCodg') > -1) {
          this.getTopList(item, index, 'city');
        } else {
          this.getTopList(item, index, 'item');
        }
        this.selectArtiListByColId(item, index);
      },
      // 第一次根据目标Id获取文章置顶
      getTopList(item, index, type) {
        let data = {};
        if (type === 'city') {
          data = {
            cityCodg: this.city.code,
          };
        } else {
          data = {
            colId: item.colId,
          };
        }

        api.getTopList({
          data,
          success: (res) => {
            this.closeRefresh();
            console.log('res:', res);
            if (res) {
              this.list[index].topList = res;
              uni.setStorageSync('list', this.list);
            }

            //
          },
          fail: (err) => {
            console.log(err);
            this.closeRefresh();
          },
        });
      },
      // 第一次根据目标Id获取文章列表（分页接口）
      selectArtiListByColId(item, index) {
        const data = {
          colId: item.colId,
          cityCodg: this.city.code || null,
          pageNum: item.pageNum,
          pageSize: item.pageSize,
        };

        api.selectArtiListByColId({
          data,
          success: (res) => {
            this.closeRefresh();
            if (res.list) {
              res.list.map((element) => {
                element.play = false;
              });
              // res.list.map((items,indexs)=>{
              //    this.list[index].content.push(Object.assign(items,{play:false}))
              // })
              this.list[index].content = res.list;

              this.list[index].nomore = false;
            } else {
              this.list[index].nomore = true;
            }
            uni.setStorageSync('list', this.list);

            //
          },
          fail: (err) => {
            console.log(err);
            this.closeRefresh();
          },
        });
      },
      // 第一次根据分类和citycode获取文章(刷新接口)
      getCmsReflushList(item, index) {
        const data = {
          colId: item.colId,
          cityCodg: this.city.code || null,
          randStr: item.randStr || '',
        };
        return new Promise((reslove, reject) => {
          api.getCmsReflushList({
            data,
            success: (res) => {
              this.closeRefresh();
              if (res.artiDTOList) {
                res.artiDTOList.map((items, indexs) => {
                  this.list[index].content.push(Object.assign(items, { play: false }));
                });
                this.list[index].nomore = false;
              } else {
                this.list[index].nomore = true;
              }
              this.list[index].randStr = res.randStr;
              uni.setStorageSync('list', this.list);
              reslove();

              //
            },
            fail: (err) => {
              this.closeRefresh();
              console.log(err);
              reslove();
            },
          });
        });
      },
      // 根据分类和citycode获取文章(刷新接口)
      refreshData() {
        // if(!this.refreshOver) return
        // this.refreshOver = false
        // 获取当前tab下标
        const currentIndex = this.currentIndex;
        // 获取当前tab的页码
        this.list[currentIndex];
        const data = {
          colId: this.list[currentIndex].colId,
          cityCodg: this.city.code || null,
          randStr: this.list[currentIndex].randStr,
        };

        return new Promise((resolve, reject) => {
          api.getCmsReflushList({
            data,
            success: (res) => {
              this.closeRefresh();
              if (res.artiDTOList) {
                res.artiDTOList.map((item, index) => {
                  this.list[currentIndex].content.unshift(Object.assign(item, { play: false }));
                });

                this.list[currentIndex].nomore = false;
              } else {
                this.list[currentIndex].nomore = true;
              }
              this.list[currentIndex].randStr = res.randStr;
              uni.setStorageSync('list', this.list);
              this.refreshOver = true;

              //
              resolve();
            },
            fail: (err) => {
              this.closeRefresh();
              console.log(err);
              resolve();
              this.refreshOver = true;
            },
          });
        });
      },
      // 更改当前的tab
      swiperChange(index) {
        this.currentIndex = index;
        const pageNum = this.list[index].pageNum;
        const content = this.list[index].content;
        if (pageNum === 1 && content.length === 0) {
          this.getColList(index);
        }
      },
      // 上拉加载更多
      loadMore() {
        // 获取当前tab下标
        const currentIndex = this.currentIndex;
        // 获取当前tab的页码
        this.list[currentIndex];
        const data = {
          colId: this.list[currentIndex].colId,
          cityCodg: this.city.code || null,
          pageNum: this.list[currentIndex].pageNum + 1,
          pageSize: this.list[currentIndex].pageSize,
        };
        return new Promise((resolve, reject) => {
          api.selectArtiListByColId({
            data,
            success: (res) => {
              if (res.list) {
                if (res.list.length > 0) {
                  // console.log("this.list[index]:",this.list[index].content)
                  console.log('res.list:', res.list.length);
                  res.list.map((item, index) => {
                    this.list[currentIndex].content.push(Object.assign(item, { play: false }));
                    // console.log( this.list[currentIndex].content)
                  });
                  this.list[currentIndex].pageNum = this.list[currentIndex].pageNum + 1;
                  console.log('this.list[index].pageNum:', this.list[currentIndex].pageNum);
                }
                uni.setStorageSync('list', this.list);
                this.$refs.tabs.bottomTips = '';
              } else {
                this.$refs.tabs.bottomTips = 'nomore';
                this.list[currentIndex].nomore = true;
              }
              resolve();
              //
            },
            fail: (err) => {
              console.log(err);
              this.closeRefresh();
              resolve();
            },
          });
        });
      },
      // 判断是否可以关闭加载
      closeRefresh() {
        if (this.begin === this.list.length) {
          uni.stopPullDownRefresh();
        } else {
          this.begin++;
        }
      },
      /**
       * 搜索框点击事件
       */
      handleSearchBarClick() {
        // 关闭语音播报
        this.handleClose();
        uni.navigateTo({
          url: '/pages/find/search',
        });
      },
      /**
       * 语音输入图标点击事件
       */
      handleVoiceInputClick() {
        // 关闭语音播报
        this.handleClose();
        uni.navigateTo({
          url: '/pages/find/search?voice=1',
        });
      },
      /**
       * 文章详情
       */
      goDetail(e, tab, index) {
        // 关闭语音播报
        this.handleClose();
        // 阅读+1
        this.list[tab].content[index].clikCnt = this.list[tab].content[index].clikCnt + 1;
        console.log('阅读:');
        let imgs = '';
        if (this.list[tab].content[index].imgs) {
          imgs = JSON.stringify(this.list[tab].content[index].imgs);
        }
        uni.navigateTo({
          url: `/pages/find/article-detail?contId=` + e.currentTarget.dataset.id + '&imgs=' + imgs,
        });
      },
      /**
       * 视频详情
       */
      goVedio(e, tab, index) {
        // 关闭语音播报
        this.handleClose();
        // 阅读+1
        this.list[tab].content[index].clikCnt = this.list[tab].content[index].clikCnt + 1;

        const { colFlag, cont, contId, imgs, mediaUrl, ttl } = this.list[tab].content[index];
        const firstVideo = { colFlag, cont, contId, imgs, mediaUrl, ttl };
        uni.navigateTo({
          url: `/pages/find/video-list?firstVideo=${encodeURIComponent(
            JSON.stringify(firstVideo),
          )}`,
        });
      },
      /**
       * 小视频详情
       */
      goSmallVedio(e, tab, index) {
        // 关闭语音播报
        this.handleClose();
        // 阅读+1
        this.list[tab].content[index].clikCnt = this.list[tab].content[index].clikCnt + 1;
        const data = this.list[tab].content[index];
        uni.getNetworkType({
          success: (res) => {
            if (res.networkType != 'none') {
              uni.navigateTo({
                url:
                  '/pages/find/video-swiper?transInfor=' +
                  `${encodeURIComponent(JSON.stringify(data))}`,
              });
            } else {
              this.$uni.showToast('没有网络');
            }
          },
        });
      },
      /**
       * 点击听文章没图片模块事件
       */
      handleNoimg(index, tab) {
        this.showAudion = true;
        console.log('音频显示');
        // 当前播放的文章所在tab
        const oldtab = this.tabIndex;
        // 即将播放的文章tab下标
        const currentIndex = tab;
        // 缓存起来，其他页面可用
        uni.setStorageSync('tab', tab);

        // 获取当前播放文章下标
        // 记录当前播放所在tab，方便后面去掉播放样式
        this.tabIndex = tab;

        if (this.innerAudioContext) {
          // 销毁音频实例
          this.innerAudioContext.destroy();
        }
        // 获取当前播放的文章所在列表的下标
        const playindex = this.playindex;
        if (oldtab !== null) {
          // console.log("对应项目：",this.list[oldtab].content[playindex])
          this.list[oldtab].content[playindex].play = false;
        }
        // 创建音频播放实例

        this.innerAudioContext = uni.createInnerAudioContext();
        this.innerAudioContext.autoplay = true;

        // 设置播放背景图

        if (this.list[currentIndex].content[index].imgs) {
          this.videoBg = this.list[currentIndex].content[index].imgs[0];
        } else {
          this.videoBg = 'http://192.168.1.187:10088/static/find/process_bg2x.png';
        }
        // 创建背景音乐实例（拿到播放路径会自动播放
        // this.innerAudioContext =uni.getBackgroundAudioManager();
        // this.innerAudioContext.title = this.list[currentIndex].content[index].ttl  //
        // #ifdef MP-WEIXIN
        this.innerAudioContext.src = this.list[currentIndex].content[index].mediaUrl;
        // #endif
        // #ifdef MP-ALIPAY
        this.innerAudioContext.src =
          this.list[currentIndex].content[index].youkuUrl ||
          this.list[currentIndex].content[index].mediaUrl;
        // #endif

        // this.innerAudioContext.src = this.list[currentIndex].content[index].mediaUrl
        this.title = this.list[currentIndex].content[index].ttl;
        uni.setStorageSync('play', true); // (false.暂停或者停止播放;true.播放音频)
        this.innerAudioContext.onPlay(() => {});

        // 当前播放音频所在列表的index
        this.playindex = index;
        // 缓存起来，其他页面可用
        uni.setStorageSync('index', index);

        // 显示正则播放图标（||）
        this.stopPlay = true;
        // 当前播放的文章显示特殊样式
        this.list[currentIndex].content[index].play = true;

        console.log('创建音频播放实例:', this.innerAudioContext);
        // 监听播放事件
        this.innerAudioContext.onTimeUpdate(() => {
          // 音频播放进度更新事件
          console.log('音频播放进度更新事件' + index + '找出重复');
          this.$refs.yaudio.process =
            (this.innerAudioContext.currentTime / this.innerAudioContext.duration) * 100;
          // console.log('音频播放进度更新事件',(this.innerAudioContext.currentTime/this.innerAudioContext.duration)*100);
        });
        // 监听播放出错事件
        this.innerAudioContext.onError((res) => {
          console.log('播放出错', res.errMsg);
          console.log(res.errCode);
        });
        // 监听自然播放结束事件
        this.innerAudioContext.onEnded((res) => {
          console.log('监听自然播放结束事件');
          this.$refs.yaudio.process = 0;
          this.stopPlay = false;
          this.nextPlay();
          uni.setStorageSync('play', false);
        });
        // 监听暂停事件
        this.innerAudioContext.onPause((res) => {
          uni.setStorageSync('play', false);
          console.log('监听暂停事件');
        });
        // 监听音频停止事件
        this.innerAudioContext.onStop((res) => {
          uni.setStorageSync('play', false);
          console.log('监听音频停止事件');
        });
      },
      /**
       * 前一篇音频按钮事件
       * 第一个参数表示prePlay已经执行过一次，没有找到可播放文件，现在执行第二次
       * 第二个参数表示将要从触发循环，从最后一条开始播放
       */
      prePlay(times, loop) {
        if (!this.prefun) {
          return;
        }
        this.prefun = false;
        // 播放音频的下标
        const playindex = this.playindex;
        console.log('假想下标：', this.loopIndex);
        console.log('定时器：', this.timer);
        // 如果没有这个参数，则取当前播放音频的下标
        if (!times) {
          this.loopIndex = playindex;
        }

        // 当前播放音频所在tab
        const tabIndex = this.tabIndex;
        // 获取当前列表长度
        const length = this.list[tabIndex].content.length;

        // 触发循环，假象下标为列表长
        if (loop) {
          this.loopIndex = length;
        }
        // 如果当前假象播放对象下标>0
        if (this.loopIndex > 0) {
          // 是文章
          this.prefun = true;
          if (this.list[tabIndex].content[this.loopIndex - 1].artiType === '0') {
            this.handleNoimg(this.loopIndex - 1, tabIndex);
            console.log('执行1');
          } else {
            // 不是文章
            this.loopIndex = this.loopIndex - 1;
            this.prePlay(true);
            console.log('执行2');
          }
        } else {
          // 如果当前假象播放对象下标=0 请求新数据
          // uni.startPullDownRefresh()
          this.$refs.tabs.swiperIndex = this.tabIndex;
          this.currentIndex = this.tabIndex;
          // 执行下拉刷新
          this.refreshOver = false; // 当刷新结束后改为true
          uni.startPullDownRefresh();
          // 开启定时器监听是否刷新完毕
          this.timer = setInterval(() => {
            console.log('定时器一直执行');
            if (this.refreshOver) {
              clearInterval(this.timer);
              this.timer = null;

              // 重新获取列表长度
              const newlength = this.list[tabIndex].content.length;
              this.prefun = true;
              if (newlength > length) {
                this.loopIndex = newlength - length;
                this.playindex = this.playindex + (newlength - length);
                this.prePlay(true);
                console.log('执行3');
              } else {
                // 播放第一篇，无更多了
                // 进行循环
                this.prePlay(true, true);
                console.log('执行4');
              }
            }
          }, 500);
        }
      },
      /**
       * 切换音频播放按钮事件
       */
      handleSwitchPlay() {
        console.log('当前音频是否是暂停或者停止状态：', this.innerAudioContext.paused);
        if (this.innerAudioContext.paused) {
          this.innerAudioContext.play();
          this.stopPlay = true;
        } else {
          this.innerAudioContext.pause();
          this.stopPlay = false;
        }
      },
      /**
       * 后一篇音频按钮事件
       * 第一个参数表示prePlay已经执行过一次，没有找到可播放文件，现在执行第二次
       * 第二个参数表示将要从触发循环，从最后一条开始播放
       */
      nextPlay(times, loop) {
        console.log();
        if (!this.nextfun) {
          return;
        }

        this.nextfun = false;
        // 播放音频的下标
        const playindex = this.playindex;

        // 如果没有这个参数，则取当前播放音频的下标.本次为第一次执行
        if (!times) {
          this.loopIndex = playindex;
        }

        // 触发循环，假象下标为列表长
        if (loop) {
          this.loopIndex = -1;
        }

        // 当前播放音频所在tab
        const tabIndex = this.tabIndex;
        // 获取当前列表长度
        const length = this.list[tabIndex].content.length;

        // this.list[tabIndex].content[playindex].play = false
        if (this.loopIndex < length - 1) {
          this.nextfun = true;
          // console.log('length:',this.list[tabIndex].content)
          if (this.list[tabIndex].content[this.loopIndex + 1].artiType === '0') {
            this.handleNoimg(this.loopIndex + 1, tabIndex);
          } else {
            this.loopIndex = this.loopIndex + 1;
            this.nextPlay(true);
          }
        } else {
          this.$refs.tabs.swiperIndex = this.tabIndex;
          this.currentIndex = this.tabIndex;
          this.loadMore().then((res) => {
            // 重新获取列表长度
            this.nextfun = true;
            const newlength = this.list[tabIndex].content.length;
            if (newlength > length) {
              this.handleNoimg(this.loopIndex + 1, tabIndex);
            } else {
              // this.$uni.showToast({
              //   title: '已经是最后一篇文章了',
              //   duration: 2000
              // });
              this.nextPlay(true, true);
            }
          });
        }
      },
      /**
       * 点音频关闭按钮事件
       */
      handleClose() {
        if (!this.innerAudioContext) {
          return;
        }
        this.innerAudioContext.destroy();
        this.showAudion = false;

        // 当前播放的文章所在tab
        const oldtab = this.tabIndex;
        // 获取当前播放的文章所在列表的下标
        const playindex = this.playindex;
        if (oldtab !== null) {
          // 去掉当前播放样式
          this.list[oldtab].content[playindex].play = false;
        }

        this.closeAudio = true;
      },

      /**
       * 切换音频背景
       */
      triggleBg(data) {
        console.log('切换音频背景:', data);
        this.closeAudio = data;
      },
    },
    onShow() {
      if (uni.getStorageSync('play')) {
        // //创建背景音乐实例（拿到播放路径会自动播放
        // this.innerAudioContext =uni.getBackgroundAudioManager();
        // this.innerAudioContext.title = this.list[currentIndex].content[index].ttl  //
      }
    },
    destroyed() {
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy();
      }
    },
  };
</script>

<style lang="scss" scoped>
  .find {
    background-color: #fff;
  }
  .navigation-bar {
    width: 100%;
    height: 100%;
    background-color: #ff5d28;
    .image {
      @include size(48, 48);
      margin: 0 14rpx 0 30rpx;
    }
  }
  .search-view {
    width: calc(100vw - 64rpx);
    height: 112rpx;
    margin-top: 180rpx;
    .search-bar {
      height: 80rpx;
      border-radius: 40rpx;
      border: 2rpx solid $color-primary;
      box-sizing: border-box;
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
  .content {
    height: calc(100vh - 112rpx);
    width: 100%;
  }
  .audio {
    position: fixed;
    bottom: 200rpx;
    left: 32rpx;
    z-index: 2;
  }
  .bg-black {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.06);
  }
</style>
