<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="300px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <s-menu
      :collapsed="collapsed"
      :menu="configMenus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"></s-menu>
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      configMenus: []
    }
  },
  created () {
    this.RetrieveMenus().then(response => {
      console.log(response)
      if (response && response.result.code === 'success') {
        const tree = this.getTree(response.result.data.subnodes)
        this.configMenus = tree
      }
    })
  },
  methods: {
    ...mapActions(['RetrieveMenus']),
    getTree (tree) {
      if (Array.isArray(tree)) {
        return tree.map(item => {
          return {
            path: this.getPath(item),
            name: `workspace${item.level}${item.code}`,
            component: () => import('@/views/dashboard/Workplace'),
            meta: this.getMeta(item),
            children: this.getChildren(item)
          }
        })
      }
    },
    getPath (item) {
      const code = item.code.replace(/\./g, '')
      return `s${item.level}-l${code}`
    },
    getChildren (item) {
      if (item.level === 4) {
        return undefined
      }
      if (item.subnodes && item.subnodes.length > 0) {
        if (item.subnodes.filter(it => it.displaytype !== '6').length) {
          return this.getTree(item.subnodes)
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
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
