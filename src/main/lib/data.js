
const path = require('path')
const os = require('os')
const fs = require('fs')

class Data {
  constructor () {
    this.hostsPath = path.resolve(os.homedir(), 'ptHosts.json')
    this.hosts = {}
    this.init()
  }
  init () {
    try {
      let exists = fs.existsSync(this.hostsPath)
      if (exists) {
        let file = fs.readFileSync(this.hostsPath)
        this.hosts = JSON.parse(file.toString())
      } else {
        this.createFile(this.hostsPath, '{}')
      }
    } catch (e) {
      console.error(e)
    }
  }
  getHosts () {
    return this.hosts
  }
  setHosts (hosts) {
    this.hosts = hosts
  }
  createFile (filePath, fileData) {
    const wstream = fs.createWriteStream(filePath)
    wstream.on('open', () => {
      wstream.write(fileData)
      wstream.end()
    })
    wstream.on('error', (err) => { console.error(err) })
    wstream.on('finish', () => {})
  }
}

export default Data
