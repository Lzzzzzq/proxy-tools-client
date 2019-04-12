<template>
  <div class="agentsMgrWrap">
    <div class="agentsMgrOpeWrap">
      <a-button type="primary" style="margin-right: 20px;" @click="handleClickAdd">新增文件代理</a-button>

      <a-modal
        title="新增文件代理"
        :visible="addOpeModal"
        :maskClosable="false"
        @cancel="handleCancelAdd"
      >
        <div class="agentsMgrInputWrap">
          <a-auto-complete placeholder="请输入地址" v-model="addAddress" style="width: 100%"/>
        </div>
        <div class="agentsMgrInputWrap">
          <a-auto-complete placeholder="请选择要代理的文件" v-model="addAgent" style="flex: 1"/>
        </div>
        <template slot="footer">
          <a-button key="back" @click="handleCancelAdd">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!addAddress || !addAgent" @click="handleClickAddModalOk">
            添加
          </a-button>
        </template>
      </a-modal>

      <a-modal
        title="编辑文件代理"
        :visible="editOpeModal"
        :maskClosable="false"
        @cancel="handleCancelEdit"
      >
        <div class="agentsMgrInputWrap">
          <a-auto-complete placeholder="请输入地址" v-model="editAddress" style="width: 100%"/>
        </div>
        <div class="agentsMgrInputWrap">
          <a-auto-complete placeholder="请选择要代理的文件" v-model="editAgent" style="flex: 1"/>
        </div>
        <template slot="footer">
          <a-button key="back" @click="handleCancelEdit">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!editAddress || !editAgent" @click="handleClickEditModalOk">
            保存
          </a-button>
        </template>
      </a-modal>
    </div>
    <a-divider />

    <a-table :columns="columns" :dataSource="agentsArr">
      <span slot="active" slot-scope="active, item">
        <a-switch v-model="active" @change='handleChangeState(item)'/>
      </span>
      <span slot="address" slot-scope="address, item">
        <div class="maxLengthWrap">
          {{item.address}}
        </div>
        <div class="agentIcon">
          <a-icon type="arrow-down" />
        </div>
        <div class="maxLengthWrap">
          {{item.agent}}
        </div>
      </span>
      <!-- <span slot="agent" slot-scope="agent, item">
        <div class="maxLengthWrap">
          {{agent}}
        </div>
      </span> -->
      <span slot="action" slot-scope="text, item">
        <a-button style="margin-right: 20px;" @click="handleEditFileAgent(item)">编辑</a-button>
        <a-button type="danger" style="margin-right: 20px;" @click="handleDeleteFileAgent(item.id)">删除</a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'FileAgentMgr',
  data () {
    return {
      addOpeModal: false,
      editOpeModal: false,

      // 添加 agent modal 中输入框内容
      addAddress: '',
      addAgent: '',

      // 编辑 agent modal 中输入框内容
      editId: '',
      editAddress: '',
      editAgent: '',

      // 所有agents数据
      agents: {}
    }
  },
  computed: {
    // agents数组
    agentsArr: function () {
      let arr = []
      for (let item in this.agents) {
        arr.push(Object.assign({}, {
          id: item,
          address: '',
          agent: ''
        }, this.agents[item]))
      }
      return arr || []
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
          scopedSlots: { customRender: 'address' }
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
    this.$notification.info({
      message: '提示',
      description: '文件代理功能暂时仅支持http',
      duration: 5
    })

    this.$socket.emit('getAllFileAgent')

    this.$socket.on('allFileAgent', (agents) => {
      this.agents = Object.freeze(agents)
    })

    /**
     * 添加文件代理回调
     */
    this.$socket.on('addFileAgentCb', (data) => {
      if (data.state === 1) {
        this.agents = data.agents
        this.$message.success('添加成功')
      } else {
        this.$message.error(`添加失败：${data.msg || ''}`)
      }
    })

    /**
     * 修改文件代理状态回调
     */
    this.$socket.on('changeFileAgentStateCb', (data) => {
      if (data.state === 1) {
        this.agents = data.agents
        this.$message.success('状态修改成功')
      } else {
        this.$message.error(`状态修改失败：${data.msg || ''}`)
      }
    })

    /**
     * 删除了某条文件代理
     */
    this.$socket.on('deleteFileAgentCb', (data) => {
      if (data.state === 1) {
        this.agents = data.agents
        this.$message.success('删除成功')
      } else {
        this.$message.error(`删除失败：${data.msg || ''}`)
      }
    })

    /**
     * 编辑了某条
     */
    this.$socket.on('editFileAgentCb', (data) => {
      if (data.state === 1) {
        this.agents = data.agents
        this.$message.success('编辑成功')
      } else {
        this.$message.error(`编辑失败：${data.msg || ''}`)
      }
    })
  },
  methods: {
    /**
     * 点击添加，弹出 modal
     */
    handleClickAdd: function () {
      this.addOpeModal = true
    },

    /**
     * 点击了取消添加 modal
     */
    handleCancelAdd: function () {
      this.addOpeModal = false
      this.addAddress = ''
      this.addAgent = ''
    },

    /**
     * 点击了取消编辑 modal
     */
    handleCancelEdit: function () {
      this.editOpeModal = false
      this.editAddress = ''
      this.editAgent = ''
    },

    /**
     * 点击添加 fileAgent 弹出 modal 中的确认
     */
    handleClickAddModalOk: function () {
      let address = this.addAddress
      let agent = this.addAgent
      this.addOpeModal = false
      this.addAddress = ''
      this.addAgent = ''
      this.$socket.emit('addFileAgent', {
        address,
        agent
      })
    },

    /**
     * 修改单条状态
     */
    handleChangeState: function (item) {
      this.$socket.emit('changeFileAgentState', {
        id: item.id
      })
    },

    /**
     * 删除某条
     */
    handleDeleteFileAgent: function (id) {
      this.$confirm({
        title: '提示',
        content: '确定要删除该条文件代理吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.$socket.emit('deleteFileAgent', {
            id: id
          })
        }
      })
    },

    /**
     * 点击编辑
     */
    handleEditFileAgent: function (item) {
      this.editId = item.id
      this.editAddress = item.address
      this.editAgent = item.agent
      this.editOpeModal = true
    },

    /**
     * 点击编辑中的保存
     */
    handleClickEditModalOk: function () {
      this.editOpeModal = false
      this.$socket.emit('editFileAgent', {
        address: this.editAddress,
        agent: this.editAgent,
        id: this.editId
      })
    }

  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
