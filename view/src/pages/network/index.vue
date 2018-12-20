<template>
  <div class="networkWrap">
    <a-drawer
      title="更多设置"
      placement="right"
      :closable="false"
      @close="settingDrawer = false"
      :visible="settingDrawer"
    >
      <p>
        <a-button type="primary" @click="handleClickClean" style="margin-right: 15px">清空全部</a-button>
      </p>
      <p>
        <a-switch style="margin-right: 10px" v-model="httpsCollect" checkedChildren="Https" unCheckedChildren="Https"></a-switch>
      </p>
    </a-drawer>
    <div class="networkFlexWrap">
      <div class="networkOpe">
        <a-input placeholder="url过滤" v-model="filterUrl">
          <div slot="addonAfter" style="cursor: pointer" @click="settingDrawer = true">
            <a-icon type="setting" style="margin-right: 6px"/>更多设置
          </div>
        </a-input>
        <a-divider />
      </div>
      <div class="networkMain" ref="netWrap" @scroll="handleScroll">
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
            <tr class="trEnter" v-for="(item) in network" :key="item.hash" v-if="item.hostname.match(filterUrl) || item.path.match(filterUrl)">
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
      hashList: {},
      filterUrl: '',
      settingDrawer: false,
      httpsCollect: true,
      keepBottom: true
    }
  },
  watch: {
    network: {
      handler: function () {
        let $wrap = this.$refs.netWrap
        if ($wrap && this.keepBottom) {
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
        window.requestAnimationFrame(() => {
          this.networkPush({
            hash,
            protocol: 'http',
            method: req.method || 'get',
            hostname: req.fromHost || req.hostname || '',
            path: req.path || '',
            ip: req.fromHost ? req.hostname : '' || ''
          })
        })
        // this.hashList[hash] = req
      })
      this.$socket.on('httpsReq', ({req, hash}) => {
        // req.id = hash
        if (!this.httpsCollect) return
        window.requestAnimationFrame(() => {
          this.networkPush({
            hash,
            protocol: 'https',
            method: req.method || 'CONNECT',
            hostname: req.fromHost || req.hostname || '',
            path: req.path || '',
            ip: req.fromHost ? req.hostname : '' || ''
          })
        })
        // this.hashList[hash] = req
      })
    },

    /**
     * 点击了清空
     */
    handleClickClean: function () {
      this.network = []
    },

    /**
     * 表格内滚动滑轮
     */
    handleScroll: function () {
      let $wrap = this.$refs.netWrap
      if ($wrap) {
        if ($wrap.scrollHeight === ($wrap.scrollTop + $wrap.clientHeight)) {
          this.keepBottom = true
        } else {
          this.keepBottom = false
        }
      }
    },

    /**
     * 追加到network列表
     */
    networkPush: function (data) {
      if (this.network.length > 100) {
        this.network.splice(0, 50)
      }
      this.network.push(Object.freeze(data))
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
