const url = require('url')
const net = require('net')

const connect = (cReq, cSock) => {
  var u = url.parse('http://' + cReq.url)

  var pSock = net.connect(u.port, u.hostname, function () {
    cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n')
    pSock.pipe(cSock)
  }).on('error', function (e) {
    cSock.end()
  })

  cSock.pipe(pSock)
}

export default connect
