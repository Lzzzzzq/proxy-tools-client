import data from './data'
const url = require('url')
const http = require('http')

const request = (cReq, cRes) => {
  var u = url.parse(cReq.url)

  var options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: cReq.method,
    headers: cReq.headers
  }

  let hosts = data.getHosts()
  for (let item in hosts) {
    if (hosts[item].address === options.hostname && hosts[item].active) {
      options.hostname = hosts[item].ip
      console.log('http hosts change')
    }
  }

  var pReq = http.request(options, function (pRes) {
    cRes.writeHead(pRes.statusCode, pRes.headers)
    pRes.pipe(cRes)
  }).on('error', function (e) {
    cRes.end()
  })

  cReq.pipe(pReq)
}

export default request
