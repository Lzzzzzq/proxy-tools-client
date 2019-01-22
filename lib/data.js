
const path = require('path')
const os = require('os')
const fs = require('fs')

class Data {
  constructor () {
    this.hostsPath = path.resolve(os.homedir(), 'ptHosts.json')
    this.fileAgentPath = path.resolve(os.homedir(), 'ptFileAgent.json')
    // this.hostsPath = path.resolve('C:/Users/viruser.v-desktop/Desktop', 'ptHosts.json')
    this.hosts = {}
    this.init()
  }

  /**
   * 初始化
   */
  init () {
    try {
      /**
       * 获取hosts文件内容
       */
      let hostsExists = fs.existsSync(this.hostsPath)
      if (hostsExists) {
        let file = fs.readFileSync(this.hostsPath)
        this.hosts = JSON.parse(file.toString())
      } else {
        this.createFile(this.hostsPath, '{}')
      }

      /**
       * 获取fileAgent内容
       */
      let fileAgentExists = fs.existsSync(this.fileAgentPath)
      if (fileAgentExists) {
        let file = fs.readFileSync(this.fileAgentPath)
        this.fileAgent = JSON.parse(file.toString())
      } else {
        this.createFile(this.fileAgentPath, '{}')
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 获取全部hosts
   */
  getHosts () {
    return this.hosts
  }

  /**
   * 修改hosts
   * @param {Object} hosts 要修改的hosts
   */
  setHosts (hosts) {
    this.hosts = hosts
    fs.writeFileSync(this.hostsPath, JSON.stringify(hosts, null, 2))
  }

  /**
   * 获取全部fileAgent
   */
  getFileAgent () {
    return this.fileAgent
  }

  /**
   * 修改fileAgent
   */
  setFileAgent (fileAgent) {
    this.fileAgent = fileAgent
    fs.writeFileSync(this.fileAgentPath, JSON.stringify(fileAgent, null, 2))
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

module.exports = data
