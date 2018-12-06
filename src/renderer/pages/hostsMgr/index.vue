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
          <a-auto-complete placeholder="请输入地址" v-model="addAddress" style="width: 100%"/>
        </div>
        <div class="hostsMgrInputWrap">
          <a-auto-complete placeholder="请输入ip" v-model="addIp" style="width: 100%"/>
        </div>
        <template slot="footer">
          <a-button key="back" @click="handleCancelAdd">取消</a-button>
          <a-button key="submit" type="primary" :disabled="!addAddress || !addIp" @click="handleClickAddModalOk">
            添加
          </a-button>
        </template>
      </a-modal>
      
      <a-button>批量添加hosts</a-button>
    </div>
    <a-divider />
    host mgr
  </div>
</template>

<script>
export default {
  name: 'HostMgr',
  data () {
    return {
      addHostModal: false,

      // 添加 host modal 中输入框内容
      addAddress: '',
      addIp: ''
    }
  },
  mounted: function () {
    this.$socket.emit('getAllHosts')
    this.$socket.on('allHosts', (hosts) => {
      console.log(hosts)
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
     * 点击了取消添加 host modal
     */
    handleCancelAdd: function () {
      this.addHostModal = false
    },

    /**
     * 点击添加 host 弹出 modal 中的确认
     */
    handleClickAddModalOk: function () {
      let address = this.addAddress
      let ip = this.addIp
      this.addHostModal = false
      this.addAddress = ''
      this.addIp = ''
      console.log('ok')
      console.log(address, ip)
    }

  }
}
</script>

<style lang='less'>
@import './index.less';
</style>
