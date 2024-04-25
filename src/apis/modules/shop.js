import { request } from '@/apis/request'

export default {
  // 分享商品增加积分
  addPointByShare: function (args = {}) {
    request({
      url: '/cin/itgl/user/addPoint',
      ...args
    })
  }

}
