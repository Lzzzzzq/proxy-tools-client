const md5 = require('md5')
const data = require('./data')
const url = require('url')
const http = require('http')
const fs = require('fs')
const mime = require('mime')

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

  let agents = data.getFileAgent()
  let fileAgent = null

  for (let item in agents) {
    let compareUrl = agents[item].address.replace(/http:|https:/, '')
    if (cReq.url.match(compareUrl) && agents[item].active) {
      fileAgent = agents[item].agent
      console.log('file agent active')
    }
  }
  
  if (fileAgent) {
    let exists = fs.existsSync(fileAgent)
    if (exists) {
      let file = fs.readFileSync(fileAgent)
      cRes.writeHead(200, {"Content-Type": mime.getType(fileAgent)})
      cRes.write(file)
      cRes.end()
    } else {
      cRes.writeHead(404)
      cRes.end()
    }
  } else {
    let pReq = http.request(options, function (pRes) {
      cRes.writeHead(pRes.statusCode, pRes.headers)
      pRes.pipe(cRes)
    }).on('error', function (e) {
      cRes.end()
    })
  
    cReq.pipe(pReq)
  }

}

module.exports = request
