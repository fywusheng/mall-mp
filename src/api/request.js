import { showLoading, hideLoading, showToast } from '@/utils/uni'

export function request({
  url,
  method = 'post',
  header = {},
  data = {},
  showsLoading = false,
  common = false
}) {
  if (!url) return
  // 显示 loading
  if (showsLoading) showLoading('加载中')

  const headers = {
    'channel': uni.getSystemInfoSync().host.env,
    'Accept': 'application/json',
    'accessToken': uni.getStorageSync('token'),
    'tsf-metadata': ''
  }

  const body = {
    appId: '19E179E5DC29C05E65B90CDE57A1C7E5',
    version: '1.0.0',
    encType: 'plain',
    transType: 'get.authcode.data',
    encData: 'sd',
    signType: 'plain',
    signData: 'sdfasfdasf',
    timestamp: 201802231423897,
    extra: {},
    data
  }

  const baseURL = ENV.BASE_API
  const request = {
    url: url.indexOf('http') === -1 ? baseURL + url : url,
    method: method,
    header: { ...headers, ...header },
    data: method === 'get' ? data : body
  }

  return new Promise((resolve, reject) => {
    uni.request({
      ...request,
      success: (response) => {
        // 隐藏 loading
        if (showsLoading) hideLoading()

        // 处理请求结果
        if ([60001, 60002, 60003, 600016].includes(response.data.code)) {
          Store.dispatch('logout')
          uni.navigateTo({
            url: '/pages/user-center/login'
          })
          resolve(response.data)
          return
        }

        if (response.statusCode === 200) {
          if (common) {
            // 这里通过第三方接口是没有data层的数据需要返回上一层的数据
            const result = response.data
            resolve(result)
          } else {
            const result = response.data
            if (result.code === 0) {
              resolve(result.data)
            } else {
              reject(result)
            }
          }
        } else {
          reject({ message: response.statusCode })
          showToast('服务繁忙，请稍后再试')
        }
      },
      fail: (error) => {
        //  隐藏 loading
        if (showsLoading) hideLoading()
        reject(error)
      }
    })
  })
}
