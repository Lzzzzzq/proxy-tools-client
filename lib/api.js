const data = require('./data')
const md5 = require('md5')

// let data = new Data()

// 获取全部hosts
const getAllHosts = () => {
  return new Promise((resolve, reject) => {
    resolve(data.getHosts())
  })
}

// 获取全部fileAgent
const getAllFileAgent = () => {
  return new Promise((resolve, reject) => {
    resolve(data.getFileAgent())
  })
}

/**
 * 添加host
 * @param {Object} host 要添加的host的信息
 */
const addHost = (host) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      let hasSame = false
      for (let item in hosts) {
        if (hosts[item].address === host.address && hosts[item].ip === host.ip) {
          hasSame = true
          resolve({
            state: 0,
            msg: '已添加过该host'
          })
          break
        }
      }
      if (!hasSame) {
        hosts[md5(Date.parse(new Date()))] = {
          ...host,
          active: false
        }
        data.setHosts(hosts)
        resolve({
          state: 1,
          hosts: hosts
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 添加fileAgent
 * @param {Object} agent 要添加的文件代理的信息
 */
const addFileAgent = (agent) => {
  return new Promise((resolve, reject) => {
    try {
      let agents = data.getFileAgent()
      let hasSame = false
      for (let item in agents) {
        if (agents[item].address === agent.address && agents[item].agent === agent.agent) {
          hasSame = true
          resolve({
            state: 0,
            msg: '已添加过该代理'
          })
          break
        }
      }
      if (!hasSame) {
        agents[md5(Date.parse(new Date()))] = {
          ...agent,
          active: false
        }
        data.setFileAgent(agents)
        resolve({
          state: 1,
          agents: agents
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 修改单条host的状态
 * @param {String} id 要修改状态的host的id
 */
const changeHostState = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      if (hosts[id]) {
        hosts[id].active = !hosts[id].active
        if (hosts[id].active) {
          for (let item in hosts) {
            if (item !== id && hosts[item].address === hosts[id].address && hosts[item].active) {
              hosts[item].active = false
            }
          }
        }
        data.setHosts(hosts)
        resolve({
          state: 1,
          hosts
        })
      } else {
        resolve({
          state: 0,
          msg: '该host不存在'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 修改单条文件袋里的状态
 * @param {String} id 要修改状态的文件袋里的id
 */
const changeFileAgentState = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let agents = data.getFileAgent()
      if (agents[id]) {
        agents[id].active = !agents[id].active
        if (agents[id].active) {
          for (let item in agents) {
            if (item !== id && agents[item].address === agents[id].address && agents[item].active) {
              agents[item].active = false
            }
          }
        }
        data.setFileAgent(agents)
        resolve({
          state: 1,
          agents
        })
      } else {
        resolve({
          state: 0,
          msg: '该文件代理不存在'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 删除某条host
 * @param {String} id 要删除的host的id
 */
const deleteHost = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      if (hosts[id]) {
        delete hosts[id]
        data.setHosts(hosts)
        resolve({
          state: 1,
          hosts
        })
      } else {
        resolve({
          state: 0,
          msg: '该host不存在'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 删除某条文件代理
 * @param {String} id 要删除的文件代理的id
 */
const deleteFileAgent = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let agents = data.getFileAgent()
      if (agents[id]) {
        delete agents[id]
        data.setFileAgent(agents)
        resolve({
          state: 1,
          agents
        })
      } else {
        resolve({
          state: 0,
          msg: '该文件代理不存在'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 编辑host
 * @param {Object} host 要编辑的host的信息
 */
const editHost = (host) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      if (!hosts[host.id]) {
        resolve({
          state: 0,
          msg: '该host不存在'
        })
      } else {
        if (
          hosts[host.id].address === host.address && 
          hosts[host.id].weight === host.weight && 
          hosts[host.id].ip === host.ip && 
          JSON.stringify(hosts[host.id].tags || []) === JSON.stringify(host.tags || [])
        ) {
          resolve({
            state: 0,
            msg: '无修改'
          })
        } else {
          hosts[host.id].address = host.address
          hosts[host.id].ip = host.ip
          hosts[host.id].tags = host.tags || []
          hosts[host.id].weight = parseInt(host.weight || 1)
          data.setHosts(hosts)
          resolve({
            state: 1,
            hosts: hosts
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 编辑文件代理
 * @param {Object} agent 要编辑的agent的信息
 */
const editFileAgent = (agent) => {
  return new Promise((resolve, reject) => {
    try {
      let agents = data.getFileAgent()
      if (!agents[agent.id]) {
        resolve({
          state: 0,
          msg: '该文件代理不存在'
        })
      } else {
        if (agents[agent.id].address === agent.address && agents[agent.id].agent === agent.agent) {
          resolve({
            state: 0,
            msg: '无修改'
          })
        } else {
          agents[agent.id].address = agent.address
          agents[agent.id].agent = agent.agent
          data.setFileAgent(agents)
          resolve({
            state: 1,
            agents: agents
          })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 批量添加hosts
 * @param {Array} importHosts 批量引入的 hosts
 */
const importHost = (importHosts) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      let agiHosts = []
      let insertIndex = []
      for (let item in hosts) {
        agiHosts.push(hosts[item].address + hosts[item].ip)
      }
      importHosts.map((item, index) => {
        if (agiHosts.indexOf(item.address + item.ip) < 0) {
          insertIndex.push(index)
        }
      })
      insertIndex.map((item, index) => {
        hosts[md5(Date.parse(new Date()) + index)] = {
          ...importHosts[item],
          active: false
        }
      })
      data.setHosts(hosts)
      resolve({
        state: 1,
        hosts: hosts
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getAllHosts,
  getAllFileAgent,
  addHost,
  addFileAgent,
  changeHostState,
  changeFileAgentState,
  deleteHost,
  deleteFileAgent,
  editHost,
  editFileAgent,
  importHost
}