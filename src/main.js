import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import './assets/style/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => { // axios拦截器为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // console.log(config);
  return config; // 这句必须 否则报错
})
Vue.prototype.$axios = axios; // 挂载到vue全局

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
