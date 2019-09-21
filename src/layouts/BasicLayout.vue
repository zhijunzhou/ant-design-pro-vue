<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :spinning="spinning"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
      @menuSelect="menuSelect"
    ></side-menu>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="multiTab"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>

</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
// import { asyncRouterMap } from '@/config/router.config.js'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data () {
    return {
      production: config.production,
      collapsed: false,
      spinning: false,
      isDir: false,
      isEmpty: false,
      selectedKey: undefined,
      menus: [],
      nodes: []
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '300px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.spinning = true
    this.RetrieveMenus().then(response => {
      this.spinning = false
      if (response && response.result.code === 'success') {
        const tree = this.getTree(response.result.data.subnodes, [])
        // this.configMenus = tree
        this.menus = tree
        this.nodes = response.result.data.subnodes
      }
    })
    // this.menus = asyncRouterMap.find((item) => item.path === '/').children
    // this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar', 'RetrieveMenus', 'UpdateFinalData']),
    getTree (tree, i, reducer) {
      if (Array.isArray(tree)) {
        return tree.map((item, index) => {
          if (index !== i) {
            reducer = []
          }
          return {
            path: this.getPath(item, reducer),
            name: `workspace${item.level}${item.code}`,
            component: () => import('@/views/dashboard/Workplace'),
            meta: this.getMeta(item),
            children: this.getChildren(item, index, reducer)
          }
        })
      }
    },
    getPath (item, reducer) {
      return `${item.level}-${item.parentcode}-${item.code}`
    },
    getChildren (item, index, reducer) {
      if (item.level === 4) {
        return undefined
      }
      if (item.subnodes && item.subnodes.length > 0) {
        if (item.subnodes.filter(it => it.displaytype !== '6').length) {
          reducer.push(item.code)
          return this.getTree(item.subnodes, index, reducer)
        }
      }
      return undefined
    },
    getMeta (item) {
      if (item.level === 1) {
        return {
          title: item.title,
          keepAlive: true,
          hiddenHeaderContent: true,
          hidden: item.displaytype === '6',
          icon: 'profile'
        }
      }
      return {
        title: item.title,
        keepAlive: true,
        hidden: item.displaytype === '6',
        hiddenHeaderContent: true
      }
    },
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '300px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect (params) {
      if (!this.isDesktop()) {
        this.collapsed = false
      } else {
        if (params) {
          if (params.key) {
            // 选中的是菜单
            this.isDir = false
            this.isEmpty = false
          } else if (params.selectedKeys.length > 0) {
            // 选中的是目录
            this.isDir = true
            this.isEmpty = false
          } else {
            // 选中的是空目录
            this.isDir = true
            this.isEmpty = true
          }
        }
        if (!this.isEmpty) {
          if (!this.isDir) {
            this.findData(params.key)
          } else {
            this.findData(params.selectedKeys.slice(-1)[0])
          }
        }
        // console.log(params)
      }
    },
    findData (key) {
      const arr = key.split('-')
      const code = arr[2]
      this.getNode(code.split('.'))
    },
    getNode (arr) {
      let i = 0
      let item = null
      let nodes = this.nodes
      while (i < arr.length) {
        item = nodes[+arr[i] - 1]
        nodes = item.subnodes
        i++
      }
      // console.log('data: ', item.data)
      this.UpdateFinalData(item)
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
