import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式
import './styles/index.less'
// 导入字体图标
import './styles/icon.less'

// 导入vant核心组件库
import Vant from 'vant'
// 加载Vant全局样式
import 'vant/lib/index.css'

// 加载动态设置REM基准值
import 'amfe-flexible'

import './utils/dayjs'

// 注册Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
