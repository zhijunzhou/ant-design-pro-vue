<template>
  <a-dropdown>
    <span class="action global-lang">
      <a-icon type="global" style="font-size: 16px"/>
    </span>
    <a-menu slot="overlay" style="width: 150px;" @click="SwitchProject">
      <a-menu-item v-for="po in projects" :key="po.Code">
        <a rel="noopener noreferrer">
          <span role="img" aria-label="简体中文">🇨🇳</span> {{ po.Title }}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LangSelect',
  computed: {
    ...mapState({
      projects: (state) => state.user.projects
    })
  },
  methods: {
    ...mapActions([
      'UpdateCode'
    ]),
    SwitchProject (row) {
      this.UpdateCode(row.key)
    }
  }
}
</script>
