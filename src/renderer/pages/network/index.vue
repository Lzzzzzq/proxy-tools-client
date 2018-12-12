<template>
  <div class="networkWrap">
    <div class="networkFlexWrap">
      <div class="networkOpe">
        <a-button type="primary" @click="handleClickClean" style="margin-right: 15px">清空</a-button>
        <a-divider />
      </div>
      <div class="networkMain" ref="netWrap">
        <table>
          <thead>
            <tr>
              <td>protocol</td>
              <td>method</td>
              <td>hostname</td>
              <td>path</td>
              <td>ip</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in network" :key="item.hash">
              <td>{{item.protocol || ''}}</td>
              <td>{{item.method || ''}}</td>
              <td>
                <div class="networkSingleLine w200">
                  {{item.hostname || ''}}
                </div>
              </td>
              <td>
                <div class="networkSingleLine w300">
                  {{item.path || ''}}
                </div>
              </td>
              <td>
                <div class="networkSingleLine w200">
                  {{item.ip || ''}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Network',
  data () {
    return {
      network: [],
      hashList: {}
    }
  },
  watch: {
    network: {
      handler: function () {
        let $wrap = this.$refs.netWrap
        if ($wrap) {
          this.$nextTick(() => {
            $wrap.scrollTop = $wrap.scrollHeight
          })
        }
      },
      immediate: true
    }
  },
  mounted: function () {
    this.socketListener()
  },
  methods: {
    socketListener: function () {
      this.$socket.on('httpReq', ({req, hash}) => {
        // req.id = hash
        console.log(req)
        this.network.push({
          hash,
          protocol: 'http',
          method: req.method || 'get',
          hostname: req.fromHost || req.hostname || '',
          path: req.path || '',
          ip: req.fromHost ? req.hostname : '' || ''
        })
        // this.hashList[hash] = req
      })
      this.$socket.on('httpsReq', ({req, hash}) => {
        // req.id = hash
        console.log(req)
        this.network.push({
          hash,
          protocol: 'https',
          method: req.method || 'connect',
          hostname: req.fromHost || req.hostname || '',
          path: req.path || '',
          ip: req.fromHost ? req.hostname : '' || ''
        })
        // this.hashList[hash] = req
      })
    },

    /**
     * 点击了清空
     */
    handleClickClean: function () {
      this.network = []
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
