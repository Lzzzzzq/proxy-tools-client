import httpProxy from './request'
import httpsProxy from './connect'
import * as api from './api'
const http = require('http')
const socket = require('socket.io')

const init = (port) => {
  const app = http.createServer()
  const io = socket(app)
  io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket'])
  io.set('origins', '*:*')
  app.listen(port)

  app.on('request', httpProxy)
  app.on('connect', httpsProxy)

  io.on('connection', (socket) => {
    // 获取全部 hosts
    socket.on('getAllHosts', async () => {
      try {
        let hosts = await api.getAllHosts()
        socket.emit('allHosts', hosts)
      } catch (e) {
        console.error(e)
      }
    })
    console.log('new connect')
  })
}

export default init
