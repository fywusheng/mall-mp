// 老年痴呆评估调查问卷
<template>
  <view class="evaluation-questions">
    <view class="top-tip">
      <view class="icon-tip">
        <image
          class="tip"
          src="http://192.168.1.187:10088/static/common/icon-tip.png"
          mode="scaleToFill"
        />
      </view>

      <view class="txt">
        为保障结果真实有效，请家属采用一问一答的方式进行评估，由提问者进行填写并提交。
      </view>
    </view>
    <view class="subject">
      <view v-for="(subject, subIndex) in subject" class="subject-list" :key="subIndex">
        <view class="subject-title">
          <text class="red">*</text>
          <view class="cont">
            {{ subject.title }}
            <image v-if="subject.imgs" class="img" :src="subject.imgs" mode="scaleToFill" />
          </view>
        </view>
        <view class="subject-cont">
          <radio-group @change="radioChange($event, subIndex)">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="item in subject.cont"
              :key="item.value"
            >
              <view>
                <radio
                  class="radio"
                  color="#FF9500"
                  :value="item.score"
                  :checked="item.score === subject.score"
                />
              </view>
              <view>{{ item.label }}</view>
            </label>
          </radio-group>
        </view>
      </view>
    </view>
    <image class="submit-btn" :src="submitUrl" mode="scaleToFill" @click="submit" />
    <question-result ref="res" />
  </view>
</template>

<script>
  import QuestionResult from './components/question-result.vue';
  export default {
    name: 'eva-question',
    components: { QuestionResult },
    data() {
      return {
        subject: [
          {
            select: '1',
            score: null,
            title: '1.是否能正确说出自己现居住的家庭地址（包括省市区及街道名称）？',
            cont: [
              { label: '能够正确说出省、市、街道', value: '0', score: 3, select: false },
              { label: '有一项说不清楚', value: '1', score: 2, select: false },
              { label: '有两项说不清楚', value: '2', score: 1, select: false },
              { label: '不能正确说出', value: '3', score: 0, select: false },
            ],
          },
          {
            select: '1',
            score: null,
            title: '2.是否能正确说出今天的年月日？',
            cont: [
              { label: '正确说出年月日', value: '0', score: 3 },
              { label: '有一项错误或不知道', value: '1', score: 2 },
              { label: '有二项错误或不知道', value: '2', score: 1 },
              { label: '不能正确说出', value: '3', score: 0 },
            ],
          },
          {
            select: '1',
            title: '3.是否能够正确说出星期几？',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '4.是否能够正确说出现在的季节?',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '5.是否能够正确说出自己所处的楼层?',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '6.能否正确回答自己的年龄及出生日期?',
            cont: [
              { label: '能够正确回答年龄及出生日期', value: '0', score: 2 },
              { label: '能够正确回答其中1项', value: '1', score: 1 },
              { label: '两项回答均错误', value: '2', score: 0 },
            ],
          },
          {
            select: '1',
            title: '7.说三个不同类型的词语（如皮球、国旗、树木），老人是否能够准确复述?',
            cont: [
              { label: '能够复述3个', value: '0', score: 3 },
              { label: '能够复述2个', value: '1', score: 2 },
              { label: '能够复述1个', value: '2', score: 1 },
              { label: '不能复述', value: '3', score: 0 },
            ],
          },
          {
            select: '1',
            title:
              '8.将100连续减7，共减5次，每减1个7，能否说出正确答案？（只能进行心算，期间不能进行明显的提示）?',
            cont: [
              { label: '回答正确5个', value: '0', score: 5 },
              { label: '回答正确4个', value: '1', score: 4 },
              { label: '回答正确3个', value: '2', score: 3 },
              { label: '回答正确2个', value: '3', score: 2 },
              { label: '回答正确1个', value: '4', score: 1 },
              { label: '回答正确0个', value: '5', score: 0 },
            ],
          },
          {
            select: '1',
            title: '9.上面第7题中提到的三个词语，老人是否还能够正确回忆并说出?',
            cont: [
              { label: '回答正确3个', value: '0', score: 3 },
              { label: '回答正确2个', value: '1', score: 2 },
              { label: '回答正确1个', value: '2', score: 1 },
              { label: '完全忘记', value: '3', score: 0 },
            ],
          },
          {
            select: '1',
            title:
              '10.取出身边两个物品（如手表、铅笔、手机等）让老人辨认，老人是否能正确辨认并说出?',
            cont: [
              { label: '正确辨认并说出2个', value: '0', score: 2 },
              { label: '正确辨认并说出1个', value: '1', score: 1 },
              { label: '无法正确辨认', value: '2', score: 0 },
            ],
          },
          {
            select: '1',
            title: '11.老人是否能分清左右手左右腿?',
            cont: [
              { label: '正确分清', value: '0', score: 2 },
              { label: '有一项错误', value: '1', score: 1 },
              { label: '分不清', value: '2', score: 0 },
            ],
          },
          {
            select: '1',
            title:
              '12.做张纸条，上面写上“闭上你的眼睛”，老人是否能正确认读，并按照字面意思做出相应闭眼的动作?',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '13.让老人写一句完善的话，该段话是否表达了完整的意思?',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '14.说出“四十四只石狮子”并让老人重复，老人是否能够准确复述?',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
          {
            select: '1',
            title: '15.画图测试，是否能够准确画出两个五边形，其中交叉部分为四边形。如下图?',
            imgs: 'http://192.168.1.187:10088/static/rights/icon-question.png',
            cont: [
              { label: '是', value: '0', score: 1 },
              { label: '否', value: '1', score: 0 },
            ],
          },
        ],
        scoreList: new Array(15).fill(''),
        submitUrl: 'http://192.168.1.187:10088/static/rights/icon-submit.png',
      };
    },
    onLoad() {},
    methods: {
      radioChange(e, index) {
        this.$set(this.scoreList, index, e.detail.value);
      },
      submit() {
        this.scoreList.forEach((score) => {
          if (score === '') {
            this.$uni.showToast({
              title: '请选择完整再提交！',
              duration: 2000,
            });
            throw Error('填写完整');
          }
        });
        const score = this.scoreList.reduce((pre, next) => {
          return parseInt(pre) + parseInt(next);
        });
        this.$refs.res.open(score);
        uni.setNavigationBarTitle({
          title: '问卷结果',
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .evaluation-questions {
    background: #f5f5f5;
    padding-bottom: 178rpx;
    .top-tip {
      width: 750rpx;
      height: 132rpx;
      background: #fffbe8;
      display: -webkit-inline-box;
      align-items: center;
      padding: 16rpx 24rpx;
      font-size: 32rpx;
      color: #333333;
      box-sizing: border-box;
      .txt {
        width: 650rpx;
      }
      .icon-tip {
        width: 36rpx;
        height: 36rpx;
        margin-right: 18rpx;
        .tip {
          width: 100%;
          height: 100%;
        }
      }
    }
    .subject {
      .subject-list {
        padding: 32rpx;
        background: #ffffff;
        font-size: 36rpx;
        .subject-title {
          display: flex;
          flex-direction: row;
          // align-items: center;
          font-weight: 500;
          .red {
            color: #eb3030;
            padding-right: 8rpx;
          }
          .cont {
            .img {
              width: 330rpx;
              height: 206rpx;
            }
          }
        }
      }
      .subject-cont {
        margin-top: 16rpx;
        .uni-list-cell {
          display: flex;
          align-items: center;
          width: 686rpx;
          height: 120rpx;
          border: 2rpx solid #eeeeee;
          .radio {
            margin: 0 32rpx;
          }
        }
      }
    }
    .submit-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 178rpx;
    }
  }
</style>
