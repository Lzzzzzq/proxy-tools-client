import Vue from 'vue'
import axios from 'axios'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App'
import router from './router'
import io from 'socket.io-client'

(async () => {
  let data = {}

  try {
    // eslint-disable-next-line
    data = await env()
  } catch (e) {
    console.log(e)
  }

  if (!data) data = {}

  // const socket = io.connect(`http://localhost:${data.socketPort}`, {transports: ['websocket', 'xhr-polling', 'jsonp-polling']})
  const socket = io.connect(`http://localhost:3000`, {transports: ['websocket', 'xhr-polling', 'jsonp-polling']})

  Vue.http = Vue.prototype.$http = axios
  Vue.config.productionTip = false

  Vue.use(Antd)

  Vue.prototype.$socket = socket

  /* eslint-disable no-new */
  new Vue({
    components: { App },
    router,
    template: '<App/>'
  }).$mount('#app')
})()
