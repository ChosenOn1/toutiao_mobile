// 请求模块

import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 请求发起时会经过这里
    // config：本次请求时请求配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 这里务必要返回config配置对象，否则请求就停在这里了
    return config
  },
  function (error) {
    // Do something with request error  请求出错时会经过这里
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
