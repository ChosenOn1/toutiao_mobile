import request from '@/utils/request'
// import store from '@/store'

export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意给接口需要授权才能访问
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户的频道
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
