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
              <a-table :columns="dataColumns" :dataSource="dataSource" :rowClassName="calcRowClass" :pagination="false" bordered>
                <template slot="name" slot-scope="text">
                  <a href="javascript:;">{{ text }}</a>
                </template>
                <template slot="img" slot-scope="img">
                  <img :src="img" class="img-overview" />
                </template>
              </a-table>
            </div>
            <div v-else-if="finalData.displaytype === '1'">
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
              <div class="img-cards-container" v-viewer="{movable: false}">
                <a-card
                  class="img-card"
                  v-for="(it, i) in dataSource.Pics"
                  :key="i"
                  @click="show(i)">
                  <l-document :item="it" :suffix-mapping="suffixMapping" />
                </a-card>
              </div>
            </div>
          </a-card>
          <!-- 当前节点为目录，显示所有目录内容 -->
          <a-card v-else :loading="loading" :title="finalData.title" :bordered="false">
            <a-list v-viewer="{movable: true}">
              <a-list-item :key="index" v-for="(item, index) in finalData.subnodes">
                <a-list-item-meta>
                  <div slot="title">
                    <a href="javascript:;" class="empty-node" v-if="isEmptyData(item)">{{ item.title }}</a>
                    <a href="javascript:;" v-else @click="viewChildren(item)">{{ item.title }}</a>
                  </div>
                  <div slot="description" v-if="item.displaytype === '6' && item.data && item.data.length > 0">
                    <div class="img-cards-container">
                      <a-card
                        class="img-card"
                        v-for="(it, i) in item.data"
                        :key="i"
                        @click="show(i)">
                        <l-document :item="it" :suffix-mapping="suffixMapping" />
                      </a-card>
                    </div>
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
import pdfLogo from '@/assets/pdf.png'
import fileLogo from '@/assets/file.png'
import LDocument from './components/document'

export default {
  name: 'Workplace',
  components: {
    PageView,
    LDocument
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      projects: [],
      imgColumns: [
        '法人授权委托书',
        '工程质量终身责任承诺书',
        '注册许可证',
        '证书'
      ],
      suffixMapping: {
        pdf: pdfLogo,
        file: fileLogo
      },
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
      if (+this.finalData.displaytype >= 7) {
        return true
      }
      return false
    },
    dataColumns () {
      if (Array.isArray(this.finalData.data) && this.finalData.data.length > 0) {
        const column = this.finalData.data[0]
        return Object.keys(column).map(k => {
          if (typeof column[k] === 'string' && this.imgColumns.indexOf(k) !== -1) {
            return {
              title: k,
              dataIndex: k,
              customRender: (text, row, index) => {
                const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/g
                if (typeof text === 'string' && text.length > 0) {
                  const suffix = text.substr(text.lastIndexOf('.') + 1).toLowerCase()
                  const suffixMapping = this.suffixMapping
                  if (regex.test(text)) {
                    return <div v-viewer><img src={text} class="img-overview" /></div>
                  } else if (this.suffixMapping[suffix]) {
                    return <a href={text} target="_blank"><img src={suffixMapping[suffix]} class="" width="60" height="60" /></a>
                  } else {
                    return <a href={text} target="_blank"><img src={suffixMapping.file} class="" width="60" height="60" /></a>
                  }
                }
                return <div>{text}</div>
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
    show (i) {
      console.log(i)
    },
    isEmptyData (item) {
      if (item.displaytype === '6' || item.displaytype === '7') {
        if (item.data === null || item.data === undefined) return true
        if (typeof item.data === 'string' && item.data.length === 0) return true
        if (Array.isArray(item.data) && item.data.length === 0) {
          return true
        }
      }
      return false
    },
    isEmptyString (str) {
      if (str === null || str === undefined) return true
      if (typeof str === 'string' && str.length === 0) return true
      return false
    },
    calcRowClass (record, index) {
      for (const p in record) {
        if (this.imgColumns.indexOf(p) !== -1 && this.isEmptyString(record[p])) {
          return 'empty-row'
        }
      }
      return ''
    },
    viewChildren (item) {
      if (+item.displaytype !== 6) {
        this.UpdateFinalData(item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  a.empty-node {
    color: #FA541C !important;
  }

  /deep/ .ant-table {
    tr.empty-row {
      background: #FA541C;
      color: #fff;

      td {
        background: #FA541C;
        color: #fff;
      }

      & :hover {
        background: #FA541C;
        color: #fff;
      }
    }
  }

  .img-overview {
    width: 60px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }

  .img-cards-container {
    display: flex;
    flex-wrap: wrap;

    .img-card {
      width: 300px;
      height: 200px;
      padding: 0;
      margin-bottom: 15px;
      margin-right: 15px;
      box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.2);

      /deep/ .ant-card-body {
        padding: 0;

        .card-desc {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 300px;
          height: 100px;
          background: linear-gradient(to top, #332, 50%, rgba(0, 0, 0, 0, 0));

          &.card-desc-attach {
            background: none;

            .ant-card-meta-detail {
              padding-bottom: 30px;

              .ant-card-meta-title {
                color: #333;
              }

              .ant-card-meta-description {
                color: #333;
              }
            }
          }

          .ant-card-meta-detail {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 20px 15px 10px 15px;

            .ant-card-meta-title {
              color: white;
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .ant-card-meta-description {
              color: white;
              font-size: 14px;
              // height: 45px;
              overflow: hidden;
              display: -webkit-box;
              text-overflow: ellipsis;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }

        & a > svg {
          width: 60px;
          height: 60px;
        }
      }

      /deep/ .img-overview {
        border-radius: 0;
        width: 300px;
        height: 200px;
        object-fit: cover;
      }
    }
  }

  .mobile {
    .img-cards-container {
      justify-content: center;
    }
  }

  .base-table {
    margin-left: 20px;
    margin-bottom: 20px;

    tr {
      & td.top {
        border-top: 1px solid #ccc;
      }
      td {
        min-width: 160px;
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
