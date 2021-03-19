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
// 导入树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 注册富文本编辑器
Vue.use(VueQuillEditor)
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置axio拦截器，增加Authorization字段
axios.interceptors.request.use(config => {
  // 开启进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
// 关闭进去条
axios.interceptors.response.use(config => {
  // 开启进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 注册全局组件
Vue.component('tree-table', TreeTable)
// 设置时间过滤器
Vue.filter('dateFormat', function (number) {
  const dt = new Date(number)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
