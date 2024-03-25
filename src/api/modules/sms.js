import {request} from '@/api/http'

// 发送短信
export function sendSMSCode (args = {}) {
  request({
    url: '/api/sms/sendLoginSms',
    header: {
      'channel':'msg'
    },
    ...args
  })
}




