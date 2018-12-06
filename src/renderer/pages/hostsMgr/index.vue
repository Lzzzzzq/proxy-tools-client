<template>
  <div class="hostsMgrWrap">
    <div class="hostsMgrOpeWrap">
      <a-button type="primary" style="margin-right: 20px;">新增host</a-button>
      <a-button>批量添加hosts</a-button>
    </div>
    <a-divider />
    host mgr
  </div>
</template>

<script>
export default {
  name: 'HostMgr',
  mounted: function () {
    this.$socket.emit('getAllHosts')
    this.$socket.on('allHosts', (hosts) => {
      console.log(hosts)
    })
  }
}
</script>

<style>

</style>
