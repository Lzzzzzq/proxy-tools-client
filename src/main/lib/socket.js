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

    // 添加新的host
    socket.on('addHost', async (host) => {
      let cbName = 'addHostCb'
      try {
        let data = await api.addHost(host)
        socket.emit(cbName, data)
      } catch (e) {
        console.error(e)
        socket.emit(cbName, {
          state: 0,
          msg: '服务端错误'
        })
      }
    })

    /**
     * 修改某条host状态
     */
    socket.on('changeHostState', async ({id}) => {
      let cbName = 'changeHostStateCb'
      if (!id) {
        socket.emit(cbName, {
          state: 0,
          msg: '参数错误'
        })
      }
      try {
        let data = await api.changeHostState(id)
        socket.emit(cbName, data)
      } catch (e) {
        console.error(e)
        socket.emit(cbName, {
          state: 0,
          msg: '服务端错误'
        })
      }
    })

    /**
     * 删除某条host
     */
    socket.on('deleteHost', async ({id}) => {
      let cbName = 'deleteHostCb'
      if (!id) {
        socket.emit(cbName, {
          state: 0,
          msg: '参数错误'
        })
        return
      }
      try {
        let data = await api.deleteHost(id)
        socket.emit(cbName, data)
      } catch (e) {
        console.error(e)
        socket.emit(cbName, {
          state: 0,
          msg: '服务端错误'
        })
      }
    })

    // 编辑host
    socket.on('editHost', async (host) => {
      let cbName = 'editHostCb'
      if (!host.id) {
        socket.emit(cbName, {
          state: 0,
          msg: '参数错误'
        })
        return
      }
      try {
        let data = await api.editHost(host)
        socket.emit(cbName, data)
      } catch (e) {
        console.error(e)
        socket.emit(cbName, {
          state: 0,
          msg: '服务端错误'
        })
      }
    })
    console.log('new connect')
  })
}

export default init
