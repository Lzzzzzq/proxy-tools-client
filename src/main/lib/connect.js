import data from './data'
import md5 from 'md5'
const url = require('url')
const net = require('net')

const connect = (cReq, cSock) => {
  let u = url.parse('http://' + cReq.url)
  let hostname = u.hostname
  let hash = md5(Math.random())

  let hosts = data.getHosts()
  for (let item in hosts) {
    if (hosts[item].address === hostname && hosts[item].active) {
      u.fromHost = u.hostname
      u.hostname = hosts[item].ip
      console.log('https hosts change')
    }
  }

  global.event.emit('httpsReq', {
    req: u,
    hash
  })

  let pSock = net.connect(u.port, u.hostname, function () {
    cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n')
    pSock.pipe(cSock)
  }).on('error', function (e) {
    cSock.end()
  })

  cSock.pipe(pSock)
}

export default connect
