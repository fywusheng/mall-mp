import request from '@/api/request'

// 用户信息新增or保存
export function saveMemberInfo(query) {
  return request({
    url: '/member/sh/memberInformation/saveMemberInfo',
    method: 'post',
    data: query
  })
}

