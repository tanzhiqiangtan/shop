import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式表
import './assets/global.css'
// 导入字体文件
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置axio拦截器，增加Authorization字段
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
