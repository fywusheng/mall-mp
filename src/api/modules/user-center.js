import request from '@/api/request'
import { http } from '@/api/http'

// 用户信息新增or保存
export function saveMemberInfo(query) {
  return request({
    url: '/member/sh/memberInformation/saveMemberInfo',
    method: 'post',
    data: query
  })
}

// 发送短信
export function sendSms(query) {
  return http({
    url: '/api/sms/sendLoginSms',
    method: 'post',
    header: {
      'channel': 'msg'
    },
    data: query
  })
}

