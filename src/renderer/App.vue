<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider
          :trigger="null"
          collapsible
          v-model="collapsed"
        >
          <div class="logo" />
          <a-menu theme="dark" mode="inline" :selectedKeys="[this.$route.path]">
            <a-menu-item v-for="(item, index) in nav" :key="item.path">
              <router-link :to="item.path">
                <a-icon :type="item.icon" />
                <span>{{item.name}}</span>
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="()=> collapsed = !collapsed"
            />
          </a-layout-header>
          <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', overflow: 'auto' }">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  name: 'proxy-tools-client',
  data () {
    return {
      collapsed: false,
      locale: zhCN,
      nav: [
        {
          name: '首页',
          icon: 'inbox',
          path: '/'
        }, {
          name: 'hosts管理',
          icon: 'inbox',
          path: '/hostsMgr'
        }
      ]
    }
  }
}
</script>

<style lang='less'>
/* CSS */
#app {
  height: 100%;
  display: flex;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}

@scrollBarWidth: 8px;

::-webkit-scrollbar-track-piece{
  width: @scrollBarWidth;
  background-color: rgba(0, 0, 0, 0.1);  
}

::-webkit-scrollbar{
  width: @scrollBarWidth;
  height: 6px; 
}

::-webkit-scrollbar-thumb{
  height: 50px;
  background-color: rgba(0, 0, 0, 0.15);  
  border-radius: @scrollBarWidth / 2;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover{
  background-color: rgba(0, 0, 0, 0.3); 
  cursor: pointer;
}


</style>
