export default {
  // 版本号
  VERSION: '1.4.7',
  // 环境常量
  NODE_ENV: process.env.NODE_ENV,
  NODE_ENV_DEVELOPMENT: process.env.NODE_ENV === 'development',
  NODE_ENV_PRODUCTION: process.env.NODE_ENV === 'production',

  // 运营位url
  CMS: {
    development: 'http://192.168.1.187:7002',
    test: 'https://cms.iot101.com',
    production: 'https://cms.iot101.com'
  }[process.env.NODE_ENV],
  // 商品搜索url
  SEARCH: {
    development: '/search/productList',
    test: '/search/productList',
    production: 'http://192.168.1.187:18888/search/productList'
  }[process.env.NODE_ENV],
  // 商城基础url
  API: {
    development: 'https://mall.hling168.com/mall-client-api',
    // development: 'http://192.168.1.187:18888',
    test: 'http://192.168.1.187:18888',
    production: 'https://mall.hling168.com/mall-client-api'
  }[process.env.NODE_ENV],
  // 国家老龄服务平台基础url
  BASE_API: {
    development: 'https://api.hpgjzlinfo.com/nepsp-api',
    // development: 'http://192.168.1.187:10000/api',
    test: 'http://192.168.1.187:10000/api',
    production: 'https://api.hpgjzlinfo.com/nepsp-api'
  }[process.env.NODE_ENV],
  // 米粒商城url
  MILI_URL: {
    development: 'https://laoling.milixf.com',
    test: 'https://laoling.milixf.com',
    production: 'https://laoling.milixf.com'
  }[process.env.NODE_ENV],
  // 收银台地址
  H5: {
    development: 'https://ggll.hpgjzlinfo.com', // 线上
    // development: 'https://api.hpgjzlinfo.com',
    test: 'https://api.hpgjzlinfo.com',
    production: 'https://ggll.hpgjzlinfo.com'
  }[process.env.NODE_ENV],

  // WAP
  PC: {
    development: 'http://39.101.162.232/pc',
    test: 'http://39.101.162.232/pc',
    production: '//39.101.162.232/pc'
  }[process.env.NODE_ENV],
  // 静态域
  ASSETS: {
    development: 'http://39.101.162.232/',
    test: 'http://39.101.162.232/',
    production: '//39.101.162.232/'
  }[process.env.NODE_ENV],
  SEARCH_BASE: {
    development: 'http://192.168.1.187:18888',
    test: 'http://192.168.1.187:18888',
    production: 'http://192.168.1.187:18888'
  }[process.env.NODE_ENV],
  SEARCH_PLAN: {
    development: 'http://192.168.1.187:18888/search/productList',
    test: 'http://192.168.1.187:18888/plan/search/productList',
    production: 'http://192.168.1.187:18888/search/productList'
  }[process.env.NODE_ENV],
  // 默认图片
  IMG_DEFAULT: 'https://ggllstatic.hpgjzlinfo.com/static/home/image-home-article-default.png'
}
