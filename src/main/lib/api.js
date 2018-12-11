import Data from './data'
import md5 from 'md5'

let data = new Data()

// 获取全部hosts
export const getAllHosts = () => {
  return new Promise((resolve, reject) => {
    resolve(data.getHosts())
  })
}

/**
 * 添加host
 * @param {Object} host 要添加的host的信息
 */
export const addHost = (host) => {
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
 * 修改单条host的状态
 * @param {String} id 要修改状态的host的id
 */
export const changeHostState = (id) => {
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
 * 删除某条host
 * @param {String} id 要删除的host的id
 */
export const deleteHost = (id) => {
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
 * 编辑host
 * @param {Object} host 要编辑的host的信息
 */
export const editHost = (host) => {
  return new Promise((resolve, reject) => {
    try {
      let hosts = data.getHosts()
      if (!hosts[host.id]) {
        resolve({
          state: 0,
          msg: '该host不存在'
        })
      } else {
        if (hosts[host.id].address === host.address && hosts[host.id].ip === host.ip && JSON.stringify(hosts[host.id].tags || []) === JSON.stringify(host.tags || [])) {
          resolve({
            state: 0,
            msg: '无修改'
          })
        } else {
          hosts[host.id].address = host.address
          hosts[host.id].ip = host.ip
          hosts[host.id].tags = host.tags || []
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
