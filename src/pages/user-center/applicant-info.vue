<template>
  <view class="applicant-info">
    <view class="form m-32">
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">姓名(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          placeholder="请输入真实姓名"
          :adjust-position="false"
          placeholder-class="placeholder"
          v-model.trim="params.name"
          :disabled="userInfo.crtfStas"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">身份证号(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          type="idcard"
          :adjust-position="false"
          placeholder="请输入正确的身份证号"
          placeholder-class="placeholder"
          v-model.trim="params.idCard"
          :disabled="userInfo.crtfStas"
        />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">性别(必填)</text>
        <radio-group @change="handleSexChange" class="flex-h flex-c-s flex-1">
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="0" :checked="params.sex == 0" />
            <text>男</text>
          </label>
          <label class="flex-h flex-c-s radio mr-64">
            <radio color="#ff5000" value="1" :checked="params.sex == 1" />
            <text>女</text>
          </label>
        </radio-group>
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">年龄(必填)</text>
        <input
          class="fs-40 c-black flex-1"
          type="idcard"
          :adjust-position="false"
          placeholder="请输入年龄"
          placeholder-class="placeholder"
          v-model="params.age"
        />
        <text class="row__label fs-40 c-black">周岁</text>
      </view>
      <view class="row flex-h flex-c-s p-20-0 store-code">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">门店编号(必填)</text>
        <view>
          <input
            class="fs-40 c-black flex-1"
            type="idcard"
            :adjust-position="false"
            placeholder="请输入所属门店编号"
            placeholder-class="placeholder"
            v-model="params.storeNo"
            @blur="handleStoreNoChange(false, $event)"
          />
          <view v-if="!params.districtArea" class="no-code">没有门店编号？</view>
          <view v-if="!params.districtArea" class="here" @click="handleStoreNoChange(true)">请点击这里</view>
        </view>
      </view>

      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator"></text>
        <text class="row__label fs-40 c-black mr-48">门店地址</text>

        <view class="right">
          <text class="city fs-40 c-black flex-1">
            {{ params.districtArea }}
          </text>
          <!-- <image
            class="row__accessory"
            mode="scaleToFill"
            src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png"
          /> -->
        </view>
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator"></text>
        <input disabled v-model="params.address" class="fs-40 c-black flex-1" placeholder-class="placeholder" />
      </view>
      <view class="row flex-h flex-c-s p-20-0">
        <text class="row__indicator">*</text>
        <text class="row__label fs-40 c-black mr-48">疾病情况(多选)</text>
        <view class="right" @click="open">
          <text class="city fs-40 c-black flex-1 c-lightgrey" v-if="showDisease.length === 0">请选择疾病情况</text>
          <text class="city fs-40 c-black flex-1" v-else>
            {{ showDisease.join(',') }}
          </text>
          <image class="row__accessory" mode="scaleToFill" src="http://192.168.1.187:10088/static/common/icon-common-arrow-rightward-grey.png" />
        </view>
      </view>
    </view>
    <button class="next-step-button bg-primary fs-44 c-white" @click="handleNextStepClick">
      {{ userInfo.crtfStas ? '修改' : '保存' }}
    </button>
    <!-- 疾病选择弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="disease">
        <view class="header">
          <text class="title">疾病情况选择</text>
          <image @click="closePop" class="icon-close" mode="scaleToFill" src="http://192.168.1.187:10088/static/images/item-detail/close.png" />
        </view>
        <view class="cont">
          <view
            v-for="item in diseaseList"
            :key="item.value"
            class="label"
            :class="{ active: selectDisease.includes(item.name) }"
            @click="selectDis(item)"
          >
            {{ item.name }}
          </view>
        </view>
        <view class="btn" @click="confirm">确定</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import dayjs from 'dayjs';
  import api from '@/apis/index.js';
  import { UniPopup } from '@dcloudio/uni-ui';
  import { validateIDCardNumber } from '@/utils/validation.js';
  import { mapState } from 'vuex';
  export default {
    components: { UniPopup },
    data() {
      return {
        showDisease: [],
        selectDisease: [],
        soure: '',
        diseaseList: [
          { name: '慢性腰腿痛', value: 0 },
          { name: '颈肩疼痛', value: 1 },
          { name: '高血压病', value: 2 },
          { name: '冠心病', value: 3 },
          { name: '动脉硬化', value: 4 },
          { name: '糖尿病', value: 5 },
          { name: '脑出血康复期', value: 6 },
          { name: '脑梗塞康复期', value: 7 },
          { name: '骨质疏松症', value: 8 },
          { name: '骨折康复期', value: 9 },
          { name: '眼底病（黄斑病变）', value: 10 },
          { name: '青光眼', value: 11 },
          { name: '肺炎', value: 12 },
          { name: '慢性阻塞性肺疾病', value: 13 },
          { name: '慢性胃炎', value: 14 },
          { name: '前列腺肥大', value: 15 },
          { name: '前列腺炎', value: 16 },
          { name: '盆腔炎', value: 17 },
          { name: '肿瘤', value: 18 },
          { name: '其他', value: 19 },
        ],
        // 表单数据
        params: {
          name: '', // 姓名
          idCard: '', // 身份证号
          sex: '0', // 性别
          age: '', // 年龄
          storeNo: '', // 门店编号
          districtArea: '', // 省市
          address: '', // 门店地址
          disease: '', // 疾病情况
          memberId: '', // 所属会员id
        },
        // 总部门店
        superStore: null,
      };
    },
    async onLoad(e) {
      if (e && e.soure) this.soure = e.soure;
      await this.$store.dispatch('getUserInfo');
      this.fillParams(this.params);
      this.getSuperStore();
    },
    onUnload() {
      // uni.$off('faceRecognitionFinished');
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
        sessionId: (state) => state.user.sessionId,
      }),
      // 页面操作  true 新增， false修改
      add() {
        if (this.userInfo && this.userInfo.memberId !== '' && this.userInfo.memberId !== ' ') {
          return false;
        } else {
          return true;
        }
      },
    },
    methods: {
      confirm() {
        this.showDisease = JSON.parse(JSON.stringify(this.selectDisease));
        this.closePop();
      },
      open() {
        this.$refs.popup.open('bottom');
      },
      closePop() {
        this.$refs.popup.close();
      },

      selectDis(item) {
        if (this.selectDisease.includes(item.name)) return;
        this.selectDisease.push(item.name);
      },
      fillParams(data) {
        for (const key in data) {
          this.params[key] = this.userInfo[key];
        }
        if (this.userInfo.disease !== '') {
          this.showDisease = this.userInfo.disease.split(',');
          this.selectDisease = this.userInfo.disease.split(',');
          this.params.disease = this.userInfo.disease.split(',');
        }
      },
      handleSexChange(e) {
        this.params.sex = e.target.value;
      },
      // 获取其他门店信息
      async handleStoreNoChange(manStore, e) {
        let params = {};
        if (manStore || e.target.value === this.superStore.storeNo) {
          this.params.storeNo = this.superStore.storeNo;
          this.params.address = this.superStore.address;
          this.params.districtArea = this.superStore.districtAreaStr;
          uni.setStorageSync('storeInfo', this.superStore);
        } else {
          params = { queryObject: { storeNo: e.target.value } };
          const result = await Axios.post('/srm/sh/stores/listByPageNo', params);
          if (result.code == 200 && result.data.list.length) {
            this.params.storeNo = result.data.list[0].storeNo;
            this.params.address = result.data.list[0].address;
            this.params.districtArea = result.data.list[0].districtAreaStr;
            uni.setStorageSync('storeInfo', result.data.list[0]);
          } else {
            this.$uni.showToast('输入有误，请重新输入');
            this.params.storeNo = '';
            this.params.address = '';
            this.params.districtArea = '';
          }
        }
      },
      // 获取总部门店信息
      async getSuperStore() {
        // const params = { queryObject: { storeType: 2 } };
        const params = {};
        const result = await Axios.post('/srm/sh/stores/listByPageNo', params);
        if (result.code == 200 && result.data.list.length) {
          this.superStore = result.data.list[0];
        }
      },
      // 保存
      async handleNextStepClick() {
        if (!this.chackInput()) return;
        const params = { ...this.params };
        params.disease = this.showDisease.join(',');
        if (!this.add) {
          params.id = this.userInfo.id;
        }

        try {
          await this.validRealName({
            userName: params.name,
            idCard: params.idCard,
          });
          const result = await Axios.post('/member/sh/memberInformation/saveMemberInfo', params);
          if (result.code == 200) {
            this.$uni.showToast('保存成功');
            this.$store.dispatch('getUserInfo');
            if (this.soure !== 'mine') {
              uni.navigateTo({ url: '/pages/user-center/register-userInfo-result' });
            } else {
              uni.navigateBack();
            }
          } else {
            this.$uni.showToast(result.msg || result.data);
          }
        } catch (error) {
          this.$uni.showToast('实名认证失败,请重新输入');
        }
      },
      // 输入信息校验
      chackInput() {
        if (!this.params.name) {
          this.$uni.showToast('请输入姓名');
          return false;
        }
        if (!this.params.idCard) {
          this.$uni.showToast('请输入身份证号');
          return false;
        }
        if (!validateIDCardNumber(this.params.idCard)) {
          this.$uni.showToast('身份证号格式错误，请重新输入');
          return false;
        }
        // if (!this.params.sex) {
        //   this.$uni.showToast('请选择性别');
        //   return false;
        // }
        if (!this.params.age) {
          this.$uni.showToast('请输入年龄');
          return false;
        }
        if (!this.params.storeNo) {
          this.$uni.showToast('请输入所属门店编号');
          return false;
        }
        if (!this.showDisease.length) {
          this.$uni.showToast('请选择疾病情况');
          return false;
        }

        return true;
      },
      // 进行实名认证
      validRealName(data) {
        return new Promise((resolve, reject) => {
          api.realPersonAuthenticate({
            data,
            showsLoading: true,
            success: (res) => {
              resolve(res);
            },
            fail: (error) => {
              reject(error);
            },
          });
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .applicant-info {
    //#ifdef MP-ALIPAY
    .clickChose {
      width: 70%;
    }
    //#endif
    .selectValue {
      width: 400rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 40rpx;
      text-align: center;
    }
    .form {
      .row {
        min-height: 120rpx;
        border-bottom: 2rpx solid $color-line;
        box-sizing: border-box;
        &.store-code {
          align-items: flex-start;
          .row__indicator {
            margin-top: 24rpx;
          }
          .no-code {
            height: 54rpx;
            font-size: 40rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #ff9500;
            line-height: 54rpx;
          }
          .here {
            width: 200rpx;
            height: 54rpx;
            font-size: 40rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #0059ff;
            line-height: 54rpx;
          }
        }
        &__indicator {
          width: 24rpx;
          min-height: 24rpx;
          text-align: center;
          color: #eb3030;
        }
        &__label {
          width: 200rpx;
        }
        &__accessory {
          @include square(48);
        }
        .city {
          @include text-line(2);
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
        }
      }
    }
    .next-step-button {
      margin: 128rpx 32rpx;
      height: 108rpx;
      line-height: 108rpx;
      border-radius: 54rpx;
      box-sizing: border-box;
    }
    .disease {
      width: 750rpx;
      height: 658rpx;
      background: #ffffff;
      border-radius: 24rpx 24rpx 0rpx 0rpx;
      padding: 60rpx 52rpx;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          height: 56rpx;
          font-size: 40rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 56rpx;
        }
        .icon-close {
          width: 36rpx;
          height: 36rpx;
        }
      }
      .cont {
        margin: 60rpx 0;
        display: grid;
        grid-template-columns: 144rpx 144rpx 144rpx 144rpx;
        grid-template-rows: 64rpx 64rpx 64rpx;
        row-gap: 24rpx;
        column-gap: 24rpx;
        .label {
          background: #f5f5f5;
          border-radius: 8rpx;
          font-size: 28rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            background: rgba(255, 85, 0, 0.07);
            border: 2rpx solid #ff5500;
            color: #ff5500;
          }
        }
      }
      .btn {
        width: 600rpx;
        height: 108rpx;
        margin: 0 auto;
        color: #ffffff;
        font-size: 44rpx;
        font-weight: 500;
        background: linear-gradient(136deg, #ff8800 0%, #ff5500 100%);
        border-radius: 54rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
