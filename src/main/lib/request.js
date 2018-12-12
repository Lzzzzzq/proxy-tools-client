import data from './data'
import md5 from 'md5'
const url = require('url')
const http = require('http')

const request = (cReq, cRes) => {
  let u = url.parse(cReq.url)
  let hash = md5(Math.random())

  let options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: cReq.method,
    headers: cReq.headers
  }

  let hosts = data.getHosts()
  for (let item in hosts) {
    if (hosts[item].address === options.hostname && hosts[item].active) {
      options.fromHost = options.hostname
      options.hostname = hosts[item].ip
      console.log('http hosts change')
    }
  }

  global.event.emit('httpReq', {
    req: options,
    hash
  })

  let pReq = http.request(options, function (pRes) {
    cRes.writeHead(pRes.statusCode, pRes.headers)
    pRes.pipe(cRes)
  }).on('error', function (e) {
    cRes.end()
  })

  cReq.pipe(pReq)
}

export default request
