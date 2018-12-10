import Vue from 'vue'
import axios from 'axios'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App'
import router from './router'
import store from './store'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:4000', {transports: ['websocket', 'xhr-polling', 'jsonp-polling']})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Antd)

Vue.prototype.$socket = socket

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
