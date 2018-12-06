import Data from './data'

let data = new Data()

// 获取全部hosts
export const getAllHosts = () => {
  return new Promise((resolve, reject) => {
    resolve(data.getHosts())
  })
}
