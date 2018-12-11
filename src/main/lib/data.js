
const path = require('path')
const os = require('os')
const fs = require('fs')

class Data {
  constructor () {
    this.hostsPath = path.resolve(os.homedir(), 'ptHosts.json')
    // this.hostsPath = path.resolve('C:/Users/viruser.v-desktop/Desktop', 'ptHosts.json')
    this.hosts = {}
    this.init()
  }

  /**
   * 初始化
   */
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

  /**
   * 获取全部hsots
   */
  getHosts () {
    return this.hosts
  }

  /**
   * 修改hsots
   * @param {Object} hosts 要修改的hosts
   */
  setHosts (hosts) {
    this.hosts = hosts
    fs.writeFileSync(this.hostsPath, JSON.stringify(hosts, null, 2))
  }

  /**
   * 创建文件
   * @param {String} filePath 文件路径
   * @param {String} fileData 文件内容
   */
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

const data = new Data()

export default data
