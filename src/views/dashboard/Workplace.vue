<template>
  <page-view :avatar="avatar" :title="false">
    <div>
      <a-row :gutter="24">
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            v-if="!isDir"
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            :title="finalData.title"
            :body-style="{ padding: 10 }">
            <div v-if="Array.isArray(dataSource) && dataSource.length > 0">
              <a-table :columns="dataColumns" :dataSource="dataSource" :pagination="false" bordered>
                <template slot="name" slot-scope="text">
                  <a href="javascript:;">{{ text }}</a>
                </template>
              </a-table>
              <template slot="img" slot-scope="img">
                <img :src="img" width="100" />
              </template>
            </div>
            <div v-else>
              <table class="base-table">
                <tr>
                  <td class="top">项目名称</td>
                  <td class="top">{{ dataSource.Title }}</td>
                </tr>
                <tr>
                  <td>建设单位</td>
                  <td>{{ dataSource.DevOrg }}</td>
                </tr>
              </table>
              <a-card
                v-for="(it, i) in dataSource.Pics"
                :key="i"
                style="width: 240px;display: inline-block;margin-left: 20px;">
                <img
                  :alt="it.name"
                  :src="it.url"
                  slot="cover"
                />
                <a-card-meta
                  :title="it.name">
                  <template slot="description">{{ it.datetime }}: {{ it.desc }}</template>
                </a-card-meta>
              </a-card>
            </div>
          </a-card>
          <!-- 当前节点为目录，显示所有目录内容 -->
          <a-card v-else :loading="loading" :title="finalData.title" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in finalData.subnodes">
                <a-list-item-meta>
                  <div slot="title">
                    <a href="javascript:;" @click="viewChildren(item)">{{ item.title }}</a>&nbsp;
                  </div>
                  <div slot="description" v-if="item.displaytype === '6' && item.data && item.data.length > 0">
                    <a-card
                      v-for="(it, i) in item.data"
                      :key="i"
                      style="width: 240px;display: inline-block;margin-left: 20px;">
                      <img
                        :alt="it.name"
                        :src="it.url"
                        slot="cover"
                      />
                      <a-card-meta
                        :title="it.name">
                        <template slot="description">{{ it.datetime }}: {{ it.desc }}</template>
                      </a-card-meta>
                    </a-card>
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { PageView } from '@/layouts'

export default {
  name: 'Workplace',
  components: {
    PageView
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      projects: [],
      loading: false,
      radarLoading: true
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome,
      finalData: (state) => state.user.finalData
    }),
    isDir () {
      if (Array.isArray(this.finalData.subnodes) && this.finalData.subnodes.length > 0) {
        return true
      }
      return false
    },
    dataColumns () {
      if (Array.isArray(this.finalData.data) && this.finalData.data.length > 0) {
        const column = this.finalData.data[0]
        return Object.keys(column).map(k => {
          if (typeof column[k] === 'string' && column[k].toLowerCase().indexOf('.jpg') !== -1) {
            return {
              title: k,
              dataIndex: k,
              customRender: (text, row, index) => {
                return <img src={text} width="100" />
              }
            }
          }
          return {
            title: k,
            dataIndex: k
          }
        }).filter(item => item.title !== 'key')
      }
      return []
    },
    dataSource () {
      if (Array.isArray(this.finalData.data) && this.finalData.data.length > 0) {
        return this.finalData.data.map((item, index) => {
          item.key = String(index)
          return item
        })
      }
      if (Object.prototype.toString.call(this.finalData.data) === '[object Object]') {
        return this.finalData.data
      }
      return []
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  methods: {
    ...mapActions(['UpdateFinalData']),
    viewChildren (item) {
      if (Array.isArray(item.subnodes) && item.subnodes.length > 0) {
        this.UpdateFinalData(item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .base-table {
    margin-left: 20px;
    margin-bottom: 20px;

    tr {
      & td.top {
        border-top: 1px solid #ccc;
      }
      td {
        width: 160px;
        padding: 15px;
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
