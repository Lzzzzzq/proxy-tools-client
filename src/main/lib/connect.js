import data from './data'
const url = require('url')
const net = require('net')

const connect = (cReq, cSock) => {
  let u = url.parse('http://' + cReq.url)
  let hostname = u.hostname

  let hosts = data.getHosts()
  for (let item in hosts) {
    if (hosts[item].address === hostname && hosts[item].active) {
      hostname = hosts[item].ip
      console.log('https hosts change')
    }
  }

  let pSock = net.connect(u.port, hostname, function () {
    cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n')
    pSock.pipe(cSock)
  }).on('error', function (e) {
    cSock.end()
  })

  cSock.pipe(pSock)
}

export default connect
