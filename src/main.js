import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import './assets/style/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => { // axios拦截器为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // console.log(config);
  return config; // 这句必须 否则报错
})
Vue.prototype.$axios = axios; // 挂载到vue全局

Vue.filter('dateFormat', function (originVal) {  // 格式化时间的过滤器
  const dt = new Date(originVal),
    year = dt.getFullYear(),
    month = (dt.getMonth() + 1 + '').padStart(2, '0'), // padStart补齐字符串操作
    date = (dt.getDate() + '').padStart(2, '0'),
    hour = (dt.getDate() + '').padStart(2, '0'),
    minute = (dt.getMinutes() + '').padStart(2, '0'),
    second = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
})

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
