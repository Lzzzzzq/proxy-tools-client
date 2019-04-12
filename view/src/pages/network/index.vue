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
      <div class="networkListTitle" style="display: flex">
        <div class="networkListTitleItem" style="flex: 0 0 100px">协议</div>
        <div class="networkListTitleItem" style="flex: 0 0 100px">方法</div>
        <div class="networkListTitleItem" style="flex: 1">域名</div>
        <div class="networkListTitleItem" style="flex: 1">路径</div>
        <div class="networkListTitleItem" style="flex: 0 0 150px">ip</div>
      </div>
      <div class="networkMain" ref="netWrap">
        <VirtualList
          :size="itemSize"
          :remain="remain"
          style="width: 100%"
          :debounce="20"
          :onscroll="handleScroll"
          ref="virList"
          :tobottom="handleToBottom"
          class="virList"
        >
          <div class="networkListItem" :class="item.ip ? 'networkItemActive' : ''" v-for="(item, index) in network" :key="index">
            <div class="singleLine" style="flex: 0 0 100px">{{item.protocol}}</div>
            <div class="singleLine" style="flex: 0 0 100px">{{item.method}}</div>
            <div class="singleLine" style="flex: 1">{{item.hostname}}</div>
            <div class="singleLine" style="flex: 1" :title="item.path">{{item.path}}</div>
            <div class="singleLine tc" style="flex: 0 0 150px">{{item.ip}}</div>
          </div>
        </VirtualList>
      </div>
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'Network',
  components: {
    VirtualList
  },
  data () {
    return {
      network: [],
      hashList: {},
      filterUrl: '',
      settingDrawer: false,
      httpsCollect: false,
      keepBottom: true,
      remain: 0,
      itemSize: 40
    }
  },
  watch: {
    network: {
      handler: function () {
      },
      immediate: true
    }
  },
  mounted: function () {
    this.socketListener()
    this.getContentHeight()
  },
  updated: function () {
    let $wrap = document.getElementsByClassName('virList')[0]
    if ($wrap && this.keepBottom) {
      window.requestAnimationFrame(() => {
        $wrap.scrollTop = $wrap.scrollHeight
      })
    }
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
      if (this.keepBottom) {
        this.keepBottom = false
      }
    },

    handleToBottom: function () {
      this.keepBottom = true
    },

    /**
     * 追加到network列表
     */
    networkPush: function (data) {
      if (!data.hostname.match(this.filterUrl) && !data.path.match(this.filterUrl)) return
      window.requestAnimationFrame(() => {
        this.network.push(Object.freeze(data))
      })
    },

    /**
     * 获取正文高度
     */
    getContentHeight: function () {
      setTimeout(() => {
        this.remain = this.$refs.netWrap.clientHeight / this.itemSize
      }, 500)
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
