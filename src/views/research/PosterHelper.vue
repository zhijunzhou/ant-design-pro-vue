<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="24">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="avatar()">
            </div>
            <div class="username">{{ nickname() }}</div>
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <a-divider :dashed="true"/>
          <div class="account-center-team">

          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { mapGetters } from 'vuex'

export default {
  components: {
    RouteView,
    PageView
  },
  data () {
    return {
      noTitleKey: 'app'
    }
  },
  mounted () {
    this.getTeams()
  },
  methods: {
    ...mapGetters(['nickname', 'avatar']),

    getTeams () {
      this.$http.get('/workplace/teams').then(res => {
        this.teams = res.result
        this.teamSpinning = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }
}
</style>
