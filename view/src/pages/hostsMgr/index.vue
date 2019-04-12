<template>
  <div class="hostsMgrWrap">
    <div class="hostsMgrOpeWrap">
      <a-button type="primary" style="margin-right: 20px;" @click="handleClickAdd">新增host</a-button>

      <a-modal
        title="新增host"
        :visible="addHostModal"
        :maskClosable="false"
        @cancel="handleCancelAdd"
      >
        <div class="hostsMgrInputWrap">
          <a-auto-complete placeholder="请输入地址" v-model="addAddress" style="width: 100%" :dataSource="addressFilter"/>
        </div>
        <div class="hostsMgrInputWrap">
          <a-auto-complete placeholder="请输入ip" v-model="addIp" style="width: 100%" :dataSource="ipFilter"/>
        </div>
        <div class="hostsMgrInputWrap">
          <a-select
            mode="tags"
            style="width: 100%"
            placeholder="请选择标签"
            v-model="addTags"
          >
            <a-select-option v-for="(item) in tagsMap" :key="item">{{item}}</a-select-option>
          </a-select>
        </div>
        <template slot="footer">
          <a-button key="back" @click="handleCancelAdd">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!addAddress || !addIp" @click="handleClickAddModalOk">
            添加
          </a-button>
        </template>
      </a-modal>

      <a-modal
        title="编辑host"
        :visible="editHostModal"
        :maskClosable="false"
        @cancel="handleCancelEdit"
      >
        <div class="hostsMgrInputWrap">
          <a-auto-complete placeholder="请输入地址" v-model="editAddress" style="width: 100%" :dataSource="addressFilter"/>
        </div>
        <div class="hostsMgrInputWrap">
          <a-auto-complete placeholder="请输入ip" v-model="editIp" style="width: 100%" :dataSource="ipFilter"/>
        </div>
        <div class="hostsMgrInputWrap">
          <a-select
            mode="tags"
            style="width: 100%"
            placeholder="请选择标签"
            v-model="editTags"
          >
            <a-select-option v-for="(item) in tagsMap" :key="item">{{item}}</a-select-option>
          </a-select>
        </div>
        <template slot="footer">
          <a-button key="back" @click="handleCancelEdit">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!editAddress || !editIp" @click="handleClickEditModalOk">
            保存
          </a-button>
        </template>
      </a-modal>

      <a-modal
        title="批量添加hosts"
        :visible="importHostsModal"
        :maskClosable="false"
        @cancel="handleCancelImport"
      >
        <a-alert message="相同的 host 将不会被导入" type="warning" showIcon />
        <a-textarea placeholder="请将hosts文件内容粘贴到此处" v-model="importHosts" :rows="8" style="margin-top: 20px"/>
        <template slot="footer">
          <a-button key="back" @click="handleCancelImport">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!importHosts"
          @click="handleClickImportModalOk">
            添加
          </a-button>
        </template>
      </a-modal>

      <a-button @click="handleClickImport">批量添加hosts</a-button>
    </div>
    <a-divider />

    <a-table :rowKey="(record, index) => index" :columns="columns" :dataSource="hostsArr">
      <span slot="active" slot-scope="active, item">
        <a-switch v-model="active" @change='handleChangeHostState(item)'/>
      </span>
      <!-- <span slot="title"></span> -->
      <span slot="tags" slot-scope="item">
        <a-tag
          color="#2db7f5"
          v-if="item && item.tags"
          v-for="(tagItem, index) in item.tags"
          :key="`${tagItem}${index}`"
        >
          {{tagItem}}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, item">
        <a-button style="margin-right: 20px;" @click="handleEditHost(item)">编辑</a-button>
        <a-button
          class="copyBtn"
          type="primary"
          style="margin-right: 20px;"
          @click="handleClickCopy(item)"
          :data-clipboard-text="`${item.ip} ${item.address}`"
        >
          复制到剪切板
        </a-button>
        <a-button type="danger" style="margin-right: 20px;" @click="handleDeleteHost(item.id)">删除</a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'

export default {
  name: 'HostMgr',
  data () {
    return {
      addHostModal: false,
      editHostModal: false,
      importHostsModal: false,

      // 添加 host modal 中输入框内容
      addAddress: '',
      addIp: '',
      addTags: [],

      // 编辑 host modal 中输入框内容
      editId: '',
      editAddress: '',
      editIp: '',
      editTags: [],

      // 批量引入 hosts modal 中输入框内容
      importHosts: '',

      // 所有hosts数据
      hosts: {}
    }
  },
  computed: {
    // hosts数组
    hostsArr: function () {
      let arr = []
      for (let item in this.hosts) {
        arr.push(Object.assign({}, {
          id: item,
          address: '',
          ip: '',
          tags: []
        }, this.hosts[item]))
      }
      return arr || []
    },

    // 地址过滤器
    addressFilter: function () {
      let address = []
      this.hostsArr.map(item => {
        address.push(item.address)
      })
      address = [...new Set(address)]
      address = address.map(item => ({
        text: item,
        value: item
      }))
      return address || []
    },

    // ip过滤器
    ipFilter: function () {
      let ip = []
      this.hostsArr.map(item => {
        ip.push(item.ip)
      })
      ip = [...new Set(ip)]
      ip = ip.map(item => ({
        text: item,
        value: item
      }))
      return ip || []
    },

    // 标签过滤器
    tagsFilter: function () {
      let tags = []
      this.hostsArr.map(item => {
        tags = tags.concat(item.tags || [])
      })
      tags = [...new Set(tags)]
      tags = tags.map(item => ({
        text: item,
        value: item
      }))
      return tags || []
    },

    // 标签
    tagsMap: function () {
      let tags = []
      this.hostsArr.map(item => {
        tags = tags.concat(item.tags || [])
      })
      return [...new Set(tags)] || []
    },

    // 表格信息
    columns: function () {
      const columns = [
        {
          key: 'active',
          dataIndex: 'active',
          title: '状态',
          scopedSlots: { customRender: 'active' }
        }, {
          key: 'address',
          dataIndex: 'address',
          title: '地址',
          filters: this.addressFilter,
          onFilter: (value, host) => host.address === value
        }, {
          key: 'ip',
          dataIndex: 'ip',
          title: 'ip',
          filters: this.ipFilter,
          onFilter: (value, host) => host.ip === value
        }, {
          key: 'tags',
          title: '标签',
          scopedSlots: { customRender: 'tags' },
          filters: this.tagsFilter,
          // filterMultiple: false,
          onFilter: (value, host) => {
            return host.tags && host.tags.indexOf(value) >= 0
          }
        }, {
          key: 'action',
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
      return columns
    }
  },
  mounted: function () {
    this.$socket.emit('getAllHosts')

    /**
     * 获取所有hosts
     */
    this.$socket.on('allHosts', (hosts) => {
      this.hosts = Object.freeze(hosts)
    })

    /**
     * 添加host回调
     */
    this.$socket.on('addHostCb', (data) => {
      if (data.state === 1) {
        this.hosts = data.hosts
        this.$message.success('添加成功')
      } else {
        this.$message.error(`添加失败：${data.msg || ''}`)
      }
    })

    /**
     * 修改host状态回调
     */
    this.$socket.on('changeHostStateCb', (data) => {
      if (data.state === 1) {
        this.hosts = data.hosts
        this.$message.success('状态修改成功')
      } else {
        this.$message.error(`状态修改失败：${data.msg || ''}`)
      }
    })

    /**
     * 删除了某条host
     */
    this.$socket.on('deleteHostCb', (data) => {
      if (data.state === 1) {
        this.hosts = data.hosts
        this.$message.success('删除成功')
      } else {
        this.$message.error(`删除失败：${data.msg || ''}`)
      }
    })

    /**
     * 编辑了某条host
     */
    this.$socket.on('editHostCb', (data) => {
      if (data.state === 1) {
        this.hosts = data.hosts
        this.$message.success('编辑成功')
      } else {
        this.$message.error(`编辑失败：${data.msg || ''}`)
      }
    })

    /**
     * 批量添加hosts
     */
    this.$socket.on('importHostsCb', (data) => {
      if (data.state === 1) {
        this.hosts = data.hosts
        this.$message.success('添加成功')
      } else {
        this.$message.error(`添加失败：${data.msg || ''}`)
      }
    })
  },
  methods: {
    /**
     * 点击添加 host，弹出 modal
     */
    handleClickAdd: function () {
      this.addHostModal = true
    },

    /**
     * 点击批量添加 hosts，弹出 modal
     */
    handleClickImport: function () {
      this.importHostsModal = true
    },

    /**
     * 点击了取消添加 host modal
     */
    handleCancelAdd: function () {
      this.addHostModal = false
    },

    /**
     * 点击了取消编辑 host modal
     */
    handleCancelEdit: function () {
      this.editHostModal = false
    },

    /**
     * 点击了取消批量添加 hosts modal
     */
    handleCancelImport: function () {
      this.importHostsModal = false
    },

    /**
     * 点击添加 host 弹出 modal 中的确认
     */
    handleClickAddModalOk: function () {
      let address = this.addAddress
      let ip = this.addIp
      let tags = this.addTags
      this.addHostModal = false
      this.addAddress = ''
      this.addIp = ''
      this.addTags = []
      this.$socket.emit('addHost', {
        address,
        ip,
        tags
      })
    },

    /**
     * 修改单条host状态
     */
    handleChangeHostState: function (item) {
      this.$socket.emit('changeHostState', {
        id: item.id
      })
    },

    /**
     * 删除某条host
     */
    handleDeleteHost: function (id) {
      this.$confirm({
        title: '提示',
        content: '确定要删除该条host吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.$socket.emit('deleteHost', {
            id: id
          })
        }
      })
    },

    /**
     * 点击复制
     */
    handleClickCopy: function (item) {
      // eslint-disable-next-line
      let clipboard = new ClipboardJS(`.copyBtn`)
      clipboard.on('success', (e) => {
        this.$message.success('已复制')
        e.clearSelection()
        clipboard.destroy()
      })
    },

    /**
     * 点击编辑
     */
    handleEditHost: function (item) {
      this.editId = item.id
      this.editAddress = item.address
      this.editIp = item.ip
      this.editTags = item.tags || []
      this.editHostModal = true
    },

    /**
     * 点击编辑host中的保存
     */
    handleClickEditModalOk: function () {
      this.editHostModal = false
      this.$socket.emit('editHost', {
        address: this.editAddress,
        ip: this.editIp,
        tags: this.editTags || [],
        id: this.editId
      })
    },

    /**
     * 点击批量导入中的添加
     */
    handleClickImportModalOk: function () {
      try {
        this.importHostsModal = false
        let cont = this.importHosts

        if (!cont) return

        this.importHosts = ''

        let ipReg = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/

        // 按行分割
        let data = cont.split(/[\n\r]/g)

        // 过滤掉空行
        data = data.filter(item => {
          return !!item && item.match(ipReg)
        })

        // 格式化每行为host对象
        data = data.map(item => {
          let ip = ''
          let address = item.replace(ipReg, function (word) {
            ip = word
            return ''
          }).replace(/[\s]/g, '')

          address = address.replace(/#/g, '')

          return {
            ip,
            address,
            active: false
          }
        })

        if (data && data.length > 0) {
          this.$socket.emit('importHosts', {
            hosts: data
          })
        }
      } catch (e) {
        console.error(e)
      }
    }

  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
