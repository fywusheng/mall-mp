import { request } from '@/api/request.js'

// 旅行下单支付
export function putHotelOrder(query) {
  return request({
    url: '/offlineshopping/order/saveOrUpdate',
    method: 'post',
    data: query
  })
}

