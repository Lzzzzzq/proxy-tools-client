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
        <RecycleScroller
          ref="virList"
          class="virList"
          :items="filterRes"
          :item-size="itemSize"
          key-field="hash"
          @scroll.native="handleScroll"
          @visible="handleVisible"
          @hidden="handleHidden"
        >
          <template v-slot="{ item }">
            <div class="networkListItem" :class="item.ip ? 'networkItemActive' : ''">
              <div class="singleLine" style="flex: 0 0 100px">{{item.protocol}}</div>
              <div class="singleLine" style="flex: 0 0 100px">{{item.method}}</div>
              <div class="singleLine" style="flex: 1">{{item.hostname}}</div>
              <div class="singleLine" style="flex: 1" :title="item.path">{{item.path}}</div>
              <div class="singleLine tc" style="flex: 0 0 150px">{{item.ip}}</div>
            </div>
          </template>
        </RecycleScroller>
      </div>
    </div>
  </div>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  name: 'Network',
  components: {
    RecycleScroller
  },
  data () {
    return {
      network: [],
      hashList: {},
      filterUrl: '',
      settingDrawer: false,
      httpsCollect: false,
      keepBottom: true,
      itemSize: 40,
      leave: true
    }
  },
  mounted: function () {
    this.socketListener()
  },
  computed: {
    filterRes: function () {
      const { filterUrl, network } = this
      if (!filterUrl) return network
      const lowerCaseSearch = filterUrl.toLowerCase()
      return network.filter(i => i.hostname.toLowerCase().includes(lowerCaseSearch) || i.path.toLowerCase().includes(lowerCaseSearch))
    }
  },
  updated: function () {
    let $wrap = document.getElementsByClassName('virList')[0]
    if ($wrap && this.keepBottom) {
      window.requestAnimationFrame(() => {
        this.$refs.virList.scrollToItem(this.network.length)
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
    handleScroll: function (e) {
      const offset = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
      if (offset > 0) {
        this.keepBottom = false
      } else {
        this.keepBottom = true
      }
    },

    /**
     * 追加到network列表
     */
    networkPush: function (data) {
      if (this.leave) return
      if (!data.hostname.match(this.filterUrl) && !data.path.match(this.filterUrl)) return
      this.network.push(Object.freeze(data))
    },

    /**
     * 列表显示
     */
    handleVisible: function () {
      this.leave = false
      this.keepBottom = true
      this.$refs.virList.scrollToItem(this.network.length)
    },

    /**
     * 列表隐藏
     */
    handleHidden: function () {
      this.leave = true
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
.virList {
  height: 100%;
}
</style>
